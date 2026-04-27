"use client";
import type { ScrapedVideo } from "@/lib/tiktok-scraper";
import { analyzeVideoAdvanced } from "@/lib/premium-analytics";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return n.toString();
}

function ViralityMeter({ score }: { score: number }) {
  const color = score >= 8 ? "#10b981" : score >= 5 ? "#f59e0b" : "#FF1654";
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000" style={{ width: `${score * 10}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
      </div>
      <span className="text-2xl font-black shrink-0" style={{ color }}>{score}/10</span>
    </div>
  );
}

export default function PredictionCard({ videos }: { videos: ScrapedVideo[] }) {
  if (videos.length === 0) return null;

  // Aggregate virality from top videos
  const topVideos = [...videos].sort((a, b) => b.engagementRate - a.engagementRate).slice(0, 5);
  const scores = topVideos.map(v => analyzeVideoAdvanced(v));
  const avgVirality = Math.round(scores.reduce((s, sc) => s + sc.virality, 0) / scores.length);
  const avgViews = Math.round(videos.reduce((s, v) => s + v.views, 0) / videos.length);

  // Predict views range based on niche data
  const top25pct = [...videos].sort((a, b) => b.views - a.views).slice(0, Math.max(1, Math.ceil(videos.length * 0.25)));
  const p75Views = Math.round(top25pct.reduce((s, v) => s + v.views, 0) / top25pct.length);
  const low  = Math.round(avgViews * 0.7);
  const high = Math.round(p75Views * 0.9);

  // Best time to post from publishedAt of top performers
  const topByEng = [...videos].sort((a, b) => b.engagementRate - a.engagementRate).slice(0, Math.ceil(videos.length * 0.3)).filter(v => v.publishedAt > 0);
  let bestTimeMsg = "Données insuffisantes";
  if (topByEng.length >= 3) {
    const hours = topByEng.map(v => new Date(v.publishedAt * 1000).getHours());
    const hourCount: Record<number, number> = {};
    hours.forEach(h => { hourCount[h] = (hourCount[h] ?? 0) + 1; });
    const peakHour = parseInt(Object.entries(hourCount).sort((a, b) => b[1] - a[1])[0][0]);
    bestTimeMsg = `${peakHour}h - ${(peakHour + 2) % 24}h (heure des top performers)`;
  }

  const viralColor = avgVirality >= 8 ? "#10b981" : avgVirality >= 5 ? "#f59e0b" : "#FF1654";

  return (
    <div className="rounded-2xl p-5 space-y-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <p className="text-white font-bold text-sm">🔮 Prédictions & Potentiel viral</p>

      {/* Virality score */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Potentiel viral de la niche</p>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${viralColor}1a`, color: viralColor, border: `1px solid ${viralColor}44` }}>
            {avgVirality >= 8 ? "Excellent" : avgVirality >= 6 ? "Très bon" : avgVirality >= 4 ? "Moyen" : "Faible"}
          </span>
        </div>
        <ViralityMeter score={avgVirality} />
        <p className="text-[11px] text-gray-500">Basé sur l'analyse des {Math.min(5, videos.length)} meilleures vidéos de la niche</p>
      </div>

      <div className="border-t border-white/5" />

      {/* Predicted views */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background: "rgba(255,22,84,0.07)", border: "1px solid rgba(255,22,84,0.15)" }}>
          <p className="text-[10px] text-gray-500 mb-1">Vues estimées (si bien exécuté)</p>
          <p className="text-base font-black text-white">{fmt(low)} – {fmt(high)}</p>
          <p className="text-[10px] text-gray-600 mt-0.5">Basé sur les données de ta niche</p>
        </div>
        <div className="rounded-xl p-3" style={{ background: "rgba(0,217,255,0.07)", border: "1px solid rgba(0,217,255,0.15)" }}>
          <p className="text-[10px] text-gray-500 mb-1">Meilleure heure pour poster</p>
          <p className="text-sm font-black text-white leading-tight">{bestTimeMsg}</p>
          <p className="text-[10px] text-gray-600 mt-0.5">Heure locale des créateurs</p>
        </div>
      </div>

      {/* Reasoning */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold text-gray-400">Pourquoi ce score ?</p>
        {scores[0] && (
          <>
            <ReasonLine icon="🎣" good={scores[0].hook >= 7} text={`Hook: ${scores[0].hookLabel}`} />
            <ReasonLine icon="⏱️" good={scores[0].duration >= 7} text={`Durée: ${scores[0].durationLabel}`} />
            <ReasonLine icon="🎬" good={scores[0].format >= 7} text={`Format: ${scores[0].formatLabel}`} />
            <ReasonLine icon="📣" good={scores[0].cta >= 5}    text={`CTA: ${scores[0].ctaLabel}`} />
          </>
        )}
      </div>
    </div>
  );
}

function ReasonLine({ icon, good, text }: { icon: string; good: boolean; text: string }) {
  return (
    <div className="flex items-start gap-2 text-[11px]">
      <span>{icon}</span>
      <span className={good ? "text-emerald-400" : "text-gray-500"}>{good ? "✓" : "✗"}</span>
      <span className="text-gray-400">{text}</span>
    </div>
  );
}
