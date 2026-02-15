# 🦅 PHOENIX-EYE / LOCATE HOME - RÉFÉRENTIEL PROJET (V1.0)

## 1. VISION & UX (Flux Croquis 14/02)
- **Concept** : Application hybride (Bricolage / Maintenance Pro) basée sur 3 piliers d'action.
- **RANGER** : Accès direct à l'inventaire par catégories.
- **SCANNER** : Module de vision IA pour identification et audit.
- **RETROUVER** : Moteur de recherche spatiale avec support vocal.

## 2. CHARTE DE VÉRITÉ (Data Schema)
- **Fichier Source** : `src/types.ts`.
- **Interface `InventoryItem`** : id, name, details, etat, categorie, score_confiance, alerte_securite, originalImage, date.
- **Sécurité** : Verrouillage automatique de l'enregistrement si `score_confiance` < 0.7 (70%).

## 3. RÉFÉRENTIEL DES CATÉGORIES (8 Piliers)
- `electro` (Outillage Électroportatif)
- `main` (Outillage à main)
- `serrage` (Serrage et Clés)
- `quinc` (Quincaillerie)
- `elec` (Électricité)
- `peinture` (Peinture et Finition)
- `mesure` (Mesure et Traçage)
- `jardin` (Jardin et Extérieur)

## 4. LOGIQUE DES TIERS (Fichier `tiers.ts`)
- **FREE** : Limite 50 outils, fonctions de base.
- **PREMIUM** : HDR activé, Vision AR, limite 9999.
- **PRO** : Safety Audit (Audit de sécurité) activé via Gemini Service.

## 5. ARCHITECTURE TECHNIQUE VALIDÉE
- **App.tsx** : Gestionnaire de navigation (Dashboard / Scanner / Library).
- **Dashboard.tsx** : Affichage par secteurs (ex: Garage/Alpha) et jauge de capacité.
- **Scanner.tsx** : Capture image et mapping vers la Charte de Vérité.
- **geminiService.ts** : Prompt expert tier-aware (PRO/FREE) avec extraction JSON Regex.
- **memoryService.ts** : Persistance LocalStorage sous la clé `phoenix_inventory_v1`.

## 6. ROADMAP & DETTES TECHNIQUES (MaJ 15/02)
- [x] **RECONSTRUCTION HDR** : Filtre industriel opérationnel.
- [x] **VOCAL** : Implémenté via Web Speech API.
- [x] **DASHBOARD DYNAMIQUE** : Connecté au memoryService.
- [x] **RANGEMENT PAR CATÉGORIES** : Grille de 8 piliers interactive.