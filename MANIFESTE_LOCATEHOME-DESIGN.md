# 🦅 MANIFESTE DESIGN | LOCATE SYSTEMS
**Version :** 2.2 (Interface Inventaire & Accent Industriel - 24 Février 2026)  
**Statut :** RÉFÉRENTIEL OFFICIEL  
**Philosophie :** "Le Google Search de la maintenance" – Mémoire augmentée & Indexation spatiale.

---

## 🎨 1. CHARTE GRAPHIQUE (DESIGN SYSTEM THÉMATIQUE)

L'écosystème repose sur des fondations fixes et un système de "Couleur Thématique" dynamique selon le module actif.

### A. Les Constantes (Communes à tous les modules)
| Élément | Code Hexa / Style | Usage & Rendu |
| :--- | :--- | :--- |
| **Fond Hub (Noyau)**| `#050505` | Noir quasi absolu avec grille matricielle CSS. |
| **Fond App (OLED)** | `#121212` | Anthracite profond pour les interfaces internes. |
| **Bordures / Cartes** | `#1E1E1E` | Gris de profondeur pour les cartes et conteneurs. |
| **Texte Secondaire** | `#B0BEC5` | Gris bleuté clair. Lisibilité haute sans éblouissement. |
| **Gris Industriel** | `#D3D3D3` | Premium. Usage : Barres de catégories, plaques d'identité, Bouton Assurance. |

### B. Les Variables (Couleur Thématique par Module)
La "Couleur Thématique" s'applique au Titre, aux boutons d'action primaires, aux faisceaux d'énergie du Hub et aux icônes principales.
* 🟠 **[HOME] :** `#FF6600` (Orange Industriel)
* 🔵 **[ASSET] :** `#007BFF` (Bleu Rigueur/Standard)
* 🟢 **[KITCHEN] :** `#28A745` (Vert Hygiène/HACCP)
* 🔴 **[GARAGE] :** `#DC3545` (Rouge Mécanique/Alerte)
* ⚪ **[CARE] :** `#E0E0E0` (Blanc Argenté/Médical)

---

## 🏷️ 2. BRANDING & LOGOTYPAGE

### A. Le Logo Principal
* **Structure :** **LOCATE** (en *Couleur Thématique*) **[NOM DU MODULE]** (en `#FFFFFF`).
* **Signature "by Systems" :** Incrustation sous forme de bandeau oblique touchant la base de la dernière lettre, avec dégradé métallique doré.

### B. Indicateur de Tiers (Badges)
* **Emplacement :** Header (haut à gauche).
* **Style :** Bouton à effet **Néon** avec dégradé (Jaune vers Orange). Invariable sur tous les modules.
* **Étiquettes :** `FREE` (15 outils) | `PREMIUM` | `PRO`.

---

## 📐 3. RÈGLES D'ADAPTABILITÉ ET PERFORMANCES (SCALING)

Pour garantir un affichage parfait sur tous les terminaux de terrain :
* **Design Liquide :** Interdiction du Pixel fixe (px). Utilisation exclusive de `rem`, `vh/vw` et `%`.
* **Actifs 3D (Règle Stricte) :** Tous les exports PNG (icônes catégories, boutons) doivent impérativement être générés en **256x256 pixels** avec fond transparent pour préserver la RAM du terminal.
* **Rendu CSS Actif :** Remplacement des images de fond lourdes par du code CSS pur (dégradés, halos lumineux, text-stroke pour les contours) pour garantir la netteté.
* **Zones de Sécurité (Safe Areas) :** Marges dynamiques pour éviter les encoches (notches) et barres de navigation.

---

## 📱 4. ARCHITECTURE DE L'INTERFACE (LAYOUT)

### 🔝 LE HUB (LOCATE CORE) - ÉCRAN D'ACCUEIL
1. **Grille Supérieure :** Alignement horizontal des 5 terminaux métiers.
2. **Faisceaux d'énergie :** Lignes de lumière CSS descendant de chaque module vers le centre.
3. **Processeur Central :** Noyau UI avec halos lumineux superposés (Bleu/Orange) et typographie "SYSTEMS" espacée (`tracking-widest`).

### 🎛️ LES ÉCRANS INTERNES (IDENTIQUES POUR CHAQUE MODULE)
1. **Le Header Standard :** Badge de statut à gauche, Logo au centre, Paramètres (Roue dentée `gear.png`) à droite. Séparation par un trait gris (`white/10`).
2. **Cockpit IA (Scanner) :** Vue caméra plein écran, zone de focus délimitée, bouton de capture central large.
3. **Interface Retrouver :** Barre de recherche, filtres spatiaux et bouton micro d'assistance vocale.

### 📋 LE FLUX INVENTAIRE (01A)
1. **En-tête Spécifique :** Bouton Assurance à gauche (`#D3D3D3`), Bouton Retour 3D à droite (`icon-return.png`).
2. **Dashboard Catégories (01A) :** Barres `#D3D3D3` avec numérotation `#FF6600` et fort contour noir (`-webkit-text-stroke: 1.5px #121212`).
3. **Liste Outils (01A1) - "Accent Industriel" :** Cartes à fond `#1E1E1E` dotées d'une bordure latérale gauche épaisse orange (`border-l-4 border-[#FF6600]`). Pastilles de statuts dynamiques (Vert/Rouge).
4. **Fiche Outil (01A-Detail) :** Plaque d'identité `#D3D3D3` couplée à un bloc de Spécifications Techniques `#1E1E1E` (intégrant le Numéro de Série) pour l'audit et l'assurance.

🚀 MODULE M5 - COCKPIT TACTIQUE (V20)
Identité Visuelle : "Rugged Industrial Interface"

1. CODES COULEURS MÉTIERS
   - MÉCANIQUE (Garage) : Accent #DC2626 (Rouge Alerte) | Énergie #FF6600
   - MAINTENANCE (Industry) : Accent #00E5FF (Cyan) | Sécurité #FFB300 (Ambre)

2. COMPOSANTS HUD (Overlays)
   - Glassmorphism : Black 80% / Blur 12px / Border 1px white 10%
   - Typographie : Monospace (JetBrains Mono / Roboto Mono) pour la data
   - Bouton Maître : PTT (Push-To-Talk) Circulaire, Large (Thumb-Zone)

3. LOGIQUE FREEMIUM (Bridage M5)
   - Session Live : 120s max (Tier FREE)
   - Cooldown : Progressif (5min > 20min > 60min > 24h)
   - Verrouillage : PDF Export (Locked)