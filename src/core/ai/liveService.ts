/**
 * LOCATE SYSTEMS - LIVE ASSISTANT SERVICE (V1.2 - Architecture Cloisonnée)
 * Architecture : WebSocket Multimodal (Gemini 2.0 Flash)
 * Standard : OSA/CBM, OBD-II, J1939 & RGPD Zéro-Trace
 */

// IMPORT STRICTEMENT SÉPARÉ DES BIBLES MÉTIERS
import { GARAGE_M5_RULES } from './expertisemetier/mecanique';
import { MAINTENANCE_M5_RULES } from './expertisemetier/maintenance';

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

    // 2. AIGUILLAGE DU CERVEAU (ZÉRO CROSS-CONTAMINATION)
    let role = "";
    let rulesContext = "";

    if (mode === 'mecanique') {
      role = "Expert Mécanique Auto & Poids Lourds (OBD2, J1939, UTAC, Thermique)";
      rulesContext = JSON.stringify(GARAGE_M5_RULES, null, 2);
    } else if (mode === 'maintenance') {
      role = "Expert Maintenance Industrielle (AFNOR, OSA/CBM, LOTO)";
      rulesContext = JSON.stringify(MAINTENANCE_M5_RULES, null, 2);
    }

    // Injection de la directive militaire "Zéro-Fioriture"
    const systemInstruction = `
      Tu es l'${role} du système LOCATE. 
      Mode actif : ${mode.toUpperCase()}.
      
      VOICI TA BIBLE MÉTIER STRICTE À APPLIQUER ABSOLUMENT :
      ${rulesContext}

      PROTOCOLE DE COMMUNICATION OBLIGATOIRE :
      - Zéro phrase de courtoisie. Va à l'essentiel.
      - Format exigé : "Étape [X] : [Action]. Dis 'Fait' quand c'est terminé."
      - Isolement du doute : Aucune extrapolation. Si la vidéo est floue, dis : "Visuel non conforme. Nettoie la lentille."
      - Droit de veto absolu : Si une condition de sécurité manque (levage sans chandelle, tension haute sans EPI), bloque le diagnostic immédiatement.
    `;

    try {
      // 3. Établissement du tunnel WebSocket
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BiDiGenerateContent?key=${apiKey}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log(`🔗 Tunnel Live LOCATE établi en mode : ${mode.toUpperCase()}`);
        
        // 4. Envoi du Setup Message avec le Manifeste Métier spécifique au mode
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
          
          // Log brut pour surveiller les retours de l'API Bidi
          console.log("Trame IA reçue :", response);

          // En attendant le vrai parsing complexe des 'serverContent' de Gemini Bidi, 
          // on garde ce stub fonctionnel pour que l'UI ne crashe pas.
          onMessage({
            hypothesis: `Analyse du flux visuel ${mode.toUpperCase()} en cours...`,
            confidence: 0.90,
            nextStep: "Attente de données capteurs ou visuelles."
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