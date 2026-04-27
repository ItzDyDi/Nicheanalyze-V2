"use client";
import { useState } from "react";
import type { ScrapedVideo, VideoStats } from "@/lib/tiktok-scraper";
import Tooltip from "@/components/Tooltip";
import { TOOLTIPS } from "@/lib/tooltip-data";

const BAR_COLORS = ["bg-[#2D6A4F]", "bg-amber-400", "bg-orange-400", "bg-stone-300", "bg-blue-300"];

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

interface Props {
  stats: VideoStats;
  topHashtags: { tag: string; count: number; avgViews: number }[];
  topHooks: { hook: string; views: number; engagementRate: number }[];
}

export default function StatsOverview({ stats, topHashtags, topHooks }: Props) {
  const [hookSort, setHookSort] = useState<"views" | "engagement">("views");

  const sortedHooks = [...topHooks].sort((a, b) =>
    hookSort === "engagement" ? b.engagementRate - a.engagementRate : b.views - a.views
  );

  return (
    <div className="w-72 flex-shrink-0 space-y-3">
      <h2 className="text-base font-semibold">Statistiques globales</h2>

      {/* 4 stat cards */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <Tooltip text={TOOLTIPS.avgViews}>
          <p className="text-xs text-gray-400 mb-1">Vues moyennes</p>
        </Tooltip>
        <p className="text-2xl font-bold text-blue-500">{fmt(stats.avgViews)}</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <Tooltip text={TOOLTIPS.avgLikes}>
          <p className="text-xs text-gray-400 mb-1">Likes moyens</p>
        </Tooltip>
        <p className="text-2xl font-bold text-rose-400">{fmt(stats.avgLikes)}</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <Tooltip text={TOOLTIPS.avgDuration}>
          <p className="text-xs text-gray-400 mb-1">Durée moyenne</p>
        </Tooltip>
        <p className="text-2xl font-bold text-emerald-500">{stats.avgDuration}s</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <Tooltip text={TOOLTIPS.avgEngagement}>
          <p className="text-xs text-gray-400 mb-1">Engagement moyen</p>
        </Tooltip>
        <p className="text-2xl font-bold text-amber-500">{stats.avgEngagementRate}%</p>
      </div>

      {/* Content type breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Types de contenu</h3>
        <div className="space-y-3">
          {stats.contentTypeBreakdown.map((item, i) => (
            <div key={item.type}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700">{item.type}</span>
                <span className="text-gray-400">{item.count} vidéos ({item.percent}%)</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top hashtags */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Hashtags performants</h3>
        <div className="space-y-2">
          {topHashtags.map((h, i) => (
            <div key={h.tag} className="flex items-center justify-between gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                i < 3 ? "bg-[#2D6A4F] text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {h.tag}
              </span>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 whitespace-nowrap">
                <span>{h.count} vidéo{h.count > 1 ? "s" : ""}</span>
                <span className="text-blue-400 font-medium">{fmt(h.avgViews)} vues moy.</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top hooks */}
      {topHooks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">🪝 Hooks les plus performants</h3>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setHookSort("views")}
                className={`text-[10px] px-2 py-1 rounded-md font-medium transition-colors ${
                  hookSort === "views" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Vues
              </button>
              <button
                onClick={() => setHookSort("engagement")}
                className={`text-[10px] px-2 py-1 rounded-md font-medium transition-colors ${
                  hookSort === "engagement" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Eng.
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {sortedHooks.map((h, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2D6A4F] text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-700 leading-snug italic">{h.hook}</p>
                  <div className="flex gap-3 mt-1">
                    <span className={`text-[10px] font-medium ${hookSort === "views" ? "text-blue-600 underline underline-offset-2" : "text-blue-400"}`}>
                      {fmt(h.views)} vues
                    </span>
                    <span className={`text-[10px] font-medium ${hookSort === "engagement" ? "text-emerald-600 underline underline-offset-2" : "text-emerald-400"}`}>
                      {h.engagementRate}% eng.
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function computeClientStats(videos: ScrapedVideo[]): VideoStats | null {
  if (!videos.length) return null;
  const n = videos.length;
  const avgViews = Math.round(videos.reduce((s, v) => s + v.views, 0) / n);
  const avgLikes = Math.round(videos.reduce((s, v) => s + v.likes, 0) / n);
  const avgDuration = Math.round(videos.reduce((s, v) => s + v.duration, 0) / n);
  const avgEngagementRate = Math.round((videos.reduce((s, v) => s + v.engagementRate, 0) / n) * 10) / 10;
  const typeCounts: Record<string, number> = {};
  for (const v of videos) typeCounts[v.contentType] = (typeCounts[v.contentType] ?? 0) + 1;
  const contentTypeBreakdown = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type, count, percent: Math.round((count / n) * 100) }));
  return { avgViews, avgLikes, avgDuration, avgEngagementRate, contentTypeBreakdown };
}
