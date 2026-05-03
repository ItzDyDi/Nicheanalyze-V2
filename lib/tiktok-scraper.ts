export interface ScrapedVideo {
  id: string;
  videoUrl: string;
  thumbnail: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  duration: number;
  hook: string;
  contentType: ContentTypeValue;
  creatorHandle: string;
  creatorFollowers: number;
  engagementRate: number;
  hashtags: string[];
  soundTrack: string;
  sourceNiche: string;
  publishedAt: number;
}

export type ContentTypeValue =
  | "tutorial"
  | "cute-moment"
  | "trick"
  | "lifestyle"
  | "educational"
  | "entertainment"
  | "other";

export interface VideoStats {
  avgViews: number;
  avgLikes: number;
  avgDuration: number;
  avgEngagementRate: number;
  contentTypeBreakdown: { type: string; count: number; percent: number }[];
}

function classifyContent(desc: string, hashtags: string[]): ContentTypeValue {
  const text = (desc + " " + hashtags.join(" ")).toLowerCase();
  if (/(tutorial|how.?to|tuto|learn|astuce|tips?|guide|step|étape|appren|conseil|recette|méthode|comment faire)/i.test(text)) return "tutorial";
  if (/(cute|mignon|adorable|😍|🥺|aww|bébé|baby|puppy|kitten)/i.test(text)) return "cute-moment";
  if (/(trick|tour|trained|appris|skill|perform|dressage|training)/i.test(text)) return "trick";
  if (/(routine|day|life|vlog|lifestyle|quotidien|journée)/i.test(text)) return "lifestyle";
  if (/(why|science|fact|truth|réalité|saviez|did.?you.?know|explication|santé|bienfait|avantage|bénéfice|effet|pourquoi|comprendre)/i.test(text)) return "educational";
  if (/(funny|pov|when|reaction|lol|😂|🤣|hilarious|drôle)/i.test(text)) return "entertainment";
  return "other";
}

function extractHook(desc: string): string {
  // Strip hashtags and trim
  const clean = desc.replace(/#\w+/g, "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const first = clean.split(/[.!?\n]/)[0].trim();
  return first.slice(0, 100);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapItem(item: any, niche: string): ScrapedVideo {
  const stats = item.stats ?? {};
  const video = item.video ?? {};
  const author = item.author ?? {};
  const desc: string = item.desc ?? "";

  const views = stats.playCount ?? 0;
  const likes = stats.diggCount ?? 0;
  const shares = stats.shareCount ?? 0;
  const comments = stats.commentCount ?? 0;
  const totalInteractions = likes + shares + comments;
  const engagementRate =
    views > 0 ? Math.round((totalInteractions / views) * 1000) / 10 : 0;

  // duration comes in ms from this API
  const durationMs = video.duration ?? 0;
  const duration = durationMs > 1000 ? Math.round(durationMs / 1000) : durationMs;

  const hashtags: string[] = (item.challenges ?? [])
    .map((c: { title?: string }) => `#${c.title ?? ""}`)
    .filter((t: string) => t.length > 1)
    .slice(0, 8);

  const hook = extractHook(desc);
  const contentType = classifyContent(desc, hashtags);

  return {
    id: item.id ?? String(Math.random()),
    videoUrl: `https://www.tiktok.com/@${author.uniqueId ?? "unknown"}/video/${item.id}`,
    thumbnail: video.cover ?? video.originCover ?? "",
    views,
    likes,
    shares,
    comments,
    duration,
    hook: hook || `Vidéo de @${author.uniqueId ?? "unknown"}`,
    contentType,
    creatorHandle: author.uniqueId ?? "unknown",
    creatorFollowers: author.followerCount ?? 0,
    engagementRate,
    hashtags,
    soundTrack: item.music?.title ?? "Original",
    sourceNiche: niche,
    publishedAt: item.createTime ?? 0,
  };
}

export async function searchTikTok(
  keyword: string,
  limit = 20,
  niche = "general",
  langOverride?: "fr" | "en" | "other"
): Promise<ScrapedVideo[]> {
  const key = process.env.RAPIDAPI_KEY?.trim();
  const host = process.env.RAPIDAPI_HOST?.trim();

  if (!key || !host) throw new Error("RAPIDAPI_KEY ou RAPIDAPI_HOST manquant dans .env.local");

  const { detectLanguage } = await import("./language-detector");
  const { enhanceQuery } = await import("./language-keywords");

  const lang = langOverride ?? detectLanguage(keyword);
  const enhancedKeyword = enhanceQuery(keyword, lang, niche as "pet-wellness" | "diy-home" | "education" | "general");

  console.log(`[TikTok] lang=${lang} | query="${keyword}" → enhanced="${enhancedKeyword}" | limit=${limit}`);

  // TikTok renvoie max ~20 résultats par page — on pagine jusqu'à avoir assez
  const PER_PAGE = 20;
  const maxPages = Math.min(Math.ceil(limit / PER_PAGE), 6); // max 6 pages (120 vidéos)
  const allItems: unknown[] = [];
  let cursor = 0;

  for (let page = 0; page < maxPages && allItems.length < limit; page++) {
    const url = `https://${host}/api/search/video?keyword=${encodeURIComponent(enhancedKeyword)}&count=${PER_PAGE}&cursor=${cursor}`;

    const res = await fetch(url, {
      headers: { "x-rapidapi-key": key, "x-rapidapi-host": host },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      if (page === 0) {
        const text = await res.text();
        throw new Error(`RapidAPI ${res.status}: ${text.slice(0, 200)}`);
      }
      break; // pages suivantes : échec silencieux
    }

    const data = await res.json();
    const items: unknown[] = data?.item_list ?? [];
    if (items.length === 0) break;

    allItems.push(...items);
    cursor = typeof data?.cursor === "number" ? data.cursor : cursor + PER_PAGE;
    if (data?.has_more === false) break; // ne break que si l'API dit explicitement "plus rien"
  }

  const all = allItems.map((item) => mapItem(item, niche));

  // Filter by language if explicitly requested (fr or en)
  if (lang === "fr" || lang === "en") {
    const filtered = all.filter((v) => {
      const detected = detectLanguage(`${v.hook} ${v.hashtags.join(" ")}`);
      return detected === lang || detected === "other";
    });
    // Fallback to unfiltered si le filtre langue retire trop de résultats (< 30% du limit)
    const minFiltered = Math.max(3, Math.floor(limit * 0.3));
    const result = filtered.length >= minFiltered ? filtered : all;
    return result.slice(0, limit);
  }

  return all.slice(0, limit);
}

export function calculateStats(videos: ScrapedVideo[]): VideoStats | null {
  if (!videos.length) return null;
  const n = videos.length;

  const avgViews = Math.round(videos.reduce((s, v) => s + v.views, 0) / n);
  const avgLikes = Math.round(videos.reduce((s, v) => s + v.likes, 0) / n);
  const avgDuration = Math.round(videos.reduce((s, v) => s + v.duration, 0) / n);
  const avgEngagementRate =
    Math.round((videos.reduce((s, v) => s + v.engagementRate, 0) / n) * 10) / 10;

  const typeCounts: Record<string, number> = {};
  for (const v of videos) typeCounts[v.contentType] = (typeCounts[v.contentType] ?? 0) + 1;

  const typeLabels: Record<string, string> = {
    tutorial: "Tutorial",
    "cute-moment": "Cute moment",
    trick: "Trick/Training",
    educational: "Educational",
    entertainment: "Entertainment",
    lifestyle: "Lifestyle",
    other: "Autre",
  };

  const contentTypeBreakdown = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({
      type: typeLabels[type] ?? type,
      count,
      percent: Math.round((count / n) * 100),
    }));

  return { avgViews, avgLikes, avgDuration, avgEngagementRate, contentTypeBreakdown };
}

export function getTopHashtags(
  videos: ScrapedVideo[]
): { tag: string; count: number; avgViews: number }[] {
  const counts: Record<string, number> = {};
  const totalViews: Record<string, number> = {};
  for (const v of videos) {
    for (const tag of v.hashtags) {
      counts[tag] = (counts[tag] ?? 0) + 1;
      totalViews[tag] = (totalViews[tag] ?? 0) + v.views;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count, avgViews: Math.round(totalViews[tag] / count) }));
}

export function getTopHooks(
  videos: ScrapedVideo[]
): { hook: string; views: number; engagementRate: number }[] {
  return [...videos]
    .filter((v) => v.hook.length > 10)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((v) => ({ hook: v.hook, views: v.views, engagementRate: v.engagementRate }));
}
