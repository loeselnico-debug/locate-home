# 🦅 LOCATEHOME | RÉFÉRENTIEL TECHNIQUE V1.4

**Date :** 17 Février 2026  
**Statut :** OPÉRATIONNEL (Build Vercel Ready 🟢)  
**Cible :** iPhone 12 Pro & Environnement Industriel (Multi-devices J5 à iPhone 17 Pro)

---

## 1. 🎯 OBJECTIF DU PRODUIT
Système de gestion et de traçabilité d'outillage pour maintenance industrielle. Optimisé pour une saisie rapide sur le terrain et une recherche instantanée par reconnaissance visuelle ou vocale.

---

## 2. 🎨 SPÉCIFICATIONS UI (CHARTE GRAPHIQUE)

| Élément | Code Hexa | Usage |
| :--- | :--- | :--- |
| **Fond** | `#121212` | Anthracite profond (Optimisation OLED / Basse luminosité). |
| **Accent** | `#FF6600` | Orange Industriel (Signalétique et Actions). |
| **Navigation** | `#007BFF` | Bleu Standard (Boutons de retour). |

---

## 🛠️ 3. PILIERS TECHNIQUES ACTUELS

### 📊 TABLEAU DE BORD
* **Suivi de capacité :** Jauge dynamique (**Limite : 15 unités en Freemium**).
* **Flux de données :** Rafraîchissement automatique via LocalStorage (Persistance).

### ⚡ SCANNER HDR (MULTI-OBJET)
* **Analyse IA :** Moteur **Google Gemini 1.5 Flash** avec injection de "La Bible" (ExpertiseRules).
* **Capture :** Flux vidéo live avec laser de balayage dynamique.
* **Reconnaissance :** Identification morphologique (Mandrins, batteries, signatures marques).

### 📦 GESTION D'INVENTAIRE (LIBRARY)
* **Classement :** Tri chronologique (Dernier scan en haut).
* **Classification :** **9 catégories métiers** (incluant Protection & EPI) avec iconographie dédiée.
* **Traçabilité :** Archivage des métadonnées techniques et score de confiance.

### 🔍 RECHERCHE & LOCALISATION
* **Interface :** Recherche hybride texte / voix.
* **État :** Localisation par défaut positionnée sur "Zone de Scan".

---

## 🚀 4. DÉVELOPPEMENT V2.0 (EN COURS)
- [ ] **Gestion des Emplacements :** Attribution précise Bacs / Étagères.
- [ ] **Persistance Offline :** Cache local pour utilisation hors réseau.

---

## 🚀 5. PROCHAINES ÉTAPES (ROADMAP V2.0)

### ✅ ÉTAPES RÉALISÉES
- [x] **Nettoyage sémantique :** Remplacer les références textuelles "PHOENIX-EYE" par "LOCATEHOME".
- [x] **Verrouillage du schéma :** Interface `InventoryItem` définie comme référence unique.
- [x] **Mise à jour `src/types.ts` :** Inclusion de la localisation et des 9 catégories.
- [x] **Gestion de la limite :** Ajouter une vérification dans `addTool` (Limite 15 outils Freemium).
- [x] **Fonction de nettoyage :** Intégration de `deleteTool` pour vider ou supprimer un scan.
- [x] **Hardening (Blindage) :** Vérifications de sécurité sur `data.candidates`.
- [x] **Extraction de secours :** Nettoyage JSON robuste pour éviter les crashs.
- [x] **Passage au Flux Vidéo Live (VRAIS YEUX) :** Intégration de `getUserMedia` et cadre de visée.
- [x] **Synchronisation du Laser :** Balayage dynamique synchronisé avec l'analyse.
- [x] **Sémantique Finale :** Remplacement de "Répertoire Phoenix-Eye" par "Système LocateHome".
- [x] **Reprendre le design :** Intégration conforme au `MANIFESTE_LOCATEHOME-DESIGN.md`.
- [x] **Syncronisation /tiers.ts avec /App.tsx

### 🟡 ÉTAPES À VENIR
- [ ] **Affichage des Catégories :** Afficher le label (ex: "Outillage à main") au lieu de l'ID brut.
- [X] **Localisation de Vérité :** Fournir à l'IA la liste des zones réelles (Fourgon, Établi).
- [ ] **Mode Hors-ligne :** Support PWA et stockage local des images pour zones blanches.
- [ ] **Filtrage par Zone (V2.0) :** Système d'onglets pour filtrer par "Fourgon" ou "Atelier".
- [ ] **Mode Basse Lumière :** Activation flash/torche via l'interface.
- [ ] **Gestion des Emplacements :** Attribution précise Bacs / Étagères.
- [ ] **Remise en service avec nouvelle clé API (ancienne delete car public)
- [ ] **Remplacer les boutons d'action "lucide-react" par ceux du fichier /public
- [ ] **Compléter et affiner /tiers.ts