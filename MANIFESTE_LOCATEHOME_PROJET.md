# 🦅 LOCATEHOME | RÉFÉRENTIEL TECHNIQUE V1.5

**Date :** 19 Février 2026  
**Statut :** OPÉRATIONNEL - VALIDÉ SUR TERRAIN 🟢  
**Cible :** iPhone 12 Pro et Galaxy J5 (Optimisation flux vidéo & haptique)

---

## 1. 🎯 OBJECTIF DU PRODUIT
Système expert de traçabilité et de diagnostic d'outillage. Le système ne se contente pas d'identifier, il analyse l'état de sécurité et la segmentation spatiale (différenciation des contenants).

---

## 2. 🎨 SPÉCIFICATIONS UI (IDENTITÉ VISUELLE "BY SYSTEMS")

| Élément | Style / Code | Usage |
| :--- | :--- | :--- |
| **Fond** | `#121212` | Anthracite profond industriel. |
| **Accent principal** | `#FF6600` | Orange Néon (Titre "LOCATE" et Actions). |
| **Texte Secondaire** | `#FFFFFF` | Blanc Pur (Titre "HOME"). |
| **Signature** | **Or Métallique** | Dégradé "by Systems" sur bandeau oblique orange. |
| **Boutons Tier** | Jaune ⮕ Orange | Effet néon pour statut Freemium/Premium/Pro. |

---

## 🛠️ 3. PILIERS TECHNIQUES ACTUALISÉS

### 📊 NAVIGATION & INTERFACE
* **Composants :** Utilisation des actifs 3D (`icon-ranger.png`, `icon-scanner.png`, `icon-retrouver.png`).
* **Header :** Structure fixe incluant le bouton Tier à gauche et les paramètres à droite.
* **Navigation :** Gestion par état `ViewState` (Home / Inventory / Scanner / Search).

### ⚡ SCANNER VIDÉO "BURST" (CERVEAU IA)
* **Moteur :** **Google Gemini 3 Flash** (Priorité Vitesse & Lecture Typographique).
* **Capture :** Mode "Burst" — Capture automatique de **6 frames sur 10 secondes**.
* **Capacités validées :** * Lecture des micro-détails (ex: "M5 x 60", "Set 22 pcs").
    * Analyse de sécurité (ex: détection d'usure de gaine isolante).
    * Conscience spatiale (distinction de deux bacs séparés).

---

## 🚀 4. ÉVOLUTIONS RÉALISÉES

- [x] **Migration Moteur :** Passage effectif à Gemini 3 Flash (Zéro erreur 404/429).
- [x] **Refonte Header :** Intégration conforme du logo et de la signature dorée.
- [x] **Design Boutons :** Remplacement des icônes vectorielles par les PNG 3D.
- [x] **Protocole de Scan :** Implémentation de la fonction `analyzeVideoBurst`.
- [x] **Diagnostic Sécurité :** Injection des règles métiers dans le prompt système.

---

## 🚀 5. PROCHAINES ÉTAPES (ROADMAP V2.0)

### 🟡 PRIORITÉS IMMÉDIATES
- [ ] **Bridage Métier :** Filtrage de l'environnement (ignorer le décor pour focus outils).
- [ ] **Protocole Zero-Trust :** Forcer l'IA à l'incertitude plutôt qu'à l'hallucination (ex: canette ouverte).
- [ ] **Localisation de Vérité :** Indexer les zones réelles (Fourgon, Atelier, Établi).
- [ ] **Dédoublonnage Intelligent :** Logique de fusion d'objets identiques détectés en rafale.

### 🔵 ÉVOLUTIONS FUTURES
- [ ] **Module "Retrouver" :** Recherche spatiale guidée par commande vocale.
- [ ] **Mode Basse Lumière :** Activation auto du flash/torche via l'API Camera.