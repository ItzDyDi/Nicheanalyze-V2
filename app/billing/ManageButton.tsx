"use client";
import { useState } from "react";

interface Props {
  label?: string;
  variant?: "primary" | "ghost";
}

export default function ManageButton({ label = "Gérer mon abonnement", variant = "primary" }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res  = await fetch("/api/billing-portal", { method: "POST" });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (e) {
      console.error(e);
      alert("Impossible d'ouvrir le portail de facturation. Réessaie.");
      setLoading(false);
    }
  }

  if (variant === "ghost") {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className="text-sm text-gray-400 hover:text-white transition disabled:opacity-50"
      >
        {loading ? "Chargement..." : label}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-4 py-2 rounded-xl text-sm font-bold border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition disabled:opacity-50"
    >
      {loading ? "Chargement..." : label}
    </button>
  );
}
