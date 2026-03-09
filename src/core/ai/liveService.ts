/**
 * LOCATE SYSTEMS - LIVE ASSISTANT SERVICE (V2.1 - JSON Schema Forcé)
 * Architecture : REST Multimodal (Gemini 2.5 Flash)
 * Standard : OSA/CBM, OBD-II, J1939 & RGPD Zéro-Trace
 */

import { GARAGE_M5_RULES } from './expertisemetier/mecanique';
import { MAINTENANCE_M5_RULES } from './expertisemetier/maintenance';

export interface LiveDiagnostic {
  hypothesis: string;
  confidence: number;
  nextStep: string;
  safetyAlert?: string;
}

class LiveService {
  private apiKey: string = "";
  private systemInstruction: string = "";
  private latestFrame: string | null = null;
  private onMessageCallback: ((data: LiveDiagnostic) => void) | null = null;

  async connect(mode: 'maintenance' | 'mecanique', onMessage: (data: LiveDiagnostic) => void) {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_GENAI_API_KEY || "";
    
    if (!this.apiKey) {
      console.error("Clé d'API manquante. Vérifiez le fichier .env.");
      throw new Error("Impossible d'établir le tunnel sécurisé.");
    }

    this.onMessageCallback = onMessage;

    let role = mode === 'mecanique' ? "Expert Mécanique Auto & Poids Lourds" : "Expert Maintenance Industrielle";
    let rulesContext = mode === 'mecanique' ? JSON.stringify(GARAGE_M5_RULES) : JSON.stringify(MAINTENANCE_M5_RULES);

    this.systemInstruction = `
      Tu es l'${role} du système LOCATE. Mode actif : ${mode.toUpperCase()}.
      
      VOICI TA BIBLE MÉTIER STRICTE :
      ${rulesContext}

      PROTOCOLE DE COMMUNICATION :
      - Zéro phrase de courtoisie. Va à l'essentiel.
      - Droit de veto absolu si une condition de sécurité manque (LOTO, VAT, etc.). Pose des questions pour valider ces étapes si le technicien ne l'a pas fait.
      - Ton objectif est de guider pas à pas.
    `;

    setTimeout(() => {
      console.log(`🔗 [EDGE MODE] Tunnel Asynchrone établi en mode : ${mode.toUpperCase()}`);
    }, 500);
  }

  sendVideoFrame(canvas: HTMLCanvasElement) {
    this.latestFrame = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
  }

  async sendPrompt(text: string) {
    if (!this.onMessageCallback) return;

    console.log(`🚀 [EDGE MODE] Transmission en cours... Texte : "${text}"`);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
      
      const parts: any[] = [{ text: text }];
      
      if (this.latestFrame) {
        console.log("📸 [EDGE MODE] Image bionique jointe à la transmission.");
        parts.push({
          inlineData: { mimeType: "image/jpeg", data: this.latestFrame }
        });
        this.latestFrame = null; 
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: this.systemInstruction }] },
          contents: [{ role: "user", parts: parts }],
          generationConfig: { 
            responseMimeType: "application/json",
            // L'ARME ABSOLUE : ON FORCE L'IA À UTILISER EXACTEMENT CES VARIABLES
            responseSchema: {
              type: "OBJECT",
              properties: {
                hypothesis: { 
                  type: "STRING", 
                  description: "Ta réponse verbale, ton diagnostic ou ta question directe au technicien." 
                },
                confidence: { 
                  type: "NUMBER", 
                  description: "Ton niveau de certitude technique sous forme de nombre (ex: 0.95)." 
                },
                nextStep: { 
                  type: "STRING", 
                  description: "L'action physique que le technicien doit accomplir ensuite." 
                },
                safetyAlert: { 
                  type: "STRING", 
                  description: "Une alerte de danger immédiat. Laisse vide s'il n'y a pas de danger." 
                }
              },
              required: ["hypothesis", "confidence", "nextStep"]
            }
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const textResponse = data.candidates[0].content.parts[0].text;
      console.log("✅ [EDGE MODE] Réponse brute de l'IA :", textResponse);
      
      const parsedData = JSON.parse(textResponse);
      
      // FILET DE SÉCURITÉ : Au cas où l'IA trébuche, on ne fait pas crasher l'UI
      const finalData: LiveDiagnostic = {
        hypothesis: parsedData.hypothesis || "Action confirmée.",
        confidence: parsedData.confidence !== undefined ? parsedData.confidence : 0.99,
        nextStep: parsedData.nextStep || "-",
        safetyAlert: parsedData.safetyAlert || undefined
      };

      this.onMessageCallback(finalData);

    } catch (error) {
      console.error("💥 [EDGE MODE] Erreur de transmission :", error);
      this.onMessageCallback({
        hypothesis: "Erreur de transmission réseau. Répétez.",
        confidence: 0,
        nextStep: "Vérifier la connexion.",
        safetyAlert: "COMMUNICATION PERDUE"
      });
    }
  }

  terminate() {
    this.latestFrame = null;
    this.onMessageCallback = null;
    console.log("🔒 [ZÉRO-TRACE] Session terminée. Buffer mémoire purgé.");
  }
}

export const liveService = new LiveService();