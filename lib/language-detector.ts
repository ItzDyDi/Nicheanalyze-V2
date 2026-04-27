export type Lang = "fr" | "en" | "other";

const FR_ACCENTS = /[éèêëàâùûîïôçœæ]/i;

const FR_WORDS = new Set([
  "le","la","les","un","une","des","du","de","et","ou","est","avec","pour",
  "mon","ma","mes","ton","ta","tes","son","sa","ses","notre","votre","leur",
  "je","tu","il","elle","nous","vous","ils","elles","on","ce","cet","cette",
  "ces","qui","que","quoi","dont","où","comment","pourquoi","quand",
  "chien","chat","cheval","animal","animaux","dressage","comportement","astuce",
  "comment","voici","voilà","fais","faire","apprendre","apprends","tout","tous",
  "maison","décoration","cuisine","recette","astuce","conseil","conseils",
  "pas","plus","très","bien","aussi","même","encore","toujours","jamais",
  "suis","avoir","être","fait","faire","voir","savoir","pouvoir","vouloir",
]);

const EN_WORDS = new Set([
  "the","a","an","is","are","was","were","be","been","being","have","has","had",
  "do","does","did","will","would","could","should","may","might","must","shall",
  "i","you","he","she","it","we","they","me","him","her","us","them",
  "my","your","his","its","our","their","this","that","these","those",
  "and","or","but","so","yet","for","nor","although","because","since","while",
  "dog","cat","horse","pet","animal","training","behavior","trick","cute","funny",
  "how","what","why","when","where","who","which","whose","whom",
  "not","no","yes","can","get","make","know","think","go","come","take","use",
  "home","house","diy","hack","tips","trick","best","top","easy","fast","quick",
]);

export function detectLanguage(text: string): Lang {
  if (!text.trim()) return "other";

  // Strong signal: French accent characters
  if (FR_ACCENTS.test(text)) return "fr";

  const words = text.toLowerCase().match(/\b[a-zA-ZÀ-ÿ]{2,}\b/g) ?? [];
  if (words.length === 0) return "other";

  let frScore = 0;
  let enScore = 0;

  for (const word of words) {
    if (FR_WORDS.has(word)) frScore++;
    if (EN_WORDS.has(word)) enScore++;
  }

  if (frScore === 0 && enScore === 0) return "other";
  if (frScore > enScore) return "fr";
  if (enScore > frScore) return "en";

  // Tie: guess from common single-word searches
  const lower = text.toLowerCase().trim();
  if (/\b(chien|chat|maison|faire|avec|pour|les|des)\b/.test(lower)) return "fr";
  if (/\b(dog|cat|home|how|the|for|tips|best)\b/.test(lower)) return "en";

  return "other";
}

export function langLabel(lang: Lang): string {
  if (lang === "fr") return "🇫🇷 Français";
  if (lang === "en") return "🇬🇧 English";
  return "🌐 Auto";
}
