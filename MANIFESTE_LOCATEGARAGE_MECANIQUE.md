🔧 🚛 LOCATE GARAGE | RÉFÉRENTIEL MÉTIER (M5)
Statut : ARCHITECTURE "LIVE DIAGNOSTIC" 🟢
Vision : "L'IA est le Chef d'Atelier embarqué : l'œil qui sécurise, l'oreille qui écoute, le cerveau qui décale la panne."

📂 ORGANIGRAMME TECHNIQUE RÉEL (MODULE GARAGE & CORE M5)

src/modules/garage/
├── components/
│   ├── GaragePdfButton.tsx  # Bouton d'export PDF isolé (Lazy Loading pour perfs)
│   ├── GarageReport.tsx     # Template du rapport d'intervention (GMAO & Ordre de Réparation)
│   └── LiveAssistant.tsx    # Cockpit Live IA (Flux Caméra, Safety Gates, Terminal Diagnostic)
├── services/
│   └── reportService.ts     # Formatage des données de clôture (MTTR, AFNOR / Mécanique)
└── views/
    └── GarageDashboard.tsx  # Menu d'aiguillage (Maintenance Industrielle vs Mécanique)

src/core/ai/
├── expertisemetier/
│   └── mecanique.ts         # BIBLE MÉTIER : Règles GARAGE_M5_RULES (Sécurité, Couples, Thermique, J1939)
├── liveService.ts           # Tunnel WebSocket sécurisé (Gemini Bidi Bêta)
└── vehicleLiveDiag.ts       # Moteur de Sécurité Live M5 (Validation visuelle EPI/Levage)


🎯 1. VISION ET BUSINESS MODEL (GO-TO-MARKET)

Stratégie de Déploiement : La "Valise Diag 5.0" et lunette VR type META
Le lancement cible les ateliers de transporteurs routiers et les mécaniciens itinérants. L'application transforme un smartphone durci en outil de diagnostic total, remplaçant les PC encombrants.

Pourquoi ? Le gain de temps (MTTR) est le nerf de la guerre en logistique. Un PL immobilisé coûte des milliers d'euros par jour. L'IA guide instantanément vers le composant défectueux sans avoir à feuilleter 500 pages de RTA.

Modularité : Le terminal se connecte en Bluetooth aux sondes (VCI) OBD-II / J1939 du véhicule tout en utilisant la caméra et le micro du smartphone pour confirmer physiquement la panne.

🛡️ 2. MOTEUR DE RÈGLES & SÉCURITÉ (LA BIBLE PRIORITÉ 0)
Dans les ateliers PL/VL, le risque mortel (écrasement, électrisation) est permanent. L'IA a un droit de veto absolu sur l'intervention.

A. Les "Safety Gates" (Hard-Stops Vidéo)
L'IA bloque le diagnostic si elle ne valide pas visuellement ces points :

Levage / Sous-châssis : Interdiction d'intervenir sous maintien hydraulique seul. Confirmation visuelle obligatoire des chandelles ou béquilles mécaniques.

Consignation / Véhicules Électriques (VE) : Si la tension système > 60V DC ou 25V AC, l'IA exige l'affichage visuel de l'habilitation (B1VL/B2VL/BCL) et le port des gants isolants (Classe 0) avec sur-gants cuir.

Hydraulique Lourde (ex: Ampliroll) : Consignation de la Prise de Mouvement (PTO) obligatoire avant intervention sur les flexibles.

B. Logique de Communication (Zéro-Fioriture)

Zéro phrase de courtoisie. Format exigé : "Étape [X] : Fais [Action]. Dis 'Fait' quand c'est terminé."

Isolement du doute : Aucune extrapolation. Si la vidéo est floue ou l'audio saturé, l'IA ordonne : "Visuel non conforme. Nettoie la lentille."

⚙️ 3. ARCHITECTURE TECHNIQUE (LE CÂBLAGE "LIVE")
Le système croise la donnée informatique du camion avec la réalité physique de l'atelier.

Le Moteur Live : Fusion de données. L'IA écoute les codes défauts du bus CAN (via pont Bluetooth) ET observe simultanément le moteur avec la caméra.

Analyse Audio Spectrale : Le micro est calibré pour isoler les fréquences critiques : claquement d'injecteur, sifflement de turbo, bruit de "graviers" (cavitation d'une pompe hydraulique).

Lecture OCR / Instrumentale : Lecture en temps réel des manomètres analogiques, des multimètres, et des étiquettes de calculateurs.

🧪 4. LE CAS D'USAGE MAÎTRE (L'ÉTALON "PANNE FREINAGE PL")
Ce scénario valide le code de LOCATE GARAGE :

Contexte : Tracteur Routier DAF. Alerte tableau de bord : Pression d'air insuffisante.

Safety Gate : L'IA vérifie le calage des roues (vidéo) avant d'autoriser le technicien à passer sous le châssis.

Test Audio/Visuel : L'IA demande au mécanicien de pomper sur la pédale de frein. Le micro capte une fuite d'air (sifflement) au niveau de l'essieu arrière.

Lecture Instrumentale : L'IA demande la lecture du manomètre de régulation. L'OCR lit 5.8 bars (Anormal : la norme UTAC exige 7.2 à 8.1 bars pour le dessiccateur).

Résolution : L'IA identifie la valve de purge du dessiccateur bloquée ouverte. Instruction de remplacement.

🔒 5. PIPELINE DE DONNÉES & TMS (Transport Management System)
Zéro-Trace : Les flux vidéo sous les jupes des camions ou des bancs d'essais ne sont jamais stockés sur le cloud.

Rapport d'Expertise (CT / UTAC) : Génération immédiate d'un PDF certifié à la fin de l'intervention, prouvant que les couples de serrage ont été respectés et documentés (photo de la clé dynamométrique). Ce rapport est envoyé direct au TMS de la flotte.

📘 6. BIBLE ULTIME : BASE DE CONNAISSANCES IA - MÉCANIQUE VL / PL
6.1 PIPELINE DATA & DIAGNOSTIC MULTIMODAL
L'IA analyse les défauts selon une matrice stricte (Symptôme -> Code -> Visuel -> Électrique).

Audio : Sifflements d'air (EBS/Pneumatique), claquements (embiellage, distribution), cavitation (hydraulique).

Visuel HDR : Suintements d'huile, oxydation des connecteurs, état des courroies, lecture d'usure des témoins de plaquettes.

6.2 EXPERTISE MÉTIER : MULTIPLEXAGE & PROTOCOLES
L'IA doit traduire le langage machine (Bus CAN) en diagnostic physique.

Protocole PL (SAE J1939) : Analyse via format SPN / FMI.

FMI 3 : Court-circuit au pôle +.

FMI 4 : Court-circuit à la masse.

FMI 5 : Circuit ouvert (fil coupé, connecteur débranché).

Protocole VL (OBD-II) : Classification Powertrain (P0xxx), Chassis (C0xxx), Body (B0xxx), Network (U0xxx).

6.3 INGÉNIERIE SPÉCIFIQUE : VALEURS CRITIQUES (HARD-CODED/RAG)
L'IA doit contrôler visuellement les actes critiques du technicien, notamment les couples de serrage lors de la remise en service :

Liaison au sol PL (Serrage en croix "à sec") :

Volvo FH/FM : 610 Nm.

Scania / Mercedes / DAF : 600 Nm.

Renault Trucks T : 450 - 500 Nm.

Alerte IA obligatoire : Planifier un resserrage à 100 km dans la GMAO de la flotte.

Freinage Pneumatique (Normes UTAC) :

Pression d'essai réglementaire : 6,2 à 6,9 bars.

Test d'épuisabilité : Validation de 4 coups de pédale minimum après alarme.

6.4 ARBORESCENCE D'INTERVENTION (LE SCRIPT VOCAL)
Pour chaque code défaut ou anomalie signalée :

Identification visuelle : "Montre-moi [l'organe] avec la caméra."

Test Croisé : "Place ton multimètre sur les bornes A et B. Lis la valeur ou montre l'écran."

Décision (Conditionnel) : SI valeur anormale ALORS remplacement. SINON "Remonte le faisceau jusqu'au calculateur."

Clôture Légale : Rappel de la règle constructeur pour l'effacement du défaut critique.

ANALYSE DE LA REQUÊTE : AIDE AU DIAGNOSTIC – ÉCHAUFFEMENT DES MÉTAUX ET SYSTÈMES
En tant qu'Ingénieur en Chef, voici le protocole standardisé pour identifier, diagnostiquer et traiter les anomalies thermiques (échauffement excessif) sur les systèmes mécaniques, hydrauliques et de freinage, basé sur les données certifiées.
1. SYMPTOMATOLOGIE
Système de Freinage (EBS) : Allumage du témoin jaune d'information au tableau de bord, affichage d'un symbole d'avertissement, pédale de frein "spongieuse" nécessitant un effort accru. Code défaut potentiel J1939 SPN 3839 (Brake Temperature Warning).
Système Hydraulique : Fonctionnement normal à froid, mais ralentissement marqué des cycles et perte de puissance dès la montée en température du circuit (baisse de viscosité de l'huile).
Ralentisseur Électromagnétique : Constat visuel de l'isolant des bobines fondu, ou rotor fendu/cassé.
Pneumatiques : Surchauffe de l'enveloppe liée à un sous-gonflage ou une surcharge (risque d'éclatement).
2. ARBRE DE DIAGNOSTIC (TOP-DOWN)
BRANCHE A : Échauffement au niveau des essieux (Freins / Moyeux)
SI voyant de température de frein allumé ALORS :
Vérifier les paramètres de conduite (sollicitation excessive des freins de service en descente au lieu du ralentisseur).
Contrôler mécaniquement les étriers de frein : Un étrier grippé (binding brake caliper) génère une chaleur continue qui déclenche la modulation de pression EBS et l'alerte.
SI jante/tambour encrassé d'huile/graisse brûlée ALORS contrôler l'étanchéité des joints de moyeu d'essieu.
BRANCHE B : Échauffement du système Hydraulique
SI perte de puissance à chaud ALORS effectuer un diagnostic tactile (avec précaution) sur le corps de pompe ou le réservoir :
40°C : Sensation de forte fièvre.
50°C : La main se réchauffe, la paume transpire.
60°C : Très chaud, tolérable environ 10 secondes.
70°C : Tolérable environ 3 secondes.
80°C : Toucher momentané, douleur aiguë (risque de brûlure).
SI température > 60°C de façon anormale ALORS contrôler le limiteur de pression. Un tarage trop élevé ou un clapet bloqué force la pompe à laminer l'huile, générant une surchauffe destructive.
BRANCHE C : Échauffement des canalisations / Faisceaux
SI passage de canalisations près du bloc moteur ou ligne d'échappement ALORS inspecter les conduites rigides et flexibles. Un contact avec un point très chaud provoque la destruction de la conduite.
3. SCHÉMATISATION LOGIQUE
Flux Mécanique (Freinage) : Étrier grippé → Frottement cinétique permanent → Accumulation thermique dans le métal (disque/tambour) → Détection par l'algorithme EBS via horloge et température ambiante → Alerte conducteur et modification de la sensation pédale.
Flux Fluide (Hydraulique) : Dysfonctionnement limiteur de pression → Lamination du fluide → Montée en température du circuit → Chute de la viscosité de l'huile → Augmentation des fuites internes de la pompe → Chute de débit et de puissance.
4. NORMES & SÉCURITÉ
Intervention sur pneu chaud : Ne JAMAIS purger l'air d'un pneu chaud pour ajuster la pression. La pression augmente naturellement à chaud ; une purge entraînerait un sous-gonflage critique à froid.
Protection des conduites plastiques (Polyamide 11) : Les tuyaux d'air pneumatiques ne doivent pas être exposés à un flux de chaleur supérieur à 130°C (pour une durée max de 60 minutes, ex: étuve de peinture). Température de service permanent admise : -40°C à +60°C.
Risque de brûlure : Les fluides hydrauliques et les pièces de friction peuvent dépasser 80°C. Port des gants (EPI) obligatoire avant toute inspection tactile.
Voudrais-tu que je génère le script d'assistance vocale exact (format Live IA) spécifiquement pour guider le technicien sur le diagnostic d'un étrier grippé ou d'une pompe hydraulique en surchauffe ?

ANALYSE DE LA REQUÊTE : DIAGNOSTIC EN DIRECT DES CAPTEURS SUR BUS SAE J1939
En tant qu'Ingénieur en Chef, voici la procédure de test et de validation en direct des capteurs opérant sur un réseau multiplexé poids lourd J1939. À la différence de l'OBD-II (requête-réponse), le J1939 diffuse ses données en continu (Broadcast).
1. SYMPTOMATOLOGIE
Alerte Tableau de Bord : Allumage d'un témoin de défaillance (ex: dysfonctionnement moteur, EBS, transmission).
Code Défaut J1939 (DTC) : Apparition d'un code composé d'un SPN (Suspect Parameter Number, identifiant le capteur, ex: SPN 190 pour régime moteur) et d'un FMI (Failure Mode Identifier, identifiant la nature électrique/logique de la panne).
Anomalie de Données Live : Sur l'interface de diagnostic, lecture de valeurs figées, erratiques ou hors tolérance reçues en continu (fréquence de rafraîchissement 10 à 50 Hz pour les systèmes critiques).
2. ARBRE DE DIAGNOSTIC (TOP-DOWN)
BRANCHE A : Analyse Live via Outil de Diagnostic (Prise Deutsch 9 broches)
SI le réseau CAN est inactif ALORS contrôler la résistance terminale du bus CAN (doit être de 60 ohms en parallèle, soit deux résistances de 120 ohms à chaque extrémité du bus).
SI le bus communique ALORS isoler le SPN du capteur suspecté et lire le code FMI associé.
BRANCHE B : Contrôle Physique et Électrique (Méthode par FMI)
SI [FMI 0 - Surcharge/Surchauffe] ALORS Valeur lue au-dessus de la plage normale. Effectuer un contrôle physique (ex: SI température d'eau trop haute ALORS vérifier circuit de refroidissement).
SI [FMI 1 - Manque/Fuite] ALORS Valeur en dessous de la plage normale. Effectuer un contrôle physique (ex: SI chute de pression ALORS vérifier étanchéité du circuit).
SI [FMI 3 - Court-circuit au +Vcc] ALORS Test multimètre sur le connecteur du capteur : Mesurer la tension. Si V 
mesure
​
 ≈V 
bat
​
 , le composant ou le faisceau est en court-circuit avec l'alimentation.
SI [FMI 4 - Court-circuit à la masse] ALORS Test multimètre : Mesurer la tension. Si V 
mesure
​
 ≈0V sur la ligne de signal, chercher un contact de fil dénudé avec le châssis.
SI [FMI 5 - Circuit ouvert] ALORS Test multimètre (hors tension) : Mesurer la continuité. Si Résistance = ∞, inspecter les broches du connecteur pour oxydation ou fil coupé dans le faisceau.
3. SCHÉMATISATION LOGIQUE
Flux Physique : Variation d'une grandeur physique (Pression, Température, Vitesse) → Modification de la résistance/tension interne du capteur.
Flux Électrique : Capteur → Signal Analogique (ex: 4-20mA ou 0-10V) → Entrée de l'ECU locale.
Flux Multiplexé (J1939) : ECU locale → Conversion numérique → Diffusion continue (Broadcast) sur le bus CAN J1939 (trames 29-bits, vitesse 250 ou 500 kbps) → Réception par la prise de diagnostic et les autres calculateurs du réseau.
4. NORMES & SÉCURITÉ
Habilitations Électriques (NF C 18-510) : SI intervention sur un capteur dont le système avoisine ou dépasse 60V DC ou 25V AC (fréquent sur architectures véhicules hybrides/électriques ou certains actuateurs lourds), l'intervenant doit posséder une habilitation valide (B1VL/B2VL/BCL).
Consignation Multi-énergies (LOTO) : Avant de débrancher un capteur de pression (air ou hydraulique) pour un test de continuité (FMI 5), la dissipation des énergies (mise à zéro des manomètres, descente des charges) est une obligation absolue.
Intégrité du Bus CAN : Ne jamais piquer les fils du réseau CAN (CAN-High / CAN-Low) avec des pointes de touche classiques sous tension, sous peine de modifier l'impédance du bus et de générer des codes défauts de communication (U-codes) sur les autres ECU.

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




Fin du document de contexte LOCATE GARAGE.