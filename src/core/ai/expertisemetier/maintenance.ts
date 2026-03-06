/**
 * LOCATE GARAGE - RÉFÉRENTIEL MAINTENANCE INDUSTRIELLE (M5)
 * Source : "Bible Maintenance 5.0"
 * Normes : OSA/CBM, AFNOR, LOTO, GD&T
 */

export const MAINTENANCE_M5_RULES = {
  // 1. SAFETY GATES (VETO IA - PRIORITÉ ABSOLUE)
  safety_veto: {
    loto: "Consignation (Lockout-Tagout) : Validation visuelle ou vocale de la coupure des énergies obligatoire avant action.",
    vat: "Vérification d'Absence de Tension (VAT) exigée avant lecture de schémas de puissance ou ouverture d'armoire.",
    espaces_confines: "Risque Gaz (H2S) : Exiger le port du détecteur 4 gaz et des EPI respiratoires."
  },

  // 2. MÉTHODOLOGIE DE DIAGNOSTIC (ENTONNOIR)
  diagnostic_logic: {
    approche: "AMDEC, QQOQCCP, Ishikawa. Toujours isoler le composant racine en allant du test le plus simple/visuel au plus intrusif/complexe. Interdiction de deviner.",
    afnor_levels: {
      1: "Réglages simples, vérifications visuelles.",
      2: "Dépannages par échange standard (Technicien habilité).",
      3: "Identification origines de pannes complexes, échanges de composants.",
      4: "Travaux importants, révisions complètes en atelier.",
      5: "Rénovation, reconstruction."
    }
  },

  // 3. ANALYSE SENSORIELLE MULTIMODALE (OSA/CBM)
  multimodal_analysis: {
    acoustic: "Détection de fuites (air, eau, gaz) et usure de roulements (ultrasons).",
    vibration: "Défauts d'alignement, balourd sur machines tournantes.",
    vision_hdr: "Corrosion, fuites externes, détection de corps étrangers, état de surface.",
    thermography: "Points chauds électriques, mauvais raccordements, frottements anormaux."
  },

  // 4. LECTURE TECHNIQUE ET PLANS
  technical_reading: {
    electrical: "Analyse unifilaire, multifilaire, cartes automates (API). Identifier la nomenclature, les références croisées et les borniers.",
    mechanical: "Tolérancement géométrique (GD&T - ISO 1101). Le 3D est insuffisant : exiger le 2D pour la rugosité (ex: Ra 3.2) et les tolérances."
  },

  // 5. EXPERTISE MÉTALLURGIQUE (COLORIMÉTRIE THERMIQUE)
  metallurgy_thermal: {
    zone_1: { color: "Jaune Paille", temp: "220°C", instruction: "Dureté max, attention au glaçage (plateau presseur)." },
    zone_4: { color: "Bleu", temp: "295°C", instruction: "DANGER : Acier détrempé. Surchauffe extrême. Remplacement obligatoire." },
    zone_5: { color: "Gris", temp: ">350°C", instruction: "DESTRUCTION : Structure compromise. Remplacement immédiat." }
  },

  // 6. PIPELINE GMAO & INDICATEURS (KPI)
  gmao_kpi: {
    mtbf: "Mean Time Between Failures (Fiabilité).",
    mttr: "Mean Time To Repair (Maintenabilité).",
    trs: "Taux de Rendement Synthétique (Disponibilité x Performance x Qualité)."
  }
};