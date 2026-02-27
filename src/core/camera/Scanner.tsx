import React, { useState, useRef, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import { geminiService } from '../ai/geminiService';
import { getCustomLocations } from '../../core/storage/memoryService';
import { validateLocateObject } from '../ai/decisionEngine';
import type { ScanResult } from '../ai/decisionEngine';

interface ScannerProps {
  onBack: () => void;
  onAnalysisComplete: (newItems: any[]) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onBack, onAnalysisComplete }) => {
  const [selectedLocation, setSelectedLocation] = useState(getCustomLocations()[0].label);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [pendingItems, setPendingItems] = useState<any[] | null>(null);
  
  // NOUVEAU : État du consentement légal
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { console.error("Accès caméra refusé", err); }
  };

  // Initialisation : Vérification du consentement avant d'allumer la caméra
  useEffect(() => {
    get('locate_ai_consent').then((val) => {
      if (val === true) {
        setHasConsented(true);
        startCamera();
      } else {
        setHasConsented(false); // Affiche la modale
      }
    });

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleConsent = async () => {
    await set('locate_ai_consent', true);
    setHasConsented(true);
    startCamera();
  };

  const toggleTorch = async () => {
    if (!videoRef.current?.srcObject) return;
    const track = (videoRef.current.srcObject as MediaStream).getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;
    if (capabilities.torch) {
      try {
        const newState = !flashOn;
        await track.applyConstraints({ advanced: [{ torch: newState }] } as any);
        setFlashOn(newState);
      } catch (err) { console.error("Erreur Torche:", err); }
    }
  };

  const handlePhotoClick = async () => {
    if (!flashOn) await toggleTorch();
    setTimeout(async () => {
      if (!videoRef.current) return;
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const img = canvas.toDataURL('image/jpeg', 0.9);
      if (flashOn) await toggleTorch();
      runAnalysis(img, true);
    }, 500);
  };

  const handleVideoRecord = async () => {
    if (!videoRef.current?.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8' });
    const chunks: Blob[] = [];

    setIsScanning(true);
    if (!flashOn) await toggleTorch();

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        runAnalysis(base64, false);
      };
      reader.readAsDataURL(blob);
      if (flashOn) await toggleTorch();
      setIsScanning(false);
    };

    mediaRecorder.start();
    setTimeout(() => {
      if (mediaRecorder.state === "recording") mediaRecorder.stop();
    }, 10000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => runAnalysis(reader.result as string, true);
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (data: string, isImage: boolean) => {
    setIsAnalyzing(true);
    try {
      const rawResults = isImage 
        ? await geminiService.analyzeVideoBurst([data], selectedLocation)
        : await geminiService.analyzeVideo(data, selectedLocation);

      if (rawResults && rawResults.length > 0) {
        const certifiedItems = rawResults.map((item: any) => {
          const validation = validateLocateObject(item as ScanResult);
          return {
            ...item,
            _validationStatus: validation.status,
            _validationMessage: validation.message,
            label: validation.status === "CERTIFIED" ? validation.label : item.label
          };
        }).filter((item: any) => item._validationStatus === "CERTIFIED");

        if (certifiedItems.length > 0) {
          setPendingItems(certifiedItems);
        } else {
          console.warn("LOCATEHOME: Aucun objet n'a passé le sas de sécurité (seuil < 70%).");
        }
      }
    } finally { 
      setIsAnalyzing(false); 
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white overflow-hidden flex flex-col font-sans">
      
      {/* ========================================== */}
      {/* SAS LÉGAL - CONSENTEMENT IA OBLIGATOIRE    */}
      {/* ========================================== */}
      {hasConsented === false && (
        <div className="absolute inset-0 z-[300] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-[6vw] text-center">
          <div className="bg-[#1E1E1E] border border-[#FF6600]/30 rounded-2xl p-[6vw] max-w-sm w-full shadow-[0_0_30px_rgba(255,102,0,0.15)] flex flex-col items-center">
            <div className="w-[15vw] h-[15vw] max-w-[60px] max-h-[60px] bg-[#FF6600]/10 rounded-full flex items-center justify-center mb-[3vh] border border-[#FF6600]/50">
              <span className="text-[#FF6600] text-2xl font-black">!</span>
            </div>
            <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.2rem,5vw,1.5rem)] mb-[2vh]">
              Consentement IA
            </h2>
            <p className="text-white/70 text-[clamp(0.85rem,3vw,1rem)] leading-relaxed mb-[4vh]">
              Locate Home utilise l'IA pour identifier vos outils. L'image est analysée puis <strong className="text-white">immédiatement supprimée</strong>. Aucune photo n'est stockée sur nos serveurs.
            </p>
            <button 
              onClick={handleConsent}
              className="w-full bg-[#FF6600] text-white py-[2vh] rounded-xl font-black uppercase tracking-widest text-[clamp(0.8rem,3vw,1rem)] shadow-[0_0_15px_rgba(255,102,0,0.3)] active:scale-95 transition-transform"
            >
              J'accepte et j'active
            </button>
            <button 
              onClick={onBack}
              className="w-full mt-[2vh] bg-transparent text-white/50 py-[1.5vh] rounded-xl font-bold uppercase tracking-widest text-[clamp(0.7rem,2.5vw,0.9rem)] active:scale-95 transition-transform"
            >
              Refuser & Quitter
            </button>
          </div>
        </div>
      )}

      {/* INJECTION CSS POUR LE LASER FLUIDE */}
      <style>{`
        .laser-sweep { animation: sweep 2.5s ease-in-out infinite alternate; }
        @keyframes sweep { 0% { top: 5%; opacity: 0.5; } 50% { opacity: 1; } 100% { top: 95%; opacity: 0.5; } }
      `}</style>

      {/* FLUX VIDÉO & ASSOMBRISSEMENT */}
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,102,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,102,0,0.03)_1px,transparent_1px)] bg-[size:5vw_5vw]"></div>

      {/* AFFICHAGE TÊTE HAUTE (HUD TOP BAR) */}
      <div className="absolute top-[env(safe-area-inset-top,2vh)] left-0 w-full flex justify-between items-center px-[4vw] pt-[2vh] z-20">
        <button onClick={onBack} className="w-[12vw] h-[12vw] max-w-[50px] max-h-[50px] bg-black/40 border border-white/10 rounded-xl backdrop-blur-md flex items-center justify-center active:scale-90">
          <img src="/icon-return.png" alt="Retour" className="w-[60%] h-[60%] object-contain opacity-80" />
        </button>
        
        <div className="flex flex-col items-center">
          <h1 className="text-[4vw] sm:text-xl tracking-widest uppercase flex gap-2">
            <span className="font-bold text-white">LOCATE</span>
            <span className="font-black text-[#FF6600] drop-shadow-[0_0_10px_rgba(255,102,0,0.8)]">SCAN</span>
          </h1>
        </div>

        <button onClick={toggleTorch} className={`w-[12vw] h-[12vw] max-w-[50px] max-h-[50px] rounded-xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 ${flashOn ? 'bg-[#FF6600]/20 border-[#FF6600] shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'bg-black/40 border-white/10'}`}>
          <span className={`text-xl ${flashOn ? 'text-[#FF6600]' : 'text-white/50 opacity-50 grayscale'}`}>⚡</span>
        </button>
      </div>

      {/* VISEUR TACTIQUE (CENTRE) */}
      <div className="absolute inset-x-[8vw] top-[20vh] bottom-[30vh] pointer-events-none z-10 flex flex-col justify-between">
        <div className="bg-[#FF6600] text-black font-black text-[2vw] sm:text-[10px] uppercase tracking-widest self-start px-2 py-1 rounded shadow-[0_0_10px_rgba(255,102,0,0.6)]">
          {isScanning ? 'ACQUISITION VIDÉO...' : 'EN ATTENTE CIBLE'}
        </div>

        <div className="relative flex-1 my-4 border border-white/10 bg-black/10 rounded-lg">
          <div className="absolute top-0 left-0 w-[8vw] h-[8vw] border-t-4 border-l-4 border-[#FF6600] rounded-tl-lg shadow-[0_0_15px_#FF6600,inset_0_0_10px_#FF6600]"></div>
          <div className="absolute top-0 right-0 w-[8vw] h-[8vw] border-t-4 border-r-4 border-[#FF6600] rounded-tr-lg shadow-[0_0_15px_#FF6600,inset_0_0_10px_#FF6600]"></div>
          <div className="absolute bottom-0 left-0 w-[8vw] h-[8vw] border-b-4 border-l-4 border-[#FF6600] rounded-bl-lg shadow-[0_0_15px_#FF6600,inset_0_0_10px_#FF6600]"></div>
          <div className="absolute bottom-0 right-0 w-[8vw] h-[8vw] border-b-4 border-r-4 border-[#FF6600] rounded-br-lg shadow-[0_0_15px_#FF6600,inset_0_0_10px_#FF6600]"></div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6vw] h-[6vw] flex items-center justify-center opacity-40">
            <div className="absolute w-full h-[1px] bg-[#FF6600]"></div>
            <div className="absolute h-full w-[1px] bg-[#FF6600]"></div>
            <div className="absolute w-1/3 h-1/3 border border-[#FF6600] rounded-full"></div>
          </div>

          <div className="absolute left-0 right-0 h-[2px] bg-[#FF6600] shadow-[0_0_20px_#FF6600] laser-sweep"></div>

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-30 rounded-lg">
              <div className="w-[12vw] h-[12vw] border-4 border-black border-t-[#FF6600] rounded-full animate-spin mb-4"></div>
              <div className="text-[#FF6600] font-black tracking-widest text-[3vw] sm:text-xs animate-pulse uppercase">Traitement Zéro-Trust</div>
            </div>
          )}
        </div>
      </div>

      {/* CONSOLE DE COMMANDE INFERIEURE */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-[10vh] pb-[env(safe-area-inset-bottom,4vh)] px-[4vw] z-20 flex flex-col gap-[3vh]">
        <div className="flex gap-[2vw] overflow-x-auto no-scrollbar w-full px-[2vw]">
          {getCustomLocations().map(loc => (
            <button 
              key={loc.id} 
              onClick={() => setSelectedLocation(loc.label)} 
              className={`whitespace-nowrap px-[4vw] py-[1vh] rounded-lg text-[2.5vw] sm:text-[10px] font-black border transition-all ${selectedLocation === loc.label ? 'bg-black border-[#FF6600] text-[#FF6600] shadow-[0_0_10px_rgba(255,102,0,0.3)]' : 'bg-black/50 border-white/10 text-white/40'}`}
            >
              {loc.label.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-end w-full px-[2vw]">
          <div className="flex flex-col items-center gap-[1vh] w-1/4">
            <button onClick={() => fileInputRef.current?.click()} className="w-[14vw] h-[14vw] max-w-[60px] max-h-[60px] bg-black/60 border border-white/10 rounded-2xl flex items-center justify-center active:scale-90 backdrop-blur">
              <img src="/icon-import.png" className="w-[60%] h-[60%] object-contain" alt="Import" />
            </button>
            <span className="text-[2vw] sm:text-[8px] text-[#FF6600] font-bold uppercase tracking-widest">MAX 5MO</span>
            <input type="file" ref={fileInputRef} onChange={handleImport} hidden accept="image/*" />
          </div>

          <div className="flex flex-col items-center gap-[1vh] w-1/4">
            <button onClick={handlePhotoClick} disabled={isScanning || isAnalyzing} className="w-[18vw] h-[18vw] max-w-[80px] max-h-[80px] bg-black/60 border border-white/10 rounded-3xl flex items-center justify-center active:scale-95 backdrop-blur shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
              <img src="/icon-photo.png" className="w-[70%] h-[70%] object-contain" alt="Photo" />
            </button>
            <span className="text-[2vw] sm:text-[8px] text-[#FF6600] font-bold uppercase tracking-widest">PHOTO HD</span>
          </div>

          <div className="flex flex-col items-center gap-[1vh] w-1/4">
            <button onClick={handleVideoRecord} disabled={isScanning || isAnalyzing} className={`w-[18vw] h-[18vw] max-w-[80px] max-h-[80px] bg-black/60 border rounded-3xl flex items-center justify-center backdrop-blur active:scale-95 transition-all ${isScanning ? 'border-[#FF6600] shadow-[0_0_20px_rgba(255,102,0,0.5)] animate-pulse' : 'border-white/10 shadow-[0_5px_20px_rgba(0,0,0,0.5)]'}`}>
              <img src="/icon-video.png" className="w-[70%] h-[70%] object-contain" alt="Vidéo" />
            </button>
            <span className="text-[2vw] sm:text-[8px] text-[#FF6600] font-bold uppercase tracking-widest">{isScanning ? 'SCAN...' : 'DIRECT 10S'}</span>
          </div>
        </div>
      </div>

      {/* MODAL RÉSULTATS */}
      {pendingItems && (
        <div className="absolute inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col p-[4vw] animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mt-[6vh] mb-[4vh] border-b border-white/10 pb-[2vh]">
            <h2 className="text-[#FF6600] font-black text-[6vw] sm:text-2xl tracking-widest uppercase">Inventaire Vidéo</h2>
            <span className="bg-[#1E1E1E] px-4 py-2 rounded-xl text-[#FF6600] font-black text-[3vw] sm:text-sm">{pendingItems.length} OBJETS</span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
            {pendingItems.map((item, idx) => (
              <div key={idx} className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg leading-tight">{item.toolName}</span>
                  <span className="text-white/40 text-[9px] uppercase tracking-widest">{item.category}</span>
                </div>
                <div className="text-[#FF6600] font-black text-xs">{item.score_confiance}%</div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-auto pt-6 pb-[env(safe-area-inset-bottom,4vh)]">
            <button onClick={() => {setPendingItems(null);}} className="flex-1 py-4 rounded-2xl bg-[#1E1E1E] text-white font-black uppercase tracking-widest active:scale-95 border border-white/10">Rejeter</button>
            <button onClick={() => onAnalysisComplete(pendingItems)} className="flex-[2] py-4 rounded-2xl bg-[#FF6600] text-black font-black uppercase tracking-widest active:scale-95 shadow-[0_0_20px_rgba(255,102,0,0.4)]">Intégrer</button>
          </div>
        </div>
      )}
    </div>
  );
};