"use client";
import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { ScrapedVideo, VideoStats } from "@/lib/tiktok-scraper";
import { detectLanguage } from "@/lib/language-detector";
import { translateQuery } from "@/lib/language-keywords";
import StatsOverview from "@/components/Search/StatsOverview";
import EmptyState from "@/components/Search/EmptyState";
import UpgradeModal from "@/components/Search/UpgradeModal";
import LoginPromptModal from "@/components/Search/LoginPromptModal";
import Tooltip from "@/components/Tooltip";
import { TOOLTIPS } from "@/lib/tooltip-data";
import { analyzeVideo } from "@/lib/video-analyzer";
import dynamic from "next/dynamic";
import {
  PatternsSection, RecommendationsSection, SoundtrackSection,
} from "@/components/Premium/InsightsPanel";
import {
  analyzeVideoAdvanced, detectPatterns, generateRecommendations,
  computeChartData, computeTopSoundtracks,
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
  premiumVideos?: ScrapedVideo[];
  stats: ApiStats | null;
  detectedLanguage?: "fr" | "en" | "other";
  total: number;
  premiumLocked?: boolean;
  guestLimit?: boolean;
  isGuest?: boolean;
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
  const plan = (session?.user as { plan?: string })?.plan ?? "free";
  const isPremium = plan === "premium";
  const isPro = plan === "pro";
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("views");
  const [results, setResults] = useState<ScrapedVideo[]>([]);
  const [premiumVideos, setPremiumVideos] = useState<ScrapedVideo[]>([]);
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeModal, setUpgradeModal] = useState<"search_limit" | "video_limit" | "hashtag_limit" | "export" | "analytics" | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
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

    // Guest : bloquer après 2 recherches côté client
    if (!session?.user) {
      const guestCount = parseInt(localStorage.getItem("nicheanalyze_guest_searches") || "0");
      if (guestCount >= 2) {
        setShowLoginPrompt(true);
        return;
      }
    }
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
        const msg = data.error ?? "Erreur lors de la recherche";
        if (data.guestLimit) {
          setShowLoginPrompt(true);
        } else if (res.status === 429 && msg.toLowerCase().includes("limite")) {
          setUpgradeModal("search_limit");
        } else {
          setError(msg);
        }
        setResults([]);
        setPremiumVideos([]);
        setStats(null);
      } else {
        setResults(data.videos ?? []);
        setPremiumVideos(data.premiumVideos ?? []);
        setStats(data.stats ?? null);
        // Incrémenter le compteur guest après une recherche réussie
        if (!session?.user) {
          const guestCount = parseInt(localStorage.getItem("nicheanalyze_guest_searches") || "0");
          localStorage.setItem("nicheanalyze_guest_searches", String(guestCount + 1));
        }
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
    <div className="min-h-screen bg-stone-50 px-3 sm:px-6 py-6">
      {upgradeModal && (
        <UpgradeModal
          plan={plan as "free" | "pro"}
          reason={upgradeModal}
          onClose={() => setUpgradeModal(null)}
        />
      )}
      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}
      <div className="max-w-5xl mx-auto">

        {/* Search bar */}
        <div className="flex gap-2 sm:gap-3 mb-3">
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
            <span className="font-semibold" style={{
              color: isPremium ? "#00D9FF" : isPro ? "#FF1654" : "#94a3b8"
            }}>
              Plan {isPremium ? "Premium" : isPro ? "Pro" : "Free"}
            </span>
            {isPremium
              ? " · Recherches illimitées · 100+ vidéos par recherche"
              : isPro
              ? " · 50 recherches/jour · 50 vidéos par recherche"
              : " · 5 recherches/jour · 10 vidéos par recherche"}
          </span>
          {!isPremium && (
            <a href="/pricing" className="font-semibold hover:underline" style={{ color: "#FF1654" }}>
              {isPro ? "⭐ Upgrade vers Premium" : "⭐ Upgrade vers Pro"}
            </a>
          )}
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
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* Left: video cards */}
            <div className="flex-1 min-w-0 w-full">
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

              {expanded && (
                <button
                  onClick={() => { setExpanded(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="w-full mt-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-400 text-sm hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-2"
                >
                  <span>↑</span> Réduire
                </button>
              )}
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
            <PremiumSection videos={premiumVideos} />
          ) : (
            <div className="relative rounded-2xl overflow-hidden" style={{ background: "#0d1117" }}>
              {/* Blurred preview — fake charts */}
              <div className="blur-md pointer-events-none select-none p-6 space-y-4 opacity-60">
                <div className="grid grid-cols-2 gap-4">
                  {/* Fake bar chart 1 */}
                  <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="h-4 w-36 rounded bg-gray-600 mb-1" />
                    <div className="h-3 w-24 rounded bg-gray-700 mb-4" />
                    <svg width="100%" height="130" viewBox="0 0 260 130">
                      {[40,90,70,55,80].map((h, i) => (
                        <rect key={i} x={10 + i * 50} y={130 - h} width={36} height={h} rx={4}
                          fill={i === 1 ? "#FF1654" : "rgba(255,255,255,0.15)"} />
                      ))}
                      <line x1="0" y1="130" x2="260" y2="130" stroke="rgba(255,255,255,0.1)" />
                    </svg>
                  </div>
                  {/* Fake bar chart 2 — vues par type */}
                  <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="h-4 w-40 rounded bg-gray-600 mb-1" />
                    <div className="h-3 w-28 rounded bg-gray-700 mb-4" />
                    <svg width="100%" height="130" viewBox="0 0 260 130">
                      {[
                        { h: 100, c: "#FF1654" }, { h: 65, c: "#00D9FF" }, { h: 85, c: "#a78bfa" },
                        { h: 45, c: "#f59e0b" }, { h: 70, c: "#10b981" },
                      ].map((b, i) => (
                        <rect key={i} x={8 + i * 50} y={130 - b.h} width={38} height={b.h} rx={4} fill={b.c} fillOpacity={0.7} />
                      ))}
                      <line x1="0" y1="130" x2="260" y2="130" stroke="rgba(255,255,255,0.1)" />
                    </svg>
                  </div>
                  {/* Fake scatter plot */}
                  <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="h-4 w-44 rounded bg-gray-600 mb-1" />
                    <div className="h-3 w-32 rounded bg-gray-700 mb-4" />
                    <svg width="100%" height="130" viewBox="0 0 260 130">
                      {[[30,100],[60,70],[80,50],[100,40],[120,30],[140,80],[160,25],[180,60],[200,20],[220,45],[50,90],[90,55]].map(([x,y],i) => (
                        <circle key={i} cx={x} cy={y} r={5} fill="#00D9FF" fillOpacity={0.75} />
                      ))}
                      <line x1="0" y1="130" x2="260" y2="130" stroke="rgba(255,255,255,0.1)" />
                      <line x1="0" y1="0" x2="0" y2="130" stroke="rgba(255,255,255,0.1)" />
                    </svg>
                  </div>
                  {/* Fake line chart */}
                  <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="h-4 w-36 rounded bg-gray-600 mb-1" />
                    <div className="h-3 w-24 rounded bg-gray-700 mb-4" />
                    <svg width="100%" height="130" viewBox="0 0 260 130">
                      <polyline points="10,110 50,80 90,95 130,50 170,65 210,30 250,45"
                        fill="none" stroke="#FF1654" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="10,120 50,100 90,115 130,85 170,90 210,70 250,75"
                        fill="none" stroke="#00D9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" />
                      {[10,50,90,130,170,210,250].map((x,i) => {
                        const ys = [110,80,95,50,65,30,45];
                        return <circle key={i} cx={x} cy={ys[i]} r={3} fill="#FF1654" />;
                      })}
                      <line x1="0" y1="130" x2="260" y2="130" stroke="rgba(255,255,255,0.1)" />
                    </svg>
                  </div>
                </div>
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
                  {isPro
                    ? "⭐ Upgrade vers Premium — 14,99€/mois →"
                    : "⭐ Essayer Pro ou Premium →"}
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
  const soundtracks   = computeTopSoundtracks(videos);
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

        {/* Patterns */}
        <PatternsSection patterns={patterns} />

        {/* Musiques */}
        <SoundtrackSection tracks={soundtracks} />

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
              <VideoScorecard key={v.id} score={analyzeVideoAdvanced(v)} hook={v.hook} rank={i + 1} thumbnail={v.thumbnail} videoUrl={v.videoUrl} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

