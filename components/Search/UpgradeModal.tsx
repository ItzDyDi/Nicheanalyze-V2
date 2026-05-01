"use client";
import { useEffect } from "react";
import Link from "next/link";

interface Props {
  plan: "free" | "pro";
  reason: "search_limit" | "video_limit" | "hashtag_limit" | "export" | "analytics";
  onClose: () => void;
}

const REASONS: Record<Props["reason"], { title: string; desc: string }> = {
  search_limit: {
    title: "Limite de recherches atteinte",
    desc: "Tu as utilisé toutes tes recherches du jour. Upgrade pour continuer à analyser.",
  },
  video_limit: {
    title: "Limite de vidéos atteinte",
    desc: "Ton plan limite le nombre de vidéos analysées par recherche.",
  },
  hashtag_limit: {
    title: "Hashtags limités",
    desc: "Ton plan affiche seulement les 3 premiers hashtags.",
  },
  export: {
    title: "Export non disponible",
    desc: "L'export CSV est réservé aux plans Pro et Premium.",
  },
  analytics: {
    title: "Analytics avancés",
    desc: "Les analytics détaillés sont réservés au plan Premium.",
  },
};

const UPGRADE_TO: Record<Props["plan"], {
  label: string;
  color: string;
  price: string;
  features: string[];
  href: string;
}> = {
  free: {
    label: "Pro",
    color: "#FF1654",
    price: "4,99€/mois",
    features: [
      "50 recherches / jour",
      "50 vidéos par recherche",
      "Top 20 hashtags",
      "Hooks analysés",
      "Export CSV",
    ],
    href: "/pricing",
  },
  pro: {
    label: "Premium",
    color: "#00D9FF",
    price: "14,99€/mois",
    features: [
      "Recherches illimitées",
      "100+ vidéos par recherche",
      "Hashtags illimités",
      "Analytics avancés + courbes",
      "Export PDF",
    ],
    href: "/pricing",
  },
};

export default function UpgradeModal({ plan, reason, onClose }: Props) {
  const info = REASONS[reason];
  const upgrade = UPGRADE_TO[plan];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-6"
        style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-lg"
        >
          ✕
        </button>

        {/* Lock icon */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ background: `${upgrade.color}18`, border: `1px solid ${upgrade.color}40` }}>
          <span className="text-2xl">🔒</span>
        </div>

        {/* Title */}
        <h2 className="text-white font-black text-xl mb-1">{info.title}</h2>
        <p className="text-gray-400 text-sm mb-6">{info.desc}</p>

        {/* Upgrade card */}
        <div className="rounded-xl p-4 mb-5"
          style={{ background: `${upgrade.color}0d`, border: `1px solid ${upgrade.color}30` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-black text-sm" style={{ color: upgrade.color }}>
              Plan {upgrade.label}
            </span>
            <span className="text-white font-bold text-sm">{upgrade.price}</span>
          </div>
          <ul className="space-y-1.5">
            {upgrade.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                <span style={{ color: upgrade.color }}>✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Link
          href={upgrade.href}
          className="w-full py-3 rounded-xl text-center text-sm font-black text-white transition-opacity hover:opacity-90 block"
          style={{ background: upgrade.color === "#FF1654"
            ? "linear-gradient(135deg, #FF1654, #ff6b8a)"
            : "linear-gradient(135deg, #00D9FF, #00b8d9)" }}
        >
          Upgrade vers {upgrade.label} →
        </Link>
      </div>
    </div>
  );
}
