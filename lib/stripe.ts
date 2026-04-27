import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2026-04-22.dahlia",
});

export const PLAN_PRICES: Record<string, string> = {
  pro:     process.env.STRIPE_PRO_PRICE_ID!,
  premium: process.env.STRIPE_PREMIUM_PRICE_ID!,
};

export function priceIdToPlan(priceId: string): "free" | "pro" | "premium" {
  if (priceId === process.env.STRIPE_PRO_PRICE_ID)     return "pro";
  if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) return "premium";
  return "free";
}

export const PLAN_LABELS: Record<string, string> = {
  free:    "Free",
  pro:     "Pro",
  premium: "Premium",
};

export const STATUS_LABELS: Record<string, string> = {
  active:             "Actif",
  canceled:           "Annulé",
  past_due:           "Paiement en retard",
  incomplete:         "Incomplet",
  trialing:           "Période d'essai",
  unpaid:             "Non payé",
  incomplete_expired: "Expiré",
};
