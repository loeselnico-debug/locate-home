import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

if (!API_KEY) {
  throw new Error("Clé API manquante dans le fichier .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Configuration stable pour Gemini 1.5 Flash
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" 
});

export const analyzeInventory = async (base64Image: string) => {
  try {
    // Nettoyage automatique du préfixe base64
    const base64Data = base64Image.split(",")[1] || base64Image;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
      "Identifie cet outil et décris son état général (marque, couleur, usure).",
    ]);

    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Erreur Gemini :", error);
    return `Erreur technique : ${error.message}`;
  }
};