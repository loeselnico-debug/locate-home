import { GoogleGenerativeAI } from '@google/generative-ai';
import { CATEGORIES } from '../../types';

// Initialisation de la connexion au moteur IA
const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[], userLocation: string = "Atelier"): Promise<any[]> => {
    if (!apiKey) {
      console.error("CRITIQUE: Clé API Google Gemini manquante.");
      return [];
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const categoriesContext = CATEGORIES.map(cat => `- ID: "${cat.id}" | Label: ${cat.label} (ex: ${cat.description})`).join('\n');

      const prompt = `
Tu es l'Expert Vision de LOCATE SYSTEMS. 
Ta mission est d'analyser ce flux d'images capturé dans la zone : [${userLocation.toUpperCase()}] et de réaliser un inventaire d'une précision chirurgicale.

RÈGLE ABSOLUE : Tu dois classer chaque objet détecté STRICTEMENT et UNIQUEMENT dans l'une de ces catégories officielles :
${categoriesContext}

Si un objet ne correspond à aucune de ces catégories, ignore-le. Ne crée JAMAIS de nouvelle catégorie.

Réponds EXCLUSIVEMENT avec un tableau JSON valide respectant cette structure exacte :
[
  {
    "name": "Nom technique et précis de l'objet",
    "category": "ID exact de la catégorie",
    "description": "Courte description technique ou état de l'objet",
    "quantity": 1,
    "location": "${userLocation}"
  }
]
Ne rajoute aucun texte avant ou après le JSON. Uniquement les données pures.`;

      const imageParts = base64Images.map(base64 => {
        const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
        return { inlineData: { data: base64Data, mimeType: "image/jpeg" } };
      });

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      let text = response.text();

      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(text);

    } catch (error) {
      console.error("Alerte de l'Expert Vision LOCATE SYSTEMS : Échec de l'analyse.", error);
      return [];
    }
  }
};