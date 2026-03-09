import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { Shield, Zap, Wind, Mic, Power, X, CheckCircle2, AlertTriangle, Camera, CameraOff, CheckSquare, LogOut, Lock, Clock } from 'lucide-react';
import { liveService, type LiveDiagnostic } from '../../../core/ai/liveService';
import { reportService } from '../services/reportService';
import { useUserTier } from '../../../core/security/useUserTier';

const GaragePdfButton = lazy(() => import('./GaragePdfButton'));

interface LiveAssistantProps {
  mode: 'maintenance' | 'mecanique';
  onExit: () => void;
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ mode, onExit }) => {
  const { currentTier } = useUserTier();

  const [isLive, setIsLive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isPTTActive, setIsPTTActive] = useState(false);

  const [showSafety, setShowSafety] = useState(true);
  const [sessionClosed, setSessionClosed] = useState(false);
  const [finalReport, setFinalReport] = useState<any>(null);
  
  const [diagnosticText, setDiagnosticText] = useState(`Terminal ${mode.toUpperCase()} en attente. Sécurisez la zone.`);
  const [currentDiagnostic, setCurrentDiagnostic] = useState<LiveDiagnostic>({
    hypothesis: "En attente de transmission...",
    confidence: 0,
    nextStep: "-"
  });
  
  const [freeTimeLeft, setFreeTimeLeft] = useState<number | null>(null);
  const [cooldownMsg, setCooldownMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  
  // NOUVEAU : Référence pour la reconnaissance vocale
  const recognitionRef = useRef<any>(null);

  const [checks, setChecks] = useState(
    mode === 'maintenance'
      ? [
          { id: 'loto', label: 'Consignation LOTO effectuée', icon: <Power size={18} />, validated: false },
          { id: 'vat', label: 'VAT (Absence Tension)', icon: <Zap size={18} />, validated: false },
          { id: 'h2s', label: 'Détecteur H2S & Gaz actif', icon: <Wind size={18} />, validated: false },
          { id: 'epi', label: 'EPI adéquats portés', icon: <Shield size={18} />, validated: false },
        ]
      : [
          { id: 'levage', label: 'Chandelles / Béquilles en place', icon: <Shield size={18} />, validated: false },
          { id: 'pto', label: 'Consignation PTO (Prise de mouvement)', icon: <Power size={18} />, validated: false },
          { id: 've', label: 'EPI VE (Gants Classe 0 si > 60V)', icon: <Zap size={18} />, validated: false },
        ]
  );

  const allValidated = checks.every(c => c.validated);

  const getCooldownStatus = () => {
    const stored = localStorage.getItem('m5_free_usage');
    if (!stored) return { allowed: true, count: 0, waitMin: 0 };
    const { count, lastUsed } = JSON.parse(stored);
    const elapsedMin = (Date.now() - lastUsed) / 60000;
    if (elapsedMin > 24 * 60) return { allowed: true, count: 0, waitMin: 0 };
    let requiredWait = 0;
    if (count === 1) requiredWait = 5;
    else if (count === 2) requiredWait = 20;
    else if (count === 3) requiredWait = 60;
    else if (count >= 4) requiredWait = 24 * 60;
    if (elapsedMin < requiredWait) return { allowed: false, count, waitMin: Math.ceil(requiredWait - elapsedMin) };
    return { allowed: true, count };
  };

  const registerFreeUsage = () => {
    const stored = localStorage.getItem('m5_free_usage');
    const count = stored ? JSON.parse(stored).count : 0;
    localStorage.setItem('m5_free_usage', JSON.stringify({ count: count + 1, lastUsed: Date.now() }));
  };

  // NOUVEAU : Initialisation du micro à l'ouverture du composant
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'fr-FR';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDiagnosticText(`🎙️ Vous : "${transcript}"`);
        // On envoie le texte au tunnel IA !
        liveService.sendPrompt(transcript);
      };
      
      recognitionRef.current.onerror = () => {
        setIsPTTActive(false);
      };
    }
  }, []);

  useEffect(() => {
    let timer: number;
    if (isLive && currentTier === 'FREE' && freeTimeLeft !== null) {
      if (freeTimeLeft <= 0) {
        registerFreeUsage();
        closeAndGenerateReport("Temps gratuit écoulé. Mode Premium requis.");
      } else {
        timer = window.setInterval(() => setFreeTimeLeft(prev => (prev !== null ? prev - 1 : 0)), 1000);
      }
    }
    return () => clearInterval(timer);
  }, [isLive, freeTimeLeft, currentTier]);

  const captureAndSendFrame = () => {
    if (videoRef.current && canvasRef.current && isVideoActive) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context && videoRef.current.videoWidth > 0) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        liveService.sendVideoFrame(canvas);
      }
    }
  };

  const toggleVisionBionique = async () => {
    if (isVideoActive) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(t => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      if (frameIntervalRef.current) {
        window.clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
      setIsVideoActive(false);
      setDiagnosticText("Vision Bionique désactivée. Passage en mode Radio (Audio).");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setIsVideoActive(true);
        
        // On force l'IA à analyser dès que la caméra s'allume
        setDiagnosticText("Vision Bionique activée. Analyse visuelle en cours...");
        setTimeout(() => {
          liveService.sendPrompt("Je viens d'activer la caméra. Analyse l'image et donne-moi un premier diagnostic visuel.");
        }, 1000); // Laisse 1s à la caméra pour s'ajuster

        frameIntervalRef.current = window.setInterval(captureAndSendFrame, 1600);
      } catch (err) { 
        setDiagnosticText("Erreur : Accès caméra refusé ou impossible."); 
      }
    }
  };

  const startLiveSession = async () => {
    if (allValidated) {
      if (currentTier === 'FREE') {
        const status = getCooldownStatus();
        if (!status.allowed) {
          setCooldownMsg(`Tunnel IA en refroidissement. Attendez ${status.waitMin} min.`);
          return;
        }
        setFreeTimeLeft(120);
      }
      setShowSafety(false);
      
      try {
        setIsLive(true);
        startTimeRef.current = new Date();
        await liveService.connect(mode, (data) => {
          setDiagnosticText(data.hypothesis);
          setCurrentDiagnostic(data);
        });
        setDiagnosticText("Tunnel crypté ouvert. Mode Radio actif. Appuyez sur PTT pour parler.");
      } catch (err) { 
        setDiagnosticText("Erreur d'ouverture du Tunnel IA."); 
      }
    }
  };

  const closeAndGenerateReport = async (forcedReason?: string) => {
    if (frameIntervalRef.current) window.clearInterval(frameIntervalRef.current);
    liveService.terminate();
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    setIsLive(false);
    setIsVideoActive(false);
    
    const reportData = {
      mode, technicianId: "TECH-M5-001", location: "Zone Opérationnelle", equipmentId: "EQ-INCONNU",
      safetyChecks: checks, diagnostic: forcedReason ? { ...currentDiagnostic, hypothesis: forcedReason } : currentDiagnostic,
      startTime: startTimeRef.current || new Date(), endTime: new Date()
    };
    const report = await reportService.generateMaintenanceReport(reportData);
    setFinalReport(report);
    setSessionClosed(true);
  };

  // NOUVEAU : Gestionnaires du bouton PTT (Microphone)
  const handlePTTDown = () => {
    if (!isLive) return;
    setIsPTTActive(true);
    setDiagnosticText("Écoute en cours...");
    try { recognitionRef.current?.start(); } catch(e) {}
  };
  
  const handlePTTUp = () => {
    if (!isLive) return;
    setIsPTTActive(false);
    try { recognitionRef.current?.stop(); } catch(e) {}
  };

  if (sessionClosed && finalReport) {
    return (
      <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full mt-8">
          <div className="flex items-center gap-4 mb-8 border-b border-[#DC2626]/30 pb-4">
            <CheckSquare className="text-[#DC2626] w-10 h-10" />
            <h1 className="text-white font-black text-2xl uppercase tracking-widest">Intervention Clôturée</h1>
          </div>
          <div className="bg-black border border-white/10 rounded-xl p-5 mb-6">
            <h3 className="text-[#DC2626] font-bold text-xs uppercase mb-3">Synthèse Diag. IA</h3>
            <p className="text-gray-300 text-sm italic">"{finalReport.diagnostic.hypothesis}"</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {currentTier === 'FREE' ? (
              <button disabled className="flex-1 bg-gray-900 text-gray-500 py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-3"><Lock size={18}/> PDF Verrouillé</button>
            ) : (
              <Suspense fallback={<div className="animate-pulse">Chargement...</div>}><GaragePdfButton reportData={finalReport} /></Suspense>
            )}
            <button onClick={onExit} className="flex-1 bg-[#121212] text-white py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-3"><LogOut size={18}/> Quitter</button>
          </div>
        </div>
      </div>
    );
  }

  const themeColor = mode === 'maintenance' ? '#00E5FF' : '#DC2626'; 

  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden select-none">
      
      <div className="relative flex-1 bg-[#050505] overflow-hidden">
        <canvas ref={canvasRef} className="hidden" />

        {/* CORRECTION BUG ÉCRAN NOIR : La balise video reste dans le DOM, on cache juste avec CSS */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className={`absolute inset-0 w-full h-full object-cover opacity-70 ${isVideoActive ? 'block' : 'hidden'}`} 
        />
        
        {/* Filtre visuel de scan sur la vidéo */}
        {isVideoActive && (
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:5vw_5vw]"></div>
        )}

        {/* MODE RADIO TACTIQUE (Affiché quand la vidéo est OFF) */}
        {!isVideoActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]">
            {isLive ? (
              <div className="flex flex-col items-center justify-center">
                <div className={`w-40 h-40 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isPTTActive ? `border-[${themeColor}] scale-110 shadow-[0_0_50px_${themeColor}40]` : 'border-white/10'}`}>
                  <div className={`w-32 h-32 rounded-full border border-white/5 flex items-center justify-center animate-pulse`}>
                    <Mic size={48} className={isPTTActive ? `text-[${themeColor}]` : 'text-gray-600'} />
                  </div>
                </div>
                <p className={`mt-8 font-mono text-xs uppercase tracking-widest ${isPTTActive ? `text-[${themeColor}]` : 'text-gray-500'}`}>
                  {isPTTActive ? "Transmission en cours..." : "Canal Audio Ouvert"}
                </p>
              </div>
            ) : (
              <Shield size={64} className="text-white/10" />
            )}
          </div>
        )}
        
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-30">
          <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <h1 className="text-white font-black text-[12px] uppercase tracking-[0.3em]">LOCATE {mode.toUpperCase()}</h1>
            {currentTier === 'FREE' && freeTimeLeft !== null && (
              <div className="flex items-center gap-1 mt-1 text-[#FF6600]">
                <Clock size={10} /><span className="font-mono text-[10px] font-black">{Math.floor(freeTimeLeft / 60)}:{(freeTimeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
          </div>
          
          {isLive && (
             <div className={`px-3 py-1.5 rounded-full border backdrop-blur-md flex items-center gap-2 ${isVideoActive ? `bg-[${themeColor}]/20 border-[${themeColor}] text-[${themeColor}]` : 'bg-white/10 border-white/20 text-gray-300'}`}>
               {isVideoActive ? <Camera size={12} /> : <Mic size={12} />}
               <span className="text-[9px] font-black uppercase tracking-widest">{isVideoActive ? 'VISION' : 'RADIO'}</span>
             </div>
          )}
        </div>

        {showSafety && (
          <div className="absolute inset-0 z-50 bg-[#050505]/95 backdrop-blur-2xl p-8 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full space-y-6">
              <div className="text-center">
                <AlertTriangle className={`mx-auto mb-4 text-[${themeColor}]`} size={40} />
                <h2 className="text-white font-black text-lg uppercase">Validation Sécurité</h2>
                {cooldownMsg && <p className="text-[#FF6600] text-xs font-bold mt-2 animate-pulse">{cooldownMsg}</p>}
              </div>
              <div className="space-y-2">
                {checks.map(check => (
                  <button key={check.id} onClick={() => setChecks(prev => prev.map(c => c.id === check.id ? {...c, validated: !c.validated} : c))}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${check.validated ? `bg-[${themeColor}]/10 border-[${themeColor}] text-white` : 'bg-white/5 border-white/5 text-gray-500'}`}>
                    <div className="flex items-center gap-4">{check.icon}<span className="text-[10px] font-black uppercase">{check.label}</span></div>
                    {check.validated && <CheckCircle2 size={18} className={`text-[${themeColor}]`} />}
                  </button>
                ))}
              </div>
              <button disabled={!allValidated || cooldownMsg !== null} onClick={startLiveSession}
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all ${allValidated && !cooldownMsg ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-gray-900 text-gray-700'}`}>
                Ouvrir Tunnel Expertise
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-[30vh] bg-[#050505] border-t border-white/5 p-6 flex flex-col items-center justify-between z-40 relative">
        
        <div className="w-full bg-black/60 rounded-xl border border-white/10 p-4 min-h-[80px] flex items-center shadow-inner">
          <p className={`font-mono text-[10px] uppercase tracking-wider leading-relaxed ${currentDiagnostic.safetyAlert ? 'text-red-500 font-bold animate-pulse' : 'text-[#FF6600]'}`}>
            {">"} {diagnosticText}
          </p>
        </div>

        <div className="flex items-center justify-between w-full mt-4 px-2">
            
           <button 
             onClick={toggleVisionBionique}
             disabled={!isLive}
             className={`flex flex-col items-center gap-2 transition-all group ${!isLive ? 'opacity-30' : 'active:scale-90'}`}
           >
              <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-colors ${isVideoActive ? `bg-[${themeColor}]/20 border-[${themeColor}] shadow-[0_0_15px_${themeColor}40]` : 'bg-white/5 border-white/10 group-hover:border-white/30'}`}>
                {isVideoActive ? <Camera size={22} className={`text-[${themeColor}]`} /> : <CameraOff size={22} className="text-white/60" />}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-tighter ${isVideoActive ? `text-[${themeColor}]` : 'text-white/60'}`}>
                {isVideoActive ? 'Vision ON' : 'Vision OFF'}
              </span>
           </button>

           {/* BOUTON PTT AVEC ÉVÉNEMENTS TACTILES ET SOURIS */}
           <div className="relative">
              <button 
                onPointerDown={handlePTTDown}
                onPointerUp={handlePTTUp}
                onPointerLeave={handlePTTUp}
                onContextMenu={(e) => e.preventDefault()} 
                disabled={!isLive}
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-b-[6px] transition-all shadow-2xl select-none ${
                  !isLive 
                    ? 'bg-gray-900 border-black opacity-50' 
                    : isPTTActive 
                      ? 'bg-[#FF6600] border-orange-900 scale-95 translate-y-[4px]' 
                      : 'bg-[#FF6600] border-orange-800 active:scale-95 hover:bg-[#ff7b24]'
                }`}
              >
                <Mic size={32} className="text-white drop-shadow-md" />
                <span className="text-[9px] font-black text-white uppercase mt-1 tracking-widest drop-shadow-md">PTT</span>
              </button>
           </div>

           <button 
             onClick={() => closeAndGenerateReport()} 
             className="flex flex-col items-center gap-2 active:scale-90 transition-all group"
           >
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-red-500/50 transition-colors">
                <X size={22} className="text-[#DC2626]" />
              </div>
              <span className="text-[8px] font-black uppercase text-[#DC2626] tracking-tighter">Fin Diag.</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;