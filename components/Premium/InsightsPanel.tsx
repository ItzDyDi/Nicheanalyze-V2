"use client";
import type { Pattern, Benchmark } from "@/lib/premium-analytics";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toString();
}

function ImpactBadge({ impact }: { impact: "high" | "medium" | "low" }) {
  const map = {
    high:   { label: "Impact fort",   bg: "rgba(16,185,129,0.12)",  color: "#10b981", border: "rgba(16,185,129,0.25)" },
    medium: { label: "Impact moyen",  bg: "rgba(245,158,11,0.12)",  color: "#f59e0b", border: "rgba(245,158,11,0.25)" },
    low:    { label: "Impact faible", bg: "rgba(148,163,184,0.1)",  color: "#94a3b8", border: "rgba(148,163,184,0.2)" },
  };
  const s = map[impact];
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </span>
  );
}

export function PatternsSection({ patterns }: { patterns: Pattern[] }) {
  if (patterns.length === 0) return null;
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <p className="text-white font-bold text-sm mb-4">🔍 Patterns détectés dans ta niche</p>
      <div className="space-y-3">
        {patterns.map((p) => (
          <div key={p.title} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-xl shrink-0">{p.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-sm font-bold text-white">{p.title}</p>
                <ImpactBadge impact={p.impact} />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecommendationsSection({ dos, avoids }: { dos: string[]; avoids: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-2xl p-5" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
        <p className="text-emerald-400 font-bold text-sm mb-3">✅ À faire</p>
        <ul className="space-y-2">
          {dos.map(d => (
            <li key={d} className="flex items-start gap-2 text-xs text-gray-300 leading-snug">
              <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
              {d}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl p-5" style={{ background: "rgba(255,22,84,0.05)", border: "1px solid rgba(255,22,84,0.15)" }}>
        <p className="font-bold text-sm mb-3" style={{ color: "#FF1654" }}>❌ À éviter</p>
        <ul className="space-y-2">
          {avoids.map(a => (
            <li key={a} className="flex items-start gap-2 text-xs text-gray-300 leading-snug">
              <span className="shrink-0 mt-0.5" style={{ color: "#FF1654" }}>✕</span>
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function BenchmarkSection({ bench }: { bench: Benchmark }) {
  const stats = [
    { label: "Vues moyennes",    value: fmt(bench.avgViews),               icon: "👁" },
    { label: "Engagement moyen", value: `${bench.avgEngagement}%`,          icon: "❤️" },
    { label: "Durée moyenne",    value: bench.avgDuration > 0 ? `${bench.avgDuration}s` : "—", icon: "⏱️" },
    { label: "Hashtags / vidéo", value: bench.avgHashtags.toString(),       icon: "#️⃣" },
    { label: "Top engagement",   value: `${bench.topEngagement}%`,          icon: "🏆" },
    { label: "Score de niche",   value: `${bench.nicheScore}%`,             icon: "🎯",
      note: "% de vidéos avec >3% engagement" },
  ];
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <p className="text-white font-bold text-sm mb-4">📊 Benchmark de la niche</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{s.icon}</span>
              <p className="text-[11px] text-gray-500">{s.label}</p>
            </div>
            <p className="text-lg font-black text-white">{s.value}</p>
            {s.note && <p className="text-[10px] text-gray-600 mt-0.5">{s.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
