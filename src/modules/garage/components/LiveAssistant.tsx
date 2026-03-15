import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { Shield, Zap, Wind, Mic, Power, X, CheckCircle2, AlertTriangle, Camera, CameraOff, CheckSquare, LogOut, Lock, Clock, AlertOctagon, User } from 'lucide-react';
import { liveService, type LiveDiagnostic } from '../../../core/ai/liveService';
import { reportService } from '../services/reportService';
import { useUserTier } from '../../../core/security/useUserTier';
import { useAppSettings } from '../../../core/storage/useAppSettings'; // <-- NOUVEAU: Import du Cerveau Local

const GaragePdfButton = lazy(() => import('./GaragePdfButton'));

interface LiveAssistantProps {
  mode: 'maintenance' | 'mecanique';
  onExit: () => void;
}

type SessionPhase = 'AUDIT' | 'DIAGNOSTIC';

const LiveAssistant: React.FC<LiveAssistantProps> = ({ mode, onExit }) => {
  const { currentTier } = useUserTier();
  const { settings } = useAppSettings(); // <-- NOUVEAU: Récupération du profil
  const profile = settings.userProfile;

  const [isLive, setIsLive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>('AUDIT');
  const [showDegradedConfirm, setShowDegradedConfirm] = useState(false);
  const [isDegradedMode, setIsDegradedMode] = useState(false);
  const [bypassedWarnings, setBypassedWarnings] = useState<string[]>([]);

  const [sessionClosed, setSessionClosed] = useState(false);
  const [finalReport, setFinalReport] = useState<any>(null);
  
  const [diagnosticText, setDiagnosticText] = useState(`Phase d'Audit ${mode.toUpperCase()} initiée. Analysez la zone.`);
  const [currentDiagnostic, setCurrentDiagnostic] = useState<LiveDiagnostic>({
    hypothesis: "Initialisation du tunnel de sécurité...",
    confidence: 0,
    nextStep: "-"
  });
  
  const [freeTimeLeft, setFreeTimeLeft] = useState<number | null>(null);
  const [cooldownMsg, setCooldownMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const recognitionRef = useRef<any>(null);

  const [checks, setChecks] = useState(
    mode === 'maintenance'
      ? [
          { id: 'loto', label: 'Consignation LOTO', icon: <Power size={14} />, validated: false },
          { id: 'vat', label: 'Absence Tension (VAT)', icon: <Zap size={14} />, validated: false },
          { id: 'h2s', label: 'Détecteur Gaz', icon: <Wind size={14} />, validated: false },
        ]
      : [
          { id: 'levage', label: 'Chandelles Sécurité', icon: <Shield size={14} />, validated: false },
          { id: 'pto', label: 'Consignation PTO', icon: <Power size={14} />, validated: false },
          { id: 've', label: 'EPI Haute Tension', icon: <Zap size={14} />, validated: false },
        ]
  );

  const allValidated = checks.every(c => c.validated);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'fr-FR';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDiagnosticText(`🎙️ VOUS : "${transcript.toUpperCase()}"`);
        setIsListening(false);
        liveService.sendPrompt(`[PHASE: ${sessionPhase}] L'opérateur dit : ${transcript}`);
      };
      
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [sessionPhase]);

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

  useEffect(() => {
    if (currentTier === 'FREE') {
      const status = getCooldownStatus();
      if (!status.allowed) {
        setCooldownMsg(`Tunnel IA en refroidissement. Attendez ${status.waitMin} min.`);
        return; 
      }
      setFreeTimeLeft(120);
    }
    startLiveSession(false);
  }, [currentTier]);

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
      setDiagnosticText("Vision Bionique désactivée. Mode Radio actif.");
      speak("Caméra coupée.");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setIsVideoActive(true);
        
        setDiagnosticText("Vision Bionique activée. Analyse visuelle...");
        speak("Vision activée.");
        setTimeout(() => {
          captureAndSendFrame();
          liveService.sendPrompt(`[PHASE: ${sessionPhase}] Je viens d'activer la caméra. Décris-moi l'environnement et les points de vigilance liés à la sécurité.`);
        }, 1500);

        frameIntervalRef.current = window.setInterval(captureAndSendFrame, 1600);
      } catch (err) { 
        setDiagnosticText("Erreur : Accès caméra refusé."); 
      }
    }
  };

  const startLiveSession = async (degraded: boolean) => {
    setShowDegradedConfirm(false);
    setIsDegradedMode(degraded);
    
    speak("Initialisation du système LOCATE.");

    try {
      setIsLive(true);
      startTimeRef.current = new Date();
      await liveService.connect(mode, (data) => {
        setDiagnosticText(data.hypothesis);
        setCurrentDiagnostic(data); 
        speak(data.hypothesis);
      });
      
      const msg = degraded 
        ? "Tunnel ouvert en MODE DÉGRADÉ. Prudence maximale."
        : "Phase d'Audit Sécurité en cours. Validez vos consignations dans le bandeau supérieur.";
      
      setDiagnosticText(msg);
      
    } catch (err) { 
      setDiagnosticText("Erreur d'ouverture du Tunnel IA."); 
    }
  };

  const handleTransitionToDiagnostic = () => {
    if (allValidated) {
      setSessionPhase('DIAGNOSTIC');
      speak("Sécurité validée. Passage en mode diagnostic.");
      liveService.sendPrompt(`[SYSTEM] L'opérateur (Habilitations: ${profile?.habilitations?.join(', ') || 'Aucune'}) a validé toutes les procédures de sécurité. Passage en mode DIAGNOSTIC. Quel est ton premier conseil d'investigation ?`);
    } else {
      const warnings: string[] = [];
      checks.forEach(c => {
        if (!c.validated) {
          if (c.id === 'loto' || c.id === 'pto') warnings.push("L'énergie mécanique ou pneumatique résiduelle pardonne rarement.");
          if (c.id === 'vat' || c.id === 've') warnings.push("Une VAT prend 10 secondes et te garantit de rentrer chez toi ce soir.");
          if (c.id === 'h2s') warnings.push("Dans un espace confiné, les gaz ne préviennent pas.");
          if (c.id === 'levage') warnings.push("Sécurise toujours avec des chandelles mécaniques.");
        }
      });
      setBypassedWarnings(warnings);
      setShowDegradedConfirm(true);
    }
  };

  const togglePTT = () => {
    if (!isLive) return;
    if (isListening) {
      setIsListening(false);
      try { recognitionRef.current?.stop(); } catch(e) {}
    } else {
      setIsListening(true);
      setDiagnosticText("Écoute en cours... (Parlez puis patientez)");
      try { recognitionRef.current?.start(); } catch(e) {}
    }
  };

  const closeAndGenerateReport = async (forcedReason?: string) => {
    if (frameIntervalRef.current) window.clearInterval(frameIntervalRef.current);
    liveService.terminate();
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    setIsLive(false);
    setIsVideoActive(false);
    
    let finalHypothesis = currentDiagnostic.hypothesis;
    if (isDegradedMode) {
      finalHypothesis = `[MODE DÉGRADÉ ENGAGÉ] - ${finalHypothesis}`;
    }

    const reportData = {
      mode, technicianId: profile?.techId || "TECH-INCONNU", location: "Zone Opérationnelle", equipmentId: "EQ-INCONNU",
      safetyChecks: checks, 
      diagnostic: forcedReason ? { ...currentDiagnostic, hypothesis: forcedReason } : { ...currentDiagnostic, hypothesis: finalHypothesis },
      startTime: startTimeRef.current || new Date(), endTime: new Date()
    };
    
    const report = await reportService.generateMaintenanceReport(reportData);
    setFinalReport(report);
    setSessionClosed(true);
    speak("Intervention clôturée. Génération du rapport.");
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

  if (cooldownMsg) {
    return (
      <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col items-center justify-center p-6 text-center">
         <AlertTriangle className="text-[#FF6600] w-16 h-16 mb-4 animate-pulse" />
         <h2 className="text-white font-black uppercase tracking-widest text-xl mb-2">Refroidissement IA</h2>
         <p className="text-gray-400 text-sm">{cooldownMsg}</p>
         <button onClick={onExit} className="mt-8 bg-white/10 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs">Retour</button>
      </div>
    );
  }

  const themeColor = mode === 'maintenance' ? '#00E5FF' : '#DC2626'; 

  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden select-none">
      
      <div className="relative flex-1 bg-[#050505] overflow-hidden">
        <canvas ref={canvasRef} className="hidden" />

        <video ref={videoRef} autoPlay playsInline className={`absolute inset-0 w-full h-full object-cover ${sessionPhase === 'AUDIT' ? 'opacity-40' : 'opacity-70'} ${isVideoActive ? 'block' : 'hidden'}`} />
        
        {isVideoActive && (
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:5vw_5vw]"></div>
        )}

        {!isVideoActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]">
            {isLive ? (
              <div className="flex flex-col items-center justify-center">
                <div className={`w-40 h-40 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isListening ? `border-[${themeColor}] scale-110 shadow-[0_0_50px_${themeColor}40]` : 'border-white/10'}`}>
                  <div className={`w-32 h-32 rounded-full border flex items-center justify-center ${isListening ? `border-[${themeColor}] animate-pulse bg-[${themeColor}]/10` : 'border-white/5'}`}>
                    <Mic size={48} className={isListening ? `text-[${themeColor}]` : 'text-gray-600'} />
                  </div>
                </div>
              </div>
            ) : (
              <Shield size={64} className="text-white/10" />
            )}
          </div>
        )}
        
        {/* ========================================================= */}
        {/* NOUVEAU : HUD TACTIQUE (FILIGRANE SUPÉRIEUR)              */}
        {/* ========================================================= */}
        <div className="absolute top-4 left-4 right-4 z-40 flex flex-col gap-2">
          
          {/* LIGNE 1 : PROFIL & ÉTATS */}
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center justify-between shadow-lg">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1A1A1A] rounded-full border border-white/20 flex items-center justify-center">
                <User size={16} className="text-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-[10px] uppercase tracking-widest leading-none mb-1">
                  {profile?.fullName || 'OPÉRATEUR INCONNU'}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-[8px] uppercase tracking-widest leading-none text-[${themeColor}]`}>
                    {profile?.techId || 'ID N/A'}
                  </span>
                  {/* REINTÉGRATION DU CHRONO FREE ICI */}
                  {currentTier === 'FREE' && freeTimeLeft !== null && (
                    <span className="flex items-center gap-1 text-gray-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                      <Clock size={8} />
                      <span className="font-mono text-[8px] font-black">{Math.floor(freeTimeLeft / 60)}:{(freeTimeLeft % 60).toString().padStart(2, '0')}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-1.5 items-center">
              {profile?.habilitations?.map(hab => (
                <span key={hab} className="bg-green-500/20 border border-green-500/50 text-green-400 px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase">
                  {hab}
                </span>
              ))}
              {(!profile?.habilitations || profile.habilitations.length === 0) && (
                <span className="bg-red-500/20 border border-red-500/50 text-red-400 px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase">
                  ⚠️ SANS HABILITATION
                </span>
              )}
            </div>

          </div>

          {/* LIGNE 2 : PILULES DE CONSIGNATION (Phase Audit Uniquement) */}
          {sessionPhase === 'AUDIT' && !showDegradedConfirm && (
            <div className="bg-black/60 backdrop-blur-md border border-orange-500/30 rounded-xl p-2 flex items-center justify-between shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {checks.map(check => (
                  <button 
                    key={check.id} 
                    onClick={() => setChecks(prev => prev.map(c => c.id === check.id ? {...c, validated: !c.validated} : c))}
                    className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      check.validated 
                        ? `bg-[${themeColor}]/20 border-[${themeColor}] text-[${themeColor}] shadow-[0_0_10px_${themeColor}40]` 
                        : 'bg-black/50 border-white/10 text-gray-500 hover:text-white'
                    }`}
                  >
                    {check.validated ? <CheckCircle2 size={12} /> : check.icon}
                    <span className="text-[9px] font-black uppercase tracking-widest">{check.label}</span>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={handleTransitionToDiagnostic}
                className={`ml-2 px-3 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest transition-all shrink-0 flex items-center gap-1 ${
                  allValidated 
                    ? `bg-[${themeColor}] text-black shadow-[0_0_15px_${themeColor}80]` 
                    : 'bg-red-900/50 text-red-400 border border-red-500/30'
                }`}
              >
                {allValidated ? 'DIAGNOSTIC' : 'FORCER'}
              </button>
            </div>
          )}

          {/* LIGNE 2 (Alternative) : PHASE DIAGNOSTIC ACTUELLE */}
          {sessionPhase === 'DIAGNOSTIC' && (
            <div className="flex justify-end mt-1">
              <span className={`px-3 py-1 rounded-full border bg-[${themeColor}]/20 border-[${themeColor}]/50 text-[${themeColor}] text-[8px] font-black uppercase tracking-widest shadow-[0_0_10px_${themeColor}40] flex items-center gap-1`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                Phase Diagnostic Active
              </span>
            </div>
          )}

        </div>
        {/* ========================================================= */}


        {/* MODALE DE CONFIRMATION DÉGRADÉE */}
        {showDegradedConfirm && (
          <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-3xl p-6 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full bg-[#1A0505] border border-[#DC2626] rounded-2xl p-6 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
              <div className="flex items-center gap-3 mb-6 border-b border-[#DC2626]/30 pb-4">
                <AlertOctagon className="text-[#DC2626] w-8 h-8" />
                <h2 className="text-white font-black text-sm uppercase tracking-widest leading-tight">Dédouanement<br/>Mode Dégradé</h2>
              </div>
              
              <div className="space-y-4 mb-8">
                {bypassedWarnings.map((warning, idx) => (
                  <div key={idx} className="bg-black/50 p-4 rounded-lg border-l-4 border-orange-500">
                    <p className="text-white/80 text-xs italic leading-relaxed">"{warning}"</p>
                  </div>
                ))}
              </div>

              <div className="bg-red-950/50 p-3 rounded-lg mb-6 border border-red-500/20">
                <p className="text-red-400 text-[9px] uppercase tracking-widest text-center font-bold">
                  En poursuivant, vous engagez votre responsabilité. Locate Systems décline toute responsabilité. Le rapport sera tagué.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowDegradedConfirm(false)} className="flex-1 py-4 bg-gray-900 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest">
                  Annuler
                </button>
                <button onClick={() => { setSessionPhase('DIAGNOSTIC'); startLiveSession(true); }} className="flex-[2] py-4 bg-[#DC2626] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95">
                  J'y vais quand même
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CONSOLE INFÉRIEURE */}
      <div className="h-[30vh] bg-[#050505] border-t border-white/5 p-6 flex flex-col items-center justify-between z-40 relative">
        
        <div className="w-full bg-black/60 rounded-xl border border-white/10 p-4 min-h-[80px] flex items-center shadow-inner">
          <p className={`font-mono text-[10px] uppercase tracking-wider leading-relaxed ${currentDiagnostic.safetyAlert ? 'text-red-500 font-bold animate-pulse' : 'text-gray-300'}`}>
            <span className={`text-[${themeColor}]`}>{">"}</span> {diagnosticText}
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

           <div className="relative">
              <button 
                onClick={togglePTT}
                disabled={!isLive}
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-b-[6px] transition-all shadow-2xl select-none ${
                  !isLive 
                    ? 'bg-gray-900 border-black opacity-50' 
                    : isListening 
                      ? 'bg-orange-600 border-orange-900 scale-95 translate-y-[4px] animate-pulse' 
                      : 'bg-orange-500 border-orange-800 active:scale-95 hover:bg-[#ff7b24]'
                }`}
              >
                <Mic size={32} className="text-white drop-shadow-md" />
                <span className="text-[9px] font-black text-white uppercase mt-1 tracking-widest drop-shadow-md">
                  {isListening ? 'PARLEZ' : 'PTT'}
                </span>
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