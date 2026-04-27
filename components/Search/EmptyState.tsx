"use client";
import Link from "next/link";
import { detectNiche } from "@/lib/niche-detector";
import { NICHE_CONTENT } from "@/lib/niche-content";

interface Props {
  lastSearch?: string;
  onSearch: (query: string) => void;
}

const STEPS = [
  { icon: "🔍", title: "Cherche ta niche", desc: "Tape un mot-clé lié à ton contenu" },
  { icon: "📊", title: "Analyse les tops", desc: "Vues, engagement, durée, hooks des meilleures vidéos" },
  { icon: "🚀", title: "Crée du contenu", desc: "Inspire-toi des tendances pour performer" },
];

export default function EmptyState({ lastSearch, onSearch }: Props) {
  const niche = lastSearch ? detectNiche(lastSearch) : null;
  const content = NICHE_CONTENT[niche ?? "generic"];

  return (
    <div className="py-12 max-w-3xl mx-auto">

      {/* Hero */}
      <div className="text-center mb-10">
        <span className="text-5xl mb-4 block">{content.icon}</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h2>
        <p className="text-gray-500 text-sm">{content.subtitle}</p>
        {niche && (
          <span className="inline-block mt-3 px-3 py-1 bg-[#2D6A4F]/10 text-[#2D6A4F] text-xs font-semibold rounded-full">
            Niche détectée : {content.icon} {content.label}
          </span>
        )}
      </div>

      {/* Trending searches */}
      <div className="mb-10">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Recherches populaires {niche ? `— ${content.label}` : ""}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {content.trending.map((item) => (
            <button
              key={item.query}
              onClick={() => onSearch(item.query)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm text-gray-700 hover:border-[#2D6A4F] hover:text-[#2D6A4F] hover:bg-[#2D6A4F]/5 transition-colors shadow-sm text-left"
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mb-10">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Comment ça marche
        </p>
        <div className="grid grid-cols-3 gap-3">
          {STEPS.map((step, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
              <span className="text-2xl mb-2 block">{step.icon}</span>
              <p className="text-xs font-semibold text-gray-800 mb-1">{step.title}</p>
              <p className="text-[11px] text-gray-400 leading-snug">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mb-10 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          💡 Tips {niche ? `pour ${content.label}` : "pour bien démarrer"}
        </p>
        <ul className="space-y-2">
          {content.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-[#2D6A4F] font-bold mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom links */}
      <div className="flex justify-center gap-3">
        {[
          { href: "/blog", label: "📖 Blog" },
          { href: "/pricing", label: "💎 Pricing" },
          { href: "/docs", label: "📚 Docs" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors shadow-sm"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
