import Link from "next/link";
import { FEATURE_ROWS, PLANS } from "@/lib/plan-limits";

const PLAN_KEYS = ["free", "pro", "premium"] as const;

const SECTIONS = [
  {
    id: "demarrer",
    icon: "🚀",
    title: "Démarrer",
    items: [
      { q: "Comment faire ma première recherche ?", a: "Va sur la page Recherche, tape un mot-clé (ex: \"chat astuce\"), puis clique sur Chercher. NicheAnalyze analyse les vidéos TikTok en temps réel et affiche les résultats triés par vues." },
      { q: "Qu'est-ce qu'une niche ?",             a: "Une niche est un sujet précis sur TikTok — ex: \"chat anxieux\", \"dressage chien\", \"lapin éducation\". Plus ton mot-clé est précis, plus les résultats sont utiles et ciblés." },
      { q: "Combien de vidéos sont analysées ?",   a: "Par défaut 10 vidéos (Free), 50 vidéos (Pro) ou 100+ vidéos (Premium) par recherche." },
    ],
  },
  {
    id: "analyser",
    icon: "📊",
    title: "Analyser une vidéo",
    items: [
      { q: "Que signifie le taux d'engagement ?", a: "C'est (likes + commentaires + partages) / vues × 100. Au-dessus de 3% c'est bien, au-dessus de 5% c'est excellent, au-dessus de 10% c'est exceptionnel sur TikTok." },
      { q: "Comment lire la section Analyse ?",   a: "Chaque vidéo a une analyse automatique — Hook (qualité de l'accroche), Durée (optimale ou non), Engagement (score et conseil). Les icônes ✅ ⚠️ ❌ résument la qualité, et 💡 donne un conseil actionnable." },
      { q: "Pourquoi certaines vidéos n'ont pas de miniature ?", a: "TikTok limite parfois l'accès aux miniatures selon la région. La vidéo est quand même analysée — clique sur l'image pour la voir directement sur TikTok." },
    ],
  },
  {
    id: "stats",
    icon: "📈",
    title: "Statistiques globales",
    items: [
      { q: "Que montrent les statistiques du panneau droit ?", a: "Les moyennes sur l'ensemble des vidéos analysées : vues moyennes, likes, durée, engagement. C'est le benchmark de ta niche — tu sais exactement ce qu'il faut viser." },
      { q: "Comment utiliser les hashtags performants ?", a: "Les hashtags affichés sont ceux des top vidéos, avec leurs vues moyennes. Plus la moyenne est haute, plus le hashtag est efficace dans ta niche. Intègre les 3-5 premiers dans tes prochaines vidéos." },
      { q: "À quoi servent les Hooks les plus performants ?", a: "Ce sont les premières phrases des vidéos les plus vues de ta niche. Inspire-toi de leur structure (pas du texte exact) pour créer tes propres accroches avec le même angle." },
    ],
  },
  {
    id: "ameliorer",
    icon: "💡",
    title: "Améliorer son contenu",
    items: [
      { q: "Quelle durée viser ?", a: "Entre 15 et 45 secondes pour la plupart des niches. Au-delà de 60s, le drop-off augmente fortement et l'algorithme te pénalise. Les tutoriels DIY tolèrent 45-60s." },
      { q: "Comment créer un bon hook ?", a: "Vise 6-10 mots, inclus un mot émotionnel ou intrigant (secret, jamais vu, incroyable), et commence par un verbe d'action ou une question. Un emoji en début aide à capter l'attention." },
      { q: "À quelle fréquence faire des recherches ?", a: "Idéalement avant chaque série de vidéos (1-2x par semaine). Les tendances TikTok évoluent vite — une recherche fraîche te donne les tendances actuelles de ta niche." },
    ],
  },
];

function cellColor(val: string) {
  if (val === "—") return "text-gray-600";
  if (val.startsWith("✓")) return "text-emerald-400";
  return "text-gray-300";
}

export default function DocsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0E27" }}>

      {/* Hero */}
      <div className="py-20 px-6 text-center" style={{ background: "linear-gradient(180deg, #0C1030 0%, #0A0E27 100%)" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#FF1654" }}>Documentation</p>
        <h1 className="text-4xl font-black text-white mb-3">Comment utiliser NicheAnalyze</h1>
        <p className="text-gray-400 max-w-xl mx-auto">Tout ce qu'il faut savoir pour analyser ta niche et créer du contenu qui performe.</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14">

        {/* Table of contents */}
        <div className="rounded-2xl p-6 mb-10" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-sm font-semibold text-gray-300 mb-4">Sommaire</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[...SECTIONS, { id: "plans", icon: "💎", title: "Plans & Limites" }].map((s) => (
              <a key={s.id} href={`#${s.id}`}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF1654] transition-colors py-1">
                <span>{s.icon}</span>{s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {SECTIONS.map((section) => (
            <div key={section.id} id={section.id}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.q} className="rounded-xl p-5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="font-semibold text-white text-sm mb-2">{item.q}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Plans section */}
          <div id="plans">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">💎</span>
              <h2 className="text-xl font-bold text-white">Plans & Limites</h2>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              {/* Header row */}
              <div className="grid grid-cols-4 text-center text-xs font-bold uppercase tracking-wide py-4 px-4"
                style={{ background: "rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-left text-gray-400">Fonctionnalité</div>
                {PLAN_KEYS.map((k) => (
                  <div key={k} style={{ color: PLANS[k].color }}>{PLANS[k].label}</div>
                ))}
              </div>
              {FEATURE_ROWS.map((row, i) => (
                <div key={row.label}
                  className="grid grid-cols-4 text-center text-xs py-3.5 px-4"
                  style={{
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}>
                  <div className="text-left text-gray-400">{row.label}</div>
                  {PLAN_KEYS.map((k) => (
                    <div key={k} className={`font-medium ${cellColor(row[k])}`}>{row[k]}</div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Link href="/pricing" className="text-sm text-[#FF1654] hover:underline">
                Voir les détails et tarifs →
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-2xl p-8 text-center"
          style={{ background: "rgba(255,22,84,0.06)", border: "1px solid rgba(255,22,84,0.15)" }}>
          <p className="text-lg font-bold text-white mb-2">Prêt à analyser ta niche ?</p>
          <p className="text-gray-400 text-sm mb-5">Lance ta première recherche gratuitement en 30 secondes.</p>
          <Link href="/dashboard/search"
            className="inline-block px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #FF1654, #d4103c)" }}>
            Commencer gratuitement →
          </Link>
        </div>
      </div>
    </div>
  );
}
