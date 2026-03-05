import { GoogleGenerativeAI } from '@google/generative-ai';
import { CATEGORIES } from '../../types';
import { INDUSTRIAL_RULES } from './expertiseRules';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// 🧠 INJECTION STRICTE DE LA BIBLE MÉTIER ET DU FORMAT JSON
const getSystemPrompt = (userLocation: string, rulesContext: string, categoriesContext: string) => `
Tu es l'Expert Vision Industrielle du système LOCATE HOME. Localisation de l'analyse : ${userLocation}.
Ton rôle est d'analyser les images/vidéos en appliquant STRICTEMENT le Protocole d'Analyse Visuelle Pyramidale (PAVP V5.0) en 4 étapes.

VOICI TON RÉFÉRENTIEL D'EXPERTISE MÉTIER OBLIGATOIRE :
${rulesContext}

CATÉGORIES AUTORISÉES (Utilise uniquement ces ID) :
${categoriesContext}

RÈGLE ABSOLUE : Tu dois retourner UNIQUEMENT un tableau JSON valide. Pas de texte avant, pas de markdown, juste le tableau.
Chaque outil détecté doit être un objet avec cette structure EXACTE :
[
  {
    "brandColor": "Étape 1 : Hypothèse de marque (ex: Bosch Professional, Makita)",
    "morphology": "Étape 2 : Type d'objet (ex: Perceuse-visseuse)",
    "zoomDetail": "Étape 3 : Détail technique (ex: Mandrin auto-serrant, batterie 12V)",
    "typography": "Étape 4 : Modèle exact lu ou déduit (ex: GSR 12V-15)",
    "confidence": 0.95,
    "categorie_id": "ID exact de la catégorie correspondante",
    "etat": "Bon état / Usagé / Neuf",
    "description": "Justification de l'analyse métier",
    "isConsumable": false,
    "consumableLevel": 100
  }
]
IMPORTANT : La valeur "confidence" DOIT impérativement être un nombre décimal compris entre 0.01 et 0.99 (ex: 0.85).
`;

export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[], userLocation: string = "Atelier"): Promise<any[]> => {
    if (!apiKey) return [];
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const categoriesContext = CATEGORIES.map(cat => `- ID: "${cat.id}" | Label: ${cat.label}`).join('\n');
      const rulesContext = JSON.stringify(INDUSTRIAL_RULES, null, 2);

      // On utilise bien la fonction ici !
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

  analyzeVideo: async (videoBase64: string, userLocation: string = "Atelier"): Promise<any[]> => {
    if (!apiKey) return [];
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const categoriesContext = CATEGORIES.map(cat => `- ID: "${cat.id}" | Label: ${cat.label}`).join('\n');
      const rulesContext = JSON.stringify(INDUSTRIAL_RULES, null, 2);

      // Appel de la fonction pour la vidéo
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