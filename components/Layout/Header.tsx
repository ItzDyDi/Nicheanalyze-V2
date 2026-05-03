"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/",                 label: "Home" },
  { href: "/dashboard/search", label: "Recherche" },
  { href: "/blog",             label: "Blog" },
  { href: "/docs",             label: "Docs" },
  { href: "/pricing",          label: "Prix" },
];

function planIcon(plan: string) {
  if (plan === "premium") return "/icone-premium.png";
  if (plan === "pro")     return "/icone-pro.png";
  return null;
}

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

  const plan      = (session?.user as { plan?: string })?.plan ?? "free";
  const icon      = planIcon(plan);
  const planName  = plan === "premium" ? "Premium" : plan === "pro" ? "Pro" : "Free";
  const planColor = plan === "premium" ? "#00D9FF" : plan === "pro" ? "#FF1654" : "#94a3b8";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/logo.png" alt="NicheAnalyze" width={130} height={34} className="object-contain sm:w-[160px] sm:h-[40px]" priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#FF1654] bg-red-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : session ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              {/* Trigger button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
              >
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full overflow-hidden bg-[#FF1654]/10 flex items-center justify-center text-xs font-bold text-[#FF1654] shrink-0">
                  {(session.user as { image?: string | null }).image ? (
                    <Image src={(session.user as { image?: string }).image!} alt="Avatar"
                      width={28} height={28} className="object-cover w-full h-full" unoptimized />
                  ) : (
                    session.user?.email?.[0]?.toUpperCase() ?? "U"
                  )}
                </div>

                <span className="max-w-[110px] truncate text-gray-700">{session.user?.email}</span>

                <span className="text-gray-400 text-xs">{dropdownOpen ? "▲" : "▼"}</span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-1rem)] sm:w-56 max-w-[224px] bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-gray-900 text-sm font-medium truncate">
                        {session.user?.name ?? "Utilisateur"}
                      </p>
                      {icon && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-sm font-bold" style={{ color: planColor }}>
                            {planName}
                          </span>
                          <Image src={icon} alt={planName} width={26} height={26} className="object-contain rounded" />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs truncate">{session.user?.email}</p>
                  </div>

                  <Link href="/account" onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                    Mon profil
                  </Link>

                  {plan === "free" && (
                    <Link href="/pricing" onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
                      style={{ color: "#FF1654" }}>
                      ⭐ Upgrade vers Pro
                    </Link>
                  )}

                  <div className="border-t border-gray-100 mt-1">
                    <button
                      onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login"
              className="hidden md:inline-flex items-center px-4 py-2 bg-[#FF1654] text-white text-sm font-semibold rounded-lg hover:bg-[#e0123f] transition-colors">
              Se connecter
            </Link>
          )}

          {/* Burger */}
          <button onClick={() => setOpen(!open)}
            className="md:hidden text-gray-600 hover:text-gray-900 p-2 text-xl leading-none"
            aria-label="Menu">
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#FF1654] bg-red-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}>
              {link.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link href="/account" onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                Mon profil
              </Link>
              <button
                onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                className="block w-full text-left mt-2 px-4 py-2.5 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition-colors">
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/auth/login" onClick={() => setOpen(false)}
              className="block mt-2 px-4 py-2.5 bg-[#FF1654] text-white text-sm font-semibold rounded-lg text-center hover:bg-[#e0123f] transition-colors">
              Se connecter
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
