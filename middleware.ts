import { NextRequest, NextResponse } from "next/server";

// Bots legítimos (SEO, réseaux sociaux) — toujours autorisés
const ALLOWED_BOTS = [
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i,
  /baiduspider/i, /yandexbot/i, /facebookexternalhit/i,
  /twitterbot/i, /linkedinbot/i, /whatsapp/i, /applebot/i,
];

// Bots malveillants / scrapers / outils d'automatisation
const BAD_BOTS = [
  /python-requests/i, /python-urllib/i, /go-http-client/i,
  /scrapy/i, /wget\//i, /libwww-perl/i, /lwp-/i,
  /headlesschrome/i, /phantomjs/i, /selenium/i, /puppeteer/i,
  /playwright/i, /mechanize/i, /httpclient/i, /okhttp/i,
];

// Pages privées — doit être noindex + accès bloqué aux bots
const PRIVATE_PREFIXES = ["/account", "/billing", "/dashboard"];

// Routes API sensibles — exiger un User-Agent de navigateur
const SENSITIVE_API = ["/api/auth/signup", "/api/auth/signin", "/api/search"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ua = req.headers.get("user-agent") ?? "";

  // ── 1. Webhooks Stripe — jamais bloqués (pas de UA navigateur)
  if (pathname.startsWith("/api/webhooks/")) {
    return NextResponse.next();
  }

  // ── 2. Ressources statiques — laisser passer
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    /\.(png|jpg|jpeg|svg|ico|webp|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── 3. Blocage des bots malveillants
  const isAllowedBot = ALLOWED_BOTS.some((p) => p.test(ua));
  if (!isAllowedBot) {
    const isBadBot = BAD_BOTS.some((p) => p.test(ua));
    // UA vide sur une route API sensible = suspect
    const isEmptyUaOnApi =
      !ua && SENSITIVE_API.some((r) => pathname.startsWith(r));

    if (isBadBot || isEmptyUaOnApi) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  const res = NextResponse.next();

  // ── 4. Noindex sur les pages privées (double sécurité avec robots.ts)
  if (PRIVATE_PREFIXES.some((p) => pathname.startsWith(p))) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
