"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell, Legend, LineChart, Line,
  AreaChart, Area,
} from "recharts";
import type { ChartData } from "@/lib/premium-analytics";

const COLORS = ["#FF1654", "#00D9FF", "#a78bfa", "#f59e0b", "#10b981", "#f97316"];

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <p className="text-white font-bold text-sm mb-0.5">{title}</p>
      {subtitle && <p className="text-gray-500 text-xs mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: "#1e2235", border: "1px solid rgba(255,255,255,0.12)" }}>
      <p className="text-gray-300 font-semibold mb-1">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="text-white font-bold">{p.value}</span></p>
      ))}
    </div>
  );
}

export default function AnalyticsCharts({ data }: { data: ChartData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Chart 1: Duration performance */}
      <ChartCard title="Performance par durée" subtitle="Engagement moyen selon la longueur de la vidéo">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.durationPerformance} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="range" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="engagement" name="Engagement %" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.durationPerformance.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#FF1654" : i === 1 ? "#FF1654" : "#4b5563"} fillOpacity={i <= 1 ? 1 : 0.5} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Chart 2: Vues moyennes par type de contenu */}
      <ChartCard title="Vues par type de contenu" subtitle="Vues moyennes selon le format de vidéo">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.contentTypes} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="type" tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v: number) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgViews" name="Vues moy." radius={[4, 4, 0, 0]} maxBarSize={40}>
              {data.contentTypes.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Chart 3: Hook quality vs Vues */}
      <ChartCard title="Hook quality vs Vues" subtitle="Corrélation entre qualité du hook et nombre de vues">
        <ResponsiveContainer width="100%" height={200}>
          <ScatterChart margin={{ top: 0, right: 10, left: -10, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="hookScore" name="Hook score" type="number" domain={[0, 10]}
              tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}
              label={{ value: "Hook /10", position: "insideBottom", offset: -10, fill: "#6b7280", fontSize: 10 }} />
            <YAxis dataKey="views" name="Vues" tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false} tickLine={false}
              tickFormatter={(v: number) => v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.1)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                const fmt = (n: number) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}k` : String(n);
                return (
                  <div className="rounded-xl px-3 py-2 text-xs max-w-[200px]" style={{ background: "#1e2235", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <p className="text-[#00D9FF] font-bold mb-1">Hook: {d.hookScore}/10</p>
                    <p className="text-[#FF1654]">Vues: {fmt(d.views)}</p>
                    <p className="text-gray-400 mt-1 leading-snug">{d.label}</p>
                  </div>
                );
              }}
            />
            <Scatter data={data.hookVsEngagement} fill="#00D9FF" fillOpacity={0.8} />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Chart 4: Distribution des vues — area chart */}
      <ChartCard title="Distribution des vues" subtitle="Répartition des vidéos par tranche de vues">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data.viewsDistribution} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="range" tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="count" name="Nb vidéos"
              stroke="#a78bfa" strokeWidth={2.5}
              fill="url(#viewsGrad)"
              dot={{ fill: "#a78bfa", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#a78bfa" }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Chart 5: Courbe vues par type de contenu */}
      <ChartCard title="Courbe vues × engagement par type" subtitle="Performance croisée selon le format">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.contentTypes} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="type" tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v: number) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
            <Line yAxisId="left" type="monotone" dataKey="avgViews" name="Vues moy."
              stroke="#FF1654" strokeWidth={2} dot={{ fill: "#FF1654", r: 4 }} activeDot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey="avgEng" name="Engagement %"
              stroke="#00D9FF" strokeWidth={2} dot={{ fill: "#00D9FF", r: 4 }} activeDot={{ r: 6 }} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  );
}
