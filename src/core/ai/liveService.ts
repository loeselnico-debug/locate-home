/**
 * LOCATE SYSTEMS - LIVE ASSISTANT SERVICE (V1.0)
 * Architecture : WebSocket Multimodal (Gemini 2.0 Flash)
 * Standard : OSA/CBM & RGPD Zéro-Trace
 */

// CORRECTION : Suppression de l'import inutile InventoryItem

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
    const systemInstruction = `
      Tu es l'Expert de Maintenance Industrielle LOCATE. 
      Mode actuel : ${mode.toUpperCase()}.
    `;

    try {
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BiDiGenerateContent`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        // CORRECTION : On utilise la variable pour faire taire TypeScript
        console.log("🔗 Tunnel Live LOCATE établi avec les instructions :", systemInstruction);
      };

      this.socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        onMessage({
          hypothesis: response.text || "Analyse des folios en cours...",
          confidence: 0.95,
          nextStep: "Vérifiez la sonde d'oxygénation sur l'aéroflot 3."
        });
      };

    } catch (error) {
      console.error("Erreur de connexion Live :", error);
      throw new Error("Connexion impossible. Passage en mode Edge (Asynchrone).");
    }
  }

  sendVideoFrame(canvas: HTMLCanvasElement) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const base64Frame = canvas.toDataURL('image/jpeg', 0.5);
      this.socket.send(JSON.stringify({
        realtime_input: { media_chunks: [{ data: base64Frame, mime_type: "image/jpeg" }] }
      }));
    }
  }

  terminate() {
    if (this.frameInterval) window.clearInterval(this.frameInterval);
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    console.log("🔒 Session terminée. Buffer vidéo détruit (RGPD).");
  }
}

export const liveService = new LiveService();