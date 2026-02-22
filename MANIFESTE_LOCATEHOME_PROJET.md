# 🧭 ⚛️ 🇫🇷 LOCATE SYSTEMS | SOURCE DE VÉRITÉ V3.1

**Statut :** RÉFÉRENTIEL MAÎTRE - ARCHITECTURE MONOREPO UNIFIÉE 🟢  
**Vision :** "L'homme ne parle pas à l'IA pour l'écouter, mais pour qu'elle devienne le prolongement de son expertise terrain."

---

## 📂 1. ORGANIGRAMME TECHNIQUE (STRUCTURE VSCODE)

```text
📦 LOCATE-SYSTEMS (Racine du projet)
├── 📂 public/                  # 🖼️ Actifs Visuels Bruts
│   ├── 📁 icons-3d/            # PNG 3D de haute qualité (remplace lucide-react)
│   └── 🌐 manifest.json        # Configuration PWA (Mode hors-ligne)
│
├── 📂 src/                     # ⚙️ MOTEUR DE L'APPLICATION
│   │
│   ├── 📂 core/                # 🛡️ M1 : TRONC COMMUN (Le Socle)
│   │   ├── 📁 ai/              # Cerveau : geminiService.ts, expertiseRules.ts (Bible V1.4)
│   │   ├── 📁 camera/          # Vision : ScannerHDR.tsx, Laser.tsx, flux vidéo
│   │   ├── 📁 ui/              # Carrosserie : Boutons universels, Badges Néon, Grilles
│   │   └── 📁 security/        # Contrôles : useUserTier.ts (Verrou Freemium/Pro)
│   │
│   ├── 📂 types/               # 📜 SOURCE DE VÉRITÉ (Data & Interfaces)
│   │   ├── 📄 index.ts         # Exporte toutes les interfaces universelles
│   │   ├── 📄 inventory.ts     # Les 9 univers (dont EPI), interface InventoryItem
│   │   └── 📄 spatial.ts       # Les zones réelles (Garage, Atelier, Maison...)
│   │
│   ├── 📂 modules/             # 🏭 LES 5 VERTICALES MÉTIERS (Cloisonnées)
│   │   │
│   │   ├── 🏠 home/            # M2 : [HOME] (Identité : Orange Néon / Blanc)
│   │   │   ├── 📁 views/       # Écrans principaux (Dashboard, Search vocal)
│   │   │   └── 📁 components/  # Pièces spécifiques (Library.tsx, Ranger.tsx)
│   │   │
│   │   ├── 📦 asset/           # M3 : [ASSET] (Identité : Bleu Néon / Blanc)
│   │   │   └── 📄 OcrEngine.ts # Extracteur de SKU 6 chiffres et XHANDER
│   │   │
│   │   ├── 🍳 kitchen/         # M4 : [KITCHEN] (Identité : Vert Émeraude Néon / Blanc)
│   │   │
│   │   ├── 🔧 garage/          # M5 : [GARAGE] (Identité : Rouge Néon / Blanc)
│   │   │
│   │   └── 🩺 care/            # M6 : [CARE] (Identité : Blanc / Gris clair)
│   │
│   ├── 📂 styles/              # 🎨 DESIGN LIQUIDE (Zéro Pixel)
│   │   └── 📄 global.css       # Tailwind, classes personnalisées, adaptation J5->iPhone 17
│   │
│   └── 📄 App.tsx              # 🧭 CHEF D'ORCHESTRE (Aiguilleur vers les modules)


🛠️ 2. LES 6 PILIERS DU SYSTÈME

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

Vision & Scan
[ X] Scanner HDR : Mode hybride fonctionnel (Photo HD / Vidéo Burst / Importation).
[ X] Étalonnage : Mode Burst calibré (12 frames / 20s).
[ X] Flux Live : Intégration getUserMedia avec cadre de visée et filtre industriel HDR.
[ X] Laser : Balayage dynamique synchronisé avec l'analyse.
[ X] Zéro-Trust : Filtrage d'environnement actif pour focus exclusif sur l'objet.

Interface & UX
[ X] Hub Central : Dashboard dynamique interactive, CSS ultra-léger.
[ X] Vocal : Implémentation via Web Speech API dans le module "Retrouver".
[ X] Dashboard : Connexion au memoryService avec jauge orange dynamique.
[ X] Cohérence : Synchronisation /tiers.ts avec App.tsx et affichage des labels de catégories.

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


