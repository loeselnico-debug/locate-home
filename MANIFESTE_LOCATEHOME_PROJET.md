# 🧭 ⚛️ 🇫🇷 LOCATE SYSTEMS | SOURCE DE VÉRITÉ V3.1
24 Février 2026
**Statut :** RÉFÉRENTIEL MAÎTRE - ARCHITECTURE MONOREPO UNIFIÉE 🟢  
**Vision :** "L'homme ne parle pas à l'IA pour l'écouter, mais pour qu'elle devienne le prolongement de son expertise terrain."

---

## 📂 1. ORGANIGRAMME TECHNIQUE (STRUCTURE EXACTE DU REPOSITORY)

📦 LOCATE-SYSTEMS
├── 📂 public/                 # Actifs Visuels (Icônes 3D, manifest.json)
├── 📂 src/                    # MOTEUR DE L'APPLICATION
│   ├── 📂 core/               # M1 : TRONC COMMUN (Le Socle)
│   │   ├── 📁 ai/             # decisionEngine.ts, expertiseRules.ts, geminiService.ts
│   │   ├── 📁 camera/         # Scanner.tsx
│   │   ├── 📁 security/       # safetyService.ts, tiers.ts, useUserTier.ts
│   │   ├── 📁 storage/        # imageService.ts, memoryService.ts
│   │   ├── 📁 ui/             # Hub.tsx, LocationBar.tsx, Logo.tsx, ResultModal.tsx, SafetyBadge.tsx
│   │   └── 📄 index.ts
│   ├── 📂 modules/            # LES 5 VERTICALES MÉTIERS
│   │   ├── 📁 asset/          # M3 : L'Industrie (Spécifications Grands Comptes)
│   │   ├── 📁 care/           # M6 : La Santé
│   │   ├── 📁 garage/         # M5 : La Maintenance
│   │   ├── 📂 home/           # M2 : Le Hub / Inventaire (Orange Néon)
│   │   │   ├── 📁 components/ # HomeMenu.tsx, InventoryCard.tsx, Library.tsx, Search.tsx, ToolDetail.tsx
│   │   │   └── 📁 views/      # Dashboard.tsx, SettingsPage.tsx
│   │   └── 📁 kitchen/        # M4 : Les Flux (HACCP)
│   ├── 📂 styles/             # App.css, index.css
│   ├── 📂 types/              # index.ts (Source de Vérité Data)
│   ├── 📄 App.tsx             # Chef d'orchestre
│   └── 📄 main.tsx
├── 📄 MANIFESTE_LOCATEHOME_PROJET.md
├── 📄 MANIFESTE_LOCATEHOME-DESIGN.md
└── ⚙️ [Fichiers de Config]    # .env, vite.config.ts, tailwind.config.js, package.json...

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

📐 3. CHARTE DE VÉRITÉ (RÈGLES DE CODAGE)

A. Branding & Logotypage
Structure : LOCATE (#FF6600) HOME (#FFFFFF).
Signature : Bandeau oblique orange sous le "E" de HOME avec texte "by Systems" en dégradé métallique doré.
Tiers : Badges Néon FREE | PREMIUM | PRO (Dégradé Jaune vers Orange).

B. Adaptabilité Liquide (Scaling)
Interdiction du Pixel (px) : Strictement banni pour les dimensions et conteneurs.
Unités : rem (typographie), vh/vw et % (structure).
Netteté : Utilisation exclusive du SVG pour les icônes et logos (Optimisation J5 vers iPhone 17).

🟢 ACQUIS TECHNIQUES (TERMINÉ)
Cerveau & Architecture
[ X] Moteur IA : Tunnel Gemini 2.0 Flash opérationnel (sans erreur 404/429).
[ X] Schéma Data : Interface InventoryItem verrouillée comme référence unique.
[ X] Types : src/types.ts à jour (inclusion de la localisation et des 9 catégories métiers).
[ X] Sécurité (Hardening) : Blindage des appels data.candidates et extraction JSON robuste.
[ X] Limites : Vérification Freemium (15 outils) active dans addTool.
[ X] Nettoyage : Sémantique "LOCATEHOME" généralisée ; fonction deleteTool intégrée.
[ X] Architecture Monorepo Modulaire : Séparation stricte Core / Modules / Types.
[ X] Agnosticisme du Core : L'IA lit dynamiquement la source de vérité.
[ X] Moteur IA : Tunnel Gemini 2.0 Flash opérationnel.
[ X] Schéma Data : Interface InventoryItem verrouillée.
[ X] Sécurité : Verrou Freemium actif dans addTool.
[ X] Tunnel Gemini 2.0 Flash opérationnel. Interface InventoryItem verrouillée. Sécurité Freemium active.
* Vision & Scan : Mode hybride (Photo/Vidéo/Import) calibré. Flux Live getUserMedia.
* Navigation Inventaire (M2) : 
  * Arborescence 3 niveaux validée : Accueil (01) > Dashboard (01A) > Liste Outils (01A1) > Fiche Produit (01A-Detail).
  * Composants `Dashboard.tsx`, `Library.tsx` et `ToolDetail.tsx` intégrés et interconnectés.
* Interface : Dashboard dynamique, CSS ultra-léger, déploiement PWA mobile sécurisé avec Safe-Areas Apple.
Vision & Scan
[ X] Scanner HDR : Mode hybride fonctionnel (Photo HD / Vidéo Burst / Importation).
[ X] Étalonnage : Mode Burst calibré (12 frames / 20s).
[ X] Flux Live : Intégration getUserMedia avec cadre de visée et filtre industriel HDR.
[ X] Laser : Balayage dynamique synchronisé avec l'analyse.
[ X] Zéro-Trust : Filtrage d'environnement actif pour focus exclusif sur l'objet.
[ X] Scanner HDR : Mode hybride (Photo/Vidéo/Import) avec interface adaptative (vw).
[ X] Étalonnage : Mode Burst calibré (12 frames / 20s).
Mode hybride (Photo/Vidéo/Import) calibré. Flux Live getUserMedia. 

Interface & UX
[ X] Hub Central : Dashboard dynamique interactive, CSS ultra-léger.
[ X] Vocal : Implémentation via Web Speech API dans le module "Retrouver".
[ X] Dashboard : Connexion au memoryService avec jauge orange dynamique.
[ X] Cohérence : Synchronisation /tiers.ts avec App.tsx et affichage des labels de catégories.
[ X] Déploiement Mobile PWA : Manifeste, Service Worker, installable sur Android/iOS.
[ X] Blindage Apple : Variables safe-area-inset et 100dvh actives.
[ X] Hub Central : Dashboard dynamique, CSS ultra-léger.

🟡 EN COURS / À RÉALISER (PENDING)
Infrastructure & Sécurité
[ ] Clé API : Mise en service de la nouvelle clé (suite à la suppression de l'ancienne).
[ ] Mode Hors-ligne : Support PWA complet et stockage local des images (LocalStorage/IndexDB).
[ ] Persistance V2 : Système d'onglets pour le filtrage par zone (Fourgon/Atelier).

Interface & Actifs
[ ] Design Actifs : Remplacement des icônes "lucide-react" et des emojis par les PNG 3D du dossier /public.
[ ] Optimisation /tiers.ts : Affiner et compléter la structure.
[ ] Mode Basse Lumière : Activation physique de la torche via l'interface de scan.

Intelligence Métier
[ ] Localisation de Vérité : Injecter la liste des zones réelles (Fourgon, Établi) pour éviter les inventions de l'IA.
[ ] Rangement : Attribution précise aux Bacs / Étagères (Pilote RANGER).
[ ] Service [ASSET] : Développement du moteur de recherche OCR vers l'API Prolians.

Business & Déploiement
[ ] Vocal Pro : Recherche "mains libres" bidirectionnelle.
[ ] Monétisation : Transformation des QR Codes physiques en points d'accès techniques.

🟡 EN COURS / À RÉALISER (PENDING)
* Infrastructure : Mode Hors-ligne PWA complet (LocalStorage/IndexDB).
* Actifs : Création des icônes `icon-assurance.png` et `gear.png` (256x256).
* Moteur Rangement : Attribution précise aux Bacs / Étagères.
* Business : Export PDF des rapports d'assurance depuis le module HOME
