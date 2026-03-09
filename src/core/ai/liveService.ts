/**
 * LOCATE SYSTEMS - LIVE ASSISTANT SERVICE (V1.4 - Correction Bidi & Gemini 2.5)
 * Architecture : WebSocket Multimodal (Gemini 2.5 Flash)
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
  private socket: WebSocket | null = null;
  private frameInterval: number | null = null;
  private messageBuffer: string = "";

  async connect(mode: 'maintenance' | 'mecanique', onMessage: (data: LiveDiagnostic) => void) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Clé d'API manquante. Vérifiez le fichier .env.");
      throw new Error("Impossible d'établir le tunnel sécurisé.");
    }

    let role = "";
    let rulesContext = "";

    if (mode === 'mecanique') {
      role = "Expert Mécanique Auto & Poids Lourds (OBD2, J1939, UTAC, Thermique)";
      rulesContext = JSON.stringify(GARAGE_M5_RULES, null, 2);
    } else if (mode === 'maintenance') {
      role = "Expert Maintenance Industrielle (AFNOR, OSA/CBM, LOTO)";
      rulesContext = JSON.stringify(MAINTENANCE_M5_RULES, null, 2);
    }

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

      FORMAT DE RÉPONSE EXIGÉ :
      Tu dois répondre UNIQUEMENT avec un objet JSON valide, sans markdown, avec cette structure exacte :
      {
        "hypothesis": "Ton diagnostic ou instruction courte",
        "confidence": 0.95,
        "nextStep": "Action suivante attendue",
        "safetyAlert": "ALERTE SI DANGER (sinon omettre)"
      }
    `;

    try {
      // CORRECTION 1 : L'URL exige "BidiGenerateContent" avec un 'd' minuscule !
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log(`🔗 Tunnel Live LOCATE établi en mode : ${mode.toUpperCase()}`);
        
        const setupMessage = {
          setup: {
            // CORRECTION 2 : Alignement sur le modèle 2.5 Flash comme demandé
            model: "models/gemini-2.5-flash",
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            }
          }
        };
        this.socket?.send(JSON.stringify(setupMessage));
        this.messageBuffer = "";
      };

      this.socket.onmessage = (event) => {
        try {
          if (typeof event.data === 'string') {
            const response = JSON.parse(event.data);
            const textChunk = response.serverContent?.modelTurn?.parts?.[0]?.text;
            
            if (textChunk) {
              this.messageBuffer += textChunk;

              const startIndex = this.messageBuffer.indexOf('{');
              const endIndex = this.messageBuffer.lastIndexOf('}');

              if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                const possibleJson = this.messageBuffer.substring(startIndex, endIndex + 1);
                
                try {
                  const parsedData = JSON.parse(possibleJson) as LiveDiagnostic;
                  onMessage(parsedData);
                  this.messageBuffer = "";
                } catch (e) {
                  // En attente de la suite du JSON...
                }
              }
            }
          }
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

// NOUVEAU : Fonction pour poser une question ou donner un ordre à l'IA
  sendPrompt(text: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const message = {
        clientContent: {
          turns: [{
            role: "user",
            parts: [{ text: text }]
          }],
          turnComplete: true
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
    this.messageBuffer = "";
    console.log("🔒 [ZÉRO-TRACE] Session terminée. Buffer vidéo et texte détruits.");
  }
}

export const liveService = new LiveService();