import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

// ON FORCE LA VERSION V1 POUR ÉVITER LE 404
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel(
  { model: "gemini-1.5-flash" },
  { apiVersion: "v1" } // <--- C'EST LE RÉGLAGE DÉCISIF
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
      "Identifie cet objet.",
    ]);

    const response = await result.response;
    return response.text();
  } catch (error: any) {
    // Si ça échoue, on veut l'erreur brute pour le diagnostic final
    return `Erreur Google : ${error.message}`;
  }
};