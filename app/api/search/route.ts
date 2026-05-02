import { auth } from "@/auth";
import { PLANS } from "@/lib/plan-limits";
import { searchTikTok, calculateStats, getTopHashtags, getTopHooks } from "@/lib/tiktok-scraper";
import { detectLanguage } from "@/lib/language-detector";
import { checkRateLimit, checkDailyRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

function nextMidnightUTC(): Date {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d;
}

async function checkDbDailyLimit(userId: string, limit: number): Promise<{ allowed: boolean; resetAt: Date }> {
  const now = new Date();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { searchCount: true, searchResetAt: true },
  });
  if (!user) return { allowed: false, resetAt: nextMidnightUTC() };

  // Reset counter if past midnight
  if (now >= user.searchResetAt) {
    await prisma.user.update({
      where: { id: userId },
      data: { searchCount: 1, searchResetAt: nextMidnightUTC() },
    });
    return { allowed: true, resetAt: nextMidnightUTC() };
  }

  if (user.searchCount >= limit) {
    return { allowed: false, resetAt: user.searchResetAt };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { searchCount: { increment: 1 } },
  });
  return { allowed: true, resetAt: user.searchResetAt };
}

export async function GET(request: Request) {
  const session = await auth();
  const ip = getClientIp(request);
  const isGuest = !session?.user;

  // Guests : 2 recherches par IP par jour, pas de compte requis
  if (isGuest) {
    const guestCheck = checkDailyRateLimit(`guest-search:${ip}`, 2);
    if (!guestCheck.allowed) {
      return Response.json(
        { success: false, error: "guest_limit", guestLimit: true },
        { status: 429 },
      );
    }
  }

  const userId = isGuest ? null : (session!.user as { id: string }).id;
  const plan = isGuest
    ? "free"
    : (((session!.user as { plan?: string }).plan ?? "free") as "free" | "pro" | "premium");
  const planConfig = PLANS[plan];

  if (!isGuest && userId) {
    // Rate limit burst : pas plus d'1 recherche / 3 secondes
    const burstCheck = checkRateLimit(`search-burst:${userId}`, 1, 3_000);
    if (!burstCheck.allowed) {
      return rateLimitResponse(burstCheck.resetAt, "Une recherche à la fois. Attends quelques secondes.");
    }

    // Rate limit journalière selon le plan — stockée en DB (résiste aux cold starts Vercel)
    const dailyLimit = plan === "free" ? 5 : plan === "pro" ? 50 : 500;
    const dailyCheck = await checkDbDailyLimit(userId, dailyLimit);
    if (!dailyCheck.allowed) {
      return rateLimitResponse(
        dailyCheck.resetAt.getTime(),
        plan === "free"
          ? "Limite de 5 recherches/jour atteinte. Upgrade vers Pro pour plus."
          : "Limite journalière atteinte.",
      );
    }
  }

  // Rate limit IP : protection contre les comptes multiples
  const ipCheck = checkRateLimit(`search-ip:${ip}`, 100, 60 * 60 * 1000);
  if (!ipCheck.allowed) {
    return rateLimitResponse(ipCheck.resetAt, "Trop de recherches depuis cette adresse.");
  }

  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("q") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "views";
  const niche = searchParams.get("niche") ?? "general";
  const langParam = searchParams.get("lang") as "fr" | "en" | "other" | null;

  const maxVideos = planConfig.videosPerSearch;
  const requested = Math.min(Number(searchParams.get("limit") ?? "20"), 50);
  const limit = Math.min(requested, maxVideos);

  if (!keyword.trim()) {
    return Response.json({ success: false, error: "keyword requis" }, { status: 400 });
  }

  if (keyword.trim().length > 200) {
    return Response.json({ success: false, error: "keyword trop long" }, { status: 400 });
  }

  const detectedLanguage = langParam ?? detectLanguage(keyword);

  try {
    const videos = await searchTikTok(keyword, limit, niche, langParam ?? undefined);

    const sorted = [...videos].sort((a, b) => {
      if (sortBy === "engagement") return b.engagementRate - a.engagementRate;
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "recent") return 0;
      return b.views - a.views;
    });

    const stats = calculateStats(sorted);
    const allHashtags = getTopHashtags(sorted);
    const topHashtags = planConfig.hashtags ? allHashtags.slice(0, planConfig.hashtags) : allHashtags;
    const topHooks = planConfig.hooks ? getTopHooks(sorted) : [];

    const data = sorted.map((video, i) => ({
      rank: i + 1,
      video,
      metrics: {
        views: video.views,
        likes: video.likes,
        engagementRate: video.engagementRate,
        duration: video.duration,
      },
    }));

    return Response.json({
      success: true,
      data,
      videos: sorted,
      premiumVideos: plan === "premium" ? sorted : [],
      stats: stats ? { ...stats, topHashtags, topHooks } : null,
      detectedLanguage,
      total: sorted.length,
      premiumLocked: plan !== "premium",
      isGuest,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("[search] erreur RapidAPI:", message);
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
