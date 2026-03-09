import { GoogleGenerativeAI } from '@google/generative-ai';
import { CATEGORIES } from '../../types';
import { INDUSTRIAL_RULES } from './expertisemetier/home';
import { KITCHEN_M4_RULES } from './expertisemetier/kitchen';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// --- PROMPT SYSTEME DYNAMIQUE ---
const getSystemPrompt = (userLocation: string, rulesContext: string, categoriesContext: string, module: 'HOME' | 'KITCHEN' = 'HOME') => {
  const brandInstruction = module === 'HOME' ? 'Marque exacte SEULE (ex: Makita, DeWalt). AUCUNE COULEUR.' : 'Marque ou Origine';
  const typeInstruction = module === 'HOME' ? 'Nom générique usuel (ex: perceuse, tondeuse, marteau)' : 'Famille de produit';
  const morphInstruction = module === 'HOME' ? 'Type d outil détaillé' : 'Type de denree ou objet';
  const zoomInstruction = module === 'HOME' ? 'Detail technique' : 'Etat de fraicheur ou detail HACCP';
  const typoInstruction = module === 'HOME' ? 'Modele exact (Si non lisible, écris: Non lisible)' : 'DLC DDM ou SKU';
  const consumableInstruction = module === 'KITCHEN' ? 'true' : 'true si vis, clou, joint, mastic, foret, colle. false sinon.';

  return `
Tu es l Expert Vision ${module === 'HOME' ? 'Industrielle' : 'Culinaire HACCP'} du système LOCATE. 
Localisation de l analyse : ${userLocation}.
Ton rôle est d analyser les images/vidéos en appliquant STRICTEMENT le protocole d expertise fourni.

VOICI TON RÉFÉRENTIEL D EXPERTISE MÉTIER OBLIGATOIRE :
${rulesContext}

CATÉGORIES AUTORISÉES (Utilise uniquement ces ID) :
${categoriesContext}

RÈGLE ABSOLUE : Tu dois retourner UNIQUEMENT un tableau JSON valide. Pas de texte avant, pas de markdown.
Tu dois détecter TOUS les objets pertinents dans l image et fournir leurs coordonnées spatiales pour le détourage néon.

Chaque objet détecté doit suivre cette structure EXACTE :
[
  {
    "box_2d": [0, 0, 1000, 1000],
    "brand": "${brandInstruction}",
    "type": "${typeInstruction}",
    "morphology": "${morphInstruction}",
    "zoomDetail": "${zoomInstruction}",
    "typography": "${typoInstruction}",
    "confidence": 0.95,
    "categorie_id": "ID exact de la categorie",
    "etat": "Bon etat / Usage / Neuf / Perime",
    "description": "Justification metier courte",
    "isConsumable": "${consumableInstruction}",
    "consumableLevel": 100
  }
]
`;
};

export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[], userLocation: string = "Atelier", module: 'HOME' | 'KITCHEN' = 'HOME'): Promise<any[]> => {
    if (!apiKey) return [];
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // MIGRATION ROADMAP V4
        generationConfig: { responseMimeType: "application/json" }
      });

      const categoriesContext = CATEGORIES.map(cat => `- ID: "${cat.id}" | Label: ${cat.label}`).join('\n');
      const rulesContext = JSON.stringify(module === 'KITCHEN' ? KITCHEN_M4_RULES : INDUSTRIAL_RULES, null, 2);

      const prompt = getSystemPrompt(userLocation, rulesContext, categoriesContext, module);
      
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

  analyzeVideo: async (videoBase64: string, userLocation: string = "Atelier", module: 'HOME' | 'KITCHEN' = 'HOME'): Promise<any[]> => {
    if (!apiKey) return [];
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // MIGRATION ROADMAP V4
        generationConfig: { responseMimeType: "application/json" }
      });

      const categoriesContext = CATEGORIES.map(cat => `- ID: "${cat.id}" | Label: ${cat.label}`).join('\n');
      const rulesContext = JSON.stringify(module === 'KITCHEN' ? KITCHEN_M4_RULES : INDUSTRIAL_RULES, null, 2);

      const prompt = getSystemPrompt(userLocation, rulesContext, categoriesContext, module);

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