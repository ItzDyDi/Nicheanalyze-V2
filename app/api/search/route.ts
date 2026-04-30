import { auth } from "@/auth";
import { PLANS } from "@/lib/plan-limits";
import { searchTikTok, calculateStats, getTopHashtags, getTopHooks } from "@/lib/tiktok-scraper";
import { detectLanguage } from "@/lib/language-detector";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ success: false, error: "Connexion requise" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const plan = ((session.user as { plan?: string }).plan ?? "free") as "free" | "pro" | "premium";
  const planConfig = PLANS[plan];

  // Rate limit : pas plus d'1 recherche / 3 secondes par utilisateur (anti-spam)
  const burstCheck = checkRateLimit(`search-burst:${userId}`, 1, 3_000);
  if (!burstCheck.allowed) {
    return rateLimitResponse(burstCheck.resetAt, "Une recherche à la fois. Attends quelques secondes.");
  }

  // Rate limit : limite journalière selon le plan (en mémoire — approximatif)
  const dailyLimit = plan === "free" ? 5 : plan === "pro" ? 50 : 500;
  const dailyCheck = checkRateLimit(`search-daily:${userId}`, dailyLimit, 24 * 60 * 60 * 1000);
  if (!dailyCheck.allowed) {
    return rateLimitResponse(
      dailyCheck.resetAt,
      plan === "free"
        ? "Limite de 5 recherches/jour atteinte. Upgrade vers Pro pour plus."
        : "Limite journalière atteinte.",
    );
  }

  // Rate limit IP : protection supplémentaire contre les comptes multiples
  const ip = getClientIp(request);
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
      stats: stats ? { ...stats, topHashtags, topHooks } : null,
      detectedLanguage,
      total: sorted.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("[search] erreur RapidAPI:", message);
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
