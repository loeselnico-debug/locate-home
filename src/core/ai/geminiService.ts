import { GoogleGenerativeAI } from '@google/generative-ai';
import { CATEGORIES } from '../../types';

// Tolérance sur le nom de la variable d'environnement (Vérifie ton .env)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey || "");

export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[], userLocation: string = "Atelier"): Promise<any[]> => {
    if (!apiKey) {
      console.error("CRITIQUE: Clé API manquante. Vérifie que ton fichier .env contient bien VITE_GEMINI_API_KEY=ta_cle");
      return [];
    }

    try {
      // 1. MISE À NIVEAU : Passage au moteur 2.5 Flash Stable (Conforme à la documentation)
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        // 2. Blindage absolu : on force la réponse de l'API en JSON pur
        generationConfig: { responseMimeType: "application/json" }
      });

      const categoriesContext = CATEGORIES.map(cat => `- ID: "${cat.id}" | Label: ${cat.label}`).join('\n');

      const prompt = `
Tu es l'Expert Vision de LOCATE SYSTEMS. 
Analyse ces images de la zone : [${userLocation.toUpperCase()}].

RÈGLE ABSOLUE : Classe chaque objet détecté UNIQUEMENT dans ces catégories :
${categoriesContext}

Réponds EXCLUSIVEMENT avec un tableau JSON valide. Ne dis pas bonjour, ne fais pas d'introduction. Chaque objet doit avoir cette structure exacte :
[
  {
    "toolName": "Nom précis de l'outil",
    "category": "ID de la catégorie",
    "description": "État visuel",
    "localisation": "${userLocation}",
    "score_confiance": 98,
    "safetyAlert": false,
    "safetyLevel": "green",
    "safetyDetails": "Vérifié"
  }
]`;

      const imageParts = base64Images.map(base64 => {
        const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
        return { inlineData: { data: base64Data, mimeType: "image/jpeg" } };
      });

      const result = await model.generateContent([prompt, ...imageParts]);
      
      const text = result.response.text();
      return JSON.parse(text);

    } catch (error: any) {
      console.error("Échec de l'analyse LOCATE SYSTEMS :", error);
      return [];
    }
  }
};