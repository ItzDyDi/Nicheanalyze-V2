"use client";
import { useEffect, useState } from "react";

const STATIC = [
  {
    id: "s1",
    quote: "Avec NicheAnalyze j'ai passé de 50k à 500k vues en 1 mois. Je comprends enfin ce qui marche dans ma niche.",
    name: "@creator_pets",
    niche: "🐾 Pet Wellness",
    stars: 5,
    followers: "487k followers",
  },
  {
    id: "s2",
    quote: "Les stats d'engagement m'ont aidé à doubler mon taux d'interaction. Un outil indispensable pour tout créateur.",
    name: "@diy_home_fr",
    niche: "🏠 DIY & Home",
    stars: 5,
    followers: "213k followers",
  },
  {
    id: "s3",
    quote: "J'analyse mes concurrents en 30 secondes. C'est un game-changer pour ma stratégie de contenu TikTok.",
    name: "@edu_creator",
    niche: "📚 Education",
    stars: 5,
    followers: "92k followers",
  },
];

const NICHES = ["🐾 Pet Wellness", "🏠 DIY & Home", "📚 Education", "💪 Fitness", "🍕 Food", "💄 Beauty", "🎮 Gaming", "💼 Business", "🎯 Créateur"];

/* ── Renders one star: full / half / empty ── */
function Star({ fill, size = 20 }: { fill: 0 | 0.5 | 1; size?: number }) {
  return (
    <span className="relative inline-block" style={{ width: size, height: size, fontSize: size }}>
      {/* Empty background */}
      <span style={{ color: "rgba(255,255,255,0.15)", lineHeight: 1 }}>★</span>
      {fill > 0 && (
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ width: fill === 1 ? "100%" : "50%", color: "#FDB51A", lineHeight: 1 }}
        >
          ★
        </span>
      )}
    </span>
  );
}

function StarDisplay({ value, size }: { value: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const fill = value >= s ? 1 : value >= s - 0.5 ? 0.5 : 0;
        return <Star key={s} fill={fill as 0 | 0.5 | 1} size={size} />;
      })}
    </div>
  );
}

/* ── Interactive picker with half-star on left side ── */
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);

  function getVal(e: React.MouseEvent<HTMLButtonElement>, s: number) {
    const rect = e.currentTarget.getBoundingClientRect();
    return e.clientX - rect.left < rect.width / 2 ? s - 0.5 : s;
  }

  const display = hover || value;

  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((s) => {
        const fill = display >= s ? 1 : display >= s - 0.5 ? 0.5 : 0;
        return (
          <button
            key={s}
            type="button"
            className="transition-transform hover:scale-110"
            style={{ width: 32, height: 32 }}
            onMouseMove={(e) => setHover(getVal(e, s))}
            onClick={(e) => onChange(getVal(e, s))}
          >
            <Star fill={fill as 0 | 0.5 | 1} size={28} />
          </button>
        );
      })}
    </div>
  );
}

type T = { id: string; quote: string; name: string; niche: string; stars: number; followers?: string };

function TestimonialCard({ t }: { t: T }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1"
      style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <StarDisplay value={t.stars} size={16} />
      <p className="text-gray-300 text-sm leading-relaxed flex-1">"{t.quote}"</p>
      <div className="flex items-center gap-2.5 pt-2 border-t border-white/5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
          style={{ background: "rgba(255,22,84,0.15)" }}>
          {t.niche.split(" ")[0]}
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-xs truncate">{t.name}</p>
          <p className="text-gray-500 text-xs truncate">{t.niche}{t.followers ? ` · ${t.followers}` : ""}</p>
        </div>
      </div>
    </div>
  );
}

function AddModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [niche, setNiche] = useState(NICHES[0]);
  const [stars, setStars] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote, name, niche, stars }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Erreur"); setLoading(false); return; }
    onAdded();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl p-7" style={{ background: "#0D1230", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-bold text-lg">Partager ton expérience</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Ta note — <span style={{ color: "#FDB51A" }}>{stars} étoile{stars !== 1 ? "s" : ""}</span>
            </label>
            <StarPicker value={stars} onChange={setStars} />
            <p className="text-gray-600 text-xs mt-1">Clique sur la moitié gauche d'une étoile pour ½</p>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Ton témoignage</label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value.slice(0, 300))}
              placeholder="Décris ton expérience avec NicheAnalyze..."
              required rows={4}
              className="w-full px-4 py-3 rounded-xl text-white text-sm resize-none focus:outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <p className="text-gray-600 text-xs mt-1">{quote.length}/300</p>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Ton pseudo / nom</label>
            <input
              type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="@ton_pseudo" required
              className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Ta niche</label>
            <select
              value={niche} onChange={(e) => setNiche(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none"
              style={{ background: "#1a1f3c", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {NICHES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #FF1654, #d4103c)" }}
          >
            {loading ? "Envoi..." : "Publier mon témoignage ✓"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SocialProof() {
  const [userTestimonials, setUserTestimonials] = useState<T[]>([]);
  const [showModal, setShowModal] = useState(false);

  async function fetchTestimonials() {
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) setUserTestimonials(await res.json());
    } catch { /* ignore */ }
  }

  useEffect(() => { fetchTestimonials(); }, []);

  const all = [...STATIC, ...userTestimonials];

  return (
    <section className="py-24 px-6" style={{ background: "#0A0E27" }}>
      {showModal && <AddModal onClose={() => setShowModal(false)} onAdded={fetchTestimonials} />}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#FF1654" }}>Témoignages</p>
          <h2 className="text-3xl font-black text-white">Ce que disent nos créateurs</h2>
        </div>

        {/* 4 cols on large: 3 testimonials + "+" on same row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {all.map((t) => <TestimonialCard key={t.id} t={t} />)}

          {/* Add card */}
          <button
            onClick={() => setShowModal(true)}
            className="rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 group min-h-[180px]"
            style={{ background: "rgba(255,22,84,0.03)", border: "1px dashed rgba(255,255,255,0.12)" }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110"
              style={{ background: "rgba(255,22,84,0.12)", color: "#FF1654" }}
            >
              +
            </div>
            <p className="text-gray-400 text-sm font-medium group-hover:text-white transition-colors">
              Partager mon expérience
            </p>
            <p className="text-gray-600 text-xs text-center leading-relaxed">
              Tu utilises NicheAnalyze ?<br />Dis-le aux autres créateurs !
            </p>
          </button>
        </div>
      </div>
    </section>
  );
}
