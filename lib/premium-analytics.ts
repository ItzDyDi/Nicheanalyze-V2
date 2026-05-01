import type { ScrapedVideo } from "@/lib/tiktok-scraper";

export interface VideoScore {
  hook: number;
  duration: number;
  format: number;
  cta: number;
  virality: number;
  hookLabel: string;
  durationLabel: string;
  formatLabel: string;
  ctaLabel: string;
  viralityLabel: string;
}

export interface Pattern {
  title: string;
  description: string;
  tip: string;
  icon: string;
  color: string;
  impact: "high" | "medium" | "low";
}

export interface ChartData {
  durationPerformance: { range: string; engagement: number; count: number }[];
  contentTypes: { type: string; count: number; avgViews: number; avgEng: number }[];
  hookVsEngagement: { hookScore: number; engagement: number; views: number; label: string }[];
  viewsDistribution: { range: string; count: number; avgEngagement: number }[];
  engagementFunnel: { name: string; total: number; rate: number; color: string }[];
  postingDays: { day: string; avgViews: number; count: number }[];
  viewsTimeline: { label: string; ts: number; views: number; likes: number }[];
}

export interface Benchmark {
  avgViews: number;
  avgEngagement: number;
  avgDuration: number;
  avgHashtags: number;
  topEngagement: number;
  nicheScore: number;
}

const EMOTIONAL_WORDS = [
  "secret","jamais","incroyable","amazing","never","shocking","incredible",
  "best","worst","only","first","urgent","warning","attention","stop","wait",
  "astuce","conseil","erreur","vrai","révèle","découvre","surprenant","choquant",
  "interdit","impossible","facile","rapide","gratuit","exclusif","never seen",
];

const CTA_WORDS = [
  "follow","suis","like","partage","share","comment","commente","sauve","save",
  "abonne","subscribe","rejoins","join","essaie","try","regarde","watch","clique",
];

export function scoreHook(hook: string): { score: number; label: string } {
  if (!hook || hook.length < 3) return { score: 1, label: "Hook absent ou trop court" };
  const words = hook.split(/\s+/);
  let score = 5;
  if (words.length >= 6 && words.length <= 12) score += 2;
  else if (words.length >= 4 && words.length <= 15) score += 1;
  else if (words.length > 20) score -= 2;
  const lower = hook.toLowerCase();
  const emotional = EMOTIONAL_WORDS.filter(w => lower.includes(w)).length;
  score += Math.min(emotional * 1.5, 3);
  if (hook.includes("?")) score += 1;
  if (/\d/.test(hook)) score += 1;
  score = Math.round(Math.min(10, Math.max(1, score)));
  const labels: Record<number, string> = {
    1: "Hook absent", 2: "Très faible", 3: "Faible — sans impact",
    4: "Peut être amélioré", 5: "Correct mais générique", 6: "Bon — accrocheur",
    7: "Bon — ciblé et précis", 8: "Très bon — émotionnel", 9: "Excellent",
    10: "Parfait — potentiel viral",
  };
  return { score, label: labels[score] ?? "Bon hook" };
}

export function scoreDuration(duration: number): { score: number; label: string } {
  if (duration <= 0) return { score: 5, label: "Durée inconnue" };
  if (duration >= 15 && duration <= 30) return { score: 10, label: "Durée parfaite (15-30s)" };
  if (duration > 30 && duration <= 35)  return { score: 9, label: "Légèrement long mais excellent" };
  if (duration > 10 && duration < 15)   return { score: 8, label: "Court et percutant" };
  if (duration > 35 && duration <= 45)  return { score: 7, label: "Acceptable, légèrement long" };
  if (duration > 45 && duration <= 60)  return { score: 5, label: "Long — risque de drop-off" };
  if (duration < 10)                    return { score: 4, label: "Trop court — manque de substance" };
  return { score: 3, label: "Trop long — drop-off élevé" };
}

export function scoreFormat(contentType: string): { score: number; label: string } {
  const map: Record<string, { score: number; label: string }> = {
    tutorial:      { score: 9, label: "Tutorial — excellente rétention" },
    educational:   { score: 8, label: "Éducatif — bon engagement" },
    trick:         { score: 8, label: "Trick/astuce — très partageable" },
    storytelling:  { score: 7, label: "Storytelling — bonne rétention" },
    "cute-moment": { score: 6, label: "Cute moment — viral mais peu ciblé" },
    entertainment: { score: 6, label: "Entertainment — dépend du style" },
    lifestyle:     { score: 5, label: "Lifestyle — très compétitif" },
    other:         { score: 5, label: "Format non identifié" },
  };
  return map[contentType] ?? { score: 5, label: "Format standard" };
}

export function scoreCTA(hook: string, hashtags: string[]): { score: number; label: string } {
  const text = (hook + " " + hashtags.join(" ")).toLowerCase();
  const found = CTA_WORDS.filter(w => text.includes(w)).length;
  if (found >= 3) return { score: 9, label: "Excellent — plusieurs CTAs" };
  if (found === 2) return { score: 7, label: "Bon — 2 CTAs présents" };
  if (found === 1) return { score: 5, label: "Moyen — 1 CTA détecté" };
  return { score: 2, label: "Pas de CTA — ajoute un appel à l'action" };
}

export function analyzeVideoAdvanced(video: ScrapedVideo): VideoScore {
  const h = scoreHook(video.hook);
  const d = scoreDuration(video.duration);
  const f = scoreFormat(video.contentType);
  const c = scoreCTA(video.hook, video.hashtags);
  const engBonus = Math.min(video.engagementRate / 2, 2);
  const raw = h.score * 0.3 + d.score * 0.25 + f.score * 0.2 + c.score * 0.15 + engBonus * 5;
  const v = Math.round(Math.min(10, Math.max(1, raw)));
  const vLabels: Record<number, string> = {
    1:"Très faible potentiel", 2:"Faible potentiel", 3:"Potentiel limité",
    4:"Potentiel modéré", 5:"Potentiel moyen", 6:"Bon potentiel",
    7:"Très bon potentiel", 8:"Excellent potentiel viral",
    9:"Potentiel exceptionnel", 10:"Viral assuré",
  };
  return {
    hook: h.score, duration: d.score, format: f.score, cta: c.score, virality: v,
    hookLabel: h.label, durationLabel: d.label, formatLabel: f.label,
    ctaLabel: c.label, viralityLabel: vLabels[v] ?? "Bon potentiel",
  };
}

export function detectPatterns(videos: ScrapedVideo[]): Pattern[] {
  if (videos.length < 3) return [];
  const patterns: Pattern[] = [];

  // Duration: short vs long
  const short = videos.filter(v => v.duration > 0 && v.duration <= 30);
  const long  = videos.filter(v => v.duration > 30);
  if (short.length >= 2 && long.length >= 2) {
    const sAvg = short.reduce((s, v) => s + v.engagementRate, 0) / short.length;
    const lAvg = long.reduce((s, v) => s + v.engagementRate, 0) / long.length;
    if (sAvg > lAvg * 1.1) {
      patterns.push({
        title: `Vidéos ≤30s → +${Math.round((sAvg / lAvg - 1) * 100)}% d'engagement`,
        description: `Les courtes vidéos (≤30s) génèrent ${sAvg.toFixed(1)}% d'engagement vs ${lAvg.toFixed(1)}% pour les longues dans cette niche.`,
        tip: `Compresse tes vidéos sous 30s : coupe l'intro, va droit au but, garde uniquement la partie la plus impactante.`,
        icon: "⚡", color: "#FF1654", impact: "high",
      });
    } else if (lAvg > sAvg * 1.1) {
      patterns.push({
        title: `Vidéos longues (>30s) → +${Math.round((lAvg / sAvg - 1) * 100)}% d'engagement`,
        description: `Dans cette niche, les formats plus longs retiennent mieux l'audience (${lAvg.toFixed(1)}% vs ${sAvg.toFixed(1)}%).`,
        tip: `Développe ton contenu sur 45-60s : intro accrocheuse, corps instructif, conclusion avec CTA.`,
        icon: "⚡", color: "#FF1654", impact: "high",
      });
    }
  }

  // Best content type
  const typeMap: Record<string, { eng: number[]; views: number[] }> = {};
  videos.forEach(v => {
    if (!typeMap[v.contentType]) typeMap[v.contentType] = { eng: [], views: [] };
    typeMap[v.contentType].eng.push(v.engagementRate);
    typeMap[v.contentType].views.push(v.views);
  });
  const types = Object.entries(typeMap)
    .filter(([, d]) => d.eng.length >= 2)
    .map(([type, d]) => ({ type, avgEng: d.eng.reduce((a,b)=>a+b,0)/d.eng.length, avgViews: d.views.reduce((a,b)=>a+b,0)/d.views.length }))
    .sort((a, b) => b.avgEng - a.avgEng);
  if (types.length >= 2) {
    const best = types[0];
    const worst = types[types.length - 1];
    const fmtViews = (n: number) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : `${(n/1000).toFixed(0)}k`;
    patterns.push({
      title: `Format "${best.type.replace("-"," ")}" domine — ${best.avgEng.toFixed(1)}% d'engagement`,
      description: `Ce format surperforme tous les autres (${fmtViews(best.avgViews)} vues moy.). "${worst.type.replace("-"," ")}" est le moins efficace (${worst.avgEng.toFixed(1)}%).`,
      tip: `Concentre-toi sur le format "${best.type.replace("-"," ")}" et évite "${worst.type.replace("-"," ")}" — c'est ce que l'algorithme favorise dans cette niche.`,
      icon: "🎯", color: "#00D9FF", impact: "high",
    });
  }

  // Hashtag impact
  const withTags    = videos.filter(v => v.hashtags.length >= 3);
  const withoutTags = videos.filter(v => v.hashtags.length < 3);
  if (withTags.length >= 2 && withoutTags.length >= 2) {
    const wAvg  = withTags.reduce((s, v) => s + v.views, 0) / withTags.length;
    const woAvg = withoutTags.reduce((s, v) => s + v.views, 0) / withoutTags.length;
    if (wAvg > woAvg * 1.05) {
      const topTags = (() => {
        const tc: Record<string, number> = {};
        withTags.forEach(v => v.hashtags.forEach(h => { tc[h] = (tc[h] ?? 0) + 1; }));
        return Object.entries(tc).sort((a,b) => b[1]-a[1]).slice(0,3).map(([t]) => t).join(", ");
      })();
      patterns.push({
        title: `3+ hashtags = +${Math.round((wAvg / woAvg - 1) * 100)}% de vues`,
        description: `Les vidéos bien hashtagées atteignent ${Math.round(wAvg/1000)}k vues en moyenne vs ${Math.round(woAvg/1000)}k sans.`,
        tip: `Utilise systématiquement ces hashtags qui reviennent chez les top créateurs : ${topTags}.`,
        icon: "#️⃣", color: "#a78bfa", impact: "medium",
      });
    }
  }

  // Emotional hooks
  const emotional    = videos.filter(v => EMOTIONAL_WORDS.some(w => v.hook.toLowerCase().includes(w)));
  const nonEmotional = videos.filter(v => !EMOTIONAL_WORDS.some(w => v.hook.toLowerCase().includes(w)));
  if (emotional.length >= 2 && nonEmotional.length >= 2) {
    const eAvg  = emotional.reduce((s, v) => s + v.engagementRate, 0) / emotional.length;
    const neAvg = nonEmotional.reduce((s, v) => s + v.engagementRate, 0) / nonEmotional.length;
    if (eAvg > neAvg * 1.1) {
      const topHook = emotional.sort((a,b) => b.engagementRate - a.engagementRate)[0];
      patterns.push({
        title: `Hooks émotionnels → +${Math.round((eAvg / neAvg - 1) * 100)}% d'engagement`,
        description: `Les hooks avec mots forts génèrent ${eAvg.toFixed(1)}% vs ${neAvg.toFixed(1)}% pour les hooks neutres.`,
        tip: `Exemple de hook qui performe : "${topHook.hook.slice(0, 60)}${topHook.hook.length > 60 ? "…" : ""}". Commence toujours par un mot choc : incroyable, secret, jamais vu…`,
        icon: "🧠", color: "#f59e0b", impact: "medium",
      });
    }
  }

  // Top creator pattern
  const creatorMap: Record<string, { views: number[]; eng: number[] }> = {};
  videos.forEach(v => {
    if (!creatorMap[v.creatorHandle]) creatorMap[v.creatorHandle] = { views: [], eng: [] };
    creatorMap[v.creatorHandle].views.push(v.views);
    creatorMap[v.creatorHandle].eng.push(v.engagementRate);
  });
  const topCreators = Object.entries(creatorMap)
    .filter(([, d]) => d.views.length >= 2)
    .map(([handle, d]) => ({ handle, avgViews: d.views.reduce((a,b)=>a+b,0)/d.views.length, avgEng: d.eng.reduce((a,b)=>a+b,0)/d.eng.length }))
    .sort((a, b) => b.avgViews - a.avgViews);
  if (topCreators.length >= 2) {
    const top = topCreators[0];
    const fmtV = (n: number) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : `${(n/1000).toFixed(0)}k`;
    patterns.push({
      title: `@${top.handle} domine avec ${fmtV(top.avgViews)} vues/vidéo`,
      description: `Ce créateur cumule ${top.avgViews >= 1000 ? fmtV(top.avgViews) : top.avgViews} vues moyennes et ${top.avgEng.toFixed(1)}% d'engagement — le benchmark de ta niche.`,
      tip: `Analyse les vidéos de @${top.handle} : son format, ses hooks, sa durée. C'est la référence à reproduire dans cette niche.`,
      icon: "👑", color: "#f59e0b", impact: top.avgEng >= 5 ? "high" : "medium",
    });
  }

  // Viral signal
  const viral = videos.filter(v => v.engagementRate >= 5);
  if (viral.length > 0) {
    const avgViral = viral.reduce((s,v) => s + v.engagementRate, 0) / viral.length;
    patterns.push({
      title: `${Math.round((viral.length / videos.length) * 100)}% des vidéos ont un engagement exceptionnel`,
      description: `${viral.length} vidéo${viral.length > 1 ? "s" : ""} dépassent 5% d'engagement (moy. ${avgViral.toFixed(1)}%) — niche très active.`,
      tip: `La barre est haute ici. Pour percer, vise minimum 5% d'engagement : pose une question dans ton hook, réponds aux commentaires vite, publie aux heures de pointe.`,
      icon: "🔥", color: "#10b981", impact: viral.length >= 3 ? "high" : "medium",
    });
  }

  return patterns.slice(0, 5);
}

export function generateRecommendations(videos: ScrapedVideo[]): { dos: string[]; avoids: string[] } {
  const dos: string[] = [];
  const avoids: string[] = [];

  // Optimal duration from top performers
  const top3 = [...videos].sort((a, b) => b.engagementRate - a.engagementRate).slice(0, 3);
  const topWithDur = top3.filter(v => v.duration > 0);
  if (topWithDur.length > 0) {
    const avg = topWithDur.reduce((s, v) => s + v.duration, 0) / topWithDur.length;
    dos.push(`Vise ${Math.round(avg * 0.85)}-${Math.round(avg * 1.15)}s — durée des top vidéos de ta niche`);
  }

  // Best content type
  const typeEng: Record<string, number[]> = {};
  videos.forEach(v => { (typeEng[v.contentType] ??= []).push(v.engagementRate); });
  const bestType = Object.entries(typeEng)
    .filter(([, rates]) => rates.length >= 2)
    .map(([t, rates]) => ({ t, avg: rates.reduce((a, b) => a + b, 0) / rates.length }))
    .sort((a, b) => b.avg - a.avg)[0];
  if (bestType) dos.push(`Utilise le format "${bestType.t.replace("-"," ")}" — il surperforme dans cette niche`);

  // Top hashtags
  const tagCount: Record<string, number> = {};
  videos.forEach(v => v.hashtags.forEach(h => { tagCount[h] = (tagCount[h] ?? 0) + 1; }));
  const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);
  if (topTags.length > 0) dos.push(`Hashtags performants: ${topTags.join(", ")}`);

  // Hook advice
  const avgHookScore = videos.reduce((s, v) => s + scoreHook(v.hook).score, 0) / videos.length;
  if (avgHookScore < 6) dos.push("Renforce tes hooks — commence par un mot émotionnel ou une question");
  else dos.push("Maintiens des hooks courts et percutants (6-10 mots)");

  // CTA
  const withCTA = videos.filter(v => CTA_WORDS.some(w => (v.hook + " " + v.hashtags.join(" ")).toLowerCase().includes(w)));
  if (withCTA.length / videos.length < 0.3) dos.push("Ajoute des CTAs (like, commente, sauve) — peu de vidéos dans ta niche en ont");

  // Avoids
  const allDur = videos.filter(v => v.duration > 0);
  if (allDur.length > 0) {
    const avgDur = allDur.reduce((s, v) => s + v.duration, 0) / allDur.length;
    if (avgDur > 45) avoids.push("Évite les vidéos > 45s — la rétention chute fortement dans cette niche");
  }
  const lowEng = videos.filter(v => v.engagementRate < 1);
  if (lowEng.length >= 2) {
    const worstType = Object.entries(
      lowEng.reduce((acc, v) => { acc[v.contentType] = (acc[v.contentType] ?? 0) + 1; return acc; }, {} as Record<string,number>)
    ).sort((a, b) => b[1] - a[1])[0];
    if (worstType) avoids.push(`Format "${worstType[0].replace("-"," ")}" — faible engagement dans cette niche`);
  }
  avoids.push("Évite de poster sans hashtags — l'algorithme distribue moins");

  return { dos: dos.slice(0, 4), avoids: avoids.slice(0, 3) };
}

export function computeChartData(videos: ScrapedVideo[]): ChartData {
  // Duration performance
  const dBuckets = [
    { range: "0-15s", min: 0, max: 15 }, { range: "15-30s", min: 15, max: 30 },
    { range: "30-45s", min: 30, max: 45 }, { range: "45-60s", min: 45, max: 60 },
    { range: "60s+",  min: 60, max: Infinity },
  ];
  const durationPerformance = dBuckets.map(b => {
    const g = videos.filter(v => v.duration >= b.min && v.duration < b.max);
    return { range: b.range, engagement: g.length > 0 ? parseFloat((g.reduce((s, v) => s + v.engagementRate, 0) / g.length).toFixed(2)) : 0, count: g.length };
  }).filter(b => b.count > 0);

  // Content type distribution
  const typeMap: Record<string, { count: number; totalViews: number; totalEng: number }> = {};
  videos.forEach(v => {
    const key = v.contentType.replace("-", " ");
    if (!typeMap[key]) typeMap[key] = { count: 0, totalViews: 0, totalEng: 0 };
    typeMap[key].count++; typeMap[key].totalViews += v.views; typeMap[key].totalEng += v.engagementRate;
  });
  const contentTypes = Object.entries(typeMap).map(([type, d]) => ({
    type, count: d.count,
    avgViews: Math.round(d.totalViews / d.count),
    avgEng: parseFloat((d.totalEng / d.count).toFixed(2)),
  })).sort((a, b) => b.count - a.count);

  // Hook quality vs engagement scatter
  const hookVsEngagement = videos.map(v => ({
    hookScore: scoreHook(v.hook).score,
    engagement: v.engagementRate,
    views: v.views,
    label: v.hook.slice(0, 35) + (v.hook.length > 35 ? "…" : ""),
  }));

  // Views distribution
  const vBuckets = [
    { range: "< 10k", min: 0, max: 10000 }, { range: "10k-50k", min: 10000, max: 50000 },
    { range: "50k-100k", min: 50000, max: 100000 }, { range: "100k-500k", min: 100000, max: 500000 },
    { range: "500k-1M", min: 500000, max: 1000000 }, { range: "1M+", min: 1000000, max: Infinity },
  ];
  const viewsDistribution = vBuckets.map(b => {
    const g = videos.filter(v => v.views >= b.min && v.views < b.max);
    return { range: b.range, count: g.length, avgEngagement: g.length > 0 ? parseFloat((g.reduce((s, v) => s + v.engagementRate, 0) / g.length).toFixed(2)) : 0 };
  }).filter(b => b.count > 0);

  // Engagement funnel
  const totalViews    = videos.reduce((s, v) => s + v.views, 0);
  const totalLikes    = videos.reduce((s, v) => s + v.likes, 0);
  const totalComments = videos.reduce((s, v) => s + v.comments, 0);
  const engagementFunnel = [
    { name: "Vues",       total: totalViews,    rate: 100,   color: "#00D9FF" },
    { name: "Likes",      total: totalLikes,    rate: totalViews > 0 ? parseFloat((totalLikes    / totalViews * 100).toFixed(2)) : 0, color: "#FF1654" },
    { name: "Commentaires", total: totalComments, rate: totalViews > 0 ? parseFloat((totalComments / totalViews * 100).toFixed(2)) : 0, color: "#a78bfa" },
  ];

  // Meilleurs jours pour poster (UTC depuis publishedAt)
  const DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const dayMap: Record<number, number[]> = {};
  videos.filter(v => v.publishedAt > 0).forEach(v => {
    const dow = new Date(v.publishedAt * 1000).getDay();
    (dayMap[dow] ??= []).push(v.views);
  });
  const postingDays = DAYS_FR.map((day, i) => ({
    day,
    avgViews: dayMap[i] ? Math.round(dayMap[i].reduce((a, b) => a + b, 0) / dayMap[i].length) : 0,
    count: dayMap[i]?.length ?? 0,
  }));

  // Timeline — vues et likes par semaine de publication
  const weekMap: Record<string, { ts: number; views: number[]; likes: number[] }> = {};
  videos.filter(v => v.publishedAt > 0).forEach(v => {
    const d = new Date(v.publishedAt * 1000);
    const mon = new Date(d); mon.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const ts = mon.getTime();
    const label = mon.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    if (!weekMap[label]) weekMap[label] = { ts, views: [], likes: [] };
    weekMap[label].views.push(v.views);
    weekMap[label].likes.push(v.likes);
  });
  const viewsTimeline = Object.entries(weekMap)
    .map(([label, d]) => ({
      label,
      ts: d.ts,
      views: Math.round(d.views.reduce((a, b) => a + b, 0) / d.views.length),
      likes: Math.round(d.likes.reduce((a, b) => a + b, 0) / d.likes.length),
    }))
    .sort((a, b) => a.ts - b.ts);

  return { durationPerformance, contentTypes, hookVsEngagement, viewsDistribution, engagementFunnel, postingDays, viewsTimeline };
}

export interface TopSoundtrack {
  title: string;
  count: number;
  avgViews: number;
  avgEng: number;
  isOriginal: boolean;
}

export function computeTopSoundtracks(videos: ScrapedVideo[]): TopSoundtrack[] {
  const map: Record<string, { views: number[]; eng: number[] }> = {};
  for (const v of videos) {
    const title = v.soundTrack?.trim() || "Original";
    if (!map[title]) map[title] = { views: [], eng: [] };
    map[title].views.push(v.views);
    map[title].eng.push(v.engagementRate);
  }
  return Object.entries(map)
    .map(([title, d]) => ({
      title,
      count: d.views.length,
      avgViews: Math.round(d.views.reduce((a, b) => a + b, 0) / d.views.length),
      avgEng: parseFloat((d.eng.reduce((a, b) => a + b, 0) / d.eng.length).toFixed(1)),
      isOriginal: /^original|son original|original sound/i.test(title),
    }))
    .sort((a, b) => b.count - a.count || b.avgViews - a.avgViews)
    .slice(0, 6);
}

export function getBenchmark(videos: ScrapedVideo[]): Benchmark {
  const withDur = videos.filter(v => v.duration > 0);
  return {
    avgViews: Math.round(videos.reduce((s, v) => s + v.views, 0) / videos.length),
    avgEngagement: parseFloat((videos.reduce((s, v) => s + v.engagementRate, 0) / videos.length).toFixed(2)),
    avgDuration: withDur.length > 0 ? Math.round(withDur.reduce((s, v) => s + v.duration, 0) / withDur.length) : 0,
    avgHashtags: parseFloat((videos.reduce((s, v) => s + v.hashtags.length, 0) / videos.length).toFixed(1)),
    topEngagement: parseFloat(Math.max(...videos.map(v => v.engagementRate)).toFixed(2)),
    nicheScore: Math.round(videos.filter(v => v.engagementRate >= 3).length / videos.length * 100),
  };
}
