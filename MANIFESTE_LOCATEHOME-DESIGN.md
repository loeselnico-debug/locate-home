# 🦅 MANIFESTE DESIGN | LOCATEHOME
**Version :** 1.0 (Révision Industrielle - 17 Février 2026)  
**Statut :** RÉFÉRENTIEL OFFICIEL  
**Philosophie :** "Le Google Search de la maintenance" – Mémoire augmentée & Indexation spatiale.

---

## 🎨 1. CHARTE GRAPHIQUE (PALETTE PRO)

| Élément | Code Hexa | Usage & Rendu |
| :--- | :--- | :--- |
| **Fond (OLED)** | `#121212` | Anthracite profond. Économie batterie & confort nocturne. |
| **Accent Action** | `#FF6600` | Orange Industriel. Signalétique, boutons primaires et Laser. |
| **Accent Nav** | `#007BFF` | Bleu Standard. Boutons de retour et navigation système. |
| **Bordures / Gris** | `#1E1E1E` | Gris de profondeur pour les cartes et conteneurs. |
| **Texte / Icônes** | `#B0BEC5` | Gris bleuté clair. Lisibilité haute sans éblouissement. |

---

## 🏷️ 2. BRANDING & LOGOTYPAGE

### A. Le Logo Principal
* **Structure :** **LOCATE** (en `#FF6600`) **HOME** (en `#FFFFFF`).
* **Signature "by Systems" :** - Incrustation sous forme de **bandeau oblique orange**.
    - Placé sous le "HOME", touchant la base de la lettre "E".
    - Texte "by Systems" avec un **dégradé métallique doré**.

### B. Indicateur de Tiers (Badges)
* **Emplacement :** Header (haut à gauche).
* **Style :** Bouton à effet **Néon** avec dégradé (Jaune vers Orange).
* **Étiquettes :** `FREE` (15 outils) | `PREMIUM` | `PRO`.

---

## 📐 3. RÈGLES D'ADAPTABILITÉ (SCALING)

Pour garantir un affichage parfait du **Galaxy J5** à l'**iPhone 17 Pro**, le design suit une logique de flux liquide :

* **Unités de mesure :** - **Interdiction du Pixel fixe (px)** pour les tailles d'écran.
    - Utilisation du `rem` pour la typographie (respect du choix utilisateur).
    - Utilisation du `vh/vw` et `%` pour les conteneurs.
* **Vecteurs (SVG) :** Tous les logos, icônes (Lucide) et éléments graphiques sont en **SVG** pour une netteté absolue à n'importe quelle densité (@2x, @3x, @4x).
* **Zones de Sécurité (Safe Areas) :** Utilisation systématique des marges dynamiques pour éviter les encoches (notches) et les barres d'accueil iOS/Android.

---

## 📱 4. ARCHITECTURE DE L'INTERFACE (LAYOUT)

### 🔝 LE HEADER (Fixe)
1. **Gauche :** Badge de statut (Abonnement).
2. **Centre :** Logo "LOCATE HOME by Systems".
3. **Droite :** Roue dentée (Paramètres) en gris clair.
4. **Séparation :