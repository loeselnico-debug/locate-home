🧭 ⚛️ 🇫🇷 LOCATE SYSTEMS | SOURCE DE VÉRITÉ V3.2
26 Février 2026
Statut : RÉFÉRENTIEL MAÎTRE - ARCHITECTURE MONOREPO UNIFIÉE 🟢  
Vision : "L'homme ne parle pas à l'IA pour l'écouter, mais pour qu'elle devienne le prolongement de son expertise terrain."

📂 1. ORGANIGRAMME TECHNIQUE (STRUCTURE EXACTE DU REPOSITORY)
📦 LOCATE-SYSTEMS
├── 📂 public/                 # Actifs Visuels (Icônes 3D, manifest.json)
├── 📂 src/                    # MOTEUR DE L'APPLICATION
│   ├── 📂 core/               # M1 : TRONC COMMUN (Le Socle)
│   │   ├── 📁 ai/             # decisionEngine.ts, expertiseRules.ts, geminiService.ts
│   │   ├── 📁 camera/         # Scanner.tsx
│   │   ├── 📁 security/       # safetyService.ts, tiers.ts, useUserTier.ts
│   │   ├── 📁 storage/        # imageService.ts, memoryService.ts
│   │   ├── 📁 ui/             # Hub.tsx, LocationBar.tsx, Logo.tsx, ResultModal.tsx, SafetyBadge.tsx
│   │   └── 📄 index.ts
│   ├── 📂 modules/            # LES 5 VERTICALES MÉTIERS
│   │   ├── 📁 asset/          # M3 : L'Industrie (Spécifications Grands Comptes)
│   │   ├── 📁 care/           # M6 : La Santé
│   │   ├── 📁 garage/         # M5 : La Maintenance
│   │   ├── 📂 home/           # M2 : Le Hub / Inventaire (Orange Néon)
│   │   │   ├── 📁 components/ # HomeMenu.tsx, InventoryCard.tsx, Library.tsx, Search.tsx, ToolDetail.tsx
│   │   │   └── 📁 views/      # Dashboard.tsx, PrivacyPolicy.tsx, SettingsPage.tsx, ValidationSas.tsx
│   │   └── 📁 kitchen/        # M4 : Les Flux (HACCP)
│   ├── 📂 styles/             # App.css, index.css
│   ├── 📂 types/              # index.ts (Source de Vérité Data)
│   ├── 📄 App.tsx             # Chef d'orchestre
│   └── 📄 main.tsx
├── 📄 MANIFESTE_LOCATEHOME_PROJET.md
├── 📄 MANIFESTE_LOCATEHOME-DESIGN.md
└── ⚙️ [Fichiers de Config]    # .env, vite.config.ts, tailwind.config.js, package.json...
---

## 🛠️ 2. LES 6 PILIERS DU SYSTÈME

🛡️ M1 : TRONC COMMUN (CORE)
Cerveau : Gemini 2.0 Flash.
Vision : Étalon 12 frames / 20 secondes.
Zéro-Trust : Filtrage morphologique strict (Focus outil/donnée uniquement).
Universalité : CM/Inch, FR/UK, adaptation aux normes locales.
Architecture des 5 Modules Universels:
L'écosystème est segmenté en cinq verticales distinctes, partageant une base de données centralisée et sécurisée. Les 5 modules ont en commun la base du code de reconnaissance augmenté et le traitement en local des données. Chaque application détient un code couleur spécifique à son domaine d’activité Domaines sécuriser pour OVH.

🏠 M2 : [HOME] (Le Hub)
Fonction : Dédié aux bricoleurs lambdas, aux bricoleurs experts et créateurs “DIY”, au professionnel et à la génération de rapports d'inventaire d’outillage électroportatif et outillages à main pour assurances. Vision internationale conversion cm/inch, multilingue FR/UK, adaptation des normes exclusives de sécurités au travail des pays d’utilisation..
Outil Maître : Module "Retrouver" (01B) - Recherche vocale mains libres.

📦 M3 : [ASSET] (L'Industrie)
Fonction : Réalisation et traçabilité des inventaires dépassant 1000 références. Focus sur la rigueur de l’inventaire (de plus de 1000 références) et de l'industrie pour la gestion des stocks (Maintenance prédictive).
Expertise : Extraction SKU (6 chiffres) et références XHANDER (XH-...).
Analyse : Diagnostic d'usure des surfaces (Nylon, Téflon, Métaux). FALSE

🍳 M4 : [KITCHEN] (Les Flux)
Fonction : SUnivers culinaire professionnel, focalisé sur la sécurité alimentaire, l'hygiène (HACCP), normes françaises et la gestion des stocks périssables. Lancement international 2030, Multilingue FR, UK, DE…( les 20 langues les plus utilisées dans le monde), adaptation des normes exclusives d’hygiènes aux pays d’utilisation.

🔧 M5 : [GARAGE] (La Maintenance)
Fonction : Suivi des réparations mécaniques et contrôle de fin de poste. La mémoire augmentée du mécanicien et du technicien de maintenance et de la précision de l’assistance et le diagnostic par l’IA.
Analyse : Détecter finement les nuances de coloration d'un métal suite échauffement, écouter des bruits suspects, émettre des hypotheses avec le technicien mécanicien.

🩺 M6 : [CARE] (La Santé)
Fonction :Santé et services à la personne, incluant la gestion documentaire, le rappel de posologie et l'indexation de calendrier (Lancement France 2030),Génération d’un fichier OMS (Organisation Mondiale de la Santé) pour recevoir les meilleurs soins adaptés à son propre historique médical. Multilingue FR, UK, DE…( les 20 langues les plus utilisées dans le monde).

📐 3. CHARTE DE VÉRITÉ (RÈGLES DE CODAGE & MÉTIER)
A. Branding & Logotypage

Structure : LOCATE (#FF6600) HOME (#FFFFFF).

Signature : Bandeau oblique orange sous le "E" de HOME avec texte "by Systems".

Tiers : Badges Néon FREE (15 outils max) | PREMIUM | PRO.

B. Adaptabilité Liquide (Scaling)

Interdiction du Pixel (px) : Unités obligatoires = rem (typographie), vh/vw et % (structure). 100dvh et safe-area-inset gérés pour iOS.

Netteté : Utilisation exclusive d'images vectorielles ou PNG HD (optimisation multi-écrans).

C. Intelligence Métier (Bible V1.5)
Application stricte du Protocole d’Analyse Visuelle Pyramidale (PAVP V5.0) par l'IA :

Étape 4 (Juge de paix) : Nomenclatures OCR (ex: DDF, DTD, suffixes J/Coffret).

Étape 3 : Sous-systèmes (Bagues Flexiclick, Pod 12V vs Rails 18V).

Étape 2 : Morphologie (Mandrins, sabots).

Étape 1 : Signatures Marques (Bleu/Cyan Makita, Rouge Bloc Milwaukee, Bleu Foncé Bosch Pro, Jaune/Noir DeWalt).

⚖️ 4. JURIDIQUE ET INFRASTRUCTURE WEB (RÉSEAU OVH)
A. Stratégie des Noms de Domaine (12 Domaines Sécurisés)
Le verrouillage des domaines est effectif pour protéger la propriété intellectuelle et anticiper les lancements jusqu'en 2030 :

Locate Systems (Critique - Identité Holding) : locatesystems.com / locatesystems.fr

Locate Home (Immédiat - Bêta en cours) : locatehome.com / locatehome.fr

Locate Kitchen (Stratégique 2030) : locatekitchen.com / locatekitchen.fr

Locate Care (Stratégique 2030) : locatecare.com / locatecare.fr

Locate Asset (Protection Industrielle) : locateasset.com / locateasset.fr

Locate Garage (Protection Mécanique) : locategarage.com / locategarage.fr

B. Architecture "Privacy by Design" (RGPD)

Local-First : L'inventaire est stocké à 100% sur l'appareil de l'utilisateur (IndexedDB). Zéro serveur de base de données.

Consentement IA : Les images scannées sont envoyées de manière éphémère et supprimées immédiatement. L'utilisateur doit obligatoirement valider le consentement IA avant l'activation du flux vidéo.

Responsabilité Humaine : L'IA ne sert que de brouillon. L'opérateur est le seul décisionnaire de l'insertion en base de données via le Sas de Validation (Zéro-Trust).

🟢 ACQUIS TECHNIQUES (TERMINÉ)
Cerveau, Architecture & Métier

[X] Moteur IA & Expertise : Refonte de geminiService.ts. Unification totale sur Gemini 2.0 Flash. Injection stricte de la Bible Métier (expertiseRules.ts) dans le System Prompt. Format JSON verrouillé (score_confiance, nom, marque) pour interdire les hallucinations.

[X] Schéma Data & Types : Interface InventoryItem verrouillée. Fichier types.ts à jour avec localisation (Fourgon/Atelier) et 9 catégories métiers.

[X] Zéro-Trust & Validation (Sas 01 C1) : Interface HUD intermédiaire créée (ValidationSas.tsx). L'IA soumet un brouillon, l'opérateur valide/rejette visuellement. Mapping typographique strict avec InventoryItem (toolName, category, location) garanti sans erreur TypeScript.

[X] Stockage Robuste : Unification totale sur IndexedDB (idb-keyval). Persistance avec système d'onglets pour le filtrage par zone.

[X] Sécurité & Privacy by Design : Implémentation du Consentement IA obligatoire bloquant le flux vidéo (Scanner.tsx). Création de la Politique de Confidentialité intégrée (PrivacyPolicy.tsx) et calcul en temps réel du stockage local Zéro-Serveur dans les paramètres (SettingsPage.tsx). Limites Freemium (15 outils) actives.

Vision & Interface (Scanner & Hub)

[X] Scanner HDR : Mode hybride (Photo HD / Vidéo 10s / Import) calibré (12 frames / 20s). Torche auto et filtrage Zéro-Trust de l'environnement actif.

[X] UI Scanner V11 (HUD) : Interface immersive 100dvh sans pixels. Réticule central, boutons flottants 3D, animation laser CSS perpétuelle, affichage tête haute (Top Bar) et cadre de visée dynamique.

[X] Architecture App V11 : Châssis parent recalibré à 12.5vh. Alignement absolu du Badge Premium et bouton Settings pour libérer le flux central.

[X] Hub Central & Inventaire (M2) : Dashboard interactif (jauge orange). Navigation 3 niveaux (Accueil > Dashboard > Liste > Détail). Redirection post-scan stabilisée. Composants interconnectés.

[X] Mobile & Vocal : Déploiement PWA installable (Service Worker actif). Implémentation vocale via Web Speech API.

🟡 CHANTIERS PRIORITAIRES (À RÉALISER)
Remplacement Graphique (Actifs 3D) : Création des icônes manquantes (icon-assurance.png en 256x256) et remplacement systématique des icônes "lucide-react" / emojis par les PNG 3D du dossier /public.

Moteur de Rangement (Pilote RANGER) : Attribution précise de l'outillage aux contenants physiques (Bacs / Étagères).

Module Assurance : Génération et export PDF des rapports d'assurance depuis le module HOME (réservé Premium/Pro).

Vocal Pro : Recherche "mains libres" bidirectionnelle avancée.

📜 RÈGLES DE SESSION (POUR L'IA)
Code : Étape 1 (Instruction) -> Étape 2 (Validation par "ok") -> Étape 3 (Code complet).

Design : Interdiction de modifier le design sans preuve de bénéfice et validation explicite.

Manifeste : Vérifier MANIFESTE_LOCATEHOME_PROJET.md avant chaque envoi pour éviter les doublons et ne jamais supprimer d'acquis.

Suivi : Synthèse toutes les 10 interactions, changement de fil toutes les 30.