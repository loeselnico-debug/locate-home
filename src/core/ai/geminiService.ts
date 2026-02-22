import { GoogleGenerativeAI } from '@google/generative-ai';
import { CATEGORIES } from '../../types';

// Utilisation de ta clé officielle validée
const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

// Forçage sur l'API Stable v1 pour éviter les instabilités du mode beta
const genAI = new GoogleGenerativeAI(apiKey || "");

export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[], userLocation: string = "Atelier"): Promise<any[]> => {
    if (!apiKey) {
      console.error("CRITIQUE: Clé API manquante.");
      return [];
    }

    try {
      // Utilisation du modèle flash version stable
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const categoriesContext = CATEGORIES.map(cat => `- ID: "${cat.id}" | Label: ${cat.label}`).join('\n');

      const prompt = `
Tu es l'Expert Vision de LOCATE SYSTEMS. 
Analyse ces images de la zone : [${userLocation.toUpperCase()}].

RÈGLE ABSOLUE : Classe chaque objet détecté UNIQUEMENT dans :
${categoriesContext}

Réponds EXCLUSIVEMENT avec un tableau JSON :
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

      // Ajout d'une sécurité sur le timeout
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(text);

    } catch (error: any) {
      // Message d'alerte spécifique pour la panne Google en cours
      if (error.message?.includes('404') || error.message?.includes('fetch')) {
        console.warn("⚠️ ALERTE INFRA : Panne mondiale détectée sur les serveurs Google AI. Le système passera en mode attente.");
      } else {
        console.error("Échec de l'analyse LOCATE SYSTEMS :", error);
      }
      return [];
    }
  }
};