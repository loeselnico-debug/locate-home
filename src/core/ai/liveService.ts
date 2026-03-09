/**
 * LOCATE SYSTEMS - LIVE ASSISTANT SERVICE (V1.5 - Parser Bidi Blindé)
 * Architecture : WebSocket Multimodal (Gemini 2.0 Flash Exp)
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
      - Si tu ne sais pas, dis "Données insuffisantes".
      - Droit de veto absolu : Si une condition de sécurité manque, bloque le diagnostic immédiatement.

      FORMAT DE RÉPONSE EXIGÉ :
      Tu dois répondre UNIQUEMENT avec un objet JSON valide, sans markdown (pas de balises \`\`\`json), avec cette structure exacte :
      {
        "hypothesis": "Ton diagnostic, ta réponse ou ton instruction courte",
        "confidence": 0.95,
        "nextStep": "Action suivante attendue",
        "safetyAlert": "ALERTE SI DANGER (sinon omettre la propriété)"
      }
    `;

    try {
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log(`🔗 Tunnel Live LOCATE établi en mode : ${mode.toUpperCase()}`);
        
        const setupMessage = {
          setup: {
            // MIGRATION VERS LE MODÈLE STABLE (En accord avec la documentation Google 2026)
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
            
            // Interception des erreurs de l'API Google
            if (response.error) {
              console.error("🔴 ERREUR API GOOGLE :", response.error);
              return;
            }

            const textChunk = response.serverContent?.modelTurn?.parts?.[0]?.text;
            
            if (textChunk) {
              this.messageBuffer += textChunk;
              
              // DEBUG : Affichage dans la console F12 pour voir ce que l'IA dit réellement
              console.log("🤖 [DEBUG IA] Buffer actuel :", this.messageBuffer);

              // PARSER ROBUSTE : On cherche tout ce qui ressemble à du JSON
              const match = this.messageBuffer.match(/\{[\s\S]*\}/);
              
              if (match) {
                try {
                  const parsedData = JSON.parse(match[0]) as LiveDiagnostic;
                  
                  // Vérification de sécurité avant envoi au HUD
                  if (!parsedData.hypothesis) parsedData.hypothesis = "Analyse en cours...";
                  if (!parsedData.confidence) parsedData.confidence = 0.8;
                  
                  onMessage(parsedData);
                  this.messageBuffer = ""; // Succès du parsing, on vide le buffer !
                } catch (e) {
                  // Le JSON n'est pas encore terminé, l'IA est en train d'écrire la suite. On attend.
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
      throw new Error("Connexion impossible. Passage en mode Edge.");
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
    console.log("🔒 [ZÉRO-TRACE] Session terminée. Buffer détruit.");
  }
}

export const liveService = new LiveService();