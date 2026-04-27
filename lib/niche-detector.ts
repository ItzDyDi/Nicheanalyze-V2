export type Niche = "pet" | "diy" | "education" | null;

export function detectNiche(query: string): Niche {
  const q = query.toLowerCase();

  if (/\b(dog|cat|pet|animal|puppy|kitten|bird|rabbit|hamster|fish|paw|vet|trick|training|behavior|chien|chat|lapin|chiot|perroquet|dressage|animaux)\b/.test(q)) {
    return "pet";
  }
  if (/\b(home|diy|hack|apartment|furniture|decoration|renter|decor|room|house|renovation|maison|déco|appartement|meuble|bricolage|cuisine|bathroom|bedroom|garden|jardin)\b/.test(q)) {
    return "diy";
  }
  if (/\b(learn|tutorial|tip|skill|memory|study|school|education|cours|apprendre|étude|math|science|language|code|program|college|university|savoir|connaissance)\b/.test(q)) {
    return "education";
  }

  return null;
}
