import Link from "next/link";
import HeroSection from "@/components/Home/HeroSection";
import SocialProof from "@/components/Home/SocialProof";
import HowItWorks from "@/components/Home/HowItWorks";
import FeaturesGrid from "@/components/Home/FeaturesGrid";

export default function Home() {
  return (
    <div style={{ background: "#0A0E27" }}>
      <HeroSection />
      <SocialProof />
      <HowItWorks />
      <FeaturesGrid />

      {/* CTA Final */}
      <section
        className="py-28 px-6 text-center relative overflow-hidden"
        style={{ background: "#0A0E27" }}
      >
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{
            width: 700,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,22,84,0.07) 0%, transparent 70%)",
            filter: "blur(60px)",
          }} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#FF1654" }}>
            Prêt à passer au niveau supérieur ?
          </p>
          <h2 className="font-black text-white mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            Rejoins les créateurs<br />
            qui{" "}
            <span style={{
              background: "linear-gradient(135deg, #FF1654, #FF6B9D)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              cartonnent
            </span>
          </h2>
          <p className="text-gray-400 mb-10 text-sm">
            Gratuit pour toujours. Pas de carte bancaire requise.
          </p>

          <Link
            href="/dashboard/search"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-base transition-all duration-200 hover:scale-105 hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #FF1654, #d4103c)",
              boxShadow: "0 0 40px rgba(255,22,84,0.40), 0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            Commencer gratuitement →
          </Link>

          <p className="text-gray-600 text-xs mt-5">
            Ou consulte notre{" "}
            <Link href="/blog" className="text-gray-400 hover:text-white underline underline-offset-2 transition-colors">
              blog
            </Link>{" "}
            pour des conseils gratuits
          </p>
        </div>
      </section>
    </div>
  );
}
