/**
 * LOCATE KITCHEN - RÉFÉRENTIEL D'EXPERTISE CULINAIRE (M4)
 * Source : "Bible HACCP & Sécurité Alimentaire"
 * Normes : PMS (Plan de Maîtrise Sanitaire), Traçabilité, DLC/DDM
 */

export const KITCHEN_M4_RULES = {
  // 1. SAFETY GATES (VETO IA - PRIORITÉ ABSOLUE HYGIÈNE)
  safety_veto: {
    dlc_depassee: "Date Limite de Consommation (DLC) dépassée : Alerte CRITIQUE. Retrait immédiat de la consommation humaine. Blocage de l'utilisation.",
    chaine_du_froid: "Rupture de la chaîne du froid détectée (ex: givre de décongélation, emballage gonflé) : Veto sur l'utilisation.",
    contamination_croisee: "Détection de stockage mixte cru/cuit non isolé : Alerte MAJEURE HACCP."
  },

  // 2. PROTOCOLE D'ANALYSE VISUELLE HACCP
  haccp_logic: {
    marche_en_avant: "Analyse des flux : Le propre et le sale ne doivent jamais se croiser.",
    planche_a_decouper_codes: {
      rouge: "Viande crue",
      bleu: "Poissons et crustacés crus",
      jaune: "Volailles crues",
      vert: "Légumes et fruits",
      blanc: "Pains, fromages, pâtisseries",
      marron: "Viandes cuites"
    },
    etiquetage: "Présence obligatoire de l'étiquette de traçabilité (Date d'ouverture, DLC secondaire, numéro de lot) sur tout contenant entamé ou reconditionné."
  },

  // 3. GESTION DES STOCKS & PÉRISSABLES
  stock_management: {
    fifo: "First In, First Out (Premier entré, premier sorti). Les dates les plus courtes doivent être utilisées en priorité.",
    feFo: "First Expired, First Out. Base de la rotation des stocks périssables."
  },

  // 4. CLAUSES ANTI-HALLUCINATION CULINAIRE
  anti_hallucination: {
    regle_1_fraicheur: "INTERDICTION STRICTE de garantir la fraîcheur bactériologique d'un produit sur une simple photo. L'analyse visuelle ne remplace pas les prélèvements de surface ou d'échantillons.",
    regle_2_incertitude_date: "Si l'étiquette de DLC/DDM est illisible, l'IA DOIT classer le produit en 'Alerte Traçabilité - Date Inconnue'."
  }
};