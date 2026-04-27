import type { Lang } from "./language-detector";

interface NicheKeywords {
  petWellness: string[];
  diy: string[];
  education: string[];
  general: string[];
}

const KEYWORDS: Record<Lang, NicheKeywords> = {
  fr: {
    petWellness: ["dressage chien", "comportement chat", "soins animaux", "chiot éducation"],
    diy: ["astuce maison", "DIY déco", "rénovation appartement locataire"],
    education: ["apprendre français", "astuce mémorisation", "tutoriel facile"],
    general: ["astuce", "tutoriel", "conseil"],
  },
  en: {
    petWellness: ["dog training tips", "pet care", "animal behavior", "puppy tricks"],
    diy: ["home hacks", "renter friendly DIY", "apartment makeover"],
    education: ["learn on TikTok", "study tips", "life hacks"],
    general: ["tips", "tutorial", "how to"],
  },
  other: {
    petWellness: ["pet training", "animal care"],
    diy: ["home DIY", "house hacks"],
    education: ["learning tips"],
    general: ["tutorial"],
  },
};

type Niche = "pet-wellness" | "diy-home" | "education" | "general";

const NICHE_MAP: Record<Niche, keyof NicheKeywords> = {
  "pet-wellness": "petWellness",
  "diy-home": "diy",
  education: "education",
  general: "general",
};

/**
 * Returns an enhanced search query by appending 1-2 language-appropriate
 * keywords to improve TikTok API relevance.
 */
// Phrases complètes en priorité, puis mots isolés
const TRANSLATIONS: Record<"en_to_fr" | "fr_to_en", [string, string][]> = {
  en_to_fr: [
    ["dog training",    "dressage chien"],
    ["dog tricks",      "tours de chien"],
    ["cat tricks",      "tours de chat"],
    ["cat content",     "contenu chat"],
    ["home hacks",      "astuces maison"],
    ["home decor",      "décoration maison"],
    ["room makeover",   "relooking chambre"],
    ["furniture flip",  "relooking meuble"],
    ["study tips",      "conseils étude"],
    ["study hacks",     "astuces révision"],
    ["life hacks",      "astuces vie"],
    ["pet care",        "soins animaux"],
    ["bird care",       "soins oiseaux"],
    ["fish tank",       "aquarium poisson"],
    ["rabbit tips",     "conseils lapin"],
    ["cute puppies",    "chiots mignons"],
    ["dog",             "chien"],
    ["cat",             "chat"],
    ["puppy",           "chiot"],
    ["kitten",          "chaton"],
    ["pet",             "animal"],
    ["training",        "dressage"],
    ["tricks",          "tours"],
    ["care",            "soins"],
    ["behavior",        "comportement"],
    ["home",            "maison"],
    ["hacks",           "astuces"],
    ["tips",            "conseils"],
    ["tutorial",        "tutoriel"],
    ["decor",           "décoration"],
    ["garden",          "jardin"],
    ["study",           "révision"],
    ["learn",           "apprendre"],
    ["school",          "école"],
  ],
  fr_to_en: [
    ["dressage chien",  "dog training"],
    ["tours de chat",   "cat tricks"],
    ["tours de chien",  "dog tricks"],
    ["astuces maison",  "home hacks"],
    ["relooking meuble","furniture flip"],
    ["soins animaux",   "pet care"],
    ["chiots mignons",  "cute puppies"],
    ["conseils étude",  "study tips"],
    ["chien",           "dog"],
    ["chat",            "cat"],
    ["chiot",           "puppy"],
    ["chaton",          "kitten"],
    ["dressage",        "training"],
    ["animal",          "pet"],
    ["maison",          "home"],
    ["astuces",         "hacks"],
    ["astuce",          "hack"],
    ["conseils",        "tips"],
    ["tutoriel",        "tutorial"],
    ["décoration",      "decor"],
    ["apprendre",       "learn"],
    ["école",           "school"],
    ["jardin",          "garden"],
  ],
};

export function translateQuery(query: string, targetLang: "fr" | "en"): string {
  const pairs = targetLang === "fr" ? TRANSLATIONS.en_to_fr : TRANSLATIONS.fr_to_en;
  let result = query.toLowerCase().trim();
  for (const [from, to] of pairs) {
    if (result.includes(from.toLowerCase())) {
      result = result.replace(new RegExp(from, "gi"), to);
      break; // une seule substitution principale pour éviter les cascades
    }
  }
  return result;
}

export function enhanceQuery(keyword: string, lang: Lang, niche: Niche = "general"): string {
  const nicheKey = NICHE_MAP[niche] ?? "general";
  const terms = KEYWORDS[lang][nicheKey];
  if (!terms.length) return keyword;

  // Pick one term that doesn't overlap with the keyword
  const extra = terms.find(
    (t) => !keyword.toLowerCase().includes(t.toLowerCase().split(" ")[0])
  );

  return extra ? `${keyword} ${extra.split(" ")[0]}` : keyword;
}

export { KEYWORDS };
