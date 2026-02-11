import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

if (!API_KEY) {
  throw new Error("ALERTE : Clé API absente du fichier .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Point de Vigilance : Forçage de l'API v1 (Stable)
const model = genAI.getGenerativeModel(
  { model: "gemini-1.5-flash" },
  { apiVersion: "v1" }
);

export const analyzeInventory = async (base64Image: string) => {
  try {
    const base64Data = base64Image.split(",")[1] || base64Image;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
      "Identifie cet outil et décris son état.",
    ]);

    const response = await result.response;
    return response.text();
  } catch (error: any) {
    // Diagnostic en cas de panne
    console.error("ERREUR_CONTROLE :", error.message);
    return `Erreur signalée : ${error.message}`;
  }
};