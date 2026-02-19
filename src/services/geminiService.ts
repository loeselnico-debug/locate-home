

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
// Note: Assurez-vous que ce modèle existe bien pour votre clé API. 
// Si erreur 404, remplacez par 'gemini-1.5-flash'
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[]): Promise<any[]> => {
    // 1. DÉFINITION DU CERVEAU (Prompt Système)
    const systemPrompt = `
    Tu es un expert en sécurité industrielle LOCATE SYSTEMS.
    MISSION : Identifier l'outil et AUDITER sa sécurité.

    RÈGLES D'IDENTIFICATION :
    - Sois précis (ex: "Perceuse Makita 18V").
    - Ignore le décor.

    RÈGLES DE SÉCURITÉ (LA VÉRITÉ SYSTÈME) :
    1. SCANNE l'image pour : Câbles dénudés ? Carter fissuré ? Rouille ?
    2. Si défaut visible -> 'safetyAlert' = true et remplis 'safetyDetails'.
    3. Si RAS -> 'safetyAlert' = false.

    FORMAT JSON STRICT ATTENDU :
    [
      {
        "toolName": "string",
        "category": "string (id)",
        "state": "string",
        "safetyAlert": boolean,
        "safetyLevel": "LOW" | "MEDIUM" | "HIGH",
        "safetyDetails": "string",
        "description": "string"
      }
    ]
    `;

    // 2. PRÉPARATION DE L'ENVOI (Payload)
    const contents = [{
      parts: [
        { text: systemPrompt }, 
        ...base64Images.map(img => ({
          inline_data: { mime_type: "image/jpeg", data: img.split(',')[1] }
        }))
      ]
    }];

    try {
      const response = await fetch(MODEL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });
      
      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error("Structure réponse IA invalide:", data);
        return [];
      }

      const text = data.candidates[0].content.parts[0].text;
      // Nettoyage du markdown JSON si présent
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);

    } catch (error) {
      console.error("Erreur IA:", error);
      return [];
    }
  }
};