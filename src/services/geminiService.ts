const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

// --- RÉGLAGES HAUTE PRÉCISION (Changelog 19/02/2026) ---
// Utilisation du fleuron actuel pour éviter le 404
const MODEL_NAME = "gemini-3.1-pro-preview"; 
// Canal v1beta impératif pour les versions Preview
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[]): Promise<any[]> => {
    
    // 1. LE PROMPT SYSTÈME (Protocole Industriel)
    const systemPrompt = `
      Tu es l'expert vision de LOCATE HOME. 
      MISSION : Identifier l'outillage et la quincaillerie avec une précision de technicien.

      RÈGLES D'ANALYSE :
      1. FOCUS DATA : Extrais prioritairement les codes articles (ex: 251755) et références (ex: XH-23040L).
      2. JARGON MÉTIER : "Olive Nylon" = Pièce de guidage pour portail. "Téflon" = Matériau d'usure.
      3. ZERO-TRUST : Ignore tout ce qui n'est pas pro (mains, mobilier, décor).
      4. SÉCURITÉ : Détecte l'usure (méplats sur les galets, rouille, câbles abîmés).

      FORMAT JSON STRICT :
      [
        {
          "toolName": "Nom technique (ex: Olive Nylon D40)",
          "category": "quinc", 
          "state": "Opérationnel" | "À vérifier",
          "safetyAlert": boolean,
          "safetyLevel": "LOW" | "MEDIUM" | "HIGH" | "NONE",
          "safetyDetails": "Description de l'usure ou RAS",
          "description": "Inclure SKU: [code 6 chiffres] et REF: [code XH]"
        }
      ]
    `;

    // 2. CONSTRUCTION DU PAQUET DATA
    const contents = [{
      parts: [
        { text: systemPrompt },
        ...base64Images.map(img => ({
          inline_data: { mime_type: "image/jpeg", data: img.split(',')[1] }
        }))
      ]
    }];

    try {
      console.log(`📡 Signal envoyé au moteur : [${MODEL_NAME}]`);
      
      const response = await fetch(MODEL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      // 3. DIAGNOSTIC RÉSEAU
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ ERREUR API :", errorData.error?.message || "Vérifie ta clé ou le nom du modèle.");
        return [];
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.warn("⚠️ Réponse vide : L'IA n'a rien identifié de probant.");
        return [];
      }

      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Nettoyage du Markdown pour isoler le JSON
      const cleanJson = textResponse.replace(/```json|```/g, "").trim();
      const parsedItems = JSON.parse(cleanJson);

      // 4. DÉDOUBLONNAGE
      const uniqueItems = new Map();
      parsedItems.forEach((item: any) => {
        const key = item.toolName.toLowerCase().trim();
        if (!uniqueItems.has(key) || item.safetyAlert) {
          uniqueItems.set(key, item);
        }
      });

      return Array.from(uniqueItems.values());

    } catch (error) {
      console.error("💥 CRASH SERVICE :", error);
      return [];
    }
  }
};