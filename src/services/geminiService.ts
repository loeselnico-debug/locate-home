const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

// --- RÉGLAGE STABILITÉ & VITESSE ---
// On utilise le 2.0 Flash pour éviter les quotas trop stricts du Pro 3.1
const MODEL_NAME = "gemini-2.0-flash"; 
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[]): Promise<any[]> => {
    
    const systemPrompt = `
      Tu es l'expert vision de LOCATE HOME. 
      MISSION : Identifier l'outillage et la quincaillerie.
      FOCUS : Extrais les codes articles (6 chiffres) et les références (type XH-...).
      Réponds UNIQUEMENT en JSON.
    `;

    const contents = [{
      parts: [
        { text: systemPrompt },
        ...base64Images.map(img => ({
          inline_data: { mime_type: "image/jpeg", data: img.split(',')[1] }
        }))
      ]
    }];

    try {
      console.log(`📡 Connexion au moteur STABLE : [${MODEL_NAME}]`);
      
      const response = await fetch(MODEL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ ERREUR API :", errorData.error?.message || "Erreur de quota.");
        return [];
      }

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      const cleanJson = textResponse.replace(/```json|```/g, "").trim();
      
      return JSON.parse(cleanJson);

    } catch (error) {
      console.error("💥 CRASH SERVICE :", error);
      return [];
    }
  }
};