export const geminiService = {
  analyzeTool: async (base64Image: string) => {
    // On utilise la variable ici pour valider qu'on reçoit bien des données
    console.log("🛠️ Analyse technique - Taille de l'image reçue :", base64Image.length, "caractères.");
    
    // Simulation d'une analyse haute précision pour ta Bosch Pro 12V
    // (C'est ici qu'on branchera l'IA réelle plus tard)
    return {
      name: "Perceuse-Visseuse Bosch Pro 12V-35",
      details: "Moteur Brushless. Couple max 35Nm. Mandrin 10mm. Maintenance préventive : Vérifier charbons/batterie.",
      etat: "Opérationnel",
      categorie: "electro",
      score_confiance: 99,
      alerte_securite: false
    };
  }
};