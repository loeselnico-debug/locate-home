import { TIERS_CONFIG, type UserTier } from '../constants/tiers';

export const analyzeInventory = async (base64Image: string, tier: UserTier = 'FREE') => {
  const config = TIERS_CONFIG[tier];
  const systemPrompt = `Identifie l'outil. Réponds en JSON : { "name": "", "details": "", "etat": "", "categorie": "", "score_confiance": 0.0, "alerte_securite": "" }. ${config.safetyAudit ? "Active l'Audit Sécurité." : ""}`;
  
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }, { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }] }]
      })
    });
    const result = await response.json();
    const text = result.candidates[0].content.parts[0].text;
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch (error) {
    return null;
  }
};