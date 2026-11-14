# MED DZ — Plateforme médicale algérienne

MED DZ est une application pédagogique en français destinée aux étudiants en médecine (1re à 7e année) et aux candidats au Résidanat en Algérie.

## Fonctionnalités présentes dans le dépôt

- Tableau de bord et navigation par année d'étude.
- Banque de QCM avec filtres par spécialité, difficulté et provenance.
- Préparation EMD et Résidanat avec sessions chronométrées, correction et suivi.
- Cours médicaux, fiches de révision, résumés intelligents et flashcards.
- Cas cliniques et outils médicaux pédagogiques.
- Favoris, erreurs à revoir, statistiques et progression locale.
- Assistant Gemini côté serveur pour les résumés et la génération de QCM.
- PWA avec cache des ressources et stockage local IndexedDB.

## Intégrité des contenus

Les catégories ne doivent pas être confondues :

- **Questions pédagogiques référencées** : questions originales d'entraînement associées à des références académiques.
- **Entraînement généré par IA** : contenu généré à la demande, clairement étiqueté comme tel.
- **Annale officielle vérifiée** : réservée à une question dont la provenance d'un document officiel a été contrôlée.
- **Série pédagogique** : assemblage de questions d'entraînement autour d'un programme ou d'une session, jamais présenté comme une copie d'examen.

État actuel du dépôt : 132 QCM pédagogiques statiques, 10 séries pédagogiques (117 questions liées) et 20 sessions historiques de Résidanat signalées comme indisponibles localement. Aucune de ces séries pédagogiques n'est présentée comme une annale officielle. Le nombre de questions et les liens entre archives et QCM sont vérifiés par le script de validation.

## Architecture

- **Frontend** : React 19, TypeScript, Vite et Tailwind CSS.
- **Backend** : Express et SDK officiel `@google/genai`.
- **IA** : modèle `gemini-3.8-flash`; la clé reste exclusivement dans l'environnement serveur.
- **Stockage local** : IndexedDB avec fallback localStorage.
- **Android** : Capacitor 7, application `dz.med.med_dz`.
- **PWA** : cache des ressources statiques et prise en charge de l'étude hors connexion après chargement initial.

## Configuration de l'IA

Définir `GEMINI_API_KEY` dans l'environnement du service backend (par exemple, dans les variables d'environnement Render). Ne jamais intégrer la clé dans le frontend, l'APK, le dépôt Git ou une capture d'écran.

Le endpoint `GET /api/health` indique si la clé est configurée sans exposer sa valeur.

## Android / APK

Le workflow GitHub Actions `.github/workflows/android-apk.yml` :

1. Installe les dépendances.
2. Vérifie les types TypeScript.
3. Valide les QCM et les archives.
4. Construit le frontend.
5. Vérifie la configuration Capacitor.
6. Génère le projet Android et le synchronise.
7. Construit un APK debug et le publie comme artifact GitHub Actions.

L'application Android utilise actuellement l'URL de déploiement configurée dans `capacitor.config.json`. Le service web/API correspondant doit donc être déployé et accessible pour utiliser les fonctions connectées à Gemini. Les données d'étude déjà chargées et enregistrées localement restent sur l'appareil.

## Validation locale

```bash
npm install
npm run lint
npm run validate:data
npm run build
```

Pour synchroniser Android après génération du projet :

```bash
npx cap sync android
```

## Limites connues avant une version publique

- Les 20 sessions historiques listées comme indisponibles ne contiennent pas de fausses questions.
- Les 10 séries disponibles sont pédagogiques, pas des annales officielles.
- Les 132 QCM statiques doivent encore faire l'objet d'une revue médicale humaine systématique avant diffusion à grande échelle.
- La progression est locale : la synchronisation de compte entre plusieurs appareils n'est pas encore intégrée.
- Les contenus générés par IA sont pédagogiques et ne remplacent ni les référentiels officiels ni l'avis d'un professionnel de santé.
