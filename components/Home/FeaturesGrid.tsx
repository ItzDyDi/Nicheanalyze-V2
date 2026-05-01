const features = [
  {
    icon: "🔍",
    color: "#FF1654",
    title: "Recherche par niche",
    desc: "Tapez n'importe quel mot-clé et accédez aux vidéos les plus performantes de votre niche en temps réel.",
    points: ["Top 20 vidéos virales", "Analyse en temps réel", "Toutes les niches"],
  },
  {
    icon: "📊",
    color: "#0099d6",
    title: "Stats ultra-détaillées",
    desc: "Vues, likes, taux d'engagement, durée optimale — comprenez exactement ce qui performe et pourquoi.",
    points: ["Engagement breakdown", "Comparaison de formats", "Métriques clés"],
  },
  {
    icon: "🧠",
    color: "#f59e0b",
    title: "Insights IA",
    desc: "Notre IA analyse hooks, durées et hashtags pour vous donner des recommandations directement actionnables.",
    points: ["Analyse de hooks", "Format gagnant", "Hashtags performants"],
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-12 sm:py-24 px-4 sm:px-6" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#f59e0b" }}>
            Fonctionnalités
          </p>
          <h2 className="text-3xl font-black mb-3" style={{ color: "#111827" }}>
            Tout ce dont tu as besoin
          </h2>
          <p className="max-w-xl mx-auto text-sm" style={{ color: "#6b7280" }}>
            pour comprendre ce qui cartonne sur TikTok dans ta niche
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 sm:p-8 group transition-all duration-300 hover:-translate-y-2"
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6"
                style={{
                  background: `${f.color}10`,
                  border: `1px solid ${f.color}25`,
                }}
              >
                {f.icon}
              </div>

              <h3 className="font-bold text-xl mb-2" style={{ color: "#111827" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#6b7280" }}>{f.desc}</p>

              <ul className="space-y-2">
                {f.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-xs">
                    <span style={{ color: f.color }}>✓</span>
                    <span style={{ color: "#374151" }}>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
