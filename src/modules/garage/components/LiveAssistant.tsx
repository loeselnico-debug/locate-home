import React, { useState, useRef } from 'react';
import { Shield, Zap, Wind, Mic, Power, X, CheckCircle2, AlertTriangle, Camera } from 'lucide-react';

// 1. DÉFINITION DES PRISES (PROPS)
interface LiveAssistantProps {
  mode: 'maintenance' | 'mecanique';
  onExit: () => void;
}

// 2. INJECTION DES PROPS DANS LE COMPOSANT
const LiveAssistant: React.FC<LiveAssistantProps> = ({ mode, onExit }) => {
  const [isLive, setIsLive] = useState(false);
  const [showSafety, setShowSafety] = useState(true);
  const [diagnosticText, setDiagnosticText] = useState(`Système ${mode.toUpperCase()} en attente. Sécurisez la zone.`);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [checks, setChecks] = useState([
    { id: 'loto', label: 'Consignation LOTO effectuée', icon: <Power size={18} />, validated: false },
    { id: 'vat', label: 'VAT (Absence Tension)', icon: <Zap size={18} />, validated: false },
    { id: 'h2s', label: 'Détecteur H2S & Gaz actif', icon: <Wind size={18} />, validated: false },
    { id: 'epi', label: 'EPI adéquats portés', icon: <Shield size={18} />, validated: false },
  ]);

  const allValidated = checks.every(c => c.validated);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setDiagnosticText("Erreur Flux Vidéo : Vérifiez les permissions.");
    }
  };

  const startLiveSession = () => {
    if (allValidated) {
      setShowSafety(false);
      setIsLive(true);
      startCamera();
      setDiagnosticText("Expertise Live Active. Pointez l'objectif vers l'organe à diagnostiquer.");
    }
  };

  // 3. LA FONCTION DE CLÔTURE MISE À JOUR
  const stopLiveSession = () => {
    // On détruit le flux vidéo de la caméra
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsLive(false);
    
    // On renvoie le signal au Dashboard pour fermer l'écran du Cockpit
    onExit(); 
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col font-sans overflow-hidden">
      
      <div className="relative flex-1 bg-[#0a0a0a] overflow-hidden">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        
        <div className="absolute inset-0 border-[1px] border-white/5 pointer-events-none grid grid-cols-3 grid-rows-3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#FF6600]/20 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-[#FF6600] rounded-full shadow-[0_0_10px_#FF6600]" />
        </div>

        <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none z-10">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl">
            <h1 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Locate Garage</h1>
            {/* Affichage dynamique de la couleur selon le métier */}
            <p className={`text-[9px] font-bold uppercase mt-1 italic ${mode === 'maintenance' ? 'text-[#FF6600]' : 'text-blue-500'}`}>
              M5 - Live {mode}
            </p>
          </div>
          {isLive && (
            <div className="bg-red-600/90 px-3 py-1 rounded-full animate-pulse border border-red-400">
              <span className="text-white font-black text-[10px] uppercase tracking-widest">Vision Live active</span>
            </div>
          )}
        </div>

        {showSafety && (
          <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl p-8 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full space-y-6">
              <div className="text-center">
                <AlertTriangle className={`mx-auto mb-4 ${mode === 'maintenance' ? 'text-[#FF6600]' : 'text-blue-500'}`} size={40} />
                <h2 className="text-white font-black text-lg uppercase tracking-tight italic">Validation des Risques</h2>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2">
                  Check-list obligatoire ({mode === 'maintenance' ? 'AFNOR Niveau 2/3' : 'Atelier'})
                </p>
              </div>

              <div className="space-y-2">
                {checks.map(check => (
                  <button
                    key={check.id}
                    onClick={() => setChecks(prev => prev.map(c => c.id === check.id ? {...c, validated: !c.validated} : c))}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      check.validated ? (mode === 'maintenance' ? 'bg-[#FF6600]/10 border-[#FF6600] text-white' : 'bg-blue-500/10 border-blue-500 text-white') : 'bg-white/5 border-white/5 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {check.icon}
                      <span className="text-[10px] font-black uppercase tracking-widest">{check.label}</span>
                    </div>
                    {check.validated && <CheckCircle2 size={18} className={mode === 'maintenance' ? 'text-[#FF6600]' : 'text-blue-500'} />}
                  </button>
                ))}
              </div>

              {/* Bouton de repli pour retourner au Dashboard si cliqué par erreur */}
              <button onClick={onExit} className="w-full py-3 mt-4 text-gray-500 text-xs uppercase font-bold tracking-widest underline decoration-gray-700 underline-offset-4 active:text-white">
                Retour à l'aiguillage
              </button>

              <button
                disabled={!allValidated}
                onClick={startLiveSession}
                className={`w-full py-5 rounded-2xl mt-2 font-black text-[10px] uppercase tracking-[0.3em] transition-all ${
                  allValidated ? 'bg-white text-black active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-gray-900 text-gray-700'
                }`}
              >
                Ouvrir Tunnel Expertise
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-[28vh] bg-[#050505] border-t border-white/5 p-6 flex flex-col gap-4 z-20">
        <div className="flex-1 bg-black rounded-lg border border-white/5 p-4 relative">
          <p className={`${mode === 'maintenance' ? 'text-[#FF6600]' : 'text-blue-500'} font-mono text-[9px] leading-relaxed uppercase tracking-widest`}>
            {diagnosticText}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button className="flex-1 bg-[#121212] py-4 rounded-xl flex flex-col items-center gap-1 border border-white/5 active:scale-95">
            <Camera size={18} className="text-white" />
            <span className="text-[8px] text-white font-black uppercase">Scan {mode === 'maintenance' ? 'Folio' : 'Pièce'}</span>
          </button>
          
          <button className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${
            isLive ? (mode === 'maintenance' ? 'bg-[#FF6600] animate-pulse scale-110' : 'bg-blue-600 animate-pulse scale-110') : 'bg-gray-900'
          }`}>
            <Mic size={32} className="text-white" />
          </button>

          <button 
            onClick={stopLiveSession}
            className="flex-1 bg-[#121212] py-4 rounded-xl flex flex-col items-center gap-1 border border-white/5 active:scale-95"
          >
            <X size={18} className="text-red-500" />
            <span className="text-[8px] text-red-500 font-black uppercase">Clôture</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;