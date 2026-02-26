import { GoogleGenerativeAI } from '@google/generative-ai';
import { CATEGORIES } from '../../types';
import { INDUSTRIAL_RULES } from './expertiseRules';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// 🧠 INJECTION STRICTE DE LA BIBLE MÉTIER ET DU FORMAT JSON
const getSystemPrompt = (userLocation: string, rulesContext: string, categoriesContext: string) => `
Tu es l'Expert Vision Industrielle du système LOCATE HOME. Localisation de l'analyse : ${userLocation}.
Ton rôle est d'analyser les images/vidéos en appliquant STRICTEMENT le Protocole d'Analyse Visuelle Pyramidale (PAVP V5.0).

VOICI TON RÉFÉRENTIEL D'EXPERTISE MÉTIER OBLIGATOIRE :
${rulesContext}

CATÉGORIES AUTORISÉES (Utilise uniquement ces ID) :
${categoriesContext}

RÈGLE ABSOLUE : Tu dois retourner UNIQUEMENT un tableau JSON valide. Pas de texte avant, pas de markdown, juste le tableau.
Chaque outil détecté doit être un objet avec cette structure EXACTE :
[
  {
    "nom": "Nom technique précis (ex: Perceuse Visseuse DDF484)",
    "marque": "Marque identifiée (selon l'ADN métier de la Bible)",
    "categorie_id": "ID exact de la catégorie correspondante",
    "score_confiance": Nombre entier entre 0 et 100 (Calcule-le selon le niveau du PAVP validé),
    "etat": "Bon état / Usagé / Neuf",
    "description": "Justification métier (ex: 'Batterie LXT détectée, mandrin auto-serrant, étape 3 validée')"
  }
]
`;

export const geminiService = {
  // --- MODE PHOTO HD / IMPORT ---
  analyzeVideoBurst: async (base64Images: string[], userLocation: string = "Atelier"): Promise<any[]> => {
    if (!apiKey) return [];
    try {
      // MISE À JOUR : Standardisation sur le modèle 2.0 Flash
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash", 
        generationConfig: { responseMimeType: "application/json" } 
      });

      const categoriesContext = CATEGORIES.map(cat => `- ID: "${cat.id}" | Label: ${cat.label}`).join('\n');
      const rulesContext = JSON.stringify(INDUSTRIAL_RULES, null, 2);

      const prompt = getSystemPrompt(userLocation, rulesContext, categoriesContext);
      
      const imageParts = base64Images.map(base64 => ({
        inlineData: { data: base64.split(',')[1], mimeType: "image/jpeg" }
      }));

      const result = await model.generateContent([prompt, ...imageParts]);
      return JSON.parse(result.response.text());
    } catch (error) { 
      console.error("Erreur Gemini (Burst):", error);
      return []; 
    }
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

      const prompt = getSystemPrompt(userLocation, rulesContext, categoriesContext);

      const videoPart = {
        inlineData: { data: videoBase64.split(',')[1], mimeType: "video/webm" }
      };

      const result = await model.generateContent([prompt, videoPart]);
      return JSON.parse(result.response.text());
    } catch (error) { 
      console.error("Erreur Gemini (Video):", error);
      return []; 
    }
  }
};