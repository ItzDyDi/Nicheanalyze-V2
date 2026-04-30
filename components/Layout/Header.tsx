"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard/search", label: "Recherche" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/logo.png" alt="NicheAnalyze" width={160} height={40} className="object-contain rounded-lg" priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#FF1654]"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
          ) : session ? (
            /* Logged-in: user dropdown */
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm text-white"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-[#FF1654]/20 flex items-center justify-center text-xs font-bold text-[#FF1654] shrink-0">
                  {(session.user as { image?: string | null }).image ? (
                    <Image
                      src={(session.user as { image?: string }).image!}
                      alt="Avatar"
                      width={28}
                      height={28}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  ) : (
                    session.user?.email?.[0]?.toUpperCase() ?? "U"
                  )}
                </div>
                <span className="max-w-[120px] truncate text-gray-300">{session.user?.email}</span>
                <span className="text-gray-500 text-xs">{dropdownOpen ? "▲" : "▼"}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-gray-800 border border-gray-700 rounded-xl shadow-xl py-1 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-700">
                    <p className="text-white text-sm font-medium truncate">{session.user?.name ?? "Utilisateur"}</p>
                    <p className="text-gray-400 text-xs truncate">{session.user?.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(148,163,184,0.15)", color: "#94a3b8" }}>
                      Plan Free · 5 recherches/jour
                    </span>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    Mon profil
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm font-semibold hover:bg-gray-700 transition-colors"
                    style={{ color: "#FF1654" }}
                  >
                    ⭐ Upgrade vers Pro
                  </Link>
                  <div className="border-t border-gray-700 mt-1">
                    <button
                      onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-out: Se connecter button */
            <Link
              href="/auth/login"
              className="hidden md:inline-flex items-center px-4 py-2 bg-[#FF1654] text-white text-sm font-semibold rounded-lg hover:bg-[#e0123f] transition-colors"
            >
              Se connecter
            </Link>
          )}

          {/* Burger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-300 hover:text-white p-2 text-xl leading-none"
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900 px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#FF1654] bg-gray-800"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                Mon profil
              </Link>
              <button
                onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                className="block w-full text-left mt-2 px-4 py-2.5 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/10 transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="block mt-2 px-4 py-2.5 bg-[#FF1654] text-white text-sm font-semibold rounded-lg text-center hover:bg-[#e0123f] transition-colors"
            >
              Se connecter
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
