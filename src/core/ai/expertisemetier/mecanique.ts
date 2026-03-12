/**
 * LOCATE GARAGE - RÉFÉRENTIEL MÉCANIQUE VL / PL (M5)
 * Version : V20 (Mise à jour Live Diagnostic)
 * Vision : "L'IA est le Chef d'Atelier embarqué"
 */

export const GARAGE_M5_RULES = {
  // 1. PROTOCOLE DE COMMUNICATION (STRICT)
  comm_logic: {
    format: "Étape [X] : Fais [Action]. Dis 'Fait' quand c'est terminé.",
    style: "Zéro phrase de courtoisie. Va à l'essentiel.",
    isolation_doute: "Aucune extrapolation. Si vidéo floue ou audio saturé, ordonne : 'Visuel non conforme. Nettoie la lentille.'"
  },

  // 2. SAFETY GATES (VETO IA - PRIORITÉ 0)
  safety_veto: {
    levage: "Interdiction d'intervenir sous maintien hydraulique seul. Confirmation visuelle OBLIGATOIRE des chandelles ou béquilles mécaniques.",
    ve_hvb: "Si tension > 60V DC / 25V AC : Affichage visuel habilitation (B1VL/B2VL/BCL) et port gants isolants (Classe 0) avec sur-gants cuir EXIGÉS.",
    hydraulique: "Consignation de la Prise de Mouvement (PTO) obligatoire avant intervention sur flexibles."
  },

  // 3. DIAGNOSTIC J1939 (BUS CAN PL) & MULTIMÈTRE
  j1939_logic: {
    fmi_codes: {
      0: "Surcharge/Surchauffe (Valeur au-dessus plage normale). Effectuer contrôle physique.",
      1: "Manque/Fuite (Valeur en dessous plage normale). Effectuer contrôle physique.",
      3: "Court-circuit au +Vcc (Tension mesurée ≈ Vbat).",
      4: "Court-circuit à la masse (Tension mesurée ≈ 0V sur ligne signal).",
      5: "Circuit ouvert (Résistance = ∞, inspecter broches ou fil coupé)."
    }
  },

  // 4. STANDARDS UTAC (FREINAGE PNEUMATIQUE)
  utac_braking: {
    target_pressure: "7.2 à 8.1 bars (Régulation dessiccateur).",
    min_test_pressure: "6.2 à 6.9 bars (Pression d'essai réglementaire).",
    test_epuisabilite: "Validation de 4 coups de pédale minimum après alarme."
  },

  // 5. COUPLES DE SERRAGE (SÉCURITÉ LIAISON AU SOL)
  torque_specs: {
    volvo_fh_fm: "610 Nm (Serrage en croix à sec)",
    scania_mercedes_daf: "600 Nm (Serrage en croix à sec)",
    renault_t: "450-500 Nm (Serrage en croix à sec)",
    post_service: "Alerte IA OBLIGATOIRE : Planifier un resserrage à 100 km dans la GMAO."
  },

  // 6. EXPERTISE MÉTALLURGIQUE (ANALYSE THERMIQUE & REVENU ACIER)
  thermal_analysis: {
    zone_1: { color: "Jaune Paille", temp: "220°C", status: "Dureté Max / Cassant. Si pièce de friction : début de glaçage thermique détecté." },
    zone_2: { color: "Jaune Foncé", temp: "260°C", status: "Bon équilibre dureté/ténacité." },
    zone_3: { color: "Violet/Pourpre", temp: "285°C", status: "Début de perte de dureté." },
    zone_4: { color: "Bleu", temp: "290°C+", status: "DANGER : Acier détrempé. Surchauffe extrême. Remplacement OBLIGATOIRE (Perte résistance structurelle)." },
    zone_5: { color: "Gris", temp: ">350°C", status: "CRITIQUE : Destruction thermique. Remplacement immédiat." },
    hydraulique_tactile: {
      "40C": "Forte fièvre",
      "50C": "Main se réchauffe, transpiration",
      "60C": "Tolérable 10s. Si > 60°C anormalement : contrôler limiteur de pression.",
      "70C": "Tolérable 3s",
      "80C": "Douleur aiguë / Risque de brûlure. EPI Gants Obligatoires."
    }
  },

  // 7. AUDIO SPECTRAL (SIGNATURES)
  acoustic_signatures: {
    claquement: "Injecteur / Embiellage / Distribution",
    sifflement: "Fuite air (EBS/Pneumatique) / Turbo",
    graviers: "Cavitation pompe hydraulique"
  }
};