import { GoogleGenerativeAI } from '@google/generative-ai';
import { CATEGORIES } from '../../types';
import { INDUSTRIAL_RULES } from './expertiseRules';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export const geminiService = {
  // --- MODE PHOTO HD / IMPORT ---
  analyzeVideoBurst: async (base64Images: string[], userLocation: string = "Atelier"): Promise<any[]> => {
    if (!apiKey) return [];
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
        generationConfig: { responseMimeType: "application/json" } 
      });

      const categoriesContext = CATEGORIES.map(cat => `- ID: "${cat.id}" | Label: ${cat.label}`).join('\n');
      const rulesContext = JSON.stringify(INDUSTRIAL_RULES, null, 2);

      // UTILISATION DE userLocation ICI
      const prompt = `Expert Vision Industrielle. Localisation actuelle : ${userLocation}. 
      Analyse ces images (PHOTO HD). Bible : ${rulesContext}. 
      Catégories autorisées : ${categoriesContext}. Retourne un JSON uniquement.`;
      
      const imageParts = base64Images.map(base64 => ({
        inlineData: { data: base64.split(',')[1], mimeType: "image/jpeg" }
      }));

      const result = await model.generateContent([prompt, ...imageParts]);
      return JSON.parse(result.response.text());
    } catch (error) { return []; }
  },

  // --- MODE VIDÉO DIRECTE 10S ---
  analyzeVideo: async (videoBase64: string, userLocation: string = "Atelier"): Promise<any[]> => {
    if (!apiKey) return [];
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash", 
        generationConfig: { responseMimeType: "application/json" } 
      });

      const categoriesContext = CATEGORIES.map(cat => `- ID: "${cat.id}" | Label: ${cat.label}`).join('\n');
      const rulesContext = JSON.stringify(INDUSTRIAL_RULES, null, 2);

      // UTILISATION DE userLocation ICI AUSSI
      const prompt = `Expert Vision Industrielle. Localisation actuelle : ${userLocation}. 
      ANALYSE CETTE VIDÉO DE 10S. Applique strictement le protocole PAVP V5.0 de la Bible : ${rulesContext}. 
      Catégories autorisées : ${categoriesContext}. Retourne un JSON uniquement.`;

      const videoPart = {
        inlineData: { data: videoBase64.split(',')[1], mimeType: "video/webm" }
      };

      const result = await model.generateContent([prompt, videoPart]);
      return JSON.parse(result.response.text());
    } catch (error) { return []; }
  }
};