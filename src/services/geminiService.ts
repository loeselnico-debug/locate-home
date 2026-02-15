export const geminiService = {
  analyzeTool: async (base64Image: string) => {
    // Utilisation de la variable pour le log technique
    console.log("Analyse image reçue (taille):", base64Image.length);

    // Simulation de réponse IA pour tes tests
    return {
      name: "Perceuse Bosch Pro 12V",
      details: "Outil électroportatif pro, batterie Lithium-Ion.",
      etat: "Bon état",
      categorie: "electro",
      score_confiance: 98,
      alerte_securite: false
    };
  }
};