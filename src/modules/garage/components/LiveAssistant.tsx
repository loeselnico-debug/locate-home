import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { Shield, Zap, Wind, Mic, Power, X, CheckCircle2, AlertTriangle, Camera, CheckSquare, LogOut, Lock, Clock } from 'lucide-react';
import { liveService, type LiveDiagnostic } from '../../../core/ai/liveService';
import { reportService } from '../services/reportService';
import { useUserTier } from '../../../core/security/useUserTier';

const GaragePdfButton = lazy(() => import('./GaragePdfButton'));

interface LiveAssistantProps {
  mode: 'maintenance' | 'mecanique';
  onExit: () => void;
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ mode, onExit }) => {
  const { currentTier } = useUserTier(); // <-- RÉCUPÉRATION DU TIER

  const [isLive, setIsLive] = useState(false);
  const [showSafety, setShowSafety] = useState(true);
  const [sessionClosed, setSessionClosed] = useState(false);
  const [finalReport, setFinalReport] = useState<any>(null);
  
  const [diagnosticText, setDiagnosticText] = useState(`Système ${mode.toUpperCase()} en attente. Sécurisez la zone.`);
  const [currentDiagnostic, setCurrentDiagnostic] = useState<LiveDiagnostic>({
    hypothesis: "En attente de flux...",
    confidence: 0,
    nextStep: "-"
  });
  
  // ÉTATS POUR LE COUPE-CIRCUIT FREE
  const [freeTimeLeft, setFreeTimeLeft] = useState<number | null>(null);
  const [cooldownMsg, setCooldownMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);

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

  // LOGIQUE DE BRIDAGE PROGRESSIF (FREE TIER)
  const getCooldownStatus = () => {
    const stored = localStorage.getItem('m5_free_usage');
    if (!stored) return { allowed: true, count: 0, waitMin: 0 };
    
    const { count, lastUsed } = JSON.parse(stored);
    const elapsedMin = (Date.now() - lastUsed) / 60000;

    if (elapsedMin > 24 * 60) return { allowed: true, count: 0, waitMin: 0 }; // Reset 24h

    let requiredWait = 0;
    if (count === 1) requiredWait = 5;
    else if (count === 2) requiredWait = 20;
    else if (count === 3) requiredWait = 60;
    else if (count >= 4) requiredWait = 24 * 60;

    if (elapsedMin < requiredWait) {
      return { allowed: false, count, waitMin: Math.ceil(requiredWait - elapsedMin) };
    }
    return { allowed: true, count };
  };

  const registerFreeUsage = () => {
    const stored = localStorage.getItem('m5_free_usage');
    const count = stored ? JSON.parse(stored).count : 0;
    localStorage.setItem('m5_free_usage', JSON.stringify({ count: count + 1, lastUsed: Date.now() }));
  };

  // CHRONOMÈTRE DE 120s POUR LE MODE FREE
  useEffect(() => {
    let timer: number;
    if (isLive && currentTier === 'FREE' && freeTimeLeft !== null) {
      if (freeTimeLeft <= 0) {
        registerFreeUsage();
        closeAndGenerateReport("Temps gratuit écoulé. Mode Premium requis pour des sessions longues.");
      } else {
        timer = window.setInterval(() => setFreeTimeLeft(prev => (prev !== null ? prev - 1 : 0)), 1000);
      }
    }
    return () => clearInterval(timer);
  }, [isLive, freeTimeLeft, currentTier]);

  useEffect(() => {
    return () => { if (isLive) forceTerminate(); };
  }, [isLive]);

  const captureAndSendFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        liveService.sendVideoFrame(canvas);
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      return true;
    } catch (err) {
      setDiagnosticText("Erreur Flux Vidéo : Vérifiez les permissions.");
      return false;
    }
  };

  const startLiveSession = async () => {
    if (allValidated) {
      // VÉRIFICATION DU COUPE-CIRCUIT AVANT LE LANCEMENT
      if (currentTier === 'FREE') {
        const status = getCooldownStatus();
        if (!status.allowed) {
          setCooldownMsg(`Tunnel IA en refroidissement. Veuillez patienter ${status.waitMin} min ou passez Premium.`);
          return;
        }
        setFreeTimeLeft(120); // 120 Secondes Max
      }

      setShowSafety(false);
      const cameraStarted = await startCamera();
      
      if (cameraStarted) {
        setIsLive(true);
        startTimeRef.current = new Date();
        setDiagnosticText("Initialisation du tunnel sécurisé...");

        try {
          await liveService.connect(mode, (data) => {
            setDiagnosticText(data.hypothesis);
            setCurrentDiagnostic(data);
          });

          frameIntervalRef.current = window.setInterval(() => {
            captureAndSendFrame();
          }, 1600);
        } catch (error) {
          setDiagnosticText("Échec réseau. Mode Edge asynchrone activé.");
        }
      }
    }
  };

  const forceTerminate = () => {
    if (frameIntervalRef.current) {
      window.clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    liveService.terminate();
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsLive(false);
  };

  const closeAndGenerateReport = async (forcedReason?: string) => {
    forceTerminate();
    
    if (forcedReason) {
      setCurrentDiagnostic(prev => ({ ...prev, hypothesis: forcedReason }));
    }

    const endTime = new Date();
    const reportData = {
      mode: mode,
      technicianId: "TECH-M5-001",
      location: "Zone d'Intervention",
      equipmentId: "EQ-INCONNU",
      safetyChecks: checks,
      diagnostic: currentDiagnostic,
      startTime: startTimeRef.current || endTime,
      endTime: endTime
    };

    const generatedReport = await reportService.generateMaintenanceReport(reportData);
    setFinalReport(generatedReport);
    setSessionClosed(true);
  };

  // ==========================================
  // ÉCRAN DE CLÔTURE (GMAO & PDF)
  // ==========================================
  if (sessionClosed && finalReport) {
    return (
      <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col p-6 overflow-y-auto font-sans">
        <div className="max-w-2xl mx-auto w-full mt-8">
          <div className="flex items-center gap-4 mb-8 border-b border-[#DC2626]/30 pb-4">
            <CheckSquare className="text-[#DC2626] w-10 h-10" />
            <div>
              <h1 className="text-white font-black text-2xl uppercase tracking-widest">Intervention Clôturée</h1>
              <p className="text-gray-400 text-xs font-mono mt-1">ID: {finalReport.metadata.reportId}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black border border-white/10 rounded-xl p-5 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
              <h3 className="text-[#DC2626] font-bold text-xs uppercase tracking-widest mb-4">Indicateurs de Performance (KPI)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#121212] p-4 rounded-lg border border-white/5">
                  <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block mb-1">MTTR (Temps de réparation)</span>
                  <span className="text-white font-mono text-lg">{finalReport.metadata.duration}</span>
                </div>
                <div className="bg-[#121212] p-4 rounded-lg border border-white/5">
                  <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block mb-1">{finalReport.context.classificationLabel}</span>
                  <span className="text-white font-mono text-xs leading-tight block">{finalReport.context.classificationValue}</span>
                </div>
              </div>
            </div>

            <div className="bg-black border border-white/10 rounded-xl p-5">
              <h3 className="text-[#DC2626] font-bold text-xs uppercase tracking-widest mb-3">Synthèse Diag. IA</h3>
              <p className={`text-sm italic border-l-2 pl-3 ${currentTier === 'FREE' && freeTimeLeft === 0 ? 'text-[#FF6600] border-[#FF6600]' : 'text-gray-300 border-[#DC2626]'}`}>
                "{finalReport.diagnostic.hypothesis}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              
              {/* BOUTON PDF CONDITIONNEL */}
              {currentTier === 'FREE' ? (
                <button disabled className="flex-1 bg-gray-900 border border-gray-700 text-gray-500 py-4 px-6 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 cursor-not-allowed">
                  <Lock size={18} /> Export PDF Réservé Premium
                </button>
              ) : (
                <Suspense fallback={<div className="flex-1 bg-[#DC2626]/50 text-white py-4 px-6 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 animate-pulse">Chargement...</div>}>
                  <GaragePdfButton reportData={finalReport} />
                </Suspense>
              )}
              
              <button onClick={onExit} className="flex-1 bg-[#121212] border border-white/10 text-white py-4 px-6 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-colors hover:bg-[#1a1a1a] active:scale-95">
                <LogOut size={18} /> Quitter le terminal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // COCKPIT IA (Caméra)
  // ==========================================
  return (
    <div className="fixed inset-0 bg-black flex flex-col font-sans overflow-hidden">
      <div className="relative flex-1 bg-[#0a0a0a] overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 border-[1px] border-white/5 pointer-events-none grid grid-cols-3 grid-rows-3" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#DC2626]/20 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-[#DC2626] rounded-full shadow-[0_0_10px_#DC2626]" />
        </div>

        <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none z-10">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl flex flex-col gap-1">
            <h1 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Locate Garage</h1>
            <p className="text-[9px] font-bold uppercase italic text-[#DC2626]">M5 - Live {mode}</p>
            
            {/* AFFICHAGE DU CHRONO FREE */}
            {currentTier === 'FREE' && freeTimeLeft !== null && (
              <div className="flex items-center gap-1 mt-1 text-[#FF6600]">
                <Clock size={10} />
                <span className="font-mono text-[9px] font-bold">{Math.floor(freeTimeLeft / 60)}:{(freeTimeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
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
                <AlertTriangle className="mx-auto mb-4 text-[#DC2626]" size={40} />
                <h2 className="text-white font-black text-lg uppercase tracking-tight italic">Validation des Risques</h2>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2">
                  Check-list obligatoire ({mode === 'maintenance' ? 'AFNOR Niveau 2/3' : 'Atelier'})
                </p>
              </div>

              {cooldownMsg && (
                <div className="bg-[#FF6600]/20 border border-[#FF6600] text-[#FF6600] p-4 rounded-xl text-xs font-bold text-center animate-pulse">
                  {cooldownMsg}
                </div>
              )}

              <div className="space-y-2">
                {checks.map(check => (
                  <button
                    key={check.id}
                    onClick={() => setChecks(prev => prev.map(c => c.id === check.id ? {...c, validated: !c.validated} : c))}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      check.validated ? 'bg-[#DC2626]/10 border-[#DC2626] text-white' : 'bg-white/5 border-white/5 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {check.icon}
                      <span className="text-[10px] font-black uppercase tracking-widest">{check.label}</span>
                    </div>
                    {check.validated && <CheckCircle2 size={18} className="text-[#DC2626]" />}
                  </button>
                ))}
              </div>

              <button onClick={onExit} className="w-full py-3 mt-4 text-gray-500 text-xs uppercase font-bold tracking-widest underline decoration-gray-700 underline-offset-4 active:text-white">
                Retour à l'aiguillage
              </button>

              <button
                disabled={!allValidated || cooldownMsg !== null}
                onClick={startLiveSession}
                className={`w-full py-5 rounded-2xl mt-2 font-black text-[10px] uppercase tracking-[0.3em] transition-all ${
                  allValidated && !cooldownMsg ? 'bg-white text-black active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-gray-900 text-gray-700'
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
          <p className="text-[#DC2626] font-mono text-[9px] leading-relaxed uppercase tracking-widest">
            {diagnosticText}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button className="flex-1 bg-[#121212] py-4 rounded-xl flex flex-col items-center gap-1 border border-white/5 active:scale-95">
            <Camera size={18} className="text-white" />
            <span className="text-[8px] text-white font-black uppercase">Scan {mode === 'maintenance' ? 'Folio' : 'Pièce'}</span>
          </button>
          
          <button className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${
            isLive ? 'bg-[#DC2626] animate-pulse scale-110' : 'bg-gray-900'
          }`}>
            <Mic size={32} className="text-white" />
          </button>

          <button
            onClick={() => closeAndGenerateReport()}
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