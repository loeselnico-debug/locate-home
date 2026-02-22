/**
 * LOCATEHOME - RÉFÉRENTIEL D'EXPERTISE MÉTIER (V1.4)
 * Source : "La Bible" (Charte de Vérité) & Analyse Technique Électroportatif.
 */

export const INDUSTRIAL_RULES = {
  // 1. SEUILS DE VÉRITÉ & SÉCURITÉ
  security: {
    trust_threshold: 70, // Verrouillage de l'automatisation sous 70% 
    voltage_check_required: ["elec"], // Rappel VAT systématique 
    machine_tournante_epi: ["meuleuse", "scie", "perceuse"], // Alerte Gants/Lunettes 
  },

  // 2. PROTOCOLE D'IDENTIFICATION SÉQUENCÉ (LA BIBLE 2.1.1) 
  identification_logic: [
    "1. Couleur (Signature Marque)",
    "2. Morphologie (Type d'objet)",
    "3. Zoom séquencé (Accouplement, mandrin, sabot)",
    "4. Lecture typographique (Affirmation)",
    "5. Contrôle pyramidal (Validation 4->3->2->1)"
  ],

  // 3. SIGNATURES MARQUES (ANALYSE MORPHOLOGIQUE) 
  brand_dna: {
    makita: {
      style: "Austère, vis d'assemblage apparentes",
      led: "Sous le mandrin",
      battery: "LXT 18V (Gabarit ~630g)",
      feature: "Poignée latérale longue anti-kickback sur gros modèles"
    },
    milwaukee: {
      style: "Design 'Bloc' carré, aspect brut",
      led: "Sous le mandrin",
      battery: "M18 (Caoutchouc, jeu mécanique léger)",
      feature: "Logo/Bouton ONE-KEY (Gestion connectée)"
    },
    bosch_pro: {
      style: "Finition Premium, Soft-grip moulé haute qualité",
      led: "Sur le pied (base)",
      battery: "ProCore (Compacte/Légère ~530g)",
      feature: "Module Bluetooth Connectivity visible"
    },
    metabo: {
      style: "Ergonomie tactile, pas de protection arrière",
      led: "Sur le pied (base)",
      battery: "CAS (Cordless Alliance System)",
      feature: "Gâchette antidérapante caoutchoutée unique"
    }
  },

  // 4. DISTINCTION TÊTE D'OUTIL (NEZ) 
  tool_head_logic: {
    perceuse_visseuse: "Mandrin rond auto-serrant + Bague de couple graduée",
    visseuse_choc: "Mandrin hexagonal + Absence de bague de couple",
    boulonneuse: "Réception carrée 1/2 sur tête métallique",
    scie_sabre: "Corps allongé + Sabot métallique en bout",
    lamelleuse: "Tête plate métallique + Poignée supérieure"
  },

  // 5. SYSTÈMES BATTERIE (PUISSANCE) 
  battery_logic: {
    v12: "Système 'Pod' (Batterie intrusive dans la poignée)",
    v18: "Système à glissière (Rail)",
    status: "Si rails visibles sans batterie -> Alerte 'Non Opérationnel'"
  },

  // 6. OUTILLAGE À MAIN (CODES COULEURS) 
  hand_tool_signatures: {
    facom_protwist: {
      jaune: "Phillips", rouge: "Plat", bleu: "Pozidriv", vert: "Torx", gris: "Hex"
    },
    wera_kraftform: {
      noir: "Pozidriv", bleu: "Hex", vert: "Torx"
    }
  },

  // 7. GESTION DES CONSOMMABLES (ÉTAT) 
  consumable_rules: {
    mastic_silicone: {
      neuf: "Canule pointue",
      entame: "Canule coupée ou biseautée (Priorité d'utilisation)"
    },
    visserie: "Estimation par pourcentage de volume (%)",
    joints: "Comptage par profilage des strates (éviter les ombres)"
  }
};