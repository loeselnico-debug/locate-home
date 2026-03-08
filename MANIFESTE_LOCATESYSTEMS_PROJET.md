# 🧭 ⚛️ 🇫🇷 MANIFESTE MAÎTRE LOCATE SYSTEMS (M1) | SOURCE DE VÉRITÉ V3.2

**Date mise à jours :** *06 Mars 2026*
**Statut : RÉFÉRENTIEL MAÎTRE - ARCHITECTURE MONOREPO UNIFIÉE 🟢** 
**Vision :** *"L'homme ne parle pas à l'IA pour l'écouter, mais pour qu'elle devienne le prolongement de son expertise terrain."*
**Export global du Code** node export-ia.cjs

---

## 📂 1. ORGANIGRAMME TECHNIQUE (ARCHITECTURE MONOREPO)
📦 LOCATE-SYSTEMS
├── 📂 public/                 # Actifs Visuels Communs (Icônes 3D, manifest.json)
├── 📂 src/                    # MOTEUR DE L'ÉCOSYSTÈME
│   ├── 📂 core/               # ⚙️ M1 : **🛡️ M1 : TRONC COMMUN (CORE)**
│   │   ├── 📁 ai/             # Moteur de décision global, geminiService.ts, liveService.ts
│   │   ├── 📁 camera/         # Scanner Hybride Universel
│   │   ├── 📁 security/       # Gestion des Tiers (Free/Premium/Pro), Audits de sécurité
│   │   ├── 📁 storage/        # memoryService.ts (Zéro-Serveur, IndexedDB)
│   │   ├── 📁 ui/             # Composants partagés : Hub.tsx, Logo.tsx, SafetyBadge.tsx
│   │   └── 📄 index.ts
│   ├── 📂 data/               # RÉFÉRENTIELS LOCAUX (Catalogue Global)
│   ├── 📂 modules/            # LES 5 VERTICALES MÉTIERS
│   │   ├── 📁 asset/          # 📦 M3 : **📦 M3 : [ASSET] (L'inventaire supérieur)**
│   │   ├── 📁 care/           # 🩺 M6 : **🩺 M6 : [CARE] (Le Compagnon administratif Santé)**
│   │   ├── 📁 garage/         # 🔧 M5 : **🔧 M5 : [GARAGE] (L'assistant live Maintenance et mécanique)**
│   │   ├── 📂 home/           # 🏠 M2 : **🏠 M2 : [HOME] (Le Bricoleur / Le Technicien)**
│   │   └── 📁 kitchen/        # 🍳 M4 : **🍳 M4 : [KITCHEN] (L'assistant du chef)**
│   ├── 📂 styles/             # Design System Global
│   ├── 📂 types/              # Source de Vérité Data Universelle (index.ts)
│   ├── 📄 App.tsx             # Chef d'orchestre du Routage
│   └── 📄 main.tsx
├── 📄 LOCATE_CONTEXT_IA.md
├── 📄 MANIFESTE_LOCATEGARAGE_MAINTENANCE.md
├── 📄 MANIFESTE_LOCATEGARAGE_MECANIQUE.md
├── 📄 MANIFESTE_LOCATEHOME.md
├── 📄 MANIFESTE_LOCATEHOME_DESIGN.md
├── 📄 MANIFESTE_LOCATESYSTEMS_PROJET.md

└── ⚙️ [Fichiers de Config]    # Variables d'environnement, Vite, Tailwind...

---

## 🛠️ 2. LES 6 PILIERS DU SYSTÈME

**🛡️ M1 : TRONC COMMUN (CORE)**
* **Cerveau :** Gemini 2.0 Flash.
* **Vision :** Étalon 12 frames / 20 secondes.
* **Zéro-Trust :** Filtrage morphologique strict (Focus outil/donnée uniquement).
* **Universalité :** CM/Inch, FR/UK, adaptation aux normes locales.
* **Architecture des 5 Modules Universels :** L'écosystème est segmenté en cinq verticales distinctes, partageant une base de données centralisée et sécurisée. Les 5 modules ont en commun la base du code de reconnaissance augmentée et le traitement en local des données. Chaque application détient un code couleur spécifique à son domaine d’activité. Domaines sécurisés par OVH.

**🏠 M2 : [HOME] (Le Bricoleur / Le Technicien)**
* **Fonction :** Dédié aux bricoleurs lambdas, aux bricoleurs experts et créateurs “DIY”, au professionnel et à la génération de rapports d'inventaire d’outillage électroportatif et outillages à main pour assurances. Vision internationale conversion cm/inch, multilingue FR/UK, adaptation des normes exclusives de sécurités au travail des pays d’utilisation.
* **Outil Maître :** Module "Retrouver" - Recherche vocale mains libres.

**📦 M3 : [ASSET] (L'inventaire supérieur)**
* **Fonction :** Réalisation et traçabilité des inventaires dépassant 1000 références. Focus sur la rigueur de l’inventaire (de plus de 1000 références) et de l'industrie pour la gestion des stocks (Maintenance prédictive).
* **Expertise :** Extraction SKU (6 chiffres) et références XHANDER (XH-...).

**🍳 M4 : [KITCHEN] (L'assistant du chef)**
* **Fonction :** Univers culinaire professionnel, focalisé sur la sécurité alimentaire, l'hygiène (HACCP), normes françaises et la gestion des stocks périssables. Lancement international 2030, Multilingue FR, UK, DE…(les 20 langues les plus utilisées dans le monde), adaptation des normes exclusives d’hygiènes aux pays d’utilisation.

**🔧 M5 : [GARAGE] (L'assistant live Maintenance et mécanique)**
* **Fonction :** Suivi des réparations mécaniques et contrôle de fin de poste. La mémoire augmentée du mécanicien et du technicien de maintenance et de la précision de l’assistance et le diagnostic par l’IA.
* **Analyse :** Détecter finement les nuances de coloration d'un métal suite échauffement, écouter des bruits suspects, émettre des hypothèses avec le technicien mécanicien.

**🩺 M6 : [CARE] (Le Compagnon administratif Santé)**
* **Fonction :** Santé et services à la personne, incluant la gestion documentaire, le rappel de posologie et l'indexation de calendrier (Lancement France 2030), Génération d’un fichier OMS (Organisation Mondiale de la Santé) pour recevoir les meilleurs soins adaptés à son propre historique médical. Multilingue FR, UK, DE…(les 20 langues les plus utilisées dans le monde).

---

## 📐 3. CHARTE DE VÉRITÉ (RÈGLES DE CODAGE GLOBALES)

**A. Branding & Logotypage**
* **Structure Universelle :** LOCATE [COULEUR MODULE] + NOM DU MODULE [BLANC].
* **Signature :** Mention discrète "by Systems" transversale.
* **Modèle Économique :** Système de Tiers globalisé : FREE (Limité) | PREMIUM (Illimité + PDF) | PRO (Sur devis interconnectivité).

**B. Adaptabilité Liquide (Scaling)**
* **Responsivité absolue :** Interdiction stricte du Pixel (px). Utilisation de `rem` pour la typographie, `vh/vw` et `%` pour la structure. Gestion native du `100dvh` pour iOS/Android.
* **Ressources :** SVG et PNG HD exclusivement.

**C. Intelligence Métier (Règles IA M1)**
Application du Protocole d’Analyse Visuelle Pyramidale (PAVP V5.0) décliné par métier :
* **Niveau 4 (OCR) :** Lecture typographique (SKU, Nomenclatures, Plaques d'immatriculation).
* **Niveau 3 (Sous-systèmes) :** Analyse des connectiques, interfaces (Batteries, Câbles, Tuyauterie).
* **Niveau 2 (Morphologie) :** Type d'objet ou de pièce mécanique.
* **Niveau 1 (Hypothèse visuelle) :** Colorimétrie et état d'usure globale.

---

## ⚖️ 4. JURIDIQUE ET INFRASTRUCTURE WEB (RÉSEAU OVH)

**A. Stratégie des Noms de Domaine (Protection IP)**
Verrouillage effectif pour anticiper les lancements mondiaux (jusqu'en 2030) :
* Holding : locatesystems.com / .fr
* Verticals : locatehome.com / locatekitchen.com / locatecare.com / locateasset.com / locategarage.com (et déclinaisons .fr).

**B. Architecture "Privacy by Design" (RGPD Zéro-Serveur)**
* **Local-First :** Base de données 100% hors-ligne (IndexedDB via `idb-keyval`). Zéro serveur cloud pour le stockage des inventaires clients.
* **Consentement IA :** Validation obligatoire avant tout accès caméra. Flux éphémères détruits après analyse.
* **Validation Humaine :** L'IA est un outil de brouillon. L'intégration des données est conditionnée à l'action humaine (Sas Zéro-Trust).
* **Documents Légaux :** Moteur PDF embarqué (`@react-pdf/renderer` avec Lazy Loading) pour générer des certificats conformes sans requêtes externes.

---
# ⚖️ 4. JURIDIQUE, INFRASTRUCTURE WEB & BUSINESS

**A. Identité Légale & Patrimoine Numérique**
* **Immatriculation :** Entreprise Individuelle (EI) validée par l'INPI le 02/03/2026. Domiciliation via LegalTech (Paris). SIRET en cours d'attribution.
* **Stratégie des Noms de Domaine :** Acquisition et verrouillage de 12 domaines stratégiques chez OVH (coût ~93€/an) pour protéger la propriété intellectuelle jusqu'en 2030 :
  * *Holding :* locatesystems.com / .fr
  * *Modules :* locatehome.com / .fr, locatekitchen.com / .fr, locatecare.com / .fr, locateasset.com / .fr, locategarage.com / .fr

**B. Cadre Juridique & "Privacy by Design" (RGPD)**
* **Legal Hub :** Rédaction complète et validée des CGU/CGV et de la Politique de Confidentialité en Français et Anglais.
* **Local-First (IndexedDB) :** L'inventaire est stocké à 100% sur l'appareil de l'utilisateur pour garantir la vitesse et la confidentialité. Zéro serveur de base de données pour les données d'inventaire.
* **Consentement IA & Traitement :** Les images scannées sont envoyées de manière éphémère et supprimées immédiatement. L'utilisateur doit obligatoirement valider le consentement IA avant l'activation du flux vidéo.
* **Clause de Responsabilité (Zéro-Trust) :** L'IA ne sert que de brouillon. L'opérateur est le seul décisionnaire de l'insertion en base de données via le Sas de Validation.

**C. Architecture SaaS & Modèle Économique**
* **Stack Hybride :** Front-end React PWA couplé à IndexedDB. Backend et authentification gérés par Supabase (Auth Shield).
* **Monétisation (Stripe) :** Modèle par Tiers défini : Free Guest, Premium (4.99€/mois), Pro (14.99€/mois).
* **Suivi Financier :** Charges fixes de fonctionnement identifiées à environ 34€/mois (Google Pro, Canva) + infrastructure OVH.

**D. Traitement Data & Optimisation Runtime**
* **Mise à jour Data :** Typage strict de `InventoryItem` avec l'intégration des variables juridiques optionnelles valorisées (`price`, `serialNumber`, `condition`) et e-commerce (`isConsumable`, `consumableLevel`).
* **Moteur PDF (Module Assurance) :** Intégration de `@react-pdf/renderer` respectant la structure exigée par les assurances.
* **Sécurité Runtime :** Déploiement du Lazy Loading (Suspense) pour le bouton PDF, évitant le crash de React 18 au démarrage de l'application.
---

## 🟢 ACQUIS TECHNIQUES (TERMINÉ)

**🧠 Cerveau, Architecture & Métier**

* **[X] Moteur IA & Expertise :** Refonte de `geminiService.ts`. Unification totale sur Gemini 2.5 Flash. Injection stricte de la Bible Métier (`expertiseRules.ts`) dans le System Prompt. Format JSON verrouillé (score_confiance, nom, marque, isConsumable, consumableLevel) pour interdire les hallucinations.
* **[X] Schéma Data & Types :** Interface `InventoryItem` verrouillée. Fichier `types.ts` à jour avec les catégories métiers et les jauges de consommables.
* **[X] Zéro-Trust & Validation (Sas 01 C1) :** Interface HUD intermédiaire créée (`ValidationSas.tsx`). L'IA soumet un brouillon, l'opérateur valide/rejette visuellement. Mapping typographique strict.
* **[X] Stockage Robuste & Zones Dynamiques :** Unification totale sur IndexedDB (`idb-keyval`). Abandon du module complexe "Ranger" au profit d'un système de 4 zones d'intervention dynamiques paramétrables en local (`memoryService.ts`).
* **[X] Architecture E-Commerce B2C/B2B (Dropshipping) :** Création du catalogue local (`catalog.ts`) servant de référentiel dimensionnel IA (Zéro-Serveur).
* **[X] Sécurité & Privacy by Design :** Implémentation du Consentement IA obligatoire bloquant le flux vidéo. Politique de Confidentialité intégrée et calcul du stockage local. Limites Freemium actives.

**👁️ Vision & Interface (Scanner & Hub)**

* **[X] Scanner HDR :** Mode hybride (Photo HD / Vidéo 10s / Import) calibré (12 frames / 20s). Torche auto et filtrage Zéro-Trust de l'environnement actif.
* **[X] UI Scanner V11 (HUD) :** Interface immersive 100dvh sans pixels. Réticule central, boutons flottants 3D, animation laser CSS perpétuelle.
* **[X] Hub Central & Inventaire (M2) :** Dashboard interactif (jauge orange). Navigation 3 niveaux.
* **[X] Vocal Pro (Moteur de recherche mains libres) :** Implémentation d'un parseur d'intention local compréhensif (ex: "Montre-moi les visseuses dans le fourgon") filtrant automatiquement l'interface Web Speech API.
* **[X] UI Minimalisme Dynamique (Boutique) :** Intégration de la jauge visuelle de consommables dans `ToolDetail.tsx` et création de la `StoreModal.tsx` connectée (préparation Revolut Pay).

---
# [cite_start]🏢 LOCATE SYSTEMS : SOLUTIONS ENTREPRISES [cite: 1, 2]
### [cite_start]L’Intelligence Visuelle au Service de la Maintenance Industrielle [cite: 3]

---

## [cite_start]💎 L'OFFRE PRO : LA PERFORMANCE SUR-MESURE [cite: 4]
[cite_start]**Plus qu’un inventaire, un écosystème de gestion d’actifs sécurisé. [cite: 5]**

### [cite_start]🎨 1. Personnalisation & Identité Visuelle (White Label) [cite: 6]
* [cite_start]**Valorisation de marque** : Valorisez votre image de marque auprès de vos collaborateurs et de vos clients. [cite: 7]
* [cite_start]**Intégration Logo** : Votre logo d’entreprise est présent sur l'interface utilisateur et sur chaque document généré. [cite: 8]
* [cite_start]**Rapports Certifiés** : Les exports PDF (assurances, audits, inventaires) sont édités sous votre en-tête officielle. [cite: 9]
* [cite_start]**Interface Industrielle** : Design "Neon Glassmorphism" avec typographie industrielle pour une lisibilité optimale en atelier. [cite: 10]

### [cite_start]🛡️ 2. "Safety First" : Priorité à la Sécurité [cite: 11]
* [cite_start]**Sécurité Intégrée** : Intégrez la sécurité au travail directement dans vos outils de gestion. [cite: 12]
* [cite_start]**Contrôle de Conformité** : Détection automatique de l'état des équipements et alertes sur les dispositifs de sécurité manquants ou endommagés. [cite: 13]
* [cite_start]**Gestion des VGP** : Suivi des Vérifications Générales Périodiques avec notifications automatiques pour ne jamais rater une échéance réglementaire. [cite: 14]
* [cite_start]**Protocoles de fin de poste** : Check-lists visuelles assistées par l'IA pour garantir que les machines sont sécurisées avant chaque passation. [cite: 15]

### [cite_start]🔗 3. Interconnexion des Modules : Fluidité Totale [cite: 16]
Maximisez la rentabilité en faisant communiquer vos environnements. [cite_start]L'offre PRO débloque le transfert de données entre vos pôles d'activité : [cite: 17]
* [cite_start]**Flux ASSET ↔ GARAGE** : Transférez vos actifs lourds du stock vers l'atelier mécanique pour un suivi de réparation immédiat sans ressaisie. [cite: 18]
* [cite_start]**Flux HOME ↔ ASSET** : Gérez la dotation d'outillage portatif de vos techniciens itinérants avec une synchronisation en temps réel. [cite: 19]
* [cite_start]**Base de Données Unifiée** : Une vision consolidée de votre parc matériel, peu importe sa localisation ou son usage. [cite: 20]

---

## [cite_start]📊 COMPARATIF DES SERVICES [cite: 21]

| Caractéristiques | FREE | PREMIUM | HOME | PRO (Entreprise & Artisan) |
| :--- | :---: | :---: | :---: | :---: |
| **Nombre d'outils**             |Jusqu'à 15 |      Illimité             | Illimité |
| **Stockage local (Zéro-Trust)** | ✅        | ✅                       | ✅ + Cloud Sécurisé |
| **Support Multi-zones**         | ❌        | ❌                       | ✅ Inclus |
| **Interconnexion Modules**      | ❌        | ❌                       | ✅ Inclus |
| **"Safety First" Entreprise**   | ❌        | ❌                       | ✅ Inclus |
| **Tarif Mensuel**               | **0 €** | **2,99 €/mois**  **30€/an** | **SUR DEVIS** |
[cite_start][cite: 22]

---

## [cite_start]💼 POURQUOI CHOISIR L'OFFRE PRO ? [cite: 23]
[cite_start]Le passage au mode PRO transforme Locate Systems en un véritable levier de productivité pour votre entreprise. [cite: 24] [cite_start]En centralisant la gestion, la sécurité et l'image de marque, vous réduisez les coûts opérationnels et renforcez la sécurité de vos équipes sur le terrain. [cite: 25]

[cite_start]**CONTACTEZ-NOUS POUR UNE ÉTUDE PERSONNALISÉE :** [cite: 26]
[cite_start]Locate Systems – Service Relation Publique & Grands Comptes [cite: 27]
[cite_start]Email : **contact@locate-systems.com** [cite: 28]