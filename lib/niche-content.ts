export interface TrendingItem {
  emoji: string;
  label: string;
  query: string;
}

export interface NicheContent {
  icon: string;
  label: string;
  label_en: string;
  title: string;
  title_en: string;
  subtitle: string;
  subtitle_en: string;
  trending_fr: TrendingItem[];
  trending_en: TrendingItem[];
  tips: string[];
  tips_en: string[];
}

export const NICHE_CONTENT: Record<"pet" | "diy" | "education" | "generic", NicheContent> = {
  pet: {
    icon: "🐾",
    label: "Animaux",
    label_en: "Pet & Animals",
    title: "Analyse ta niche animaux",
    title_en: "Analyze your pet niche",
    subtitle: "Niche animaux détectée — voici les recherches qui performent.",
    subtitle_en: "Pet niche detected — here are top performing searches.",
    trending_fr: [
      { emoji: "🐕", label: "Dressage chien", query: "dressage chien" },
      { emoji: "🐱", label: "Astuces chat", query: "astuces chat tiktok" },
      { emoji: "🐶", label: "Chiots mignons", query: "chiot mignon" },
      { emoji: "🦜", label: "Perroquet parlant", query: "perroquet parle" },
      { emoji: "🐇", label: "Lapin domestique", query: "lapin apprivoisé" },
      { emoji: "🐠", label: "Aquarium déco", query: "aquarium décoration" },
    ],
    trending_en: [
      { emoji: "🐕", label: "Dog Training", query: "dog training" },
      { emoji: "🐱", label: "Cat Tricks", query: "cat tricks" },
      { emoji: "🐶", label: "Cute Puppies", query: "cute puppies" },
      { emoji: "🦜", label: "Bird Care", query: "bird care" },
      { emoji: "🐇", label: "Rabbit Tips", query: "rabbit tips" },
      { emoji: "🐠", label: "Fish Tank", query: "fish tank decor" },
    ],
    tips: [
      "Utilise #dogsoftiktok, #catsoftiktok — des millions de vues garantis",
      "Les moments d'émotion (mignons, drôles) surperforment les tutos",
      "Durée optimale : 15-45s pour du contenu animaux",
    ],
    tips_en: [
      "Use #dogsoftiktok, #catsoftiktok — millions of views guaranteed",
      "Emotional moments (cute, funny) outperform tutorials",
      "Optimal length: 15-45s for pet content",
    ],
  },
  diy: {
    icon: "🏠",
    label: "DIY & Déco",
    label_en: "DIY & Home",
    title: "Analyse ta niche DIY & déco",
    title_en: "Analyze your DIY & home niche",
    subtitle: "Niche déco détectée — voici les recherches qui performent.",
    subtitle_en: "Home niche detected — here are top performing searches.",
    trending_fr: [
      { emoji: "🏠", label: "Astuces maison", query: "astuces maison" },
      { emoji: "🛋️", label: "Relooking meuble", query: "relooking meuble" },
      { emoji: "🎨", label: "Déco chambre", query: "décoration chambre" },
      { emoji: "🔧", label: "Bricolage facile", query: "bricolage facile" },
      { emoji: "🪴", label: "Plantes intérieur", query: "plantes d'intérieur" },
      { emoji: "🍳", label: "Rangement cuisine", query: "rangement cuisine" },
    ],
    trending_en: [
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
    tips_en: [
      "Show the before/after — transformations get massive views",
      "Use #renterfriendly, #homedecor, #diyhome",
      "Optimal length: 20-45s for DIY tutorials",
    ],
  },
  education: {
    icon: "📚",
    label: "Éducation",
    label_en: "Education",
    title: "Analyse ta niche éducation",
    title_en: "Analyze your education niche",
    subtitle: "Niche éducation détectée — voici les recherches qui performent.",
    subtitle_en: "Education niche detected — here are top performing searches.",
    trending_fr: [
      { emoji: "🧠", label: "Techniques mémoire", query: "techniques de mémorisation" },
      { emoji: "💻", label: "Apprendre à coder", query: "apprendre à coder" },
      { emoji: "📝", label: "Astuces études", query: "astuces pour étudier" },
      { emoji: "🗣️", label: "Apprendre anglais", query: "apprendre anglais rapidement" },
      { emoji: "📐", label: "Maths faciles", query: "maths astuces" },
      { emoji: "🔬", label: "Faits scientifiques", query: "faits scientifiques incroyables" },
    ],
    trending_en: [
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
    tips_en: [
      "Start with a surprising fact — boosts views by 30%",
      "Use #learnontiktok, #didyouknow, #education",
      "Optimal length: 30-60s for educational videos",
    ],
  },
  generic: {
    icon: "✨",
    label: "Toutes niches",
    label_en: "All niches",
    title: "Analyse ta niche TikTok",
    title_en: "Analyze your TikTok niche",
    subtitle: "Recherche un mot-clé pour découvrir ce qui performe dans ta niche.",
    subtitle_en: "Search a keyword to discover what's performing in your niche.",
    trending_fr: [
      { emoji: "💪", label: "Fitness & sport", query: "fitness motivation" },
      { emoji: "🍔", label: "Recettes virales", query: "recette virale tiktok" },
      { emoji: "💄", label: "Routine beauté", query: "routine beauté" },
      { emoji: "👗", label: "Tenues du jour", query: "outfit tenue du jour" },
      { emoji: "✈️", label: "Voyages & trips", query: "voyage conseils" },
      { emoji: "💰", label: "Argent & finance", query: "investissement débutant" },
      { emoji: "🎮", label: "Gaming TikTok", query: "gaming highlights" },
      { emoji: "🧘", label: "Bien-être & santé", query: "bien-être mental" },
      { emoji: "📱", label: "Tech & gadgets", query: "tech gadgets" },
      { emoji: "🐕", label: "Animaux mignons", query: "animaux mignons" },
      { emoji: "🏠", label: "Déco maison", query: "décoration maison tendance" },
      { emoji: "📚", label: "Astuces études", query: "astuces productivité" },
    ],
    trending_en: [
      { emoji: "💪", label: "Fitness & Workout", query: "fitness motivation" },
      { emoji: "🍔", label: "Viral Recipes", query: "viral recipe tiktok" },
      { emoji: "💄", label: "Beauty Routine", query: "beauty routine" },
      { emoji: "👗", label: "Outfit of the Day", query: "outfit of the day" },
      { emoji: "✈️", label: "Travel Tips", query: "travel tips" },
      { emoji: "💰", label: "Money & Finance", query: "investing beginners" },
      { emoji: "🎮", label: "Gaming TikTok", query: "gaming highlights" },
      { emoji: "🧘", label: "Wellness & Health", query: "mental wellness" },
      { emoji: "📱", label: "Tech & Gadgets", query: "tech gadgets" },
      { emoji: "🐕", label: "Cute Animals", query: "cute animals" },
      { emoji: "🏠", label: "Home Decor", query: "home decor trending" },
      { emoji: "📚", label: "Productivity Tips", query: "productivity hacks" },
    ],
    tips: [
      "Plus ton mot-clé est précis, meilleurs sont les résultats",
      "Essaie en français ET en anglais pour ta niche",
      "Compare plusieurs mots-clés pour trouver la bonne tendance",
    ],
    tips_en: [
      "The more specific your keyword, the better the results",
      "Try both your language and English for your niche",
      "Compare multiple keywords to find the right trend",
    ],
  },
};
