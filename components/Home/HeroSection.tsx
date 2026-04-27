"use client";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
      style={{ background: "#0A0E27" }}
    >
      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{
          position: "absolute", top: "8%", left: "10%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,22,84,0.13) 0%, transparent 70%)",
          filter: "blur(48px)",
          animation: "orb-float 9s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "8%",
          width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,217,255,0.10) 0%, transparent 70%)",
          filter: "blur(48px)",
          animation: "orb-float-alt 12s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", left: "35%",
          width: 260, height: 260, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(253,181,26,0.08) 0%, transparent 70%)",
          filter: "blur(36px)",
          animation: "orb-float 15s ease-in-out infinite reverse",
        }} />
      </div>

      {/* Grid overlay très subtil */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto pt-10">

        {/* Badge */}
        <div style={{ animation: "fade-in-up 0.7s ease-out both" }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8" style={{
            background: "rgba(255,22,84,0.10)",
            color: "#FF1654",
            border: "1px solid rgba(255,22,84,0.25)",
          }}>
            🚀 Analyse TikTok alimentée par l'IA
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-black text-white mb-6 leading-none"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
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
          className="text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ fontSize: "1.125rem", animation: "fade-in-up 0.7s ease-out 0.2s both" }}
        >
          Analysez n'importe quelle niche en quelques secondes. Hooks, formats,
          durées — tout ce qu'il faut pour créer du contenu qui cartonne.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
          style={{ animation: "fade-in-up 0.7s ease-out 0.3s both" }}
        >
          <Link
            href="/dashboard/search"
            className="px-9 py-4 rounded-xl font-bold text-white text-base transition-all duration-200 hover:scale-105 hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #FF1654, #d4103c)",
              boxShadow: "0 0 35px rgba(255,22,84,0.45), 0 4px 15px rgba(0,0,0,0.3)",
            }}
          >
            Commencer gratuitement →
          </Link>
          <Link
            href="/blog"
            className="px-9 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:bg-white/5"
            style={{ border: "1px solid rgba(0,217,255,0.35)", color: "#00D9FF" }}
          >
            Voir le blog
          </Link>
        </div>

        {/* Stats */}
        <div
          className="flex flex-wrap justify-center gap-8 text-sm"
          style={{ animation: "fade-in-up 0.7s ease-out 0.4s both" }}
        >
          {[
            ["✨", "50 000+", "analyses effectuées"],
            ["⭐", "4.9/5", "satisfaction créateurs"],
            ["🚀", "Gratuit", "pour commencer"],
          ].map(([icon, bold, label]) => (
            <div key={label} className="flex items-center gap-1.5 text-gray-500">
              <span>{icon}</span>
              <span className="text-white font-semibold">{bold}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #0A0E27)" }} />
    </section>
  );
}
