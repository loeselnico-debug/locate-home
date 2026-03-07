# 🏠 ⚛️ 🇫🇷 MANIFESTE LOCATE HOME (MODULE M2) | SOURCE DE VÉRITÉ V3.2

**Date mise à jours :** *06 Mars 2026*
**Statut :** LE GOOGLE SEARCH DE LA MAISON
**Vision :** *"L'homme ne parle pas à l'IA pour l'écouter, mais pour qu'elle devienne le prolongement de son expertise terrain."*

---

## 📂 1. ORGANIGRAMME TECHNIQUE (FOCUS M2)
📦 LOCATE-SYSTEMS
├── 📂 public/                 # Actifs Visuels (Icônes 3D, manifest.json)
├── 📂 src/                    # MOTEUR DE L'APPLICATION
│   ├── 📂 core/               # M1 : TRONC COMMUN (Le Socle)
│   │   ├── 📁 ai/             # decisionEngine.ts, expertiseRules.ts, geminiService.ts
│   │   ├── 📁 camera/         # Scanner.tsx
│   │   ├── 📁 security/       # safetyService.ts, tiers.ts, useUserTier.ts
│   │   ├── 📁 storage/        # imageService.ts, memoryService.ts
│   │   ├── 📁 ui/             # Hub.tsx, LocationBar.tsx, Logo.tsx, ResultModal.tsx, SafetyBadge.tsx
│   │   └── 📄 index.ts
│   ├── 📂 data/               # RÉFÉRENTIELS LOCAUX (Zéro-Serveur)
│   │   └── 📄 catalog.ts      # Catalogue Dropshipping & Dimensions IA
│   ├── 📂 modules/            # VERTICALES MÉTIERS
│   │   ├── 📂 home/           # 🎯 M2 : LE HUB / INVENTAIRE (Orange Néon)
│   │   │   ├── 📁 components/ # HomeMenu.tsx, InventoryCard.tsx, Library.tsx, Search.tsx, ToolDetail.tsx, StoreModal.tsx
│   │   │   └── 📁 views/      # Dashboard.tsx, PrivacyPolicy.tsx, SettingsPage.tsx, ValidationSas.tsx
│   │   ├── 📁 asset/          # M3 : Industrie (Spécifications Grands Comptes)
│   │   ├── 📁 kitchen/        # M4 : Flux (HACCP)
│   │   ├── 📁 garage/         # M5 : Maintenance
│   │   └── 📁 care/           # M6 : Santé
│   ├── 📂 styles/             # App.css, index.css
│   ├── 📂 types/              # index.ts (Source de Vérité Data)
│   ├── 📄 App.tsx             # Chef d'orchestre
│   └── 📄 main.tsx
├── 📄 MANIFESTE_LOCATEHOME_PROJET.md
└── ⚙️ [Fichiers de Config]    # .env, vite.config.ts, tailwind.config.js, package.json...

---

## 🛠️ 2. FONDATIONS ET MODULE MAÎTRE

**🛡️ M1 : TRONC COMMUN (CORE)**
* **Cerveau :** Gemini 2.0 Flash (Migration prévue vers 2.5 Flash).
* **Vision :** Étalon 12 frames / 20 secondes.
* **Zéro-Trust :** Filtrage morphologique strict (Focus outil/donnée uniquement).
* **Universalité :** CM/Inch, FR/UK, adaptation aux normes locales.
* **Architecture :** Écosystème segmenté en 5 verticales partageant une BDD centralisée et sécurisée (traitement local).

**🏠 M2 : [HOME] (Le Hub)**
* **Cible :** Bricoleurs lambdas, experts "DIY", professionnels.
* **Fonction Principale :** Création, gestion et génération de rapports d'inventaire d’outillage (électroportatif et à main) pour assurances.
* **Spécificités :** Vision internationale (cm/inch, multilingue FR/UK), adaptation des normes de sécurité.
* **Outil Maître :** Module "Retrouver" (01B) - Recherche vocale mains libres.

---

## 📐 3. CHARTE DE VÉRITÉ (RÈGLES DE CODAGE & MÉTIER)

**A. Branding & Logotypage**
* **Structure :** LOCATE (#FF6600) HOME (#FFFFFF).
* **Signature :** Bandeau oblique orange sous le "E" de HOME avec texte "by Systems" (+15% de taille).
* **Tiers :** Badges Néon FREE (15 outils max) | PREMIUM | PRO.

**B. Adaptabilité Liquide (Scaling)**
* **Interdiction du Pixel (px) :** Unités obligatoires = rem (typographie), vh/vw et % (structure). 100dvh et safe-area-inset gérés pour iOS.
* **Netteté :** Utilisation exclusive d'images vectorielles ou PNG HD.

**C. Intelligence Métier (Bible V1.5)**
Application stricte du Protocole d’Analyse Visuelle Pyramidale (PAVP V5.0) par l'IA :
* **Étape 4 (Juge de paix) :** Nomenclatures OCR (ex: DDF, DTD, suffixes J).
* **Étape 3 :** Sous-systèmes (Bagues Flexiclick, Pod 12V vs Rails 18V).
* **Étape 2 :** Morphologie (Mandrins, sabots).
* **Étape 1 :** Signatures Marques (Bleu/Cyan Makita, Rouge Bloc Milwaukee, etc.).

---

## ⚖️ 4. JURIDIQUE ET INFRASTRUCTURE WEB

**A. Architecture "Privacy by Design" (RGPD)**
* **Local-First :** Inventaire stocké à 100% en local (IndexedDB). Zéro serveur de base de données.
* **Consentement IA :** Images envoyées de manière éphémère et supprimées immédiatement. Validation obligatoire avant activation caméra.
* **Responsabilité :** L'IA propose un brouillon. L'opérateur est le seul décisionnaire (Sas de Validation Zéro-Trust).

**B. Structure Data & Domaines**
* **Domaines sécurisés OVH :** locatehome.com / .fr (et déclinaisons des autres modules).
* **Modèle Data :** Typage strict de `InventoryItem` (intégration variables juridiques `price`, `serialNumber`, `condition` et e-commerce `isConsumable`, `consumableLevel`).
* **Moteur PDF :** `@react-pdf/renderer` avec Lazy Loading (Suspense) pour éviter les crashs React 18 au démarrage.

---

## 🟢 ACQUIS TECHNIQUES (TERMINÉ)

**🧠 Cerveau, Architecture & Métier**
* [X] Moteur IA & Expertise : Unification Gemini, injection de la Bible Métier, format JSON verrouillé.
* [X] Schéma Data & Types : Interface `InventoryItem` verrouillée, catégories et jauges de consommables à jour.
* [X] Zéro-Trust & Validation : HUD intermédiaire `ValidationSas.tsx` opérationnel.
* [X] Stockage Robuste : Unification IndexedDB, système de 4 zones d'intervention dynamiques.
* [X] E-Commerce : Catalogue local dropshipping servant de référentiel dimensionnel IA.
* [X] Sécurité : Consentement IA bloquant, Politique de Confidentialité, Limites Freemium actives.
**[07/03/2026] IA / Modèle :** Migration du endpoint API de `gemini-2.0-flash` vers `gemini-2.5-flash` pour des performances de vision accrues. Ajout de la clé `type` dans le prompt JSON pour structurer l'affichage et doper l'efficacité de la recherche vocale (module "Retrouver").



**👁️ Vision & Interface (Scanner & Hub)**
* [X] Scanner HDR : Mode hybride (Photo/Vidéo/Import), calibré 12 fps/20s.
* [X] UI Scanner V11 : HUD immersif 100dvh, réticule, animation laser CSS.
* [X] Hub Central (M2) : Dashboard interactif, navigation 3 niveaux.
* [X] Vocal Pro : Parseur d'intention local compréhensif filtrant la Web Speech API.
* [X] UI Boutique : Jauge visuelle de consommables, `StoreModal.tsx` connectée.
- **[07/03/2026] UX/UI Home (Vue A) :** Remplacement de l'affichage en ligne du scanner par une carte aérée (Miniature + Marque + Nom complet + Type générique + Badge Score) selon le principe de divulgation progressive. Préparation du terrain pour optimiser la recherche vocale.
- **[07/03/2026] UX/UI Home (Vue B) :** Refonte majeure de `ValidationSas.tsx`. Changement de titre ("SCAN"). Création d'une carte à 3 zones (Image détourée, Terminal IA "Waouh effect" masquant le JSON brut, et Barre d'action basse). Ajout d'une Checkbox permettant d'ignorer un outil sans le supprimer, illustrant le concept de divulgation progressive et de Sas "Zéro-Trust".
- **[07/03/2026] UX/UI Home (Vue C) :** Refonte de la carte outil dans `Library.tsx` (Divulgation progressive). Suppression de la troncature pour le nom de l'outil, ajout de la Marque en surtitre, intégration du badge d'Énergie et réalignement du bloc de statut en bas de carte. Le bouton "Export PDF par rubrique" est décalé à une V2 pour des raisons de stabilité.
- **[07/03/2026] UX/UI Home (Vue D) :** Refonte majeure de `ToolDetail.tsx`. Transformation du formulaire d'édition en "Panneau de Contrôle" structuré (Grid) avec miniature persistante. Ajout des champs `condition` (État) et `notes` (Observations) pour créer une spécification technique ultra-détaillée type "Fiche Produit" assumant un scroll justifié par l'exhaustivité des données métiers.


---

## 🚀 ROADMAP V4 - OPTIMISATION UX/UI MOBILE

### 1. OBSERVATIONS GÉNÉRALES & DESIGN SYSTEM
- [ ] Homogénéiser les polices d'écriture (tailles et positions titres/sous-titres).
- [ ] Standardiser la position de tous les boutons "Return/Retour".
- [ ] Créer le visuel pour le Sas de validation.

### 2. LOGO & IDENTITÉ
- [X] Augmenter la taille de la mention "By Systems" (+15%).

### 3. NAVIGATION (HUB & HOMEMENU)
- [X] **HUB :** Corriger le léger scroll vertical (cible 100vh).
- [X] **HUB :** Intégrer et valider les nouvelles icônes redessinées.
- [ ] **HUB :** Vérifier l'accès fluide aux 4 autres modules.
- [X] **HOMEMENU :** Ajouter un badge "néon" (promesse CGU/CGV).

### 4. MODULE PARAMÈTRES
- [ ] Réduire l'en-tête (head) de -30%.
- [ ] Créer une cohérence visuelle (inscription tiers / offre tiers).
- [ ] Ajouter un bouton de contact (contact@locate-systems.com).
- [ ] Intégrer le switch de langue "FR / EN" (exclusif à cette vue).

### 5. MODULE RANGER (Inventaire)
- [ ] Ajuster les sous-rubriques pour afficher le nom complet de l'outil.
- [ ] Revoir la taille et les infos des fiches outils (noms tronqués).
- [ ] Refondre le design du bouton "Éditer" (suppression du scroll en mode édition).
- [ ] Réaliser la connexion de PDFassurance présent dans src\modules\home\components\Library.tsx

### 6. MODULE SCANNER
- [ ] **Accès (Tiers) :** Limiter "Fourgon/Atelier" (FREE) ; réserver "Chantier/Prêt" (PREMIUM/PRO).
- [X] **Ergo Mobile :** Remonter les boutons Import, Photo et Vidéo.
- [X] **Interface :** Reprendre la pertinence des infos sous les boutons.
- [X] **Fonctionnalité :** Inclure un compteur de temps (0 à 10s) pour la vidéo.
- [X] **Moteur IA :** Migrer le endpoint Gemini de 2.0 vers 2.5 Flash.

### 7. MODULE RETROUVER (Recherche)
- [X] Supprimer la bannière "Vocal Pro".
- [X] Supprimer l'affichage en liste par défaut.
- [X] Centrer la barre de recherche textuelle.
- [X] Placer un grand bouton micro sous le pouce.

---

## 📜 RÈGLES DE SESSION STRICTES
* **Code :** Étape 1 (Instruction) -> Étape 2 (Validation par "ok") -> Étape 3 (Code complet).
* **Design :** Interdiction de modifier le design sans preuve de bénéfice et validation explicite.
* **Manifeste :** Vérifier MANIFESTE_LOCATEHOME_PROJET.md avant chaque envoi. Ne jamais supprimer d'acquis.
* **Suivi :** Synthèse toutes les 10 interactions, changement de fil toutes les 30.