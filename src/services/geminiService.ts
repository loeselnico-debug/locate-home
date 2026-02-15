const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export const geminiService = {
  analyzeTool: async (base64Image: string): Promise<any[]> => {
    const base64Data = base64Image.split(',')[1] || base64Image;

    const prompt = `
      Tu es un expert en logistique et maintenance industrielle pour l'application LOCATEHOME.
      
      MISSION 1 : Identifie l'environnement de travail (ex: Établi, Fourgon, Armoire, Mur d'outillage).
      MISSION 2 : Identifie CHAQUE outil visible dans cet environnement.

      Réponds UNIQUEMENT avec un TABLEAU JSON d'objets [{}, {}...].
      Chaque objet doit suivre cette structure :
      {
        "name": "Nom technique de l'outil",
        "details": "Modèle, marque visible, état général",
        "etat": "Opérationnel" | "À vérifier",
        "categorie": "electro" | "main" | "serrage" | "quinc" | "elec" | "peinture" | "mesure" | "jardin",
        "score_confiance": 0-100,
        "alerte_securite": false,
        "localisation": "Le nom du lieu détecté (ex: Établi zone A, Fond du Fourgon, etc.)"
      }

      RÈGLES CRITIQUES :
      - Sois extrêmement précis sur la 'localisation' en fonction de l'arrière-plan.
      - Si tu vois 12 outils, renvoie 12 objets.
      - Réponse au format JSON pur sans texte explicatif.
    `;

    try {
      const response = await fetch(MODEL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: "image/jpeg", data: base64Data } }
            ]
          }]
        })
      });

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      
      const jsonString = textResponse.replace(/```json|```/g, "").trim();
      const result = JSON.parse(jsonString);

      return Array.isArray(result) ? result : [result];

    } catch (error) {
      console.error("❌ Erreur Analyse Spatiale :", error);
      return [];
    }
  }
};