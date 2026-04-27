import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LABELS, STATUS_LABELS } from "@/lib/stripe";
import ManageButton from "./ManageButton";
import Link from "next/link";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}k`;
  return n.toString();
}

export default async function BillingPage({ searchParams }: { searchParams: { success?: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const userId = (session.user as { id: string }).id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await prisma.user.findUnique({ where: { id: userId } }) as any;
  if (!user) redirect("/auth/login");

  const plan   = user.plan ?? "free";
  const status = user.subscriptionStatus;
  const endAt  = user.subscriptionEnd ? new Date(user.subscriptionEnd) : null;

  const planColor: Record<string, string> = {
    free:    "#94a3b8",
    pro:     "#FF1654",
    premium: "#00D9FF",
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Success banner */}
        {searchParams.success && (
          <div className="p-4 rounded-xl text-sm font-medium text-emerald-400" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
            🎉 Paiement confirmé ! Ton plan a été mis à jour.
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-white">Abonnement</h1>
          <p className="text-gray-400 text-sm mt-1">Gère ton plan et tes paiements</p>
        </div>

        {/* Plan actuel */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 space-y-4">
          <h2 className="text-white font-semibold">Plan actuel</h2>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black" style={{ color: planColor[plan] ?? "#94a3b8" }}>
                {PLAN_LABELS[plan] ?? plan}
              </span>
              {status && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{
                  background: status === "active" ? "rgba(16,185,129,0.12)" : "rgba(255,22,84,0.12)",
                  color:      status === "active" ? "#10b981" : "#FF1654",
                  border:     `1px solid ${status === "active" ? "rgba(16,185,129,0.25)" : "rgba(255,22,84,0.25)"}`,
                }}>
                  {STATUS_LABELS[status] ?? status}
                </span>
              )}
            </div>
            {plan === "free" ? (
              <Link
                href="/pricing"
                className="px-4 py-2 rounded-xl text-sm font-bold text-white transition hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #FF1654, #d4103c)" }}
              >
                ⭐ Upgrade
              </Link>
            ) : (
              <ManageButton />
            )}
          </div>

          {/* Details */}
          <div className="border-t border-gray-700 pt-4 space-y-3 text-sm">
            {plan !== "free" && endAt && (
              <div className="flex justify-between">
                <span className="text-gray-400">Prochain renouvellement</span>
                <span className="text-white">{endAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Recherches / jour</span>
              <span className="text-white">{plan === "free" ? "5" : plan === "pro" ? "50" : "Illimitées"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Vidéos / recherche</span>
              <span className="text-white">{plan === "free" ? "10" : plan === "pro" ? "50" : "100+"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Analytics Premium</span>
              <span className={plan === "premium" ? "text-emerald-400 font-semibold" : "text-gray-500"}>
                {plan === "premium" ? "✓ Inclus" : "Non inclus"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Export CSV</span>
              <span className={plan !== "free" ? "text-emerald-400 font-semibold" : "text-gray-500"}>
                {plan !== "free" ? "✓ Inclus" : "Non inclus"}
              </span>
            </div>
          </div>
        </div>

        {/* Upgrade CTA si free ou pro */}
        {plan !== "premium" && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <h2 className="text-white font-semibold mb-1">
              {plan === "free" ? "Passe à Pro ou Premium" : "Upgrade vers Premium"}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              {plan === "free"
                ? "Débloque 50 recherches/jour, les exports CSV et bien plus."
                : "Analytics avancées, courbes, rapports mensuels et support prioritaire."}
            </p>
            <Link
              href="/pricing"
              className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold text-white transition hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #FF1654, #d4103c)" }}
            >
              Voir les plans →
            </Link>
          </div>
        )}

        {/* Info facturation */}
        {plan !== "free" && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 space-y-3">
            <h2 className="text-white font-semibold">Facturation</h2>
            <p className="text-gray-400 text-sm">
              Tes factures, méthodes de paiement et informations de facturation sont gérées directement via le portail Stripe sécurisé.
            </p>
            <ManageButton label="Gérer la facturation →" variant="ghost" />
          </div>
        )}

        {/* Back */}
        <Link href="/account" className="block text-center text-sm text-gray-500 hover:text-gray-300 transition">
          ← Retour au compte
        </Link>
      </div>
    </div>
  );
}
