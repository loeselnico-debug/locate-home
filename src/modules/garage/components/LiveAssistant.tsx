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
  const { currentTier } = useUserTier();

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
    if (videoRef.current && canvasRef.current) {
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
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setIsLive(true);
        startTimeRef.current = new Date();
        await liveService.connect(mode, (data) => {
          setDiagnosticText(data.hypothesis);
          setCurrentDiagnostic(data);
        });
        frameIntervalRef.current = window.setInterval(captureAndSendFrame, 1600);
      } catch (err) { setDiagnosticText("Erreur Caméra."); }
    }
  };

  const closeAndGenerateReport = async (forcedReason?: string) => {
    if (frameIntervalRef.current) window.clearInterval(frameIntervalRef.current);
    liveService.terminate();
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    setIsLive(false);
    
    const reportData = {
      mode, technicianId: "TECH-M5-001", location: "Atelier", equipmentId: "EQ-INCONNU",
      safetyChecks: checks, diagnostic: forcedReason ? { ...currentDiagnostic, hypothesis: forcedReason } : currentDiagnostic,
      startTime: startTimeRef.current || new Date(), endTime: new Date()
    };
    const report = await reportService.generateMaintenanceReport(reportData);
    setFinalReport(report);
    setSessionClosed(true);
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

  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden select-none">
      <div className="relative flex-1 bg-[#050505] overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-70" />
        
        {/* HUD SUPÉRIEUR */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-30">
          <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <h1 className="text-white font-black text-[12px] uppercase tracking-[0.3em]">LOCATE {mode.toUpperCase()}</h1>
            {currentTier === 'FREE' && freeTimeLeft !== null && (
              <div className="flex items-center gap-1 mt-1 text-[#FF6600]">
                <Clock size={10} /><span className="font-mono text-[10px] font-black">{Math.floor(freeTimeLeft / 60)}:{(freeTimeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
          </div>
        </div>

        {/* HUD LATÉRAL DYNAMIQUE */}
        {isLive && (
          <div className="absolute left-6 top-[20vh] z-30 flex flex-col gap-3">
            {mode === 'mecanique' ? (
              <div className="bg-black/60 backdrop-blur-md border-l-4 border-[#DC2626] p-3 rounded-r-xl">
                <p className="text-[8px] font-black text-[#DC2626] uppercase">Brake Pressure</p>
                <p className="text-xl text-white font-mono font-black">7.5 BAR</p>
              </div>
            ) : (
              <div className="bg-black/60 backdrop-blur-md border-l-4 border-[#00E5FF] p-3 rounded-r-xl">
                <p className="text-[8px] font-black text-[#00E5FF] uppercase">Pump Vib.</p>
                <p className="text-xl text-white font-mono font-black">4.2 mm/s</p>
              </div>
            )}
          </div>
        )}

        {/* MODALE SAFETY GATES (C'est ICI que tes variables sont lues !) */}
        {showSafety && (
          <div className="absolute inset-0 z-50 bg-[#050505]/95 backdrop-blur-2xl p-8 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full space-y-6">
              <div className="text-center">
                <AlertTriangle className="mx-auto mb-4 text-[#DC2626]" size={40} />
                <h2 className="text-white font-black text-lg uppercase">Validation Sécurité</h2>
                {cooldownMsg && <p className="text-[#FF6600] text-xs font-bold mt-2 animate-pulse">{cooldownMsg}</p>}
              </div>
              <div className="space-y-2">
                {checks.map(check => (
                  <button key={check.id} onClick={() => setChecks(prev => prev.map(c => c.id === check.id ? {...c, validated: !c.validated} : c))}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${check.validated ? 'bg-[#DC2626]/10 border-[#DC2626] text-white' : 'bg-white/5 border-white/5 text-gray-500'}`}>
                    <div className="flex items-center gap-4">{check.icon}<span className="text-[10px] font-black uppercase">{check.label}</span></div>
                    {check.validated && <CheckCircle2 size={18} className="text-[#DC2626]" />}
                  </button>
                ))}
              </div>
              <button disabled={!allValidated || cooldownMsg !== null} onClick={startLiveSession}
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] ${allValidated && !cooldownMsg ? 'bg-white text-black' : 'bg-gray-900 text-gray-700'}`}>
                Ouvrir Tunnel Expertise
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CONSOLE IA INFÉRIEURE : COMMANDES DE TERRAIN */}
      <div className="h-[28vh] bg-[#050505] border-t border-white/5 p-6 flex flex-col items-center justify-between z-40 relative">
        
        {/* TERMINAL DE TEXTE IA */}
        <div className="w-full bg-black/40 rounded-xl border border-white/5 p-4 min-h-[80px]">
          <p className="text-[#FF6600] font-mono text-[10px] uppercase tracking-wider">
            {">"} {diagnosticText}
          </p>
        </div>

        {/* BARRE D'ACTIONS TACTIQUES */}
        <div className="flex items-center justify-around w-full mt-4">
           
           {/* BOUTON CAMERA : SCAN MANUEL OCR / PIÈCE */}
           <button 
             onClick={() => setDiagnosticText("Capture manuelle pour analyse OCR...")}
             className="flex flex-col items-center gap-2 active:scale-90 transition-all group"
           >
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#FF6600]/50 transition-colors">
                <Camera size={20} className="text-white group-hover:text-[#FF6600]" />
              </div>
              <span className="text-[8px] font-black uppercase text-white/60 tracking-tighter">
                Scan {mode === 'maintenance' ? 'Folio' : 'Pièce'}
              </span>
           </button>

           {/* BOUTON CENTRAL : PTT (PUSH TO TALK) */}
           <div className="relative">
              <button 
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-b-4 transition-all active:scale-95 shadow-2xl ${
                  isLive ? 'bg-[#FF6600] border-orange-800' : 'bg-gray-900 border-black'
                }`}
              >
                <Mic size={32} className="text-white" />
                <span className="text-[8px] font-black text-white uppercase mt-1">PTT</span>
              </button>
           </div>

           {/* BOUTON CLÔTURE */}
           <button 
             onClick={() => closeAndGenerateReport()} 
             className="flex flex-col items-center gap-2 active:scale-90 transition-all group"
           >
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-red-500/50 transition-colors">
                <X size={20} className="text-[#DC2626]" />
              </div>
              <span className="text-[8px] font-black uppercase text-[#DC2626] tracking-tighter">Fin Diag.</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;