import { INDUSTRIAL_RULES } from '../../config/expertiseRules'; // Correction du chemin (montée de 2 niveaux)

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY?.trim();
const MODEL_NAME = "gemini-2.0-flash";
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

export const VALID_LOCATIONS = ["Garage", "Atelier", "Maison", "Prêt", "Jardin", "Chantier"];

// Correction du mot-clé 'eexport' en 'export'
export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[], userLocation: string = "Atelier"): Promise<any[]> => {
    
    // INJECTION DE LA BIBLE DANS LE PROMPT (Lecture typographique & Morphologie)
    const systemPrompt = `
      Tu es l'Expert Vision de LOCATE SYSTEMS 🧭.
      Tu dois identifier l'outillage en suivant strictement le RÉFÉRENTIEL MÉTIER V1.4 :
      
      PROTOCOLE D'IDENTIFICATION :
      ${INDUSTRIAL_RULES.identification_logic.join(' -> ')}

      SIGNATURES MARQUES :
      - Makita : ${INDUSTRIAL_RULES.brand_dna.makita.style}
      - Milwaukee : ${INDUSTRIAL_RULES.brand_dna.milwaukee.style}
      - Bosch Pro : ${INDUSTRIAL_RULES.brand_dna.bosch_pro.style}
      
      LOGIQUE DE TÊTE (NEZ) :
      - Visseuse choc : ${INDUSTRIAL_RULES.tool_head_logic.visseuse_choc}
      - Boulonneuse : ${INDUSTRIAL_RULES.tool_head_logic.boulonneuse}

      FORMAT JSON STRICT :
      [{
        "toolName": string,
        "location": "${userLocation}",
        "category": "electro" | "main" | "serrage" | "quinc" | "elec" | "peinture" | "mesure" | "jardin" | "EPI",
        "confidence": number,
        "safetyStatus": string,
        "sku": string
      }]
    `;

    const contents = base64Images.map(b64 => ({
      inline_data: { mime_type: "image/jpeg", data: b64.split(',')[1] }
    }));

    try {
      const response = await fetch(MODEL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: systemPrompt }, ...contents] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      const data = await response.json();
      return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("Erreur Vision Systems:", error);
      return [];
    }
  }
};