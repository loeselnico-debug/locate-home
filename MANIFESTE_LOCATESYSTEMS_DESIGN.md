# 🟠🔵🟢🔴⚪ MANIFESTE DESIGN | LOCATE SYSTEMS

**Date mise à jours :** *06 Mars 2026*
**Version :** 2.2 (Interface Inventaire & Accent Industriel)
**Statut :** *RÉFÉRENTIEL OFFICIEL (M1 à M6)*

---

## 🎨 1. CHARTE GRAPHIQUE (DESIGN SYSTEM THÉMATIQUE)

L'écosystème repose sur des fondations fixes (le socle M1) et un système de "Couleur Thématique" dynamique qui s'adapte selon le module actif.

### A. Les Constantes (Communes à tous les modules)
| Élément | Code Hexa / Style | Usage & Rendu |
| :--- | :--- | :--- |
| **Fond Hub (Noyau)**| `#050505` | Noir quasi absolu avec grille matricielle CSS. |
| **Fond App (OLED)** | `#121212` | Anthracite profond pour les interfaces internes. |
| **Bordures / Cartes** | `#1E1E1E` | Gris de profondeur pour les cartes et conteneurs. |
| **Texte Secondaire** | `#B0BEC5` | Gris bleuté clair. Lisibilité haute sans éblouissement. |
| **Gris Industriel** | `#D3D3D3` | Premium. Usage : Barres de catégories, plaques d'identité, Bouton Assurance. |

### B. Les Variables (Couleur Thématique par Module)
La "Couleur Thématique" s'applique au Titre principal, aux boutons d'action primaires, aux faisceaux d'énergie du Hub et aux icônes maîtresses.
* 🟠 **[HOME - M2] :** `#FF6600` (Orange Industriel)
* 🔵 **[ASSET - M3] :** `#007BFF` (Bleu Rigueur/Standard)
* 🟢 **[KITCHEN - M4] :** `#28A745` (Vert Hygiène/HACCP)
* 🔴 **[GARAGE - M5] :** `#DC3545` (Rouge Mécanique/Alerte)
* ⚪ **[CARE - M6] :** `#E0E0E0` (Blanc Argenté/Médical)

---

## 🏷️ 2. BRANDING & LOGOTYPAGE

### A. Le Logo Principal
* **Structure :** **LOCATE** (en *Couleur Thématique*) **[NOM DU MODULE]** (en `#FFFFFF`).
* **Signature "by Systems" :** Incrustation sous forme de bandeau oblique touchant la base de la dernière lettre, avec un dégradé métallique doré.

### B. Indicateur de Tiers (Badges)
* **Emplacement :** Header (en haut à gauche).
* **Style :** Bouton à effet **Néon** avec dégradé (Jaune vers Orange). Invariable sur tous les modules.
* **Étiquettes :** `FREE` (15 outils) | `PREMIUM` | `PRO`.

---

## 📐 3. RÈGLES D'ADAPTABILITÉ ET PERFORMANCES (SCALING)

Pour garantir un affichage parfait et fluide sur tous les terminaux de terrain :
* **Design Liquide :** Interdiction stricte du Pixel fixe (`px`). Utilisation exclusive de `rem`, `vh/vw` et `%`.
* **Actifs 3D (Règle Stricte) :** Tous les exports PNG (icônes catégories, boutons) doivent impérativement être générés en **256x256 pixels** avec fond transparent pour préserver la RAM du terminal.
* **Rendu CSS Actif :** Remplacement des images de fond lourdes par du code CSS pur (dégradés, halos lumineux, `text-stroke` pour les contours) pour garantir une netteté absolue.
* **Zones de Sécurité (Safe Areas) :** Marges dynamiques obligatoires pour éviter les encoches (notches) et les barres de navigation natives du système.

---

## 📱 4. ARCHITECTURE DE L'INTERFACE (LAYOUT)

### 🔝 LE HUB (LOCATE CORE) - ÉCRAN D'ACCUEIL
1. **Grille Supérieure :** Alignement horizontal des 5 terminaux métiers.
2. **Faisceaux d'énergie :** Lignes de lumière générées en CSS descendant de chaque module vers le centre.
3. **Processeur Central :** Noyau UI avec halos lumineux superposés (Bleu/Orange) et typographie "SYSTEMS" très espacée (`tracking-widest`).

### 🎛️ LES ÉCRANS INTERNES (STANDARDS INTER-MODULES)
1. **Le Header Standard :** Badge de statut à gauche, Logo au centre, Paramètres (Roue dentée `gear.png`) à droite. Séparation par un trait gris (`white/10`).
2. **Cockpit IA (Scanner) :** Vue caméra plein écran, zone de focus délimitée visuellement, bouton de capture central et large.
3. **Interface Retrouver :** Barre de recherche, filtres spatiaux en pilules, et bouton micro centralisé pour l'assistance vocale.

### 📋 LE FLUX INVENTAIRE (01A)
1. **En-tête Spécifique :** Bouton Assurance à gauche (`#D3D3D3`), Bouton Retour 3D à droite (`icon-return.png`).
2. **Dashboard Catégories (01A) :** Barres gris industriel (`#D3D3D3`) avec numérotation thématique (`#FF6600`) et fort contour noir (`-webkit-text-stroke: 1.5px #121212`).
3. **Liste Outils (01A1) - "Accent Industriel" :** Cartes à fond `#1E1E1E` dotées d'une bordure latérale gauche épaisse thématique (ex: `border-l-4 border-[#FF6600]`). Pastilles de statuts dynamiques (Vert/Rouge).
4. **Fiche Outil (01A-Detail) :** Plaque d'identité `#D3D3D3` couplée à un bloc de Spécifications Techniques `#1E1E1E` (intégrant le Numéro de Série) pour faciliter l'audit et les déclarations d'assurance.

---

## 🚀 5. SPÉCIFICATIONS HUD AVANCÉES (EX: MODULE M5 - GARAGE)

Certains modules nécessitent des interfaces tactiques spécifiques, basées sur l'identité visuelle **"Rugged Industrial Interface"** (Cockpit V20).

### A. Codes Couleurs Métiers (Variables M5)
* **MÉCANIQUE (Garage) :** Accent `#DC2626` (Rouge Alerte) | Énergie `#FF6600`.
* **MAINTENANCE (Industry) :** Accent `#00E5FF` (Cyan) | Sécurité `#FFB300` (Ambre).

### B. Composants HUD (Overlays)
* **Glassmorphism :** Fond Noir à 80% / Flou (Blur) 12px / Bordure 1px Blanche à 10% d'opacité.
* **Typographie Data :** Police Monospace (JetBrains Mono / Roboto Mono) exigée pour les retours de données techniques.
* **Bouton Maître :** PTT (Push-To-Talk) circulaire et large, placé dans la "Thumb-Zone" (zone du pouce).

### C. Répercussions UI de la Logique Freemium (M5)
L'interface doit visuellement refléter le bridage selon l'abonnement :
* **Session Live :** Compteur visuel (120s max pour le Tier FREE).
* **Cooldown :** Affichage progressif du délai (5min > 20min > 60min > 24h) sur l'interface de scan.
* **Verrouillage :** Bouton d'export PDF grisé ou affublé d'une icône de cadenas (Locked) pour les comptes non éligibles.


🧭 ⚛️ 🇫🇷 MANIFESTE MAÎTRE LOCATE SYSTEMS (M1) | SOURCE DE VÉRITÉ V4.1
Date mise à jour : 15 Mars 2026
Statut : RÉFÉRENTIEL MAÎTRE - ARCHITECTURE MONOREPO UNIFIÉE 🟢 Vision : "L'homme ne parle pas à l'IA pour l'écouter, mais pour qu'elle devienne le prolongement de son expertise terrain."

📂 1. ORGANIGRAMME TECHNIQUE (STRUCTURE M5 DÉTAILLÉE)
📦 LOCATE-SYSTEMS
└── 📂 src/modules/garage/
├── 📂 components/
│   ├── 📄 LiveAssistant.tsx   # HUD immersif (z-200), cockpit de réalité augmentée.
│   ├── 📄 PassportScanner.tsx  # Capture IA OCR des habilitations (BR, BC, CACES).
│   └── 📄 GaragePdfButton.tsx  # Générateur de rapports certifiés (AFNOR/OBD2).
└── 📂 views/
├── 📄 GarageDashboard.tsx  # Aiguilleur métier scindé (Maintenance / Mécanique).
├── 📄 TechProfile.tsx      # Vestiaire numérique (Identité & Habilitations).
├── 📄 PreparationChantier.tsx # Analyse prédictive des risques & outillage.
└── 📄 TourDeControle.tsx    # Supervision Realtime via Supabase WebSockets.

🎨 2. DESIGN TACTIQUE DU MODULE GARAGE (M5)
Le design du module Garage répond aux contraintes des environnements sévères (basse luminosité, port de gants, besoin d'immersion totale).

⚙️ 2.1 Maintenance Industrielle (M5-INDUS)
Code Couleur : Cyan Électrique (#00E5FF).

Ambiance Visuelle : Interface "High-Tech Lab". Fond noir pur pour maximiser le contraste.

Composants Spécifiques :

Préparation de Chantier : Cartes de risques en dégradés de rouge/orange.

Assistant IA : Mode "Audit" avec pilules de consignation clignotantes en Cyan tant qu'elles ne sont pas validées.

Phasage : Transition visuelle nette (Flash blanc) lors du passage de l'Audit au Diagnostic.

🚛 2.2 Mécanique Auto & P.L. (M5-MECA)
Code Couleur : Rouge Compétition (#DC2626).

Ambiance Visuelle : Interface "Dashboard Performance". Utilisation de typographies mono-espacées pour les codes erreurs.

Composants Spécifiques :

Module FOD : Grille de comparaison "Matin/Soir" côte à côte avec surlignage des anomalies en rouge néon.

Assistant IA : Intégration de jauges de pression et de couples de serrage en superposition vidéo.

Quick Tags : Boutons tactiles géants pour une saisie rapide sans retirer les gants.

👁️ 3. L'INTERFACE IMMERSIVE (HUD Z-200)
La force du design M5 réside dans son HUD (Heads-Up Display) filigrane appliqué au LiveAssistant.

Immersion Totale : Utilisation d'un z-index: 200 pour recouvrir le Logo et la navigation globale. La caméra devient le fond d'écran de l'application.

Bandeau Filigrane (Top Bar) :

Ligne 1 (Identité) : Rappel permanent du nom du technicien et de ses habilitations scannées (Badges verts/rouges).

Ligne 2 (Sécurité) : Checklist horizontale de "Pilules" (LOTO, VAT, Chandelles). Une pilule validée devient luminescente.

Console de Commande (Bottom Bar) :

Bouton PTT (Push-To-Talk) central, format 3D Orange, réagissant dynamiquement au volume de la voix.

Bouton Vision Bionique pour activer/désactiver le flux HDR de Gemini.

⚡ 4. LOGIQUE MÉTIER IA (INTÉGRATION V29)
A. Le Veto IA (Habilitations)
Le design ne se contente pas d'afficher, il protège. Si l'IA identifie une source de tension électrique et que le TechProfile ne comporte pas l'habilitation BR, le HUD affiche une alerte critique plein écran et bloque le tunnel de diagnostic.

B. Analyse Métallurgique HDR
Le moteur de rendu visuel traite les nuances de couleurs de l'acier (Zones 1 à 5). En cas de détection d'une Zone 4 (Bleu), l'interface mécanique force l'affichage de l'instruction : "Remplacement obligatoire : Acier détrempé".

⚖️ 5. JURIDIQUE, INFRASTRUCTURE & BUSINESS (ACQUIS V4)
Identité Légale : Nicolas Loesel EI - Locate Systems. SIRET en cours.

Privacy by Design : Stockage local IndexedDB. Buffer vidéo détruit après chaque session "Live".

Modèle de Tiers :

FREE : 15 outils, sessions 120s, cooldown progressif.

PREMIUM/PRO : Inventaire illimité, PDF certifiés (AFNOR/Assurances), Tour de contrôle Temps Réel.

🟢 6. ACQUIS TECHNIQUES (TERMINÉ SESSION V29)
[X] Segmentation Symétrique : Sous-menus Maintenance (Cyan) et Mécanique (Rouge) indépendants.

[X] TechProfile & OCR : Lecture automatique des habilitations via PassportScanner.

[X] HUD Filigrane : Intégration du bandeau de sécurité z-200 dans le Live Assistant.

[X] Préparation de Chantier : Génération IA de plans de prévention croisés avec l'inventaire local.

[X] Realtime Supabase : Remontée des alertes de fin de poste vers la Tour de Contrôle via WebSockets.

Fin du Manifeste Maître V4.1. Ce document fait foi pour tout futur développement des interfaces M5.