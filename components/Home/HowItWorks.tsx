const steps = [
  {
    num: "01",
    icon: "🔍",
    color: "#FF1654",
    title: "Cherche ta niche",
    desc: "Tape un mot-clé ou un hashtag. On trouve instantanément les vidéos les plus performantes.",
  },
  {
    num: "02",
    icon: "📊",
    color: "#00D9FF",
    title: "On analyse tout",
    desc: "Hooks, durée, engagement, hashtags — notre IA décode ce qui rend chaque vidéo virale.",
  },
  {
    num: "03",
    icon: "🚀",
    color: "#FDB51A",
    title: "Tu crées mieux",
    desc: "Applique les insights à ton contenu et regarde tes vues exploser.",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="py-24 px-6"
      style={{ background: "linear-gradient(180deg, #0A0E27 0%, #0C1030 100%)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#00D9FF" }}>
            Comment ça marche
          </p>
          <h2 className="text-3xl font-black text-white">Simple. Rapide. Efficace.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connector (desktop) */}
          <div className="hidden md:block absolute top-10 left-[25%] right-[25%] h-px"
            style={{ background: "linear-gradient(90deg, rgba(255,22,84,0.25), rgba(0,217,255,0.25))" }} />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4">
              {/* Icon box */}
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl relative"
                style={{
                  background: `${step.color}12`,
                  border: `1px solid ${step.color}28`,
                  boxShadow: `0 0 30px ${step.color}15`,
                }}
              >
                {step.icon}
                {/* Step number badge */}
                <span
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: step.color }}
                >
                  {i + 1}
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: step.color }}>
                  ÉTAPE {step.num}
                </p>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
