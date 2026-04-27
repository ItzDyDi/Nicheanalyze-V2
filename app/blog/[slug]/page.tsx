import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getRelatedPosts, blogPosts, type Block } from "@/lib/blog-posts";

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "p":
      return <p key={i} className="text-gray-300 leading-relaxed text-base">{block.text}</p>;

    case "h2":
      return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-2">{block.text}</h2>;

    case "h3":
      return <h3 key={i} className="text-lg font-semibold text-white mt-6 mb-2">{block.text}</h3>;

    case "ul":
      return (
        <ul key={i} className="space-y-2 pl-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-gray-300 text-sm">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FF1654] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol key={i} className="space-y-2 pl-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-gray-300 text-sm">
              <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: "#FF1654" }}>
                {j + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      );

    case "blockquote":
      return (
        <blockquote key={i}
          className="pl-4 py-3 text-gray-300 text-sm italic leading-relaxed"
          style={{ borderLeft: "3px solid #FF1654", background: "rgba(255,22,84,0.05)", borderRadius: "0 8px 8px 0" }}>
          {block.text}
        </blockquote>
      );

    case "tip":
      return (
        <div key={i} className="rounded-xl p-4 text-sm"
          style={{ background: "rgba(0,217,255,0.06)", border: "1px solid rgba(0,217,255,0.15)" }}>
          <p className="font-semibold mb-1" style={{ color: "#00D9FF" }}>{block.label}</p>
          <p className="text-gray-300 leading-relaxed">{block.text}</p>
        </div>
      );

    case "example":
      return (
        <div key={i} className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#FDB51A" }}>
            {block.title}
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">{block.text}</p>
        </div>
      );

    case "stats":
      return (
        <div key={i} className="grid grid-cols-2 gap-3">
          {block.items.map((s, j) => (
            <div key={j} className="rounded-xl p-4 text-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-gray-400 text-xs leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post, 3);
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const next = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <div style={{ background: "#0A0E27", minHeight: "100vh" }}>

      {/* Hero */}
      <div className={`relative py-20 px-6 bg-gradient-to-br ${post.bg}`}>
        <div className="absolute inset-0" style={{ background: "rgba(10,14,39,0.55)" }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-5">{post.emoji}</div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: `${post.categoryColor}20`, color: post.categoryColor, border: `1px solid ${post.categoryColor}35` }}>
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">{post.title}</h1>
          <p className="text-gray-300 text-base mb-6 max-w-xl mx-auto leading-relaxed">{post.excerpt}</p>
          <div className="flex items-center justify-center gap-4 text-gray-400 text-sm">
            <span>📅 {post.dateFormatted}</span>
            <span>·</span>
            <span>⏱ {post.readTime} min de lecture</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Main article */}
          <article className="flex-1 min-w-0 space-y-5">
            {post.blocks.map((block, i) => renderBlock(block, i))}
          </article>

          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0 space-y-6 sticky top-24 self-start">

            {/* CTA */}
            <div className="rounded-2xl p-5"
              style={{ background: "rgba(255,22,84,0.06)", border: "1px solid rgba(255,22,84,0.2)" }}>
              <p className="text-white font-bold mb-2 text-sm">Prêt à analyser ta niche ?</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                Trouve les vidéos virales de ta niche en quelques secondes avec NicheAnalyze.
              </p>
              <Link href="/dashboard/search"
                className="block text-center py-2.5 px-4 rounded-xl text-white text-sm font-bold transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #FF1654, #d4103c)" }}>
                Commencer gratuitement →
              </Link>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-wide">Articles liés</h3>
                <div className="space-y-3">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/blog/${r.slug}`}
                      className="flex items-start gap-2.5 group p-3 rounded-xl transition-colors hover:bg-white/5">
                      <span className="text-xl shrink-0">{r.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-gray-300 text-xs leading-snug group-hover:text-white transition-colors line-clamp-2">
                          {r.title}
                        </p>
                        <p className="text-gray-600 text-xs mt-0.5">{r.readTime} min</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Prev / Next navigation */}
        <div className="mt-14 pt-8 grid grid-cols-2 gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {prev ? (
            <Link href={`/blog/${prev.slug}`}
              className="group p-4 rounded-xl transition-colors hover:bg-white/5 text-left"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-gray-500 text-xs mb-1">← Article précédent</p>
              <p className="text-white text-sm font-medium group-hover:text-[#FF1654] transition-colors line-clamp-2">
                {prev.title}
              </p>
            </Link>
          ) : <div />}

          {next && (
            <Link href={`/blog/${next.slug}`}
              className="group p-4 rounded-xl transition-colors hover:bg-white/5 text-right ml-auto w-full"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-gray-500 text-xs mb-1">Article suivant →</p>
              <p className="text-white text-sm font-medium group-hover:text-[#FF1654] transition-colors line-clamp-2">
                {next.title}
              </p>
            </Link>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, rgba(255,22,84,0.08), rgba(0,217,255,0.05))", border: "1px solid rgba(255,22,84,0.15)" }}>
          <p className="text-2xl font-black text-white mb-2">Passe à l'action maintenant</p>
          <p className="text-gray-400 text-sm mb-6">
            Applique ce que tu viens d'apprendre. Analyse ta niche avec NicheAnalyze — gratuit.
          </p>
          <Link href="/dashboard/search"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #FF1654, #d4103c)", boxShadow: "0 0 30px rgba(255,22,84,0.35)" }}>
            Analyser ma niche →
          </Link>
        </div>
      </div>
    </div>
  );
}
