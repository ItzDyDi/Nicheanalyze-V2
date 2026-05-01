"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { detectNiche } from "@/lib/niche-detector";
import { NICHE_CONTENT } from "@/lib/niche-content";

interface Props {
  lastSearch?: string;
  onSearch: (query: string) => void;
}

const STEPS_FR = [
  { icon: "🔍", title: "Cherche ta niche", desc: "Tape un mot-clé lié à ton contenu" },
  { icon: "📊", title: "Analyse les tops", desc: "Vues, engagement, durée, hooks des meilleures vidéos" },
  { icon: "🚀", title: "Crée du contenu", desc: "Inspire-toi des tendances pour performer" },
];

const STEPS_EN = [
  { icon: "🔍", title: "Find your niche", desc: "Type a keyword related to your content" },
  { icon: "📊", title: "Analyze top videos", desc: "Views, engagement, duration, hooks of best videos" },
  { icon: "🚀", title: "Create content", desc: "Get inspired by trends to perform" },
];

export default function EmptyState({ lastSearch, onSearch }: Props) {
  const [lang, setLang] = useState<"fr" | "en">("fr");

  useEffect(() => {
    fetch("/api/locale")
      .then((r) => r.json())
      .then((d) => { if (d.lang === "en") setLang("en"); })
      .catch(() => {});
  }, []);

  const niche = lastSearch ? detectNiche(lastSearch) : null;
  const content = NICHE_CONTENT[niche ?? "generic"];

  const trending = lang === "fr" ? content.trending_fr : content.trending_en;
  const label = lang === "fr" ? content.label : content.label_en;
  const title = lang === "fr" ? content.title : content.title_en;
  const subtitle = lang === "fr" ? content.subtitle : content.subtitle_en;
  const tips = lang === "fr" ? content.tips : content.tips_en;
  const steps = lang === "fr" ? STEPS_FR : STEPS_EN;

  const trendingLabel = lang === "fr"
    ? `Recherches populaires${niche ? ` — ${label}` : ""}`
    : `Popular searches${niche ? ` — ${label}` : ""}`;

  const tipsLabel = lang === "fr"
    ? `💡 Tips ${niche ? `pour ${label}` : "pour bien démarrer"}`
    : `💡 Tips ${niche ? `for ${label}` : "to get started"}`;

  const howLabel = lang === "fr" ? "Comment ça marche" : "How it works";

  return (
    <div className="py-12 max-w-3xl mx-auto">

      {/* Hero */}
      <div className="text-center mb-10">
        <Image
          src="/logo.png"
          alt="NicheAnalyze"
          width={64}
          height={64}
          className="mx-auto mb-4 object-contain"
          unoptimized
        />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
        {niche && (
          <span className="inline-block mt-3 px-3 py-1 bg-[#2D6A4F]/10 text-[#2D6A4F] text-xs font-semibold rounded-full">
            {lang === "fr" ? "Niche détectée" : "Detected niche"} : {label}
          </span>
        )}
      </div>

      {/* Trending searches */}
      <div className="mb-10">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          {trendingLabel}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {trending.map((item) => (
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
          {howLabel}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {steps.map((step, i) => (
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
          {tipsLabel}
        </p>
        <ul className="space-y-2">
          {tips.map((tip, i) => (
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
          { href: "/pricing", label: "💎 Prix" },
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
