import Link from "next/link";
import Image from "next/image";
import { PLANS, FEATURE_ROWS } from "@/lib/plan-limits";
import CheckoutButton from "@/components/Pricing/CheckoutButton";

const PLAN_KEYS = ["free", "pro", "premium"] as const;

const PLAN_STYLE = {
  free:    { border: "rgba(255,255,255,0.08)", btn: "bg-white/10 hover:bg-white/15 text-white" },
  pro:     { border: "#FF1654",                btn: "text-white",                               badge: "Le plus populaire" },
  premium: { border: "rgba(0,217,255,0.35)",   btn: "text-white" },
};

const PLAN_BTN_BG = {
  free:    "",
  pro:     "linear-gradient(135deg, #FF1654, #d4103c)",
  premium: "linear-gradient(135deg, #00D9FF, #0099bb)",
};

const FAQS = [
  { q: "Puis-je annuler à tout moment ?",         a: "Oui, sans engagement. Annule depuis ton compte à tout moment, sans frais." },
  { q: "Les données TikTok sont-elles en temps réel ?", a: "Oui, chaque recherche interroge l'API TikTok en direct. Pas de cache vieux de plusieurs jours." },
  { q: "Le plan Free a-t-il une limite de temps ?", a: "Non, le plan Free est gratuit pour toujours avec 5 recherches par jour." },
  { q: "Y a-t-il une réduction annuelle ?",        a: "Oui — en payant à l'année tu économises 2 mois. Disponible dans les paramètres de compte." },
];

function cellColor(value: string) {
  if (value === "—") return "text-gray-600";
  if (value.startsWith("✓")) return "text-emerald-400";
  return "text-gray-200";
}

const SORTED_ROWS = [...FEATURE_ROWS].sort((a, b) => {
  const score = (row: typeof FEATURE_ROWS[0]) =>
    PLAN_KEYS.filter((k) => row[k] !== "—").length;
  return score(b) - score(a);
});

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0E27" }}>

      {/* Hero */}
      <div className="py-20 px-6 text-center" style={{ background: "linear-gradient(180deg, #0C1030 0%, #0A0E27 100%)" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#FF1654" }}>Pricing</p>
        <h1 className="text-4xl font-black text-white mb-3">Un plan pour chaque créateur</h1>
        <p className="text-gray-400">Commence gratuitement. Upgrade quand tu es prêt.</p>
      </div>

      {/* Plan cards */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLAN_KEYS.map((key) => {
            const plan = PLANS[key];
            const style = PLAN_STYLE[key];
            const btnBg = PLAN_BTN_BG[key];
            return (
              <div
                key={key}
                className="rounded-2xl p-6 relative"
                style={{ background: "rgba(255,255,255,0.035)", border: `1px solid ${"border" in style ? style.border : "rgba(255,255,255,0.08)"}` }}
              >
                {"badge" in style && style.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap"
                    style={{ background: "#FF1654" }}>
                    {style.badge}
                  </span>
                )}

                {/* Header */}
                <div className="mb-5">
                  {key !== "free" && (
                    <Image
                      src={key === "pro" ? "/icone-pro.png" : "/icone-premium.png"}
                      alt={plan.label}
                      width={48} height={48}
                      className="rounded-xl mb-3 object-contain"
                    />
                  )}
                  <h2 className="text-lg font-bold text-white mb-0.5">{plan.label}</h2>
                  <p className="text-xs text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mt-2 mb-3">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-sm text-gray-400">{plan.period}</span>
                  </div>
                  <div className="mb-3 h-[30px] flex items-center">
                    {plan.yearlyPrice ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
                        <span className="text-xs text-gray-400">{plan.yearlyPrice}/an</span>
                        <span className="text-xs font-bold text-emerald-400">2 mois offerts</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* CTA */}
                {key === "free" ? (
                  <Link
                    href="/dashboard/search"
                    className={`block w-full text-center py-2.5 rounded-xl text-sm font-bold transition-all mb-6 hover:brightness-110 ${style.btn}`}
                    style={btnBg ? { background: btnBg } : {}}
                  >
                    Commencer gratuitement
                  </Link>
                ) : (
                  <CheckoutButton
                    plan={key as "pro" | "premium"}
                    label={key === "pro" ? "Essayer Pro" : "Essayer Premium"}
                    className={`block w-full text-center py-2.5 rounded-xl text-sm font-bold transition-all mb-6 hover:brightness-110 disabled:opacity-60 ${style.btn}`}
                    style={btnBg ? { background: btnBg } : {}}
                  />
                )}

                {/* Features */}
                <ul className="space-y-2.5">
                  {SORTED_ROWS.map((row) => {
                    const val = row[key];
                    const missing = val === "—";
                    return (
                      <li key={row.label}
                        className={`flex items-start justify-between gap-2 text-[12px] ${missing ? "opacity-35" : ""}`}>
                        <span className={missing ? "text-gray-400 line-through" : "text-gray-300"}>{row.label}</span>
                        <span className={`font-medium shrink-0 ${cellColor(val)}`}>{val}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Full comparison table */}
        <div className="mt-16">
          <h2 className="text-xl font-black text-white text-center mb-8">Comparaison complète</h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            {/* Header */}
            <div className="grid grid-cols-4 text-center text-xs font-bold uppercase tracking-wide py-4 px-4"
              style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-left text-gray-400">Fonctionnalité</div>
              {PLAN_KEYS.map((k) => (
                <div key={k} style={{ color: PLANS[k].color }}>{PLANS[k].label}</div>
              ))}
            </div>
            {/* Rows */}
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
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-black text-white text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-xl p-5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="font-semibold text-white text-sm mb-1.5">{faq.q}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link href="/dashboard/search"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #FF1654, #d4103c)", boxShadow: "0 0 25px rgba(255,22,84,0.35)" }}>
            Commencer gratuitement →
          </Link>
        </div>
      </div>
    </div>
  );
}
