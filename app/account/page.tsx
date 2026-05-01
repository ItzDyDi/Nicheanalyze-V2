"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF1654] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const userImage = (session.user as { image?: string | null }).image;
  const userEmail = session.user?.email ?? "";
  const initial = userEmail[0]?.toUpperCase() ?? "U";
  const plan = (session.user as { plan?: string }).plan ?? "free";

  const PLAN_META: Record<string, { label: string; color: string; icon: string | null; searches: string; videos: string; export: string }> = {
    free:    { label: "Free",    color: "#94a3b8", icon: null,                searches: "5",           videos: "10 max", export: "Non inclus" },
    pro:     { label: "Pro",     color: "#FF1654", icon: "/icone-pro.png",     searches: "50",          videos: "50 max", export: "✓ Inclus"  },
    premium: { label: "Premium", color: "#00D9FF", icon: "/icone-premium.png", searches: "Illimitées",  videos: "100+",   export: "✓ Inclus"  },
  };
  const meta = PLAN_META[plan] ?? PLAN_META.free;

  async function saveName() {
    if (!nameValue.trim()) return;
    setNameSaving(true);
    setNameError("");
    const res = await fetch("/api/user/name", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameValue.trim() }),
    });
    const data = await res.json();
    if (!res.ok) { setNameError(data.error ?? "Erreur"); }
    else { await update({ name: data.name }); setEditingName(false); }
    setNameSaving(false);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("/api/user/avatar", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setUploadError(data.error ?? "Erreur lors de l'upload");
    } else {
      await update({ image: data.imageUrl });
    }
    setUploading(false);
    // Reset input so same file can be re-selected
    e.target.value = "";
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-white">Mon compte</h1>
          <p className="text-gray-400 text-sm mt-1">Gérez vos informations personnelles</p>
        </div>

        {/* Profile card */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 space-y-4 relative">

          {/* Plan badge — absolute top right of card */}
          {plan !== "free" && meta.icon && (
            <div
              className="absolute top-6 right-6 rounded-2xl overflow-hidden"
              style={{ width: 96, height: 96, border: `2px solid ${meta.color}80` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={meta.icon}
                alt={meta.label}
                style={{ width: 96, height: 96, objectFit: "fill", display: "block" }}
              />
            </div>
          )}

          <div className="flex items-start gap-4 pr-32">
            {/* Avatar with upload */}
            <div className="relative group">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative w-16 h-16 rounded-full overflow-hidden focus:outline-none"
                title="Changer la photo"
                disabled={uploading}
              >
                {userImage ? (
                  <Image
                    src={userImage}
                    alt="Avatar"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-[#FF1654]/20 flex items-center justify-center text-2xl font-bold text-[#FF1654]">
                    {initial}
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-white text-lg">📷</span>
                  )}
                </div>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditingName(false); }}
                    maxLength={50}
                    className="bg-gray-700 text-white text-sm font-semibold px-2 py-1 rounded-lg border border-gray-600 focus:outline-none focus:border-[#FF1654] w-40"
                  />
                  <button onClick={saveName} disabled={nameSaving}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold">
                    {nameSaving ? "..." : "✓"}
                  </button>
                  <button onClick={() => setEditingName(false)} className="text-xs text-gray-500 hover:text-gray-300">✕</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold">{session.user?.name ?? "Utilisateur"}</p>
                  {plan !== "free" && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: meta.color, background: `${meta.color}18` }}>
                      {meta.label}
                    </span>
                  )}
                  <button
                    onClick={() => { setNameValue(session.user?.name ?? ""); setEditingName(true); setNameError(""); }}
                    className="text-xs text-gray-500 hover:text-[#FF1654] transition-colors"
                    title="Modifier le nom"
                  >
                    ✎
                  </button>
                </div>
              )}
              {nameError && <p className="text-red-400 text-xs mt-0.5">{nameError}</p>}
              <p className="text-gray-400 text-sm">{userEmail}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#FF1654] hover:underline mt-0.5"
                disabled={uploading}
              >
                {uploading ? "Upload en cours..." : "Changer la photo"}
              </button>
            </div>

          </div>

          {uploadError && (
            <p className="text-red-400 text-sm">{uploadError}</p>
          )}

          <div className="border-t border-gray-700 pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Email</span>
              <span className="text-white">{userEmail}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-400">Plan actuel</span>
              <div className="flex items-center gap-1.5">
                {meta.icon && <Image src={meta.icon} alt={meta.label} width={20} height={20} className="object-contain" unoptimized />}
                <span className="font-bold" style={{ color: meta.color }}>{meta.label}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Recherches / jour</span>
              <span className="text-white">{meta.searches}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Vidéos / recherche</span>
              <span className="text-white">{meta.videos}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Export</span>
              <span style={{ color: plan !== "free" ? "#10b981" : "#6b7280" }}>{meta.export}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 space-y-3">
          <h2 className="text-white font-semibold mb-4">Accès rapide</h2>
          <Link
            href="/dashboard/search"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-700 transition-colors group"
          >
            <span className="text-gray-300 group-hover:text-white text-sm">🔍 Recherche TikTok</span>
            <span className="text-gray-500 text-xs">→</span>
          </Link>
          <Link
            href="/billing"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-700 transition-colors group"
          >
            <span className="text-gray-300 group-hover:text-white text-sm">💳 Abonnement & facturation</span>
            <span className="text-gray-500 text-xs">→</span>
          </Link>
          {plan !== "premium" && (
            <Link
              href="/pricing"
              className="flex items-center justify-between p-3 rounded-xl transition-colors group"
              style={{ background: "rgba(255,22,84,0.06)", border: "1px solid rgba(255,22,84,0.2)" }}
            >
              <div>
                {plan === "pro" ? (
                  <>
                    <span className="text-sm font-bold" style={{ color: "#00D9FF" }}>💎 Upgrade vers Premium — 14,99€/mois</span>
                    <p className="text-gray-500 text-xs mt-0.5">Recherches illimitées · 100+ vidéos · Analytics avancés</p>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-bold" style={{ color: "#FF1654" }}>⭐ Upgrade vers Pro — 4,99€/mois</span>
                    <p className="text-gray-500 text-xs mt-0.5">50 recherches/jour · 50 vidéos · Export CSV</p>
                  </>
                )}
              </div>
              <span className="text-gray-500 text-xs">→</span>
            </Link>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full py-3 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors text-sm font-medium"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
