

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
// Note: Assurez-vous que ce modèle existe bien pour votre clé API. 
// Si erreur 404, remplacez par 'gemini-1.5-flash'
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[]): Promise<any[]> => {
    // 1. DÉFINITION DU CERVEAU (Prompt Système)
    const systemPrompt = `
    Tu es le moteur de vision industrielle LOCATE HOME (by Systems).
    PROTOCOLE ZERO-TRUST ET BRIDAGE MÉTIER ACTIVÉS.
    MISSION : Identifier l'outil et AUDITER sa sécurité.

    RÈGLES STRICTES DE VÉRITÉ :
    1. BRIDAGE MÉTIER : Ignore totalement l'environnement (murs, meubles, mains, décor, etc.). Ne te concentre que sur l'équipement technique.
    2. ZERO-TRUST : Si un objet n'appartient PAS au domaine strict de l'outillage, de la quincaillerie, du bricolage ou de l'industrie (ex: canette de soda, tasse, téléphone, nourriture), IGNORE-LE complètement. Ne tente JAMAIS de l'assimiler à un outil.
    3. INCERTITUDE : Si un objet ressemble à un outil mais n'est pas clairement identifiable avec certitude, ne devine pas. Indique "À vérifier" dans 'state' et précise la nature du doute dans 'description'.
    4. SÉCURITÉ (LA VÉRITÉ SYSTÈME) : Scanne l'image pour des défauts (câbles dénudés, carter fissuré, rouille). 
       - Si défaut visible -> 'safetyAlert' = true, définis un 'safetyLevel' et remplis 'safetyDetails'. 
       - Si RAS -> 'safetyAlert' = false, 'safetyLevel' = "NONE", 'safetyDetails' = "RAS".
    5. DÉDOUBLONNAGE : Identifie un outil de manière unique, même s'il apparaît sur plusieurs frames de la rafale vidéo.

    FORMAT JSON STRICT ATTENDU :
    [
      {
        "toolName": "string (Nom technique précis ou 'Non identifié')",
        "category": "string (id de la catégorie : electro, main, serrage, quinc, elec, peinture, mesure, jardin)",
        "state": "string (Opérationnel, À vérifier)",
        "safetyAlert": boolean,
        "safetyLevel": "LOW" | "MEDIUM" | "HIGH" | "NONE",
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
      const cleanJson = text.replace(/```json|```/g, "").trim();
      const parsedItems = JSON.parse(cleanJson);

      // --- DÉDOUBLONNAGE INTELLIGENT (Ceinture et bretelles) ---
      const uniqueItems = new Map();
      parsedItems.forEach((item: any) => {
        // On utilise le nom de l'outil (en minuscules pour éviter les erreurs de casse) comme clé unique
        const key = item.toolName ? item.toolName.toLowerCase().trim() : 'inconnu';
        
        if (!uniqueItems.has(key)) {
          // Si l'outil n'est pas encore dans la liste, on l'ajoute
          uniqueItems.set(key, item);
        } else {
          // Si l'outil existe déjà, on vérifie si cette nouvelle image a détecté une alerte de sécurité
          // La sécurité prime : on garde l'alerte même si la première image ne l'avait pas vue
          const existingItem = uniqueItems.get(key);
          if (item.safetyAlert && !existingItem.safetyAlert) {
            uniqueItems.set(key, item);
          }
        }
      });

      return Array.from(uniqueItems.values());

    } catch (error) {
      console.error("Erreur IA:", error);
      return [];
    }
  }
};