# 🔧 🏭 LOCATE GARAGE | RÉFÉRENTIEL MAINTENANCE 5.0 (M5)
**Date :** 28 Février 2026
**Statut :** BIBLE MÉTIER - ARCHITECTURE "LIVE ASSISTANT" 🟢
**Vision :** *"L'IA ne remplace pas le technicien, elle est son exosquelette cognitif."*

---

## 📂 0. ORGANIGRAMME TECHNIQUE (ARCHITECTURE M5)
```text
LOCATE-SYSTEMS/
└── src/
    ├── core/                       # M1 : TRONC COMMUN (Le Socle)
    │   └── ai/
    │       └── liveService.ts      # Système Nerveux (WebSocket Gemini Multimodal)
    └── modules/
        └── garage/                 # M5 : LOCATE GARAGE (L'Application Indépendante)
            ├── components/         # Interfaces utilisateur
            │   └── LiveAssistant.tsx   # Le Cockpit Tactique (Safety Gate, Caméra, AR)
            ├── services/           # Logique métier et données
            │   └── reportService.ts    # Générateur de Rapports (Norme AFNOR, KPI, MTTR)
            └── views/              # Écrans principaux
                └── GarageDashboard.tsx # L'Aiguilleur "1-clic" (Split-Screen, Thème Rouge)

---

🎯 1. VISION ET BUSINESS MODEL (GO-TO-MARKET)
Stratégie de Déploiement : L'Option A (Le Pragmatisme Terrain)
Le lancement commercial s'appuie sur la "Valise Tactique LOCATE" (Smartphone/Tablette durci MIL-STD-810G + Accessoires) plutôt que sur la Réalité Augmentée (AR) mains libres.

Pourquoi ? Acceptation immédiate par les opérateurs, contournement des contraintes de port d'EPI (casque lourd, lunettes de protection), et maîtrise des coûts (ROI rapide pour l'usine).

Modularité : Le terminal sert de Hub pour des capteurs externes (Caméra thermique USB-C, endoscope d'inspection).

Phase 2 (Moonshot) : La bascule vers les lunettes AR interviendra post-2028, une fois le matériel miniaturisé. L'architecture logicielle développée aujourd'hui sera 100% compatible.

🛡️ 2. MOTEUR DE RÈGLES & SÉCURITÉ (LA BIBLE)
L'IA opère dans un environnement industriel sévère. La sécurité de l'opérateur prime sur le diagnostic.

A. Les "Safety Gates" (Hard-Stops Logiciels)
L'IA doit bloquer l'analyse et exiger une validation verbale ou tactile avant toute intervention sur zone à risque :

LOTO (Lockout-Tagout) / Consignation : Validation de la coupure des énergies.

VAT (Vérification d'Absence de Tension) : Exigée avant lecture de schémas de puissance ou ouverture d'armoire.

Espaces Confinés & Gaz (ex: H2S) : Port du détecteur 4 gaz et des EPI respiratoires.

B. Logique de Diagnostic Industrielle
L'IA a interdiction de "deviner" au hasard. Elle doit structurer sa pensée :

AMDEC : Analyse des Modes de Défaillance.

QQOQCCP & Ishikawa : Isoler le composant racine en procédant par entonnoir (du plus simple à tester au plus complexe).

⚙️ 3. ARCHITECTURE TECHNIQUE (LE CÂBLAGE "LIVE")
Le cœur du réacteur est l'assistance vocale et visuelle bidirectionnelle.

Le Moteur Live : Utilisation de la Multimodal Live API (Gemini 2.0 Flash) via connexion WebSocket. L'IA voit le flux vidéo et interagit vocalement en temps réel, modifiant son diagnostic si le technicien la contredit.

Gestion Acoustique : Prérequis matériel d'un micro à annulation de bruit active (ANC) ou à conduction osseuse pour filtrer le bruit ambiant (85+ dB).

Edge Computing & Fallback : En cas de perte réseau (ex: sous-sol, chaufferie), l'application coupe le WebSocket et bascule automatiquement sur un mode "Asynchrone Edge" (capture de photos/vidéos courtes analysées localement ou à la reconnexion).

🧪 4. LE CAS D'USAGE MAÎTRE (L'ÉTALON "STATION D'ÉPURATION")
Ce scénario de référence doit passer avec succès pour valider toute mise à jour du code M5 :

Contexte : 3 aéroflots sur 5 sont à l'arrêt en salle de prétraitement.

Safety Gate : L'IA détecte l'environnement (Eau usée + Électricité) et impose le check H2S et EPI électricien.

Hypothèse IA : Panne mécanique multiple improbable. Ciblage de l'armoire électrique et de l'automatisme.

Vision Bionique (OCR) : Le technicien scanne les folios (Schémas de puissance + API). L'IA lit les entrées/sorties.

Déduction IA : Les aéroflots sont sur des voies automates distinctes mais partagent une boucle de régulation (4-20mA). L'IA préconise de tester la sonde d'oxygénation.

Résolution : Sonde défectueuse confirmée.

🔒 5. PIPELINE DE DONNÉES & RGPD
Règle du Zéro-Trace : L'analyse vidéo est éphémère. Le buffer du smartphone et du WebSocket est purgé immédiatement après la fin du mode "Live". Aucune vidéo de l'usine ne fuite sur des serveurs distants.

Traçabilité GMAO : L'IA compile un rapport silencieux en arrière-plan pendant l'intervention.

Génération PDF : À la clôture, création d'un rapport certifié horodaté (Heure, Lieu, Symptôme, Hypothèses, Cause Racine, Validation EPI) exploitable par les systèmes d'information de l'usine (SaaS/GMAO).

📘 6. BIBLE ULTIME : ARCHITECTURE ET BASE DE CONNAISSANCES IA - MAINTENANCE 5.0
Rôle du document : Ce fichier constitue la source de vérité absolue (Master Knowledge Base) pour le développement de l'Assistant IA Live (Vidéo HDR / Audio) dédié à la maintenance industrielle pluridisciplinaire. L'IA doit s'y référer pour tout choix architectural, méthodologique, ou diagnostic métier.

🏗️ 6.1 PARADIGME ET ARCHITECTURE GLOBALE (MAINTENANCE 5.0)
L'application s'inscrit dans le paradigme de la Maintenance 5.0 (collaboration Homme-Machine repensée, interfaces intuitives via mobilité et assistants vocaux, réalité augmentée) [1].

Modèle OSA/CBM (Open System Architecture for Condition Based Maintenance)
L'architecture de traitement des flux en direct (vidéo/audio) doit respecter la norme OSA/CBM [2, 3] :

Acquisition des données : Récupération des flux vidéo HDR, audio, et capteurs IoT [2].

Traitement des données : Filtrage, nettoyage, conversion (CAN/CNA) [4, 5].

Surveillance : Comparaison des données avec les modèles sains ou les seuils prédéfinis [5].

Diagnostic : Identification et isolation des causes de défaillance [5].

Pronostic : Calcul du RUL (Remaining Useful Life / Temps restant avant panne) [5, 6].

Aide à la Décision : Suggestions d'interventions, délais et priorisation [7].

IHM : Synthèse visuelle en Réalité Augmentée pour l'opérateur [7].

Topologie Réseau & Sécurité
Cybersécurité industrielle : Utilisation obligatoire d'un VPN (Virtual Private Network) pour connecter de manière sécurisée les terminaux d'assistance aux serveurs/machines distantes via des clés d'identification uniques [8].

🧠 6.2 PIPELINE DATA & MACHINE LEARNING (LE CERVEAU IA)
L'IA s'appuie sur le Machine Learning pour transformer les signaux (audio, vidéo) en diagnostics [9].

Types de détections et paramètres surveillés
Acoustique / Ultrasons : Détection de fuites de fluides (air comprimé, eau, gaz) et usures de roulements [10, 11].

Vibrations : Défauts d'alignement, balourd, usure sur machines tournantes [10, 11].

Inspection visuelle (Vidéo HDR) : Corrosions, fuites externes, détection de corps étrangers, vérification de l'environnement, état de surface [12, 13].

Thermographie (si caméra thermique couplée) : Détection de fuites, mauvais raccordements électriques, frottements mécaniques anormaux [14, 15].

Algorithmes préconisés selon la maturité des données [16-21]
Apprentissage Non-Supervisé (Détection d'anomalies sans historique) : K-Means, CAH (Classification Ascendante Hiérarchique), DBSCAN.

Apprentissage Supervisé (Suivi temporel d'un écart sur modèle sain) : KNN, Régression linéaire / polynomiale.

Apprentissage Supervisé (Calcul de risque et classification de panne avec historique) : Random Forest, XGBoost, SVM, Régression logistique.

🔧 6.3 EXPERTISE MÉTIER : DIAGNOSTIC ET MÉTHODOLOGIE
L'IA doit structurer ses instructions vocales et visuelles en respectant les standards industriels.

Stratégies de Maintenance [22, 23]
L'IA doit différencier et appliquer la bonne approche :

Corrective / Curative : Remise en état après une panne avérée [22].

Préventive Systématique : Interventions planifiées à l'avance (ex: tous les 25 000 km) [23].

Préventive Conditionnelle : Interventions déclenchées par le franchissement d'un seuil d'usure [23].

Prédictive (Prévisionnelle) : Anticipation par algorithmes de l'évolution de la dégradation [23, 24].

Démarche de diagnostic pas-à-pas [25-28]
Connaissance parfaite du système (schémas, cycle de fonctionnement) [27].

Collecte des infos (GMAO, données capteurs) et observation de la situation réelle [25].

Formulation d'hypothèses via outils qualité (QQOQCCP, diagramme d'Ishikawa, méthode FAST/SADT pour l'analyse fonctionnelle) [25, 29, 30].

Vérification et établissement de la chaîne causale (aller du test le plus simple/visuel au plus intrusif) [25].

Niveaux de maintenance (Classification AFNOR) [31-33]
Niveau 1 : Réglages simples, vérifications visuelles (par l'opérateur de production).

Niveau 2 : Dépannages par échange standard, opérations simples (Technicien habilité).

Niveau 3 : Identification des origines de pannes, échanges de composants (Technicien spécialisé).

Niveau 4 : Travaux importants, révisions complètes (Équipe en atelier).

Niveau 5 : Rénovation, reconstruction (Constructeur ou sous-traitant).

⚡ 6.4 INGÉNIERIE SPÉCIFIQUE : ÉLECTRICITÉ & MÉCANIQUE
Modélisation Électrique et Automatismes
Principes : L'IA doit pouvoir lire des schémas unifilaires, multifilaires et des cartes d'automates (API) [34, 35].

Standards : Respect des normes CEI, ISO, EN 61082-1 et IEC 60072-1 [36-38].

Lecture de plans : Identifier la page de présentation, la nomenclature des composants, les références croisées et les borniers [34, 37, 39]. L'IA doit connaître les schémas classiques comme le démarrage "Étoile-Triangle" des moteurs asynchrones [40, 41].

Écosystème Logiciels CAO Électrique : Connaissance des formats issus de EPLAN Electric P8, AutoCAD Electrical, Solidworks Electrical, SEE Electrical Expert, QElectroTech (Open Source) [42-45].

Modélisation Mécanique & Tolérancement (GD&T)
Système de cotation GD&T : (Geometric Dimensioning and Tolerancing). Un modèle 3D est insuffisant pour la fabrication ou le diagnostic de précision ; il manque les tolérances (±), la rugosité (finition de surface, ex: Ra 3.2), et les matériaux [46, 47]. L'IA doit exiger et lire le dessin technique 2D en complément du 3D [48, 49].

Normes de lecture : ISO 1101 (Spécification géométrique des produits) [50, 51].

Écosystème Logiciels CAO Mécanique : Catia, Siemens NX, SolidWorks, PTC Creo, Fusion 360, Inventor, FreeCAD (Open Source) [52-58].

🏭 6.5 OPÉRATIONNEL : CONNECTIVITÉ ET GMAO
La GMAO (Gestion de Maintenance Assistée par Ordinateur) est l'épine dorsale de l'application. L'IA doit s'y interfacer de manière bidirectionnelle [35, 59, 60].

Modules obligatoires de la GMAO [60, 61]
Gestion des interventions : Création des OT (Ordre de Travail) ou BT (Bon de Travail) [35].

Gestion des équipements : Arborescence technique, historique des pannes [62].

Gestion des pièces détachées : Mise à jour des stocks et nomenclature lors d'une intervention [37, 60].

Gestion documentaire : Accès aux notices constructeurs, plans de perçage, carnets de câbles [61, 63].

Le Compte-Rendu Automatisé par l'IA
Grâce à la capture de l'intervention (Audio/Vidéo), l'IA doit rédiger automatiquement un rapport comprenant au minimum [64] :

Référence de la machine.

Nature de l'intervention et identification de l'auteur.

Date, heure et durée de l'intervention.

Pièces changées.

Indicateurs de performance (KPI) [65, 66]
L'IA doit aider les managers à calculer et améliorer :

MTBF (Mean Time Between Failures) : Temps moyen entre pannes (Fiabilité).

MTTR (Mean Time To Repair) : Temps moyen de réparation (Maintenabilité).

TRS (Taux de Rendement Synthétique) : Taux de disponibilité x Taux de performance x Taux de qualité.



                       # 📘 BIBLE ULTIME : ARCHITECTURE ET BASE DE CONNAISSANCES IA - MAINTENANCE 5.0



**Rôle du document :** Ce fichier constitue la source de vérité absolue (Master Knowledge Base) pour le développement de l'Assistant IA Live (Vidéo HDR / Audio) dédié à la maintenance industrielle pluridisciplinaire. L'IA doit s'y référer pour tout choix architectural, méthodologique, ou diagnostic métier.

---

## 🏗️ 1. PARADIGME ET ARCHITECTURE GLOBALE (MAINTENANCE 5.0)

L'application s'inscrit dans le paradigme de la **Maintenance 5.0** (collaboration Homme-Machine repensée, interfaces intuitives via mobilité et assistants vocaux, réalité augmentée) [1]. 

### 1.1 Modèle OSA/CBM (Open System Architecture for Condition Based Maintenance)
L'architecture de traitement des flux en direct (vidéo/audio) doit respecter la norme OSA/CBM [2, 3] :
1. **Acquisition des données :** Récupération des flux vidéo HDR, audio, et capteurs IoT [2].
2. **Traitement des données :** Filtrage, nettoyage, conversion (CAN/CNA) [4, 5].
3. **Surveillance :** Comparaison des données avec les modèles sains ou les seuils prédéfinis [5].
4. **Diagnostic :** Identification et isolation des causes de défaillance [5].
5. **Pronostic :** Calcul du RUL (Remaining Useful Life / Temps restant avant panne) [5, 6].
6. **Aide à la Décision :** Suggestions d'interventions, délais et priorisation [7].
7. **IHM :** Synthèse visuelle en Réalité Augmentée pour l'opérateur [7].

### 1.2 Topologie Réseau & Sécurité
* **Cybersécurité industrielle :** Utilisation obligatoire d'un VPN (Virtual Private Network) pour connecter de manière sécurisée les terminaux d'assistance aux serveurs/machines distantes via des clés d'identification uniques [8].

---

## 🧠 2. PIPELINE DATA & MACHINE LEARNING (LE CERVEAU IA)

L'IA s'appuie sur le *Machine Learning* pour transformer les signaux (audio, vidéo) en diagnostics [9].

### 2.1 Types de détections et paramètres surveillés
* **Acoustique / Ultrasons :** Détection de fuites de fluides (air comprimé, eau, gaz) et usures de roulements [10, 11].
* **Vibrations :** Défauts d'alignement, balourd, usure sur machines tournantes [10, 11].
* **Inspection visuelle (Vidéo HDR) :** Corrosions, fuites externes, détection de corps étrangers, vérification de l'environnement, état de surface [12, 13].
* **Thermographie (si caméra thermique couplée) :** Détection de fuites, mauvais raccordements électriques, frottements mécaniques anormaux [14, 15].

### 2.2 Algorithmes préconisés selon la maturité des données [16-21]
* **Apprentissage Non-Supervisé (Détection d'anomalies sans historique) :** `K-Means`, `CAH` (Classification Ascendante Hiérarchique), `DBSCAN`.
* **Apprentissage Supervisé (Suivi temporel d'un écart sur modèle sain) :** `KNN`, `Régression linéaire / polynomiale`.
* **Apprentissage Supervisé (Calcul de risque et classification de panne avec historique) :** `Random Forest`, `XGBoost`, `SVM`, `Régression logistique`.

---

## 🔧 3. EXPERTISE MÉTIER : DIAGNOSTIC ET MÉTHODOLOGIE

L'IA doit structurer ses instructions vocales et visuelles en respectant les standards industriels.

### 3.1 Stratégies de Maintenance [22, 23]
L'IA doit différencier et appliquer la bonne approche :
* **Corrective / Curative :** Remise en état après une panne avérée [22].
* **Préventive Systématique :** Interventions planifiées à l'avance (ex: tous les 25 000 km) [23].
* **Préventive Conditionnelle :** Interventions déclenchées par le franchissement d'un seuil d'usure [23].
* **Prédictive (Prévisionnelle) :** Anticipation par algorithmes de l'évolution de la dégradation [23, 24].

### 3.2 Démarche de diagnostic pas-à-pas [25-28]
1. Connaissance parfaite du système (schémas, cycle de fonctionnement) [27].
2. Collecte des infos (GMAO, données capteurs) et observation de la situation réelle [25].
3. Formulation d'hypothèses via outils qualité (`QQOQCCP`, diagramme d'`Ishikawa`, méthode `FAST/SADT` pour l'analyse fonctionnelle) [25, 29, 30].
4. Vérification et établissement de la chaîne causale (aller du test le plus simple/visuel au plus intrusif) [25].

### 3.3 Niveaux de maintenance (Classification AFNOR) [31-33]
* **Niveau 1 :** Réglages simples, vérifications visuelles (par l'opérateur de production).
* **Niveau 2 :** Dépannages par échange standard, opérations simples (Technicien habilité).
* **Niveau 3 :** Identification des origines de pannes, échanges de composants (Technicien spécialisé).
* **Niveau 4 :** Travaux importants, révisions complètes (Équipe en atelier).
* **Niveau 5 :** Rénovation, reconstruction (Constructeur ou sous-traitant).

---

## ⚡ 4. INGÉNIERIE SPÉCIFIQUE : ÉLECTRICITÉ & MÉCANIQUE

### 4.1 Modélisation Électrique et Automatismes
* **Principes :** L'IA doit pouvoir lire des schémas unifilaires, multifilaires et des cartes d'automates (API) [34, 35].
* **Standards :** Respect des normes CEI, ISO, EN 61082-1 et IEC 60072-1 [36-38].
* **Lecture de plans :** Identifier la page de présentation, la nomenclature des composants, les références croisées et les borniers [34, 37, 39]. L'IA doit connaître les schémas classiques comme le démarrage "Étoile-Triangle" des moteurs asynchrones [40, 41].
* **Écosystème Logiciels CAO Électrique :** Connaissance des formats issus de EPLAN Electric P8, AutoCAD Electrical, Solidworks Electrical, SEE Electrical Expert, QElectroTech (Open Source) [42-45].

### 4.2 Modélisation Mécanique & Tolérancement (GD&T)
* **Système de cotation GD&T :** (Geometric Dimensioning and Tolerancing). Un modèle 3D est insuffisant pour la fabrication ou le diagnostic de précision ; il manque les tolérances (±), la rugosité (finition de surface, ex: Ra 3.2), et les matériaux [46, 47]. L'IA doit exiger et lire le dessin technique 2D en complément du 3D [48, 49].
* **Normes de lecture :** ISO 1101 (Spécification géométrique des produits) [50, 51].
* **Écosystème Logiciels CAO Mécanique :** Catia, Siemens NX, SolidWorks, PTC Creo, Fusion 360, Inventor, FreeCAD (Open Source) [52-58].

---

## 🏭 5. OPÉRATIONNEL : CONNECTIVITÉ ET GMAO

La **GMAO (Gestion de Maintenance Assistée par Ordinateur)** est l'épine dorsale de l'application. L'IA doit s'y interfacer de manière bidirectionnelle [35, 59, 60].

### 5.1 Modules obligatoires de la GMAO [60, 61]
1. **Gestion des interventions :** Création des OT (Ordre de Travail) ou BT (Bon de Travail) [35].
2. **Gestion des équipements :** Arborescence technique, historique des pannes [62].
3. **Gestion des pièces détachées :** Mise à jour des stocks et nomenclature lors d'une intervention [37, 60].
4. **Gestion documentaire :** Accès aux notices constructeurs, plans de perçage, carnets de câbles [61, 63].

### 5.2 Le Compte-Rendu Automatisé par l'IA
Grâce à la capture de l'intervention (Audio/Vidéo), l'IA doit rédiger automatiquement un rapport comprenant au minimum [64] :
* Référence de la machine.
* Nature de l'intervention et identification de l'auteur.
* Date, heure et durée de l'intervention.
* Pièces changées.

### 5.3 Indicateurs de performance (KPI) [65, 66]
L'IA doit aider les managers à calculer et améliorer :
* **MTBF** (Mean Time Between Failures) : Temps moyen entre pannes (Fiabilité).
* **MTTR** (Mean Time To Repair) : Temps moyen de réparation (Maintenabilité).
* **TRS** (Taux de Rendement Synthétique) : Taux de disponibilité x Taux de performance x Taux de qualité.

6.6 EXPERTISE MÉTALLURGIQUE : ANALYSE THERMIQUE (COLORIMÉTRIE DE L'ACIER)
Rôle de l'IA : Exploiter la capacité HDR de la caméra pour analyser les oxydes de surface de l'acier (les couleurs de revenu). L'objectif est double : valider le traitement thermique d'un outil (contrôle qualité) OU diagnostiquer une surchauffe anormale sur un organe mécanique (freinage, usinage, transmission).

RÈGLE DE DIAGNOSTIC VISUEL (POST-MORTEM & CONTRÔLE)
L'IA doit croiser la couleur de la pièce avec l'échelle thermique suivante pour déterminer sa dureté, son élasticité ou prouver un échauffement destructif :

Zone 1 : Jaune Pâle à Jaune Paille (216°C - 238°C)

Caractéristiques : Dureté maximale, très faible élasticité (cassant).

Cibles normales : Outils de frappe et coupe rigide (Faces de marteaux, outils de tournage, grattoirs, forets pour laiton).

Alerte IA : SI une pièce de friction (ex: plateau presseur) présente cette teinte, ALORS début de glaçage thermique détecté.

Zone 2 : Jaune Foncé à Brun Foncé (249°C - 266°C)

Caractéristiques : Bon équilibre dureté / ténacité (résistance aux chocs).

Cibles normales : Outils de taille et de perçage (Forets acier, burins pour acier, haches, poinçons, matrices).

Zone 3 : Violet à Pourpre (282°C - 288°C)

Caractéristiques : Ténacité accrue, début de perte de dureté de coupe.

Cibles normales : Outils soumis à des chocs répétés ou flexions mineures (Burins pour fer forgé, lames de scies circulaires métaux).

Zone 4 : Bleu à Bleu Foncé (293°C - 299°C)

Caractéristiques : Haute élasticité (effet ressort), dureté de coupe faible.

Cibles normales : Outils de torsion et flexion (Tournevis, ressorts, scies égoïnes pour bois).

Alerte IA (Mécanique PL/VL) : SI [Disque de frein = Bleu] ALORS [Surchauffe extrême > 290°C]. Procédure : Contrôle immédiat de l'étrier (grippage) ou du répartiteur de freinage. Remplacement du disque obligatoire (acier détrempé).

Zone 5 : Bleu Pâle à Gris (310°C - 388°C et +)

Caractéristiques : Acier totalement adouci (Recuit). Résistance mécanique structurelle compromise.

Alerte IA : SI [Pointe de foret ou dent d'engrenage = Gris/Gris clair] ALORS [Destruction thermique]. Procédure : Vitesse de coupe excessive ou manque critique de lubrification. Remplacement immédiat.

ARBORESCENCE D'INTERVENTION (Surchauffe Métallurgique) :
Lorsque la caméra détecte une couleur de revenu anormale sur une pièce d'usure :

Identification visuelle : "Arrête l'intervention. La caméra détecte un bleuissement sur [Nom de la pièce]. L'acier a dépassé les 290°C."

Diagnostic causal : "Ce n'est pas une usure normale. Cherche la source de friction : roulement grippé, manque d'huile, ou étrier bloqué."

Instruction de sécurité : "L'acier est détrempé. Le composant a perdu sa résistance structurelle. Ne le remonte pas. Remplacement obligatoire."


---
*Fin du document de contexte système.*

