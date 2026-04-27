"use client";
import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { ScrapedVideo, VideoStats } from "@/lib/tiktok-scraper";
import { detectLanguage } from "@/lib/language-detector";
import { translateQuery } from "@/lib/language-keywords";
import StatsOverview from "@/components/Search/StatsOverview";
import EmptyState from "@/components/Search/EmptyState";
import Tooltip from "@/components/Tooltip";
import { TOOLTIPS } from "@/lib/tooltip-data";
import { analyzeVideo } from "@/lib/video-analyzer";
import dynamic from "next/dynamic";
import {
  PatternsSection, RecommendationsSection, BenchmarkSection,
} from "@/components/Premium/InsightsPanel";
import {
  analyzeVideoAdvanced, detectPatterns, generateRecommendations,
  computeChartData, getBenchmark,
} from "@/lib/premium-analytics";

const AnalyticsCharts = dynamic(() => import("@/components/Premium/AnalyticsCharts"), { ssr: false });
const VideoScorecard  = dynamic(() => import("@/components/Premium/VideoScorecard"),  { ssr: false });
const PredictionCard  = dynamic(() => import("@/components/Premium/PredictionCard"),  { ssr: false });

interface ApiStats extends VideoStats {
  topHashtags: { tag: string; count: number; avgViews: number }[];
  topHooks: { hook: string; views: number; engagementRate: number }[];
}

interface SearchResponse {
  success: boolean;
  videos: ScrapedVideo[];
  stats: ApiStats | null;
  detectedLanguage?: "fr" | "en" | "other";
  total: number;
  error?: string;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

const THUMBNAIL_COLORS = [
  "bg-slate-100", "bg-rose-100", "bg-blue-50", "bg-amber-50",
  "bg-emerald-50", "bg-violet-50", "bg-sky-50", "bg-orange-50",
  "bg-pink-50", "bg-teal-50",
];

const BADGE_COLORS: Record<string, string> = {
  tutorial: "bg-amber-100 text-amber-700",
  "cute-moment": "bg-amber-100 text-amber-700",
  trick: "bg-blue-100 text-blue-700",
  educational: "bg-green-100 text-green-700",
  entertainment: "bg-purple-100 text-purple-700",
  storytelling: "bg-rose-100 text-rose-700",
  lifestyle: "bg-gray-100 text-gray-600",
  other: "bg-gray-100 text-gray-500",
};

function formatDate(ts: number): string {
  if (!ts) return "";
  const days = Math.floor((Date.now() - ts * 1000) / 86_400_000);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 7)  return `il y a ${days} jours`;
  if (days < 30) return `il y a ${Math.floor(days / 7)} sem.`;
  if (days < 365) return `il y a ${Math.floor(days / 30)} mois`;
  return `il y a ${Math.floor(days / 365)} an${Math.floor(days / 365) > 1 ? "s" : ""}`;
}

function VideoCard({ video, rank }: { video: ScrapedVideo; rank: number }) {
  const badge = BADGE_COLORS[video.contentType] ?? "bg-gray-100 text-gray-500";
  const fallbackBg = THUMBNAIL_COLORS[(rank - 1) % THUMBNAIL_COLORS.length];

  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Thumbnail portrait — cliquable uniquement */}
      <a
        href={video.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative sm:w-[45%] flex-shrink-0 aspect-[9/16] sm:aspect-auto hover:opacity-90 transition-opacity ${fallbackBg}`}
      >
        {video.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnail}
            alt={video.hook}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="flex items-center justify-center h-full min-h-[180px]">
            <span className="text-gray-300 text-sm">VideoThumbnail</span>
          </div>
        )}
        {/* Rank badge */}
        <span className="absolute top-2 right-2 bg-[#2D6A4F] text-white text-xs font-bold px-2 py-0.5 rounded-lg">
          #{rank}
        </span>
        {/* Duration */}
        {video.duration > 0 && (
          <span className="absolute bottom-2 left-2 bg-gray-900/60 text-white text-[11px] font-medium px-2 py-0.5 rounded-lg">
            {video.duration}s
          </span>
        )}
      </a>

      {/* Data — côté droit */}
      <div className="flex flex-col gap-3 p-6 flex-1 min-w-0">

        {/* Créateur + date */}
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-gray-500">@{video.creatorHandle}</p>
          {video.publishedAt > 0 && (
            <span className="text-[10px] text-gray-300">· {formatDate(video.publishedAt)}</span>
          )}
        </div>

        {/* Hook + hashtags */}
        <div>
          <p className="text-[12px] text-gray-600 italic leading-snug line-clamp-2 mb-1.5">
            "{video.hook}"
          </p>
          {video.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {video.hashtags.slice(0, 6).map((tag) => (
                <span key={tag} className="text-[10px] text-[#2D6A4F] font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats 2×2 grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#E0E7FF] rounded-xl p-3 hover:bg-[#c7d2fe] transition-colors">
            <Tooltip text={TOOLTIPS.views} position="top">
              <p className="text-[11px] text-indigo-500 mb-1">Vues</p>
            </Tooltip>
            <p className="text-lg font-semibold text-indigo-700">{fmt(video.views)}</p>
          </div>
          <div className="bg-[#FCE7F3] rounded-xl p-3 hover:bg-[#fbcfe8] transition-colors">
            <Tooltip text={TOOLTIPS.likes} position="top">
              <p className="text-[11px] text-pink-500 mb-1">Likes</p>
            </Tooltip>
            <p className="text-lg font-semibold text-pink-700">{fmt(video.likes)}</p>
          </div>
          <div className="bg-[#EDE9FE] rounded-xl p-3 hover:bg-[#ddd6fe] transition-colors">
            <Tooltip text={TOOLTIPS.comments} position="bottom">
              <p className="text-[11px] text-violet-500 mb-1">Commentaires</p>
            </Tooltip>
            <p className="text-lg font-semibold text-violet-700">{fmt(video.comments)}</p>
          </div>
          <div className="bg-[#DCFCE7] rounded-xl p-3 hover:bg-[#bbf7d0] transition-colors">
            <Tooltip text={TOOLTIPS.engagement} position="bottom">
              <p className="text-[11px] text-emerald-600 mb-1">Engagement</p>
            </Tooltip>
            <p className="text-lg font-semibold text-emerald-700">{video.engagementRate}%</p>
          </div>
        </div>

        {/* Analyse intelligente */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 mb-2 font-medium uppercase tracking-wide">Analyse</p>
          <div className="space-y-1.5">
            {analyzeVideo(video).map((item) => (
              <div key={item.label}>
                <div className="flex items-start gap-1 text-[11px]">
                  <span>{item.status === "good" ? "✅" : item.status === "warning" ? "⚠️" : "❌"}</span>
                  <span className="font-medium text-gray-700">{item.label} —</span>
                  <span className="text-gray-500">{item.insight}</span>
                </div>
                {item.tip && (
                  <p className="ml-5 text-[10px] text-[#2D6A4F] mt-0.5">💡 {item.tip}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Type badge */}
        <div>
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${badge}`}>
            {video.contentType}
          </span>
        </div>

      </div>
    </div>
  );
}

export default function SearchPage() {
  const { data: session } = useSession();
  const isPremium = (session?.user as { plan?: string })?.plan === "premium";
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("views");
  const [results, setResults] = useState<ScrapedVideo[]>([]);
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearch, setLastSearch] = useState<string>("");
  const [langOverride, setLangOverride] = useState<"fr" | "en" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("nicheanalyze_last_search");
    if (stored) setLastSearch(stored);
  }, []);

  // Réinitialise l'override quand le keyword change
  useEffect(() => { setLangOverride(null); }, [keyword]);

  const detectedLang = useMemo(() => detectLanguage(keyword), [keyword]);
  const effectiveLang = langOverride ?? (detectedLang === "other" ? "en" : detectedLang);

  const doSearch = async (q?: string, lang?: "fr" | "en") => {
    const kw = q ?? keyword;
    if (!kw.trim()) return;
    if (q) setKeyword(q);
    const searchLang = lang ?? effectiveLang;
    // Si la langue forcée est différente de celle détectée, on traduit la requête
    const autoLang = detectLanguage(kw);
    const needsTranslation = lang && autoLang !== "other" && autoLang !== lang;
    const finalKw = needsTranslation ? translateQuery(kw, lang!) : kw;
    setLoading(true);
    setSearched(true);
    setExpanded(false);
    setError(null);
    localStorage.setItem("nicheanalyze_last_search", kw);
    setLastSearch(kw);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(finalKw)}&lang=${searchLang}`);
      const data: SearchResponse = await res.json();
      if (!data.success) {
        setError(data.error ?? "Erreur lors de la recherche");
        setResults([]);
        setStats(null);
      } else {
        setResults(data.videos ?? []);
        setStats(data.stats ?? null);
      }
    } catch {
      setError("Erreur réseau — vérifie ta connexion");
    } finally {
      setLoading(false);
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "engagement") return b.engagementRate - a.engagementRate;
    if (sortBy === "likes") return b.likes - a.likes;
    if (sortBy === "recent") return b.publishedAt - a.publishedAt;
    return b.views - a.views;
  });

  const visibleResults = expanded ? sortedResults : sortedResults.slice(0, 3);

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Search bar */}
        <div className="flex gap-3 mb-3">
          <input
            className="flex-1 px-4 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
            placeholder="Ex: dog training, chien anxieux, cat tricks..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }}
          />
          {keyword.trim().length > 1 && (
            <div className="self-center flex gap-0.5 rounded-xl border border-gray-200 bg-white p-0.5 shrink-0">
              {(["fr", "en"] as const).map((l) => {
                const isActive = effectiveLang === l;
                const isAuto = langOverride === null && isActive;
                return (
                  <button
                    key={l}
                    onClick={() => {
                      const newLang = langOverride === l ? null : l;
                      setLangOverride(newLang);
                      if (keyword.trim()) {
                        const finalLang = newLang ?? (detectedLang === "other" ? "en" : detectedLang as "fr" | "en");
                        doSearch(undefined, finalLang);
                      }
                    }}
                    title={isAuto ? "Détecté automatiquement — clique pour forcer" : `Forcer ${l.toUpperCase()}`}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-[#2D6A4F] text-white"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {l === "fr" ? "🇫🇷" : "🇬🇧"}
                    <span>{l.toUpperCase()}</span>
                    {isAuto && <span className="opacity-60 text-[9px] ml-0.5">auto</span>}
                  </button>
                );
              })}
            </div>
          )}
          <button
            onClick={() => doSearch()}
            disabled={loading}
            className="bg-[#2D6A4F] text-white px-8 py-3.5 rounded-xl font-medium hover:bg-[#245a42] transition disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? "Analyse..." : "Chercher"}
          </button>
        </div>

        {/* Plan banner */}
        <div className="mb-4 flex items-center justify-between px-4 py-2.5 rounded-xl text-xs"
          style={{ background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.12)" }}>
          <span className="text-gray-400">
            <span className="font-semibold text-gray-300">Plan Free</span>
            {" · "}5 recherches/jour · 10 vidéos par recherche
          </span>
          <a href="/pricing" className="font-semibold hover:underline" style={{ color: "#FF1654" }}>
            ⭐ Upgrade
          </a>
        </div>

        <div className="mb-6 pb-2 border-b border-gray-200" />

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg mb-2">🔍</p>
            <p>Analyse des vidéos TikTok en cours...</p>
          </div>
        )}

        {/* Empty state — première visite ou aucun résultat */}
        {!loading && !searched && (
          <EmptyState lastSearch={lastSearch} onSearch={doSearch} />
        )}

        {!loading && searched && !error && results.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium text-gray-600 mb-1">Aucun résultat trouvé</p>
            <p className="text-sm">Essaie un autre mot-clé ou en anglais</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-6">
          <div className="flex gap-6 items-start">

            {/* Left: video cards (60%) */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">
                  {results.length} vidéos analysées
                </h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-xl bg-white text-xs text-gray-700 focus:outline-none"
                >
                  <option value="views">Vues ↓</option>
                  <option value="engagement">Engagement ↓</option>
                  <option value="likes">Likes ↓</option>
                  <option value="recent">Récent ↓</option>
                </select>
              </div>
              <div className="space-y-4">
                {visibleResults.map((video, i) => (
                  <VideoCard key={video.id} video={video} rank={i + 1} />
                ))}
              </div>

              {results.length > 3 && !expanded && (
                <button
                  onClick={() => setExpanded(true)}
                  className="w-full mt-4 py-5 bg-white border border-gray-100 rounded-2xl text-gray-400 text-sm hover:bg-gray-50 transition shadow-sm"
                >
                  + {results.length - 3} vidéos...
                </button>
              )}

              <div className="flex justify-center mt-8">
                <button className="bg-white border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-gray-50 shadow-sm">
                  ↓
                </button>
              </div>
            </div>

            {/* Right: stats panel (40%) */}
            {stats && (
              <StatsOverview
                stats={stats}
                topHashtags={stats.topHashtags ?? []}
                topHooks={stats.topHooks ?? []}
              />
            )}
          </div>

          {/* ── Premium Analytics Section ── */}
          {isPremium ? (
            <PremiumSection videos={results} />
          ) : (
            <div className="relative rounded-2xl overflow-hidden" style={{ background: "#0d1117" }}>
              {/* Blurred preview */}
              <div className="blur-sm pointer-events-none select-none p-6 space-y-4 opacity-40">
                <div className="h-6 w-48 rounded bg-gray-700" />
                <div className="grid grid-cols-2 gap-4">
                  {[0,1,2,3].map(i => <div key={i} className="h-48 rounded-xl bg-gray-800" />)}
                </div>
                <div className="h-32 rounded-xl bg-gray-800" />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <span className="text-3xl mb-3">💎</span>
                <p className="text-white font-black text-lg mb-1">Analytics Premium</p>
                <p className="text-gray-400 text-sm mb-5 max-w-sm">
                  4 graphiques, scores vidéo, patterns détectés, recommandations et prédictions de viralité.
                </p>
                <a
                  href="/pricing"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:brightness-110 transition"
                  style={{ background: "linear-gradient(135deg, #FF1654, #d4103c)" }}
                >
                  Upgrade vers Premium — 14,99€/mois →
                </a>
              </div>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
}

function PremiumSection({ videos }: { videos: ScrapedVideo[] }) {
  const chartData     = computeChartData(videos);
  const patterns      = detectPatterns(videos);
  const recs          = generateRecommendations(videos);
  const bench         = getBenchmark(videos);
  const top3          = [...videos].sort((a, b) => b.engagementRate - a.engagementRate).slice(0, 3);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.07)" }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3" style={{ background: "linear-gradient(90deg, rgba(255,22,84,0.1), rgba(0,217,255,0.06))", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-xl">💎</span>
        <div>
          <p className="text-white font-black text-sm">Premium Analytics</p>
          <p className="text-gray-500 text-xs">{videos.length} vidéos analysées en profondeur</p>
        </div>
        <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(255,22,84,0.15)", color: "#FF1654", border: "1px solid rgba(255,22,84,0.3)" }}>
          Premium
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Charts */}
        <AnalyticsCharts data={chartData} />

        {/* Benchmark */}
        <BenchmarkSection bench={bench} />

        {/* Patterns */}
        <PatternsSection patterns={patterns} />

        {/* Recommendations */}
        <div>
          <p className="text-white font-bold text-sm mb-3">💡 Recommandations personnalisées</p>
          <RecommendationsSection dos={recs.dos} avoids={recs.avoids} />
        </div>

        {/* Prediction */}
        <PredictionCard videos={videos} />

        {/* Top 3 scorecards */}
        <div>
          <p className="text-white font-bold text-sm mb-3">🏆 Scoring des 3 meilleures vidéos</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3.map((v, i) => (
              <VideoScorecard key={v.id} score={analyzeVideoAdvanced(v)} hook={v.hook} rank={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

