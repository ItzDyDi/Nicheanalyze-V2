"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  plan: "pro" | "premium";
  label: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function CheckoutButton({ plan, label, className, style }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login?redirect=/pricing");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ plan }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (e) {
      console.error(e);
      alert("Une erreur est survenue. Réessaie ou contacte le support.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || status === "loading"}
      className={className}
      style={style}
    >
      {loading ? "Redirection..." : label}
    </button>
  );
}
