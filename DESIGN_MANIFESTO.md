# 🛠️ MANIFESTE DU DESIGN - LOCATE HOME
> **Version :** 1.0 (Février 2026)
> **Statut :** Document de référence pour le développement VSCode

---

## 1. 🎨 IDENTITÉ VISUELLE & COULEURS
*C'est ici que tu modifies l'ambiance générale de l'app.*

| Élément | Code Hexa | Commentaire pour modification |
| :--- | :--- | :--- |
| **Fond (Background)** | `#000000` | **NOIR PUR.** Ne pas modifier pour garder le contraste "OLED". |
| **Accent Primaire** | `#FF8C00` | **ORANGE INDUSTRIEL.** Couleur des boutons d'action. |
| **Accent Secondaire** | `#B0BEC5` | **GRIS MÉTAL.** Utilisé pour les icônes secondaires et bordures. |
| **Validation OK** | `#28A745` | **VERT.** Utilisé pour "Intégration Automatique". |
| **Correction** | `#DC3545` | **ROUGE.** Utilisé pour "Correction Manuelle". |
| **Navigation** | `#007BFF` | **BLEU.** Couleur exclusive des boutons "RETOUR". |

---

## 2. 💎 LOGIQUE DU BADGE "PREMIUM" (EFFET NÉON)
*Cette section définit le rendu visuel de l'abonnement sous le logo.*

* **ÉTAT PREMIUM :** * **Dégradé :** De `Orange (#FF8C00)` vers `Gris Métal (#B0BEC5)`.
    * **Effet :** Ombre portée (Shadow) de 10px type "Néon Orange".
* **ÉTAT FREE / PRO :** * **Dégradé :** Nuances de Gris uniquement (Effet plaque d'acier brossé).
    * **Modification :** Pour changer l'intensité du néon, modifier la valeur `blurRadius` dans le code.

---

## 3. 📐 RÈGLES DE MISE EN PAGE (UI)
*À suivre pour chaque nouvel écran créé dans VSCode.*

* **Tri des Listes (Écrans 01 A, A1...A8) :**
    * **RÈGLE D'OR :** Tri **ALPHABÉTIQUE strict (A-Z)** sur le label de l'outil.
    * *Pourquoi ?* Rapidité de lecture pour un technicien en intervention.
* **Le Header (Haut d'écran) :**
    * Le logo "LOCATE HOME" est toujours centré.
    * Le bouton "Paramètres" (Engrenage) est toujours à droite.
* **Zone Caméra (01 B / 01 C) :**
    * **Focus :** Cadres de détection (Bounding Boxes) en couleur **CYAN**.
    * **HDR :** Filtre HDR automatique activé par défaut (selon Roadmap).

---

## 4. 🧩 BIBLIOTHÈQUE D'ICÔNES (LUCIDE)
*Utiliser uniquement ces noms pour rester cohérent avec la structure de données.*

* **Outillage :** `Hammer`, `Wrench`, `Zap`, `Nut`.
* **Navigation :** `ChevronLeft`, `Settings`, `X`.
* **Actions :** `Search` (Loupe), `ScanLine` (Scanner), `Archive` (Ranger).

---

## 5. 📑 GLOSSAIRE POUR LE CODE
*Pour ne pas se tromper de variable dans les fichiers .tsx*

* `primaryColor` -> Toujours l'Orange.
* `isPremium` -> Variable (Vrai/Faux) qui déclenche l'effet néon.
* `categorySort` -> Fonction de tri A-Z.