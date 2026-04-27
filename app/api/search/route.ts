import { searchTikTok, calculateStats, getTopHashtags, getTopHooks } from "@/lib/tiktok-scraper";
import { detectLanguage } from "@/lib/language-detector";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("q") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "views";
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 50);
  const niche = searchParams.get("niche") ?? "general";
  const langParam = searchParams.get("lang") as "fr" | "en" | "other" | null;

  if (!keyword.trim()) {
    return Response.json({ success: false, error: "keyword requis" }, { status: 400 });
  }

  const detectedLanguage = langParam ?? detectLanguage(keyword);

  try {
    const videos = await searchTikTok(keyword, limit, niche, langParam ?? undefined);

    const sorted = [...videos].sort((a, b) => {
      if (sortBy === "engagement") return b.engagementRate - a.engagementRate;
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "recent") return 0; // no date from API, keep original order
      return b.views - a.views;
    });

    const stats = calculateStats(sorted);
    const topHashtags = getTopHashtags(sorted);
    const topHooks = getTopHooks(sorted);

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
