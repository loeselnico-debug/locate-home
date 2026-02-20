import { INDUSTRIAL_RULES } from '../../config/expertiseRules';

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY?.trim();
const MODEL_NAME = "gemini-2.0-flash";
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

export const VALID_LOCATIONS = ["Garage", "Atelier", "Maison", "Prêt", "Jardin", "Chantier"];

export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[], userLocation: string = "Atelier"): Promise<any[]> => {
    
    // Intégration du Référentiel Métier V1.4 dans le raisonnement
    const systemPrompt = `
      Tu es l'Expert Vision de LOCATE SYSTEMS 🧭.
      Ton analyse doit être guidée par le RÉFÉRENTIEL MÉTIER GLOBAL suivant :
      
      PROTOCOLE D'IDENTIFICATION :
      ${INDUSTRIAL_RULES.identification_logic.join(' -> ')}

      SIGNATURES MARQUES & MORPHOLOGIE :
      - Milwaukee : ${INDUSTRIAL_RULES.brand_dna.milwaukee.style}
      - Makita : ${INDUSTRIAL_RULES.brand_dna.makita.style}
      - Bosch Pro : ${INDUSTRIAL_RULES.brand_dna.bosch_pro.style}
      
      LOGIQUE DE TÊTE D'OUTIL :
      - Visseuse choc : ${INDUSTRIAL_RULES.tool_head_logic.visseuse_choc}
      - Boulonneuse : ${INDUSTRIAL_RULES.tool_head_logic.boulonneuse}

      OUTILLAGE À MAIN (Signatures couleurs) :
      - Facom Protwist : Rouge=${INDUSTRIAL_RULES.hand_tool_signatures.facom_protwist.rouge}, Jaune=${INDUSTRIAL_RULES.hand_tool_signatures.facom_protwist.jaune}

      CONSIGNE : Identifie les objets présents dans la zone "${userLocation}".
      
      FORMAT DE RÉPONSE JSON STRICT :
      [{
        "toolName": string,
        "location": "${userLocation}",
        "category": string,
        "confidence": number,
        "safetyStatus": string,
        "sku": string
      }]
    `;

    const contents = base64Images.map(b64 => ({
      inline_data: { 
        mime_type: "image/jpeg", 
        data: b64.includes(',') ? b64.split(',')[1] : b64 
      }
    }));

    try {
      const response = await fetch(MODEL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: systemPrompt }, ...contents] }],
          generationConfig: { 
            response_mime_type: "application/json",
            temperature: 0.1 
          }
        })
      });

      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);

      const data = await response.json();
      const rawText = data.candidates[0].content.parts[0].text;
      
      // Nettoyage sécurisé du JSON
      const cleanJson = rawText.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);

    } catch (error) {
      console.error("Erreur Vision Systems:", error);
      return [];
    }
  }
};