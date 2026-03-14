# 🔧 🚛 LOCATE GARAGE | RÉFÉRENTIEL MÉCANIQUE VL / PL (M5)

**Date mise à jour :** *13 Mars 2026*
**Statut :** BIBLE MÉTIER - ARCHITECTURE "LIVE DIAGNOSTIC", "FOD" & "REALTIME SUPABASE" 🟢
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
    │   │   └── 📄 geminiService.ts     # Cerveau Vision (Intègre analyzeServanteFOD pour détection mousse)
    │   └── 📁 security/
    │       ├── 📄 supabaseClient.ts    # Pont de connexion vers le Backend
    │       └── 📄 useUserTier.ts       # Gestionnaire de Grade Dynamique (Écoute table 'profiles')
    └── 📂 modules/garage/              # 🔧 M5 : LA MAINTENANCE (Garage)
        ├── 📁 components/              # Interface utilisateur tactique (HUD)
        │   ├── 📄 LiveAssistant.tsx    # Cockpit Tactique "Garage" (Rouge) avec PTT
        │   ├── 📄 GaragePdfButton.tsx  # Export PDF d'intervention
        │   ├── 📄 PriseDePosteReport.tsx # Gabarit PDF FOD (Audit simple)
        │   └── 📄 FinDePosteReport.tsx # Gabarit PDF FOD (Comparatif Avant/Après côte à côte)
        ├── 📁 services/                # Logique métier spécifique
        │   └── 📄 reportService.ts     # Générateur d'Ordres de Réparation (White Label)
        └── 📁 views/                   # Écrans principaux du module
            ├── 📄 GarageDashboard.tsx  # Aiguilleur Tactique Flex-1 (Cyan/Rouge)
            ├── 📄 PriseDePoste.tsx     # Module d'acquisition matin (mitraillage + IA)
            ├── 📄 FinDePoste.tsx       # Module de clôture (récupération mémoire locale)
            └── 📄 TourDeControle.tsx   # Hub Superviseur en Temps Réel (WebSockets)

---

## ✅ 1. ACQUIS TECHNIQUES & ÉTAT DU SYSTÈME
Le module mécanique est fonctionnel et architecturé pour des déploiements industriels connectés :

* **Architecture Backend Temps Réel (Supabase) :** * Table `profiles` avec Trigger SQL pour automatisation des inscriptions (grade `FREE` par défaut).
    * Table `servantes_status` avec WebSockets (`channel`) pour pousser les mises à jour UI en temps réel sans rafraîchissement.
* **Ergonomie "Tactique Flat Design" :** Abandon strict des icônes 3D complexes au profit du Vectoriel Plat (`lucide-react`) pour garantir une lecture militaire, instantanée et haut contraste. Interface 100% fluide (`flex-1`).
* **Cerveau IA Partitionné :** Le `liveService.ts` injecte strictement les données `GARAGE_M5_RULES`. Isolation totale entre protocoles industriels et camions.
* **Ergonomie Terrain "Quick Tags" :** Remplacement de la saisie clavier fastidieuse par des boutons tactiles de motifs d'anomalie ("Outil sur chantier", "Rangement chaos") pour la déclaration de perte.
* **Pont Mémoriel Local (`localStorage`) :** Capacité de l'application à retenir les clichés de 08h00 pour les recracher à 17h00 dans le PDF final (Zéro-Cloud, Zéro-Latence).
* **Modèle Économique "Golden Time" :**
    * **Tier FREE :** Session Live limitée à 120s avec refroidissement progressif (frustration positive). Export PDF verrouillé.
    * **Tier PREMIUM/PRO :** Sessions illimitées, accès Tour de Contrôle et PDF.
* **RGPD Zéro-Trace :** Aucune image du châssis, des organes mécaniques ou des servantes n'est stockée sur le cloud après génération du PDF.

---

## 🎯 2. PROCESSUS OPÉRATIONNEL : LE STANDARD FOD / 5S EN TEMPS RÉEL

*Objectif : Garantir l'intégrité de la servante (Prise / Fin de poste) et offrir une supervision "Management par Exception" au Chef d'Atelier.*

### A. La Prise de Poste (08:00)
1. **L'Acquisition UI (Mitraillage) :** Prise de vue guidée au flash (Tiroir 1 à 6 + Plateau) sans temps de chargement inter-photos.
2. **L'Analyse IA Automatique (`useEffect`) :** Envoi asynchrone à Gemini Flash. L'IA cherche les zones de couleurs vives (mousse) indiquant un trou, ou les zones de chaos.
3. **Le Sas de Validation :** L'IA pré-remplit le rapport en ROUGE avec les "Quick Tags" si anomalie. Le tech valide.
4. **La Transmission & Sauvegarde :** Génération d'un PDF local. Sauvegarde silencieuse des photos dans la mémoire du téléphone (`locatem5_morning_ID`). Envoi d'un signal "Upsert" à Supabase.

### B. La Fin de Poste (17:00) - "Le Juge de Paix"
1. **Le Pont Temporel :** Le module fouille le `localStorage` et remonte les photos prises le matin même.
2. **L'Acquisition de Clôture :** Mitraillage de l'état actuel de la servante.
3. **Le PDF "Avant / Après" :** Génération du rapport comparatif. La grille PDF aligne la photo du matin (Gauche) et celle du soir (Droite) pour un constat visuel humain irréfutable.
4. **Mise à jour Base de données :** Signal Supabase pour clôturer l'état de la servante sur le serveur.

### C. La Tour de Contrôle (Le Hub Superviseur)
* Écran dédié au Chef d'Atelier. Connecté en **Live WebSockets**.
* **Management par Exception :** L'œil est attiré uniquement par les lignes rouges (Statut DÉGRADÉ) et les compteurs d'alerte. Les servantes CONFORMES restent silencieuses (vert/gris).
* **Temps Réel :** Si le technicien valide un problème à l'autre bout de l'atelier, l'alerte apparaît en moins de 100ms sur l'écran du Chef, avec l'heure exacte et le motif (tags).

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