"use client";
import type { VideoScore } from "@/lib/premium-analytics";

function scoreColor(score: number) {
  if (score >= 8) return { text: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" };
  if (score >= 5) return { text: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" };
  return { text: "#FF1654", bg: "rgba(255,22,84,0.12)", border: "rgba(255,22,84,0.25)" };
}

function ScoreBar({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <div className="relative h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
      <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-700" style={{ width: `${score * 10}%`, background: color.text }} />
    </div>
  );
}

function ScoreItem({ icon, label, score, description }: { icon: string; label: string; score: number; description: string }) {
  const c = scoreColor(score);
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
      <span className="text-lg shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-white">{label}</span>
          <span className="text-sm font-black shrink-0 ml-2" style={{ color: c.text }}>{score}/10</span>
        </div>
        <ScoreBar score={score} />
        <p className="text-[11px] text-gray-400 mt-1.5 leading-snug">{description}</p>
      </div>
    </div>
  );
}

export default function VideoScorecard({ score, hook, rank }: { score: VideoScore; hook: string; rank: number }) {
  const viralColor = scoreColor(score.virality);
  return (
    <div className="rounded-2xl p-5 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-500">#{rank}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: viralColor.bg, color: viralColor.text, border: `1px solid ${viralColor.border}` }}>
              Viralité {score.virality}/10
            </span>
          </div>
          <p className="text-xs text-gray-300 italic leading-snug line-clamp-2">"{hook}"</p>
        </div>
        {/* Virality big score */}
        <div className="shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center" style={{ background: viralColor.bg, border: `1px solid ${viralColor.border}` }}>
          <span className="text-xl font-black" style={{ color: viralColor.text }}>{score.virality}</span>
          <span className="text-[9px] text-gray-500 font-medium">/10</span>
        </div>
      </div>

      {/* Score grid */}
      <div className="grid grid-cols-2 gap-2">
        <ScoreItem icon="🎣" label="Hook"    score={score.hook}     description={score.hookLabel} />
        <ScoreItem icon="⏱️" label="Durée"   score={score.duration} description={score.durationLabel} />
        <ScoreItem icon="🎬" label="Format"  score={score.format}   description={score.formatLabel} />
        <ScoreItem icon="📣" label="CTA"     score={score.cta}      description={score.ctaLabel} />
      </div>
    </div>
  );
}
