import type { ScrapedVideo } from "./tiktok-scraper";

export interface AnalysisItem {
  label: string;
  status: "good" | "warning" | "bad";
  insight: string;
  tip?: string;
}

function analyzeHook(hook: string): AnalysisItem {
  const words = hook.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const hasEmoji = /\p{Emoji}/u.test(hook);
  const hasExclamation = /[!?]/.test(hook);
  const hasEmotionalWord =
    /(incroyable|secret|choc|jamais|urgent|alerte|attention|wow|viral|astuce|hack|découvre|révèle|vérité|amazing|never|shocking|trick|tip|bêtise|erreur|interdit|méthode)/i.test(hook);

  if (wordCount < 4) {
    return {
      label: "Hook",
      status: "warning",
      insight: `Trop court (${wordCount} mots) — manque de contexte.`,
      tip: "Ajoute 3-4 mots pour intriguer davantage.",
    };
  }
  if (wordCount > 15) {
    return {
      label: "Hook",
      status: "warning",
      insight: `Trop long (${wordCount} mots) — les viewers décrochent.`,
      tip: "Réduis à 8-10 mots max pour plus d'impact.",
    };
  }

  const missing: string[] = [];
  if (!hasEmoji) missing.push("emoji");
  if (!hasExclamation) missing.push("point d'exclamation");

  if (hasEmotionalWord || (hasEmoji && hasExclamation)) {
    return {
      label: "Hook",
      status: "good",
      insight: "Court, intrigant, bonne longueur pour TikTok.",
    };
  }

  return {
    label: "Hook",
    status: "warning",
    insight: `Longueur correcte (${wordCount} mots) mais manque de punch.`,
    tip: missing.length > 0
      ? `Ajoute un ${missing.join(" ou un ")} pour + d'impact.`
      : "Utilise un mot fort : incroyable, secret, jamais vu…",
  };
}

function analyzeDuration(duration: number): AnalysisItem {
  if (!duration) return { label: "Durée", status: "warning", insight: "Durée non disponible." };

  if (duration <= 15) {
    return {
      label: "Durée",
      status: "warning",
      insight: `${duration}s — très courte.`,
      tip: "Vise 20-45s pour développer le contenu.",
    };
  }
  if (duration <= 45) {
    return {
      label: "Durée",
      status: "good",
      insight: `${duration}s — durée idéale (15-45s optimal TikTok).`,
    };
  }
  if (duration <= 60) {
    return {
      label: "Durée",
      status: "warning",
      insight: `${duration}s — légèrement longue.`,
      tip: "L'optimal est 15-45s. Essaie de couper 15-20s.",
    };
  }
  if (duration <= 120) {
    return {
      label: "Durée",
      status: "warning",
      insight: `${duration}s — trop longue, risque de drop-off.`,
      tip: "Enlève les silences et l'intro — vise 45s max.",
    };
  }
  return {
    label: "Durée",
    status: "bad",
    insight: `${duration}s — beaucoup trop longue pour TikTok.`,
    tip: "Découpe en plusieurs courtes vidéos (série).",
  };
}

function analyzeCTA(hook: string): AnalysisItem {
  const ctaRegex =
    /\b(essaie|essayez|tente|tentez|teste|testez|regarde|regardez|découvre|découvrez|clique|cliquez|commente|commentez|dis.?moi|dites.?moi|partage|partagez|sauvegarde|suis|suivez|abonne|abonnez|watch|try|look|check|like|vote|votez|réponds|répondez)\b/i;

  if (ctaRegex.test(hook)) {
    return {
      label: "CTA",
      status: "good",
      insight: "Appel à l'action présent dans le hook.",
    };
  }
  return {
    label: "CTA",
    status: "bad",
    insight: "Aucun appel à l'action détecté.",
    tip: 'Commence par "Essaie ça !" ou "Regarde ce qui se passe !"',
  };
}

function analyzeEngagement(rate: number): AnalysisItem {
  if (rate >= 10) {
    return {
      label: "Engagement",
      status: "good",
      insight: `${rate}% — exceptionnel, top 1% TikTok.`,
    };
  }
  if (rate >= 5) {
    return {
      label: "Engagement",
      status: "good",
      insight: `${rate}% — excellent (>5% = très au-dessus de la moyenne).`,
    };
  }
  if (rate >= 3) {
    return {
      label: "Engagement",
      status: "good",
      insight: `${rate}% — très bon (>3% = au-dessus de la moyenne).`,
    };
  }
  if (rate >= 1) {
    return {
      label: "Engagement",
      status: "warning",
      insight: `${rate}% — dans la moyenne, peut mieux faire.`,
      tip: "Pose une question dans le hook pour booster les commentaires.",
    };
  }
  return {
    label: "Engagement",
    status: "bad",
    insight: `${rate}% — très faible.`,
    tip: "Revoir le hook et le CTA — le contenu ne génère pas d'interaction.",
  };
}

export function analyzeVideo(
  video: Pick<ScrapedVideo, "hook" | "duration" | "engagementRate">
): AnalysisItem[] {
  return [
    analyzeHook(video.hook),
    analyzeDuration(video.duration),
    analyzeEngagement(video.engagementRate),
  ];
}
