import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

if (!API_KEY) {
  throw new Error("Clé API manquante");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// On utilise le nom le plus stable pour éviter la 404
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" 
});

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
      "Identifie cet objet et décris sa couleur.",
    ]);

    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Erreur technique :", error);
    return `Code Erreur : ${error.message}`;
  }
};