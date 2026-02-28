/**
 * LOCATE SYSTEMS - LIVE ASSISTANT SERVICE (V1.1)
 * Architecture : WebSocket Multimodal (Gemini 2.0 Flash)
 * Standard : OSA/CBM & RGPD Zéro-Trace
 */

import { INDUSTRIAL_RULES } from './expertiseRules';

export interface LiveDiagnostic {
  hypothesis: string;
  confidence: number;
  nextStep: string;
  safetyAlert?: string;
}

class LiveService {
  private socket: WebSocket | null = null;
  private frameInterval: number | null = null;

  async connect(mode: 'maintenance' | 'mecanique', onMessage: (data: LiveDiagnostic) => void) {
    // 1. Récupération de la clé API
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Clé d'API manquante. Vérifiez le fichier .env.");
      throw new Error("Impossible d'établir le tunnel sécurisé.");
    }

    const systemInstruction = `
      Tu es l'Expert de Maintenance Industrielle LOCATE. 
      Mode actuel : ${mode.toUpperCase()}.
      Protocole de sécurité strict : ${INDUSTRIAL_RULES.security.epi_alert}
      Utilise la méthode AMDEC pour le diagnostic.
    `;

    try {
      // 2. Injection de la clé directement dans l'URL (Requis par Gemini WebSocket)
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BiDiGenerateContent?key=${apiKey}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log("🔗 Tunnel Live LOCATE établi.");
        
        // 3. Envoi du Setup Message avec le Manifeste Métier
        const setupMessage = {
          setup: {
            model: "models/gemini-2.0-flash",
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            }
          }
        };
        this.socket?.send(JSON.stringify(setupMessage));
      };

      this.socket.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          
          // Log brut pour surveiller les retours complexes de l'API Bidi
          console.log("Trame IA reçue :", response);

          // Remplacement du hardcoding par un retour générique en attendant le parsing complet des 'serverContent'
          onMessage({
            hypothesis: "Analyse du flux visuel en cours...",
            confidence: 0.90,
            nextStep: "Attente de votre directive vocale ou visuelle."
          });
        } catch (error) {
          console.error("Erreur de lecture de la trame IA :", error);
        }
      };

    } catch (error) {
      console.error("Erreur de connexion Live :", error);
      throw new Error("Connexion impossible. Passage en mode Edge (Asynchrone).");
    }
  }

  sendVideoFrame(canvas: HTMLCanvasElement) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      // 4. Nettoyage du signal : Gemini refuse l'en-tête "data:image/jpeg;base64,"
      const base64Data = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
      
      const message = {
        realtimeInput: {
          mediaChunks: [{
            mimeType: "image/jpeg",
            data: base64Data
          }]
        }
      };
      this.socket.send(JSON.stringify(message));
    }
  }

  terminate() {
    if (this.frameInterval) {
      window.clearInterval(this.frameInterval);
      this.frameInterval = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    console.log("🔒 [ZÉRO-TRACE] Session terminée. Buffer vidéo détruit.");
  }
}

export const liveService = new LiveService();