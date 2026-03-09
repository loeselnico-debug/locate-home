/**
 * LOCATE SYSTEMS - LIVE ASSISTANT SERVICE (V1.3 - Parser Bidi JSON Strict)
 * Architecture : WebSocket Multimodal (Gemini 2.0 Flash)
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
  private messageBuffer: string = ""; // Buffer pour accumuler les morceaux de texte de l'IA

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

    // INSTRUCTION STRICTE : On force un format de sortie JSON pour le parsing
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
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BiDiGenerateContent?key=${apiKey}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log(`🔗 Tunnel Live LOCATE établi en mode : ${mode.toUpperCase()}`);
        
        const setupMessage = {
          setup: {
            model: "models/gemini-2.0-flash",
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            }
          }
        };
        this.socket?.send(JSON.stringify(setupMessage));
        this.messageBuffer = ""; // Réinitialisation du buffer
      };

      this.socket.onmessage = (event) => {
        try {
          // Si le serveur renvoie un Blob, on doit le lire (cas rare mais possible)
          // Dans la majorité des cas Bidi, c'est du texte formaté en JSON.
          if (typeof event.data === 'string') {
            const response = JSON.parse(event.data);
            
            // On extrait le texte généré par l'IA
            const textChunk = response.serverContent?.modelTurn?.parts?.[0]?.text;
            
            if (textChunk) {
              this.messageBuffer += textChunk;

              // L'IA streame sa réponse. On cherche un bloc JSON complet.
              const startIndex = this.messageBuffer.indexOf('{');
              const endIndex = this.messageBuffer.lastIndexOf('}');

              if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                const possibleJson = this.messageBuffer.substring(startIndex, endIndex + 1);
                
                try {
                  const parsedData = JSON.parse(possibleJson) as LiveDiagnostic;
                  onMessage(parsedData);
                  // Succès du parsing, on vide le buffer pour la prochaine trame
                  this.messageBuffer = "";
                } catch (e) {
                  // Le JSON n'est pas encore complet, on attend le prochain bout de texte
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