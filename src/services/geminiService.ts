const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

// TEST DE LA CLÉ : Si elle est vide, on le saura tout de suite
if (!API_KEY) {
  console.error("⚠️ ERREUR : La clé API n'est pas détectée. Vérifie tes variables d'environnement Vercel !");
}

// On utilise l'URL la plus stable et universelle
const MODEL_NAME = "gemini-1.5-flash"; // On reste sur 1.5 pour le test de stabilité
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[]): Promise<any[]> => {
    const systemPrompt = `Tu es le moteur LOCATE HOME. Identifie l'outillage et la quincaillerie. Réponds UNIQUEMENT en JSON. Format : [{"toolName": "nom", "category": "id", "state": "Opérationnel", "safetyAlert": false, "safetyLevel": "NONE", "safetyDetails": "RAS", "description": "détails"}]`;

    const contents = [{
      parts: [
        { text: systemPrompt },
        ...base64Images.map(img => ({
          inline_data: { mime_type: "image/jpeg", data: img.split(',')[1] }
        }))
      ]
    }];

    try {
      console.log("🚀 Envoi de la requête à :", MODEL_NAME);
      
      const response = await fetch(MODEL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      if (!response.ok) {
        // --- DIAGNOSTIC CRITIQUE ---
        const errorDetail = await response.json();
        console.error("❌ ERREUR API GOOGLE (" + response.status + "):", errorDetail);
        throw new Error(`Erreur Google : ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);

    } catch (error) {
      console.error("💥 CRASH SERVICE IA :", error);
      return [];
    }
  }
};