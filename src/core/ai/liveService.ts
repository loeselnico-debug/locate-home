/**
 * LOCATE SYSTEMS - LIVE ASSISTANT SERVICE (V2.0 - Asynchrone Edge Mode)
 * Architecture : REST Multimodal (Gemini 2.5 Flash) - Fallback activé
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
      - Droit de veto absolu si une condition de sécurité manque.
    `;

    // Simulation de l'ouverture du tunnel pour l'interface utilisateur
    setTimeout(() => {
      console.log(`🔗 [EDGE MODE] Tunnel Asynchrone établi en mode : ${mode.toUpperCase()}`);
    }, 500);
  }

  // Cette fonction est appelée par l'intervalle de la caméra. 
  // On ne l'envoie plus dans le vide, on la stocke en mémoire vive.
  sendVideoFrame(canvas: HTMLCanvasElement) {
    this.latestFrame = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
  }

  // Déclenché quand tu relâches le bouton PTT
  async sendPrompt(text: string) {
    if (!this.onMessageCallback) return;

    console.log(`🚀 [EDGE MODE] Transmission en cours... Texte : "${text}"`);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
      
      // Construction du payload (Texte + Image si la Vision Bionique est activée)
      const parts: any[] = [{ text: text }];
      
      if (this.latestFrame) {
        console.log("📸 [EDGE MODE] Image bionique jointe à la transmission.");
        parts.push({
          inlineData: { mimeType: "image/jpeg", data: this.latestFrame }
        });
        // On purge l'image après utilisation pour le Zéro-Trace
        this.latestFrame = null; 
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: this.systemInstruction }] },
          contents: [{ role: "user", parts: parts }],
          generationConfig: { 
            // LE VERROU MAGIQUE : Force la sortie en JSON pur, sans markdown !
            responseMimeType: "application/json" 
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      // Extraction et parsing automatique garanti par le responseMimeType
      const textResponse = data.candidates[0].content.parts[0].text;
      console.log("✅ [EDGE MODE] Réponse brute de l'IA :", textResponse);
      
      const parsedData = JSON.parse(textResponse) as LiveDiagnostic;
      this.onMessageCallback(parsedData);

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
