import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

if (!API_KEY) {
  throw new Error("ALERTE : Clé API absente de la configuration");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Mise en conformité 2026 : Passage au modèle 2.5 Flash
const model = genAI.getGenerativeModel(
  { model: "gemini-2.5-flash" }, 
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
      "Identifie cet outil, sa marque et son état général.",
    ]);

    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("ERREUR_SYSTÈME :", error.message);
    return `Diagnostic technique : ${error.message}`;
  }
};