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