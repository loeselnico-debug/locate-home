import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }, { apiVersion: "v1" });

export const analyzeInventory = async (base64Image: string) => {
  try { // <--- LE MOT CLÉ INDISPENSABLE
    const base64Data = base64Image.split(",")[1] || base64Image;
    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
      "Identifie cet outil et son état. CERTITUDE: [valeur entre 0 et 100]"
    ]);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    return `Erreur : ${error.message}`;
  }
};