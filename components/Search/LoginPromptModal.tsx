"use client";
import { useEffect } from "react";
import Link from "next/link";

interface Props {
  onClose: () => void;
}

export default function LoginPromptModal({ onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl p-7 text-center"
        style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(255,22,84,0.12)", border: "1px solid rgba(255,22,84,0.3)" }}>
          <span className="text-3xl">🔍</span>
        </div>

        <h2 className="text-white font-black text-xl mb-2">
          Tu as utilisé tes 2 recherches gratuites
        </h2>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Crée un compte <span className="text-white font-semibold">100% gratuit</span> pour débloquer <span className="text-white font-semibold">5 recherches par jour</span> et bien plus.
        </p>

        {/* Free plan features */}
        <div className="rounded-xl p-4 mb-6 text-left"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Plan Gratuit — 0€</p>
          <ul className="space-y-2">
            {[
              "5 recherches / jour",
              "10 vidéos analysées par recherche",
              "Statistiques de base",
              "Top 3 hashtags",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-emerald-400">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/auth/register"
            className="w-full py-3 rounded-xl text-center text-sm font-black text-white"
            style={{ background: "linear-gradient(135deg, #FF1654, #ff6b8a)" }}
          >
            Créer un compte gratuit →
          </Link>
          <Link
            href="/auth/login"
            className="w-full py-2.5 rounded-xl text-center text-xs text-gray-400 hover:text-white transition-colors"
          >
            J&apos;ai déjà un compte — Me connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
