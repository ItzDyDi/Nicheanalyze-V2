export const TOOLTIPS = {
  // Stats vidéo individuelles
  views:      "Nombre de fois que la vidéo a été regardée sur TikTok.",
  likes:      "Nombre de ❤️ reçus. Signe que le contenu plaît.",
  comments:   "Nombre de commentaires. Signe fort d'engagement — les gens réagissent!",
  engagement: "% de (likes + commentaires + partages) / vues. >5% = excellent, >10% = viral!",
  duration:   "Durée de la vidéo en secondes. Les courtes (15-30s) performent souvent mieux.",
  hook:       "La première phrase qui accroche le spectateur. C'est le secret des vidéos virales.",
  creator:    "Compte TikTok du créateur. Clique sur la card pour voir la vidéo originale.",
  contentType: "Type de contenu détecté automatiquement (tutorial, cute moment, etc.).",

  // Stats globales panel droit
  avgViews:      "Moyenne de vues sur les vidéos analysées. Plus haut = niche plus populaire.",
  avgLikes:      "Moyenne de likes. Bon indicateur de la qualité du contenu dans cette niche.",
  avgDuration:   "Durée moyenne des vidéos top. C'est la durée idéale à viser pour cette niche!",
  avgEngagement: "% d'engagement moyen. >5% = bien, >8% = très bien, >10% = exceptionnel!",

  // Sections
  contentBreakdown: "Répartition par type de contenu. Mise sur le type qui domine — c'est ce que l'audience veut.",
  hashtags:         "Hashtags les plus utilisés dans les top vidéos. Ajoute-les à tes vidéos pour plus de reach!",
  topHooks:         "Les accroches des vidéos les plus vues. Inspire-toi de leur structure pour tes propres hooks.",
} as const;

export type TooltipKey = keyof typeof TOOLTIPS;
