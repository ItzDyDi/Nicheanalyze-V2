export interface TrendingItem {
  emoji: string;
  label: string;
  query: string;
}

export interface NicheContent {
  icon: string;
  label: string;
  title: string;
  subtitle: string;
  trending: TrendingItem[];
  tips: string[];
}

export const NICHE_CONTENT: Record<"pet" | "diy" | "education" | "generic", NicheContent> = {
  pet: {
    icon: "🐾",
    label: "Pet Wellness",
    title: "Prêt à analyser plus de pet content ?",
    subtitle: "Ta niche pet détectée — voici les recherches qui performent.",
    trending: [
      { emoji: "🐕", label: "Dog Training", query: "dog training" },
      { emoji: "🐱", label: "Cat Tricks", query: "cat tricks" },
      { emoji: "🐶", label: "Cute Puppies", query: "cute puppies" },
      { emoji: "🦜", label: "Bird Care", query: "bird care" },
      { emoji: "🐇", label: "Rabbit Tips", query: "rabbit tips" },
      { emoji: "🐠", label: "Fish Tank", query: "fish tank decor" },
    ],
    tips: [
      "Utilise #dogsoftiktok, #catsoftiktok — millions de vues garantis",
      "Les moments d'émotion (mignons, drôles) surperforment les tutos",
      "Durée optimale : 15-45s pour du pet content",
    ],
  },
  diy: {
    icon: "🏠",
    label: "DIY Home",
    title: "Prêt à analyser plus de DIY content ?",
    subtitle: "Ta niche déco détectée — voici les recherches qui performent.",
    trending: [
      { emoji: "🏠", label: "Home Hacks", query: "home hacks" },
      { emoji: "🛋️", label: "Furniture Flip", query: "furniture flip" },
      { emoji: "🎨", label: "Room Makeover", query: "room makeover" },
      { emoji: "🔧", label: "Repair Tips", query: "repair tips" },
      { emoji: "🪴", label: "Plant Decor", query: "plant decor" },
      { emoji: "🍳", label: "Kitchen Hacks", query: "kitchen hacks" },
    ],
    tips: [
      "Montre le avant/après — les transformations font exploser les vues",
      "Utilise #renterfriendly, #homedecor, #diyhome",
      "Durée optimale : 20-45s pour les tutos DIY",
    ],
  },
  education: {
    icon: "📚",
    label: "Éducation",
    title: "Prêt à analyser plus d'éducation content ?",
    subtitle: "Ta niche éducation détectée — voici les recherches qui performent.",
    trending: [
      { emoji: "🧠", label: "Memory Tips", query: "memory tips" },
      { emoji: "💻", label: "Coding Tricks", query: "coding tricks" },
      { emoji: "📝", label: "Study Hacks", query: "study hacks" },
      { emoji: "🗣️", label: "Language Tips", query: "language learning tips" },
      { emoji: "📐", label: "Math Tricks", query: "math tricks" },
      { emoji: "🔬", label: "Science Facts", query: "science facts" },
    ],
    tips: [
      "Commence par un fait surprenant — ça booste les vues de 30%",
      "Utilise #learnontiktok, #didyouknow, #education",
      "Durée optimale : 30-60s pour les vidéos éducatives",
    ],
  },
  generic: {
    icon: "✨",
    label: "Toutes niches",
    title: "Analyse ta niche TikTok",
    subtitle: "Recherche un mot-clé pour découvrir ce qui performe.",
    trending: [
      { emoji: "🐕", label: "Dog Training", query: "dog training" },
      { emoji: "🏠", label: "Home Hacks", query: "home hacks" },
      { emoji: "🧠", label: "Study Tips", query: "study tips" },
      { emoji: "🐱", label: "Cat Content", query: "cat content" },
      { emoji: "🎨", label: "Room Decor", query: "room decor" },
      { emoji: "💻", label: "Tech Tips", query: "tech tips" },
    ],
    tips: [
      "Plus ton mot-clé est précis, meilleurs sont les résultats",
      "Essaie en français ET en anglais pour ta niche",
      "Compare plusieurs mots-clés pour trouver la bonne tendance",
    ],
  },
};
