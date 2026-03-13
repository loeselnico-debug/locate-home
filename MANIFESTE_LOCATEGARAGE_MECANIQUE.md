# 🔧 🚛 LOCATE GARAGE | RÉFÉRENTIEL MÉCANIQUE VL / PL (M5)

**Date mise à jour :** *13 Mars 2026*
**Statut :** BIBLE MÉTIER - ARCHITECTURE "LIVE DIAGNOSTIC" & "FOD" 🟢
**Vision :** *"L'IA est le Chef d'Atelier embarqué : l'œil qui sécurise, l'oreille qui écoute, le cerveau qui décale la panne."*

---

## 📂 0. ORGANIGRAMME TECHNIQUE RÉEL (MODULE GARAGE & CORE M5)
📦 LOCATE-SYSTEMS
└── 📂 src/                            # MOTEUR DE L'APPLICATION
    ├── 📂 core/ai/                    # SYSTÈME NERVEUX & INTELLIGENCE
    │   ├── 📁 expertisemetier/        # Référentiels d'expertise locaux
    │   │   └── 📄 mecanique.ts        # BIBLE : Règles GARAGE_M5_RULES (J1939, UTAC, Couples, Thermique)
    │   └── 📄 liveService.ts          # Système Nerveux (WebSocket Gemini Bidi Partitionné)
    └── 📂 modules/garage/             # 🔧 M5 : LA MAINTENANCE (Garage)
        ├── 📁 components/             # Interface utilisateur tactique (HUD)
        │   ├── 📄 LiveAssistant.tsx   # Cockpit Tactique "Garage" (Rouge) avec PTT & Chrono 120s
        │   └── 📄 GaragePdfButton.tsx # Export PDF (Verrouillé en Tier FREE)
        ├── 📁 services/               # Logique métier spécifique
        │   └── 📄 reportService.ts    # Générateur d'Ordres de Réparation (White Label)
        └── 📁 views/                  # Écrans principaux du module
            └── 📄 GarageDashboard.tsx # Aiguilleur Tactique Flex-1 (Cyan/Rouge)

---

## ✅ 1. ACQUIS TECHNIQUES & ÉTAT DU SYSTÈME
Le module mécanique est fonctionnel et architecturé pour des déploiements industriels :

* **Cerveau IA Partitionné :** Le `liveService.ts` injecte strictement les données `GARAGE_M5_RULES`. Isolation totale entre protocoles industriels et camions.
* **Design Cockpit "Rugged" :** Interface 100% fluide (`flex-1`) absorbant les "Safe Areas". Haut contraste avec accents Rouge (`#DC2626`) pour la Mécanique et Cyan (`#00E5FF`) pour l'Industrie. Textes secondaires en gris pour éviter l'aberration chromatique.
* **Safety Gates Mécaniques :** Veto de l'IA si elle ne détecte pas visuellement les éléments critiques de sécurité (Chandelles, EPI VE, consignation PTO).
* **Modèle Économique "Golden Time" :**
    * **Tier FREE :** Session Live limitée à 120s avec refroidissement progressif (frustration positive). Export PDF verrouillé.
    * **Tier PREMIUM/PRO :** Sessions illimitées, accès au Hub ASSET (Supervision).
* **RGPD Zéro-Trace :** Aucune image du châssis ou des organes mécaniques n'est stockée sur le cloud après analyse.

---

## 🎯 2. PROCESSUS OPÉRATIONNEL : "PRISE DE POSTE" (LE STANDARD FOD / 5S)

*Objectif : Garantir l'intégrité de la servante en début et fin de poste sans interrompre le flux de travail du mécanicien, via un "Hack Low-Tech" évitant les limitations de crop de l'IA.*

### A. Le Déroulé : "Rafale Asynchrone"
1. **L'Initialisation (Le Handshake) :** Scan du QR Code de la servante. Téléchargement du "Profil JSON" local (nb de tiroirs, couleur de la mousse, photos de référence).
2. **L'Acquisition UI (Le Mitraillage) :** Ouverture caméra plein écran. Prise de vue guidée (Tiroir 1/6 à 6/6 + Plateau Libre) sans temps de chargement inter-photos.
3. **L'Analyse IA Asynchrone :** L'IA analyse les photos en arrière-plan. *Prompt binaire : "Vois-tu des zones de couleur [Rouge] indiquant une empreinte vide ? OUI/NON."*
4. **Le Sas de Validation :** Synthèse affichée. Si anomalie détectée (empreinte vide), le technicien DOIT saisir une justification via un menu rapide.
5. **La Création du PDF "Avant/Après" :** Génération immédiate d'un PDF local. Il affiche côte à côte la photo "Parfaite" (référence) et la photo "Réelle" du jour. C'est l'œil humain du superviseur qui juge la différence visuelle.
6. **La Centralisation :** Envoi d'un "Paquet JSON Léger" (ID, Statut, Justification) vers le superviseur intra-garage.

### B. Le Superviseur Intra-Garage (Intégré au Dashboard)
* Remplacement du module externe ASSET par un accès sécurisé (Code PIN/PRO) dans `GarageDashboard.tsx`.
* **Vue Macro :** Matrice de la flotte de servantes (Vert = OK, Rouge = Anomalie).
* **Résolution :** Au clic sur une anomalie, affichage du "Crash Report" (les 2 photos Avant/Après + la justification). Le chef valide, refuse, ou déclenche une commande.

---

## 📘 3. BIBLE ULTIME : BASE DE CONNAISSANCES IA - MÉCANIQUE VL / PL

*(Les règles métier intégrées dans `expertisemetier/mecanique.ts` et poussées dans les prompts systémiques de l'IA).*

### 3.1 PIPELINE DATA & DIAGNOSTIC MULTIMODAL
L'IA analyse les défauts selon une matrice stricte (Symptôme -> Code -> Visuel -> Électrique).
* **Audio :** Sifflements d'air (EBS/Pneumatique), claquements (embiellage, distribution), cavitation (hydraulique).
* **Visuel HDR :** Suintements d'huile, oxydation des connecteurs, état des courroies, usure des témoins.

### 3.2 EXPERTISE MÉTIER : MULTIPLEXAGE & PROTOCOLES
L'IA traduit le langage machine (Bus CAN) en diagnostic physique.
* **Protocole PL (SAE J1939) :**
    * FMI 0 : Surcharge/Surchauffe (Contrôle physique requis).
    * FMI 1 : Manque/Fuite (Contrôle étanchéité requis).
    * FMI 3 : Court-circuit au pôle + (Vmesure ≈ Vbat).
    * FMI 4 : Court-circuit à la masse (Vmesure ≈ 0V).
    * FMI 5 : Circuit ouvert (Résistance = ∞, fil coupé).
* **Protocole VL (OBD-II) :** Classification Powertrain (P0xxx), Chassis (C0xxx), Body (B0xxx), Network (U0xxx).

### 3.3 INGÉNIERIE SPÉCIFIQUE : VALEURS CRITIQUES (HARD-CODED/RAG)
L'IA contrôle visuellement les actes critiques (couples de serrage, pressions).
* **Liaison au sol PL (Serrage en croix "à sec") :**
    * Volvo FH/FM : 610 Nm.
    * Scania / Mercedes / DAF : 600 Nm.
    * Renault Trucks T : 450 - 500 Nm.
    * *Alerte IA OBLIGATOIRE :* Planifier un resserrage à 100 km dans la GMAO.
* **Freinage Pneumatique (Normes UTAC) :**
    * Pression de régulation dessiccateur : 7.2 à 8.1 bars.
    * Pression d'essai réglementaire : 6.2 à 6.9 bars.
    * Test d'épuisabilité : 4 coups de pédale minimum après alarme.

### 3.4 ARBRE DE DIAGNOSTIC : ANOMALIES THERMIQUES (ÉCHAUFFEMENT)
Protocole standardisé pour identifier et traiter la surchauffe des systèmes.
* **A. Freins / Moyeux (EBS - SPN 3839) :**
    * Si alerte température + jante encrassée = Fuite joint de moyeu.
    * Si alerte température seule = Contrôle mécanique étrier grippé (Frottement cinétique permanent).
* **B. Système Hydraulique :**
    * Perte de puissance à chaud = Baisse viscosité huile due à surchauffe.
    * *Diagnostic tactile (avec EPI)* : 60°C (très chaud), 80°C (brûlure).
    * Si > 60°C anormalement = Contrôle limiteur de pression (lamination du fluide).
* **C. Faisceaux / Canalisations :**
    * Les tuyaux d'air (Polyamide 11) fondent si exposés à > 130°C (Tmax de service : +60°C).

### 3.5 EXPERTISE MÉTALLURGIQUE : ANALYSE THERMIQUE HDR
L'IA exploite le HDR de la caméra pour analyser les couleurs de revenu de l'acier et prouver un échauffement destructif.
* **Zone 1 (Jaune Paille - 220°C) :** Dureté max. Alerte IA si pièce de friction = début de glaçage.
* **Zone 2/3 (Jaune Foncé/Violet - 260/285°C) :** Bon équilibre, début perte dureté.
* **Zone 4 (Bleu - 295°C) : DANGER.** Acier détrempé. *Alerte IA (ex: Disque de frein) : Surchauffe extrême > 290°C. Remplacement du composant obligatoire (perte résistance structurelle).*
* **Zone 5 (Gris - >350°C) : DESTRUCTION.** Acier adouci (recuit). Vitesse de friction excessive ou manque lubrification. Remplacement immédiat.

### 3.6 ARBORESCENCE D'INTERVENTION (LE SCRIPT VOCAL IA)
Format d'échange vocal strict de l'IA (Tunnel Live) :
1. **Identification visuelle :** *"Montre-moi [l'organe] avec la caméra."*
2. **Test Croisé :** *"Place ton multimètre sur les bornes A et B. Lis la valeur ou montre l'écran."*
3. **Décision :** *"Valeur anormale. Remonte le faisceau jusqu'au calculateur."*
4. **Clôture :** *"Remplacement validé. Efface le défaut avec la valise."*