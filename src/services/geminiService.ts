export const geminiService = {
  analyzeTool: async (base64Image: string) => {
    console.log("Analyse technique en cours...");
    
    // Simulation d'une analyse haute précision pour ta Bosch Pro 12V
    return {
      name: "Perceuse-Visseuse Bosch Pro 12V-35",
      details: "Moteur Brushless. Couple max 35Nm. Mandrin 10mm. Maintenance préventive : Vérifier charbons/batterie.",
      etat: "Opérationnel",
      categorie: "electro",
      score_confiance: 99,
      alerte_securite: false // Pas de défaut critique détecté
    };
  }
};