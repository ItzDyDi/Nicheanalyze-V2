"use client";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6"
      style={{
        backgroundImage: "url('/image%20de%20fond%20page%20acceuil.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Subtle tinted orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{
          position: "absolute", top: "8%", left: "10%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,22,84,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orb-float 9s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "8%",
          width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,150,255,0.10) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orb-float-alt 12s ease-in-out infinite",
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto pt-10">

        {/* Badge */}
        <div style={{ animation: "fade-in-up 0.7s ease-out both" }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8" style={{
            background: "rgba(255,22,84,0.08)",
            color: "#FF1654",
            border: "1px solid rgba(255,22,84,0.2)",
          }}>
            🚀 Analyse TikTok alimentée par l'IA
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-black mb-6 leading-none"
          style={{
            fontSize: "clamp(2rem, 7vw, 5.5rem)",
            color: "#ffffff",
            animation: "fade-in-up 0.7s ease-out 0.1s both",
          }}
        >
          Découvrez ce qui{" "}
          <span style={{
            background: "linear-gradient(135deg, #FF1654 0%, #FF6B9D 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            PERFORME
          </span>
          <br />vraiment sur TikTok
        </h1>

        {/* Subtitle */}
        <p
          className="mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ fontSize: "clamp(0.95rem, 3vw, 1.125rem)", color: "#d1d5db", animation: "fade-in-up 0.7s ease-out 0.2s both" }}
        >
          Analysez n'importe quelle niche en quelques secondes. Hooks, formats,
          durées — tout ce qu'il faut pour créer du contenu qui cartonne.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-14"
          style={{ animation: "fade-in-up 0.7s ease-out 0.3s both" }}
        >
          <Link
            href="/dashboard/search"
            className="px-6 sm:px-9 py-4 rounded-xl font-bold text-white text-base transition-all duration-200 hover:scale-105 hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #FF1654, #d4103c)",
              boxShadow: "0 4px 20px rgba(255,22,84,0.35)",
            }}
          >
            Commencer gratuitement →
          </Link>
          <Link
            href="/blog"
            className="px-9 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff" }}
          >
            Voir le blog
          </Link>
        </div>

        {/* Stats */}
        <div
          className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm"
          style={{ animation: "fade-in-up 0.7s ease-out 0.4s both" }}
        >
          {[
            ["✨", "50 000+", "analyses effectuées"],
            ["⭐", "4.9/5", "satisfaction créateurs"],
            ["🚀", "Gratuit", "pour commencer"],
          ].map(([icon, bold, label]) => (
            <div key={label} className="flex items-center gap-1.5" style={{ color: "#d1d5db" }}>
              <span>{icon}</span>
              <span className="font-semibold" style={{ color: "#ffffff" }}>{bold}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #0A0E27)" }} />
    </section>
  );
}
