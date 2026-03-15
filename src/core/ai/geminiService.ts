import { GoogleGenerativeAI } from '@google/generative-ai';
import { CATEGORIES } from '../../types';
import { INDUSTRIAL_RULES } from './expertisemetier/home';
import { KITCHEN_M4_RULES } from './expertisemetier/kitchen';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// --- PROMPT SYSTEME DYNAMIQUE HOME & KITCHEN ---
const getSystemPrompt = (userLocation: string, rulesContext: string, categoriesContext: string, module: 'HOME' | 'KITCHEN' = 'HOME') => {
  const brandInstruction = module === 'HOME' ? 'Marque exacte SEULE. DÉDUIRE OBLIGATOIREMENT la marque via couleurs/formes/design si le texte est flou (ex: Bleu/Rouge = Bosch/Milwaukee).' : 'Marque ou Origine';
  const typeInstruction = module === 'HOME' ? 'Nom générique usuel (ex: perceuse, meuleuse, niveau laser)' : 'Famille de produit';
  const morphInstruction = module === 'HOME' ? 'Type d outil détaillé' : 'Type de denree ou objet';
  const zoomInstruction = module === 'HOME' ? 'Detail technique (ex: 12V, 18V, filaire, batterie)' : 'Etat de fraicheur ou detail HACCP';
  const typoInstruction = module === 'HOME' ? 'Modèle ou Gamme. DÉDUIRE via design si plaque illisible (ex: Bosch Professional, gamme M18). Écrire Inconnu uniquement si impossible.' : 'DLC DDM ou SKU';
  const consumableInstruction = module === 'KITCHEN' ? 'true' : 'true si vis, clou, joint, foret, colle. false sinon.';
  
  return `
Tu es l Expert Vision ${module === 'HOME' ? 'Industrielle' : 'Culinaire HACCP'} du système LOCATE. 
Localisation de l analyse : ${userLocation}.
Ton rôle est d analyser les images/vidéos en appliquant STRICTEMENT le protocole d expertise fourni.

VOICI TON RÉFÉRENTIEL D EXPERTISE MÉTIER OBLIGATOIRE :
${rulesContext}

CATÉGORIES AUTORISÉES (Utilise uniquement ces ID) :
${categoriesContext}

RÈGLE ABSOLUE : Tu dois retourner UNIQUEMENT un tableau JSON valide. Pas de texte avant, pas de markdown.

Chaque objet détecté doit suivre cette structure EXACTE :
[
  {
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
        model: "gemini-2.5-flash",
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
        model: "gemini-2.5-flash",
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
  },

  // --- FONCTION SPÉCIALISÉE POUR L'ANALYSE FOD ---
  analyzeServanteFOD: async (base64Images: string[], servanteId: string = "INCONNU"): Promise<{status: string, tags: string[], justification: string} | null> => {
    if (!apiKey) {
      console.error("Clé API Gemini introuvable.");
      return null;
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
Tu es l'Expert Vision Industrielle du protocole FOD (Foreign Object Debris) du système LOCATE M5.
Tu vas analyser ${base64Images.length} clichés consécutifs représentant les tiroirs et le plateau de la servante d'atelier "${servanteId}".

RÈGLE D'ANALYSE (LE STANDARD 5S ET LES MOUSSES BICOLORES) :
- Les tiroirs possèdent des mousses de rangement bicolores (ex: noir en surface, rouge ou couleur vive au fond).
- ATTENTION AUX FAUX POSITIFS : Il est normal de voir de petites zones rouges autour des outils présents (ce sont les encoches de préhension pour les doigts). Ignore ces petites zones.
- LA VRAIE ANOMALIE : Tu dois chercher les "trous complets" (une empreinte d'outil entièrement vide laissant apparaître la silhouette complète de l'outil dans la couleur de fond).
- Outils en vrac : détecte les zones de "Rangement chaos" où les outils ne sont pas dans leurs empreintes, ou si le plateau supérieur est encombré de pièces non rangées.

INSTRUCTION DE SORTIE :
Tu dois retourner UNIQUEMENT un objet JSON valide suivant cette structure EXACTE :
{
  "status": "CONFORME" | "DEGRADE",
  "tags": [],
  "justification": ""
}

Logique de remplissage :
- Si AUCUN trou complet n'est visible et que le plateau est propre -> "status": "CONFORME", "tags": [], "justification": "Contrôle visuel OK. Mousses pleines, aucune anomalie détectée."
- Si au moins UNE empreinte est totalement vide ou qu'un tiroir/plateau est en vrac -> "status": "DEGRADE". 
  - Dans "tags", inclus les motifs pertinents : ["Outil manquant", "Rangement chaos", "Outil mal placé"].
  - Dans "justification", sois descriptif. Ex: "Tiroir 02 : Empreinte de pince vide visible au centre. Tiroir 04 : Clés plates en vrac."
`;

      const imageParts = base64Images.map(base64 => ({
        inlineData: { data: base64.split(',')[1], mimeType: "image/jpeg" }
      }));

      const result = await model.generateContent([prompt, ...imageParts]);
      return JSON.parse(result.response.text());
      
    } catch (error) {
      console.error("Erreur Gemini (Analyse FOD):", error);
      return null;
    }
  },
  
  // --- FONCTION SPÉCIALISÉE : LECTURE DU PASSEPORT SÉCURITÉ ---
  analyzePasseportSecurite: async (base64Image: string): Promise<{fullName: string, company: string, techId: string, habilitations: string[]} | null> => {
    if (!apiKey) {
      console.error("Clé API Gemini introuvable.");
      return null;
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
Tu es l'Expert de Conformité et Sécurité du système LOCATE M5.
Analyse cette photo qui représente un passeport sécurité, une carte d'habilitation électrique, un CACES ou un badge professionnel.

INSTRUCTION DE SORTIE :
Tu dois retourner UNIQUEMENT un objet JSON valide suivant cette structure EXACTE :
{
  "fullName": "Nom et Prénom du technicien",
  "company": "Nom de l'entreprise ou de l'employeur (si visible, sinon vide)",
  "techId": "Numéro de matricule, numéro de titre ou identifiant (si visible, sinon vide)",
  "habilitations": ["Liste", "des", "habilitations", "visibles", "ex: BR, B0, CACES R489, H1V..."]
}

Règles : 
- Cherche minutieusement les symboles d'habilitation électrique française (B0, B1V, BR, BC, H0, etc.).
- Ne retourne pas de Markdown, uniquement le JSON brut.
`;

      const imagePart = {
        inlineData: { data: base64Image.split(',')[1], mimeType: "image/jpeg" }
      };

      const result = await model.generateContent([prompt, imagePart]);
      return JSON.parse(result.response.text());
      
    } catch (error) {
      console.error("Erreur Gemini (Analyse Passeport):", error);
      return null;
    }
  }
};