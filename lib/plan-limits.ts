export type Plan = "free" | "pro" | "premium";

export type PlanConfig = {
  label: string;
  price: string;
  period: string;
  yearlyPrice?: string;
  description: string;
  color: string;
  searchesPerDay: number | null; // null = unlimited
  videosPerSearch: number;
  hashtags: number | null;
  stats: "basic" | "complete" | "advanced";
  hooks: boolean;
  exportCsv: boolean;
  exportPdf: boolean;
  saveHistory: number | null; // days, null = none
  nicheComparison: boolean;
  monthlyReports: boolean;
  charts: boolean;
  support: "none" | "email" | "priority";
  betaFeatures: boolean;
};

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    label: "Free",
    price: "0€",
    period: "pour toujours",
    description: "Pour découvrir NicheAnalyze",
    color: "#94a3b8",
    searchesPerDay: 5,
    videosPerSearch: 10,
    hashtags: 3,
    stats: "basic",
    hooks: false,
    exportCsv: false,
    exportPdf: false,
    saveHistory: null,
    nicheComparison: false,
    monthlyReports: false,
    charts: false,
    support: "none",
    betaFeatures: false,
  },
  pro: {
    label: "Pro",
    price: "4,99€",
    period: "/ mois",
    yearlyPrice: "49,90€",
    description: "Pour les créateurs sérieux",
    color: "#FF1654",
    searchesPerDay: 50,
    videosPerSearch: 50,
    hashtags: 20,
    stats: "complete",
    hooks: true,
    exportCsv: true,
    exportPdf: false,
    saveHistory: 7,
    nicheComparison: false,
    monthlyReports: false,
    charts: false,
    support: "email",
    betaFeatures: false,
  },
  premium: {
    label: "Premium",
    price: "14,99€",
    period: "/ mois",
    yearlyPrice: "149,90€",
    description: "Pour les agences & pros",
    color: "#00D9FF",
    searchesPerDay: null,
    videosPerSearch: 100,
    hashtags: null,
    stats: "advanced",
    hooks: true,
    exportCsv: true,
    exportPdf: true,
    saveHistory: 90,
    nicheComparison: true,
    monthlyReports: true,
    charts: true,
    support: "priority",
    betaFeatures: true,
  },
};

export type FeatureRow = {
  label: string;
  free: string;
  pro: string;
  premium: string;
  highlight?: boolean;
};

export const FEATURE_ROWS: FeatureRow[] = [
  { label: "Recherches / jour",       free: "5",          pro: "50",         premium: "Illimitées",    highlight: true },
  { label: "Vidéos par recherche",    free: "10",         pro: "50",         premium: "100+" },
  { label: "Statistiques",             free: "Basiques",   pro: "Complètes",  premium: "Avancées + courbes" },
  { label: "Top hashtags",            free: "Top 3",      pro: "Top 20",     premium: "Illimités" },
  { label: "Hooks analysés",          free: "—",          pro: "✓",          premium: "✓ amélioré" },
  { label: "Export CSV",              free: "—",          pro: "✓",          premium: "✓" },
  { label: "Export PDF",              free: "—",          pro: "—",          premium: "✓" },
  { label: "Historique",              free: "—",          pro: "7 jours",    premium: "90 jours" },
  { label: "Comparaison niches",      free: "—",          pro: "—",          premium: "3 niches" },
  { label: "Rapports mensuels",       free: "—",          pro: "—",          premium: "✓" },
  { label: "Statistiques avec courbes", free: "—",         pro: "—",          premium: "✓" },
  { label: "Support",                 free: "—",          pro: "Email",      premium: "Prioritaire" },
  { label: "Betas features",          free: "—",          pro: "—",          premium: "✓" },
];

export function getPlanLabel(plan: Plan): string {
  return PLANS[plan].label;
}

export function getSearchLimit(plan: Plan): number | null {
  return PLANS[plan].searchesPerDay;
}

export function getUpgradePlan(plan: Plan): Plan | null {
  if (plan === "free") return "pro";
  if (plan === "pro") return "premium";
  return null;
}
