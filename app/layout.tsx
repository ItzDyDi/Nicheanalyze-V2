import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const BASE = "https://nicheanalyze.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "NicheAnalyze — Analyse TikTok pour créateurs",
    template: "%s | NicheAnalyze",
  },
  description:
    "Analysez n'importe quelle niche TikTok en quelques secondes. Hooks, formats, durées — tout ce qu'il faut pour créer du contenu qui cartonne.",
  keywords: [
    "analyse TikTok", "niche TikTok", "créateur TikTok", "viralité TikTok",
    "hashtags TikTok", "outils TikTok", "statistiques TikTok", "NicheAnalyze",
  ],
  authors: [{ name: "NicheAnalyze", url: BASE }],
  creator: "NicheAnalyze",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: BASE,
    siteName: "NicheAnalyze",
    title: "NicheAnalyze — Analyse TikTok pour créateurs",
    description:
      "Analysez n'importe quelle niche TikTok en quelques secondes. Hooks, formats, durées — tout ce qu'il faut pour créer du contenu qui cartonne.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "NicheAnalyze — Analyse TikTok pour créateurs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NicheAnalyze — Analyse TikTok pour créateurs",
    description:
      "Analysez n'importe quelle niche TikTok en quelques secondes. Hooks, formats, durées — tout ce qu'il faut pour créer du contenu qui cartonne.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: BASE },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R8LFVBQQBP"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R8LFVBQQBP');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
