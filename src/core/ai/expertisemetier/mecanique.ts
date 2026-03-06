export const GARAGE_M5_RULES = {
  // 1. PROTOCOLE DE COMMUNICATION (STRICT)
  comm_logic: {
    format: "Étape [X] : [Action]. Dis 'Fait' quand terminé.",
    style: "Zéro courtoisie, isolation du doute, ordre de nettoyage lentille si flou."
  },

  // 2. SAFETY GATES (VETO IA)
  safety_veto: {
    levage: "Confirmation visuelle CHANDELLES/BÉQUILLES obligatoire. Veto si hydraulique seul.",
    ve_hvb: "Si > 60V DC / 25V AC : Exiger Gants Classe 0 + Sur-gants + Habilitation B1VL/B2VL.",
    hydraulique: "Consignation PTO (Prise de mouvement) obligatoire avant flexible."
  },

  // 3. DIAGNOSTIC J1939 (BUS CAN PL)
  j1939_logic: {
    fmi_codes: {
      3: "Court-circuit au pôle + (Vcc)",
      4: "Court-circuit à la masse (GND)",
      5: "Circuit ouvert (Fil coupé/débranché)"
    },
    utac_braking: {
      target_pressure: "7.2 à 8.1 bars",
      min_test_pressure: "6.2 à 6.9 bars",
      alert_threshold: "Dessiccateur anormal si < 7.2 bars"
    }
  },

  // 4. COUPLES DE SERRAGE (SÉCURITÉ LIAISON AU SOL)
  torque_specs: {
    volvo_fh_fm: "610 Nm",
    scania_mercedes_daf: "600 Nm",
    renault_t: "450-500 Nm",
    post_service: "Alerte resserrage obligatoire à 100 km"
  },

  // 5. THERMIQUE & COLORIMÉTRIE (VISION HDR)
  thermal_analysis: {
    scale: [
      { color: "Jaune Paille", temp: "220°C", status: "Dureté Max / Cassant" },
      { color: "Bleu", temp: "295°C", status: "DANGER : Acier détrempé / Remplacement obligatoire" },
      { color: "Gris", temp: ">350°C", status: "CRITIQUE : Structure compromise" }
    ],
    hydraulique_tactile: {
      "60C": "Tolérable 10s",
      "70C": "Tolérable 3s",
      "80C": "Douleur aiguë / Brûlure / Veto IA"
    }
  },

  // 6. AUDIO SPECTRAL (SIGNATURES)
  acoustic_signatures: {
    claquement: "Injecteur / Embiellage / Distribution",
    sifflement: "Fuite air (EBS) / Turbo / Cavitation pompe"
  }
};