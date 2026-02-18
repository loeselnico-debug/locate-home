import { INDUSTRIAL_RULES } from '../config/expertiseRules';

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export const geminiService = {
  analyzeTool: async (base64Image: string): Promise<any[]> => {
    const base64Data = base64Image.split(',')[1] || base64Image;

    // INJECTION DYNAMIQUE DE L'EXPERTISE MÉTIER
    const prompt = `
      Tu es l'Expert Vision de la holding LOCATE SYSTEMS.
      Ta mission est d'identifier l'environnement et CHAQUE outil avec une précision industrielle.

      RÈGLES D'EXPERTISE À APPLIQUER (STRICT) :
      ${JSON.stringify(INDUSTRIAL_RULES)}

      FORMAT DE RÉPONSE :
      Renvoie UNIQUEMENT un tableau JSON [{}, {}] respectant scrupuleusement l'interface InventoryItem.
      Chaque objet doit inclure :
      - name: Nom technique précis (ex: "Visseuse à choc Milwaukee M18")
      - details: Analyse selon l'expertise (état batterie, type mandrin, usure)
      - etat: "Opérationnel" ou "À vérifier"
      - categorie: L'ID exact parmi les 9 catégories définies.
      - score_confiance: 0-100 (Sois sévère, applique le seuil de 70%)
      - alerte_securite: boolean (Vrai si anomalie ou outil dangereux sans EPI)
      - localisation: Détection spatiale précise (ex: "Établi Central", "Rayon Droite Fourgon")

      RÈGLE CRITIQUE : Pas de texte avant ou après le JSON.
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

      // BLINDAGE : Vérification de l'existence de la réponse
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        console.error("⚠️ Réponse Gemini vide ou bloquée par la sécurité.");
        return [];
      }

      const textResponse = data.candidates[0].content.parts[0].text;
      
      // EXTRACTION DE SECOURS : On cherche le premier '[' et le dernier ']'
      const startJson = textResponse.indexOf('[');
      const endJson = textResponse.lastIndexOf(']') + 1;
      
      if (startJson === -1 || endJson === 0) {
        console.error("❌ Aucun format JSON détecté dans la réponse.");
        return [];
      }

      const jsonString = textResponse.substring(startJson, endJson);
      const result = JSON.parse(jsonString);

      return Array.isArray(result) ? result : [result];

    } catch (error) {
      console.error("❌ Erreur Analyse Expert :", error);
      return [];
    }
  }
};