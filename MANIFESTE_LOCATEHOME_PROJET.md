# 🧭 ⚛️ 🇫🇷 LOCATE SYSTEMS | SOURCE DE VÉRITÉ V3.1

**Statut :** RÉFÉRENTIEL MAÎTRE - ARCHITECTURE MONOREPO UNIFIÉE 🟢  
**Vision :** "L'homme ne parle pas à l'IA pour l'écouter, mais pour qu'elle devienne le prolongement de son expertise terrain."

---

## 📂 1. ORGANIGRAMME TECHNIQUE (STRUCTURE VSCODE)

```text
LOCATE-SYSTEMS/
├── src/
│   ├── core/                 # 🛡️ M1 : TRONC COMMUN (Le Socle)
│   │   ├── services/         # Gemini 2.0 Flash (v1beta) - API Stable
│   │   ├── components/       # Scanner HDR, Flash, Importation, Laser
│   │   └── theme/            # Grille matricielle, Faisceaux, CSS Néon
│   ├── modules/
│   │   ├── home/             # 🏠 M2 : [HOME] (Identité : Indigo/Blanc)
│   │   ├── asset/            # 📦 M3 : [ASSET] (Identité : Orange Néon)
│   │   ├── kitchen/          # 🍳 M4 : [KITCHEN] (Identité : Vert Émeraude)
│   │   ├── garage/           # 🔧 M5 : [GARAGE] (Identité : Gris/Bleu Chrome)
│   │   └── care/             # 🩺 M6 : [CARE] (Identité : Rouge/Blanc)
│   ├── types/                # Interfaces TypeScript universelles
│   └── assets/               # Bibliothèque SVG & Icônes 3D par module

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

Moteur IA : Tunnel Gemini 2.0 Flash opérationnel (sans erreur 404/429).

Schéma Data : Interface InventoryItem verrouillée comme référence unique.

Types : src/types.ts à jour (inclusion de la localisation et des 9 catégories métiers).

Sécurité (Hardening) : Blindage des appels data.candidates et extraction JSON robuste.

Limites : Vérification Freemium (15 outils) active dans addTool.

Nettoyage : Sémantique "LOCATEHOME" généralisée ; fonction deleteTool intégrée.

Vision & Scan

Scanner HDR : Mode hybride fonctionnel (Photo HD / Vidéo Burst / Importation).

Étalonnage : Mode Burst calibré (12 frames / 20s).

Flux Live : Intégration getUserMedia avec cadre de visée et filtre industriel HDR.

Laser : Balayage dynamique synchronisé avec l'analyse.

Zéro-Trust : Filtrage d'environnement actif pour focus exclusif sur l'objet.

Interface & UX

Hub Central : Dashboard dynamique interactive, CSS ultra-léger.

Vocal : Implémentation via Web Speech API dans le module "Retrouver".

Dashboard : Connexion au memoryService avec jauge orange dynamique.

Cohérence : Synchronisation /tiers.ts avec App.tsx et affichage des labels de catégories.

🟡 EN COURS / À RÉALISER (PENDING)
Infrastructure & Sécurité

[ ] Clé API : Mise en service de la nouvelle clé (suite à la suppression de l'ancienne).

[ ] Mode Hors-ligne : Support PWA complet et stockage local des images (LocalStorage/IndexDB).

[ ] Persistance V2 : Système d'onglets pour le filtrage par zone (Fourgon/Atelier).

Interface & Actifs

[ ] Design Actifs : Remplacement des icônes "lucide-react" et des emojis par les PNG 3D du dossier /public.

[ ] Optimisation /tiers.ts : Affiner et compléter la structure.

[X] Mode Basse Lumière : Activation physique de la torche via l'interface de scan.

Intelligence Métier

[ ] Localisation de Vérité : Injecter la liste des zones réelles (Fourgon, Établi) pour éviter les inventions de l'IA.

[ ] Rangement : Attribution précise aux Bacs / Étagères (Pilote RANGER).

[ ] Service [ASSET] : Développement du moteur de recherche OCR vers l'API Prolians.

Business & Déploiement

[ ] Vocal Pro : Recherche "mains libres" bidirectionnelle.

[ ] Monétisation : Transformation des QR Codes physiques en points d'accès techniques.




