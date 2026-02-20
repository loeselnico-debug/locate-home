// src/core/services/geminiService.ts

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY?.trim();
const MODEL_NAME = "gemini-2.0-flash";
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

// LA SOURCE DE VÉRITÉ DES ZONES
export const VALID_LOCATIONS = ["Garage", "Atelier", "Maison", "Prêt", "Jardin", "Chantier"];

export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[], userLocation: string = "Atelier"): Promise<any[]> => {
    const systemPrompt = `
      Tu es l'expert vision de LOCATE SYSTEMS 🧭 ⚛️ 🇫🇷.
      MISSION : Identifier l'outillage et l'indexer dans la zone : ${userLocation}.
      
      CONTRAINTE : Choisis impérativement la localisation parmi cette liste : [${VALID_LOCATIONS.join(", ")}].
      
      FORMAT JSON STRICT :
      [{
        "toolName": string,
        "location": string,
        "category": "electro" | "main" | "serrage" | "quinc" | "elec" | "peinture" | "mesure" | "jardin" | "EPI",
        "sku": string,
        "safetyStatus": string,
        "confidence": number
      }]
    `;

    try {
      if (!API_KEY) throw new Error("Clé API manquante dans l'environnement.");

      const response = await fetch(MODEL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: systemPrompt },
              ...base64Images.map(img => ({
                inline_data: { mime_type: "image/jpeg", data: img.split(',')[1] }
              }))
            ]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erreur API Gemini:", errorData.error?.message);
        return [];
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) return [];

      // Nettoyage et parsing robuste du JSON
      const cleanJson = textResponse.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);

    } catch (error) {
      console.error("💥 Crash geminiService:", error);
      return [];
    }
  }
};