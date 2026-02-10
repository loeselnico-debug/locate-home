import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeInventory(base64Image: string) {
  const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

  if (!API_KEY) {
    throw new Error("Clé API manquante dans le fichier .env");
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Tu es l'assistant de vision de Locate Home. Identifie les objets et leur position."
    });

    const imagePart = {
      inlineData: {
        data: base64Image.split(",")[1],
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent(["Analyse cette image.", imagePart]);
    return result.response.text();
  } catch (error: any) {
    console.error("Erreur Gemini :", error);
    // Affiche le message d'erreur réel pour le diagnostic
    return `Erreur : ${error.message || "Problème de connexion"}`;
  }
}