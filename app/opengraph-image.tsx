import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NicheAnalyze — Analyse TikTok pour créateurs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0E27 0%, #0C1030 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div style={{
          position: "absolute",
          top: "10%", left: "15%",
          width: 500, height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,22,84,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%", right: "10%",
          width: 350, height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,217,255,0.10) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />

        {/* Badge */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 20px",
          borderRadius: 999,
          background: "rgba(255,22,84,0.12)",
          border: "1px solid rgba(255,22,84,0.3)",
          marginBottom: 32,
        }}>
          <span style={{ fontSize: 18 }}>🚀</span>
          <span style={{ color: "#FF1654", fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>
            ANALYSE TIKTOK ALIMENTÉE PAR L'IA
          </span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: 72,
          fontWeight: 900,
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.1,
          marginBottom: 24,
          maxWidth: 900,
        }}>
          Découvrez ce qui{" "}
          <span style={{ color: "#FF1654" }}>PERFORME</span>
          {" "}sur TikTok
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 26,
          color: "#94a3b8",
          textAlign: "center",
          maxWidth: 700,
          marginBottom: 48,
          lineHeight: 1.5,
        }}>
          Analysez n'importe quelle niche en quelques secondes
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 40 }}>
          {[["✨", "50 000+", "analyses"], ["⭐", "4.9/5", "satisfaction"], ["🆓", "Gratuit", "pour commencer"]].map(([icon, bold, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>{bold}</span>
              <span style={{ color: "#64748b", fontSize: 18 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{
          position: "absolute",
          bottom: 32,
          right: 48,
          color: "#334155",
          fontSize: 18,
          fontWeight: 600,
        }}>
          nicheanalyze.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
