# TikTok Niche Analyzer — CLAUDE.md

## Vue d'ensemble du projet
Application Node.js d'analyse de vidéos TikTok permettant d'identifier
les tendances et contenus performants par niche, avec transcription
automatique et génération de rapports/dashboards.

## Stack technique
- Runtime : Node.js (JavaScript, pas TypeScript)
- Framework backend : Express.js
- Frontend / Dashboard : 
- Base de données : 
- Transcription : 
- TikTok data :  TikTok API officielle, RapidAPI
  
## Architecture du projet
src/
├── routes/          # Endpoints Express
├── services/        # Logique métier (analyse, transcription, scraping)
├── models/          # Schémas de données
├── utils/           # Fonctions utilitaires
├── dashboard/       # Frontend / templates de rapports
└── config/          # Variables d'environnement et configuration

## Fonctionnalités principales
1. **Récupération de vidéos** par niche / hashtag / compte
2. **Transcription** du contenu audio des vidéos
3. **Analyse de niche** : identification de ce qui performe (hooks,
   formats, durée, sujets récurrents)
4. **Génération de rapports** : dashboards visuels des tendances

## Conventions de code
- Langue : français pour les commentaires et variables métier
- Indentation : 2 espaces
- Modules : CommonJS (`require`) sauf si le projet utilise déjà ESM
- Nommage : camelCase pour les variables, PascalCase pour les classes
- Pas de `var`, uniquement `const` et `let`
- Gestion des erreurs : toujours utiliser try/catch sur les appels async

## Ce qu'il ne faut PAS modifier sans me demander
- La logique de scoring / ranking des niches
- Les clés API et fichiers `.env`
- La structure des objets de données retournés par les services

## Comportement attendu de Claude
- Toujours proposer des modifications incrémentales, pas des rewrites complets
- Conserver la structure de fichiers existante
- Commenter les nouvelles fonctions ajoutées
- Signaler si une dépendance npm ajoutée est lourde ou risquée
- Vérifier que les appels async sont bien awaités avant de soumettre

## Variables d'environnement utilisées
- `TIKTOK_API_KEY` — clé d'accès à l'API TikTok / RapidAPI
- `TRANSCRIPTION_API_KEY` — clé du service de transcription
- `PORT` — port du serveur Express
- `DB_URI` — chaîne de connexion base de données

## Commandes utiles
```bash
npm run dev      # Lancer en mode développement
npm run build    # Build de production
npm test         # Lancer les tests
```