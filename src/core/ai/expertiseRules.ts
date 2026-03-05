/**
 * LOCATEHOME - RÉFÉRENTIEL D'EXPERTISE MÉTIER (V1.5)
 * Source : "La Bible" (Charte de Vérité) & Analyse Technique Électroportatif.
 * MASTER DATA : Intègre 100% des spécifications terrain (Documents 01, 02, 03).
 */

export const INDUSTRIAL_RULES = {
  // 1. PROTOCOLE D'ANALYSE VISUELLE PYRAMIDALE (PAVP V5.0)
  // L’identification doit strictement être réalisée selon une validation régressive (Étape 4 -> 3 -> 2 -> 1). 
  // Un objet est confirmé avec >90% de certitude si au moins 3 niveaux concordent parfaitement.
  identification_protocol: {
    step_4_ocr: "Lecture typographique et gravure. Scan instantané des flancs pour logos et nomenclatures. Arbitre final décisif.",
    step_3_zoom: "Analyse des sous-systèmes : Position LED, interface batterie (Pod 12V vs Glissière 18V), gâchette, accouplement.",
    step_2_morphology: "Définition du type d'objet : Analyse du nez (mandrin, sabot) et du corps.",
    step_1_color: "Colorimétrie et signature visuelle globale. Filtre primaire d'hypothèse de marque."
  },

  // 2. SIGNATURES MARQUES & ADN DESIGN
  brand_dna: {
    makita: { color: "Bleu-vert/cyan", style: "Austère, vis d'assemblage apparentes, aspect bourru", led: "Sous le mandrin", battery: "LXT 18V (~630g) ou XGT 40V." },
    milwaukee: { color: "Rouge", style: "Design 'Bloc' (boxy), aspect brut", led: "Sous le mandrin (ombre portée)", battery: "M18 (jeu mécanique) ou M12", feature: "Logo/Bouton ONE-KEY." },
    bosch_professional: { color: "Bleu foncé", style: "Premium, soft-grip parfaitement moulé", led: "Sur le pied (base)", battery: "ProCore", feature: "Module Bluetooth Connectivity." },
    dewalt: { color: "Jaune et noir", style: "Robuste et ergonomique", battery: "XR 20V, FlexVolt 54V, Powerstack", prefix: "DC (Cordless) ou DWHT (Hand Tool)." },
    hilti: { color: "Rouge Signalisation RAL 3020", feature: "Perçage et démolition, identification OCR requise." },
    metabo: { color: "Vert qualitatif", feature: "Gâchette antidérapante caoutchoutée unique (99% certitude), système CAS." },
    festool_ryobi: { feature: "Validation EXCLUSIVEMENT par OCR (Étape 4). Système Centrotec pour Festool." }
  },

  // 3. NOMENCLATURES OCR (JUGE DE PAIX)
  nomenclatures: {
    makita: "DDF (Perceuse), DTD (Chocs), DHP (Percussion), DGA (Meuleuse). Suffixe J = Coffret Makpac.",
    dewalt_codes: {
      logic: "3ème lettre : D (Drill), G (Grinder), S (Saw), H (Hammer).",
      suffixes: "N (Nu), NT (Coffret TSTAK), E (Powerstack 1.7Ah), T (FlexVolt 54V / TSTAK)."
    }
  },

  // 4. DISTINCTION TECHNIQUE (NEZ ET TÊTE)
  tool_head_logic: {
    perceuse_visseuse: "Mandrin rond auto-serrant + Bague de couple graduée.",
    visseuse_choc: "Nez court, mandrin hexagonal rapide, absence de bague de couple.",
    boulonneuse: "Réception carrée 1/2 ou 3/4 sur tête métallique.",
    perforateur: "Corps allongé, mandrin type SDS / SDS+ (système à gorge).",
    modulaire: "Bague d'accouplement + icône 'cadenas' à la base du mandrin (ex: Bosch FlexiClick)."
  },

  // 5. OUTILLAGE À MAIN (PAVP V5.0 ADAPTÉ)
  hand_tools: {
    facom_protwist: { jaune: "Phillips", rouge: "Plat", bleu: "Pozidriv", vert: "Torx", gris: "Hexagonal." },
    facom_douilles: "Système 'GRIP' : observation d’un système angulaire multiple à l'intérieur.",
    wera_kraftform: { noir: "Pozidriv", bleu: "Hexagonal", vert: "Torx." },
    wera_douilles: "Orange (5.5), Bleu (6), Jaune m. (7), Rose (8), Jaune (10), Noir (12), Vert (13).",
    others: "Kirschen (Deux Cerises + protections bleues), Wiha (Manche VDE Rouge/Jaune + marquage laser)."
  },

  // 6. SÉCURITÉ ET VIGILANCE (SOCLE INALTÉRABLE)
  security: {
    trust_threshold: 70, // Blocage si < 70%. Règle des 90% pour validation automatique.
    safety_check: "Contrôle gainage (isolement 1000V) et procédure VAT systématique pour électriciens.",
    epi_alert: "Machine tournante = Gants + Lunettes. Machine à chocs = Lunettes + Bouchons.",
    battery_status: "Rails visibles sans batterie = 'Électroportatif non opérationnel'."
  },

  // 7. CONSOMMABLES ET JAUGE DE DROPSHIPPING
  consumables: {
    mastic_silicone: "Canule pointue = Neuf / Canule coupée ou biseautée = Entamé (Priorité d'utilisation).",
    visserie_joints: "Quantité en % du volume. Joints par profilage des strates (éviter les ombres).",
    contenants: "Scellé rompu / rabats entrouverts = 'Présence à confirmer physiquement'.",
    // VERROUILLAGE INFORMATIQUE STRICT :
    format_obligatoire: "Si l'objet analysé est un consommable, tu DOIS évaluer le volume restant selon les strates et l'air. Tu retourneras UNIQUEMENT un nombre entier compris entre 0 et 100 pour définir le niveau. Interdiction stricte d'utiliser le symbole '%' ou du texte."
  },

  // 8. CLAUSES PUNITIVES ET ANTI-HALLUCINATION (STRICT)
  anti_hallucination: {
    regle_1_contenants: "INTERDICTION STRICTE de deviner le contenu d'une mallette, d'un carton fermé ou d'un bac opaque. Si le contenant est fermé, décris le contenant et plafonne la certitude à 50%.",
    regle_2_certitude_ocr: "Si aucune typographie (Étape 4) n'est lisible clairement sur l'image, la valeur 'confidence' NE DOIT JAMAIS dépasser 0.65.",
    regle_3_doute_et_couleur: "La couleur seule (Étape 1) ne suffit pas. Une machine bleue n'est pas forcément Bosch. Sans confirmation de l'Étape 2 ou 3, plafonne la certitude à 0.40.",
    regle_4_franchise: "Si tu ne reconnais pas l'outil, n'invente rien. Retourne des valeurs génériques et une 'confidence' de 0.10."
  }
};