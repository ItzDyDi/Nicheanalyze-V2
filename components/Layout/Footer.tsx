import Link from "next/link";

const LINKS = {
  Produit: [
    { label: "Recherche", href: "/dashboard/search" },
    { label: "Blog", href: "/blog" },
    { label: "Docs", href: "/docs" },
    { label: "Pricing", href: "/pricing" },
  ],
  Légal: [
    { label: "Confidentialité", href: "#" },
    { label: "Conditions", href: "#" },
  ],
  Social: [
    { label: "Twitter / X", href: "#" },
    { label: "TikTok", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer
      className="px-6 py-14"
      style={{ background: "#07091C", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-1.5 text-white font-bold text-lg mb-3">
              🐾 <span><span className="text-[#FF1654]">Niche</span>Analyze</span>
            </Link>
            <p className="text-gray-500 text-xs leading-relaxed">
              Analyze what WORKS<br />on TikTok.
            </p>
          </div>

          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-gray-500 text-sm hover:text-gray-200 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-gray-600 text-xs">© 2026 NicheAnalyze Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
