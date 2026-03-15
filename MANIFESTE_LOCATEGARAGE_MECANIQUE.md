# 🔧 🚛 LOCATE GARAGE | RÉFÉRENTIEL MÉCANIQUE VL / PL (M5)

**Date mise à jour :** *15 Mars 2026*
**Statut :** BIBLE MÉTIER - ARCHITECTURE "LIVE DIAGNOSTIC", "FOD" & "PROFIL TACTIQUE" 🟢
**Vision :** *"L'IA est le Chef d'Atelier embarqué : l'œil qui sécurise, l'oreille qui écoute, le cerveau qui décale la panne."*

---

## 📂 0. ORGANIGRAMME TECHNIQUE RÉEL (MODULE GARAGE & CORE M5)
📦 LOCATE-SYSTEMS
└── 📂 src/                             # MOTEUR DE L'APPLICATION
    ├── 📂 core/                        # SYSTÈME NERVEUX & SÉCURITÉ
    │   ├── 📁 ai/
    │   │   ├── 📁 expertisemetier/ 
    │   │   │   └── 📄 mecanique.ts     # BIBLE : Règles GARAGE_M5_RULES (J1939, UTAC, Couples, Thermique)
    │   │   ├── 📄 liveService.ts       # Système Nerveux Vocal (WebSocket Gemini Bidi Partitionné)
    │   │   └── 📄 geminiService.ts     # Cerveau Vision (Intègre analyzeServanteFOD et analyzePasseportSecurite)
    │   └── 📁 security/
    │       ├── 📄 supabaseClient.ts    # Pont de connexion vers le Backend
    │       └── 📄 useUserTier.ts       # Gestionnaire de Grade Dynamique
    └── 📂 modules/garage/              # 🔧 M5 : LA MÉCANIQUE (Garage)
        ├── 📁 components/              # Interface utilisateur tactique (HUD)
        │   ├── 📄 LiveAssistant.tsx    # Cockpit Tactique "Garage" (Rouge, HUD Filigrane, Audit/Diag)
        │   ├── 📄 PassportScanner.tsx  # Scanner IA OCR pour habilitations (CACES, Mécanique)
        │   ├── 📄 GaragePdfButton.tsx  # Export PDF d'intervention
        │   ├── 📄 PriseDePosteReport.tsx # Gabarit PDF FOD (Audit simple)
        │   └── 📄 FinDePosteReport.tsx  # Gabarit PDF FOD (Comparatif Avant/Après)
        └── 📁 views/                   # Écrans principaux du module
            ├── 📄 GarageDashboard.tsx  # Aiguilleur Tactique (Scindé Maintenance/Mécanique)
            ├── 📄 TechProfile.tsx      # Fiche Technicien (Vestiaire, Habilitations scannées)
            ├── 📄 PriseDePoste.tsx     # Module d'acquisition matin (mitraillage + IA)
            ├── 📄 FinDePoste.tsx       # Module de clôture (récupération mémoire locale)
            └── 📄 TourDeControle.tsx   # Hub Superviseur en Temps Réel (WebSockets)

---

## ✅ 1. ACQUIS TECHNIQUES & ÉTAT DU SYSTÈME

* **Segmentation & Symmetry :** Le module possède désormais une structure miroir de la maintenance, scellée par le `GarageDashboard`. L'univers mécanique est codé en **Rouge (#DC2626)** pour une différenciation visuelle immédiate.
* **Profil Technicien OCR :** Intégration du `PassportScanner`. L'IA extrait les habilitations (CACES R489, habilitations électriques véhicule hybride/électrique) pour conditionner l'accès au diagnostic.
* **HUD Tactique Immersif (Z-200) :** Le Live Assistant Mécanique utilise un bandeau filigrane. Les habilitations du technicien et les étapes de sécurité (Chandelles, PTO, VE) sont affichées sans masquer la visibilité de l'organe mécanique.
* **Architecture Backend (Supabase) :** Table `servantes_status` connectée en temps réel via WebSockets pour la Tour de Contrôle.
* **Pont Mémoriel Local (`localStorage`) :** Conservation des images du matin pour génération du rapport comparatif "Avant/Après" à 17h00.
* **Modèle Économique :** Tier FREE bridé à 120s/session. Tier PRO débloquant la Tour de Contrôle et l'export PDF certifié.

---

## 🎯 2. PROCESSUS OPÉRATIONNEL : LE STANDARD FOD / 5S EN TEMPS RÉEL

### A. La Prise de Poste (08:00)
1. **Acquisition UI :** Mitraillage guidé des tiroirs de la servante (ex: FACOM JET M4).
2. **Analyse IA :** `analyzeServanteFOD` détecte les trous dans les mousses bicolores.
3. **Transmission :** Envoi des données à Supabase et stockage local des photos pour la clôture du soir.

### B. La Fin de Poste (17:00) - "Le Juge de Paix"
1. **Comparaison Temporelle :** L'application remonte les clichés du matin.
2. **Génération PDF :** Alignement côte à côte (Matin vs Soir) pour preuve irréfutable d'absence de perte d'outil (Foreign Object Debris).

### C. La Tour de Contrôle
* Supervision "Management par Exception" pour le Chef d'Atelier. Alertes visuelles instantanées si une servante passe en statut DÉGRADÉ.

---

## 📘 3. BIBLE ULTIME : BASE DE CONNAISSANCES IA - MÉCANIQUE VL / PL

### 3.1 DIAGNOSTIC MULTIMODAL
* **Audio :** Sifflements (fuite air pneumatique), claquements (embiellage), cavitation (pompes hydrauliques).
* **Visuel HDR :** Oxydation, suintements, usure de courroie.

### 3.2 MULTIPLEXAGE & PROTOCOLES
* **SAE J1939 (PL) :** Interprétation des codes FMI (0: Surcharge, 1: Fuite, 3: Court-circuit +, 4: Masse, 5: Circuit ouvert).
* **OBD-II (VL) :** Classification P/C/B/U.

### 3.3 INGÉNIERIE & VALEURS CRITIQUES
* **Serrage Roues PL (En croix, à sec) :** Volvo (610 Nm), Scania/MB/DAF (600 Nm), Renault (450-500 Nm). Alerte IA resserrage 100 km.
* **Freinage UTAC :** Régulation 7.2 - 8.1 bars. Test épuisabilité (4 coups après alarme).

### 3.4 ANOMALIES THERMIQUES & MÉTALLURGIQUES
* **Diagnostic EBS :** Distinction entre fuite joint de moyeu (jante encrassée) et étrier grippé.
* **Colorimétrie HDR de l'acier (Revenu) :**
    * Zone 1 (Jaune - 220°C) : Dureté max / Glaçage.
    * Zone 4 (Bleu - 295°C) : **DANGER**. Acier détrempé. Résistance structurelle perdue. Remplacement obligatoire.
    * Zone 5 (Gris - >350°C) : **DESTRUCTION**. Acier recuit. Remplacement immédiat.

### 3.5 ARBRE D'INTERVENTION VOCAL
1. Vision de l'organe. 2. Test multimètre guidé. 3. Décision logique. 4. Clôture & Effacement défaut.

---
*Fin du document de contexte mécanique M5.*