# 🦅 MANIFESTE DESIGN | LOCATE SYSTEMS
**Version :** 2.1 (Interface Core & Faisceaux Lumineux - 19 Février 2026)  
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

## 📐 3. RÈGLES D'ADAPTABILITÉ (SCALING)

Pour garantir un affichage parfait sur tous les terminaux de terrain :
* **Design Liquide :** Interdiction du Pixel fixe (px). Utilisation exclusive de `rem`, `vh/vw` et `%`.
* **Rendu CSS Actif :** Remplacement des images de fond lourdes par du code CSS pur (dégradés, halos lumineux, flous) pour garantir la netteté et soulager le processeur de l'appareil.
* **Zones de Sécurité (Safe Areas) :** Marges dynamiques pour éviter les encoches (notches) et barres de navigation.

---

## 📱 4. ARCHITECTURE DE L'INTERFACE (LAYOUT)

### 🔝 LE HUB (LOCATE CORE) - ÉCRAN D'ACCUEIL
1. **Grille Supérieure :** Alignement horizontal des 5 terminaux métiers.
2. **Faisceaux d'énergie :** Lignes de lumière CSS (Gradient to transparent) descendant de chaque module vers le centre.
3. **Processeur Central :** Noyau UI avec halos lumineux superposés (Bleu/Orange) en arrière-plan et typographie "SYSTEMS" espacée (`tracking-widest`).
4. **Citation Base :** "L'homme ne parle pas à l'IA pour l'écouter, mais pour qu'elle devienne le prolongement de son expertise terrain."

### 🎛️ LES ÉCRANS INTERNES (IDENTIQUES POUR CHAQUE MODULE)
1. **Le Header :** Badge de statut à gauche, Logo au centre, Paramètres (Roue dentée) à droite. Séparation par un trait gris (`white/10`).
2. **Menu Module :** Grille des fonctionnalités principales (Ranger, Retrouver...).
3. **Cockpit IA (Scanner) :** Vue caméra plein écran, zone de focus délimitée, bouton de capture central large.
4. **Interface Retrouver :** Barre de recherche, filtres spatiaux et bouton micro d'assistance vocale.