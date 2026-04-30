import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — Guides & Stratégies TikTok",
  description:
    "Guides, stratégies et analyses pour créateurs TikTok. Hooks viraux, formats gagnants, hashtags performants — tout ce qu'il faut pour cartonner sur TikTok.",
  alternates: { canonical: "https://nicheanalyze.vercel.app/blog" },
  openGraph: {
    url: "https://nicheanalyze.vercel.app/blog",
    title: "Blog NicheAnalyze — Guides & Stratégies TikTok",
    description:
      "Hooks viraux, formats gagnants, hashtags performants — les meilleures stratégies TikTok pour créateurs.",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Hooks: "text-rose-400",
  Analyse: "text-amber-400",
  Format: "text-cyan-400",
  Stats: "text-emerald-400",
  Hashtags: "text-violet-400",
};

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0E27" }}>

      {/* Hero */}
      <div className="py-20 px-6 text-center" style={{ background: "linear-gradient(180deg, #0C1030 0%, #0A0E27 100%)" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#FF1654" }}>Blog</p>
        <h1 className="text-4xl font-black text-white mb-4">Guides & Stratégies TikTok</h1>
        <p className="text-gray-400 text-base max-w-xl mx-auto">
          Tout ce qu'il faut savoir pour créer du contenu qui performe — quelle que soit ta niche.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Card header */}
              <div
                className={`h-36 flex items-center justify-center text-5xl bg-gradient-to-br ${post.bg} relative`}
              >
                <div className="absolute inset-0" style={{ background: "rgba(10,14,39,0.4)" }} />
                <span className="relative z-10">{post.emoji}</span>
              </div>

              {/* Card body */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wide ${CATEGORY_COLORS[post.category] ?? "text-gray-400"}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">{post.readTime} min</span>
                </div>
                <h2 className="text-sm font-bold text-white mb-2 group-hover:text-[#FF1654] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                <p className="text-xs text-gray-600 mt-3">{post.dateFormatted}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm mb-4">Tu veux voir ça en action ?</p>
          <Link
            href="/dashboard/search"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #FF1654, #d4103c)", boxShadow: "0 0 25px rgba(255,22,84,0.35)" }}
          >
            Analyser ma niche gratuitement →
          </Link>
        </div>
      </div>
    </div>
  );
}
