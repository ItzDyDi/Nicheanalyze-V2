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
    color: "#00D9FF",
    title: "Stats ultra-détaillées",
    desc: "Vues, likes, taux d'engagement, durée optimale — comprenez exactement ce qui performe et pourquoi.",
    points: ["Engagement breakdown", "Comparaison de formats", "Métriques clés"],
  },
  {
    icon: "🧠",
    color: "#FDB51A",
    title: "Insights IA",
    desc: "Notre IA analyse hooks, durées et hashtags pour vous donner des recommandations directement actionnables.",
    points: ["Analyse de hooks", "Format gagnant", "Hashtags performants"],
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-24 px-6" style={{ background: "#0C1030" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#FDB51A" }}>
            Fonctionnalités
          </p>
          <h2 className="text-3xl font-black text-white mb-3">
            Tout ce dont tu as besoin
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            pour comprendre ce qui cartonne sur TikTok dans ta niche
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl p-8 group transition-all duration-300 hover:-translate-y-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6"
                style={{
                  background: `${f.color}12`,
                  border: `1px solid ${f.color}28`,
                  boxShadow: `0 0 20px ${f.color}10`,
                }}
              >
                {f.icon}
              </div>

              <h3 className="text-white font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{f.desc}</p>

              <ul className="space-y-2">
                {f.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-xs">
                    <span style={{ color: f.color }}>✓</span>
                    <span className="text-gray-300">{p}</span>
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
