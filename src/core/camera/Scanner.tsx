import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../ai/geminiService';
import { LOCATIONS } from '../../types';
import { validateLocateObject } from '../ai/decisionEngine';
import type { ScanResult } from '../ai/decisionEngine';

interface ScannerProps {
  onBack: () => void;
  onAnalysisComplete: (newItems: any[]) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onBack, onAnalysisComplete }) => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].label);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [pendingItems, setPendingItems] = useState<any[] | null>(null);
  
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

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const setTorch = async (state: boolean) => {
    if (!videoRef.current?.srcObject) return;
    const track = (videoRef.current.srcObject as MediaStream).getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;
    if (capabilities.torch) {
      try {
        await track.applyConstraints({ advanced: [{ torch: state }] } as any);
        setFlashOn(state);
      } catch (err) { console.error("Erreur Torche:", err); }
    }
  };

  const handlePhotoClick = async () => {
    await setTorch(true);
    setTimeout(async () => {
      if (!videoRef.current) return;
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const img = canvas.toDataURL('image/jpeg', 0.9);
      await setTorch(false);
      runAnalysis(img, true);
    }, 500);
  };

  const handleVideoRecord = async () => {
    if (!videoRef.current?.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8' });
    const chunks: Blob[] = [];

    setIsScanning(true);
    await setTorch(true);

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        runAnalysis(base64, false);
      };
      reader.readAsDataURL(blob);
      await setTorch(false);
      setIsScanning(false);
    };

    mediaRecorder.start();
    setTimeout(() => {
      if (mediaRecorder.state === "recording") mediaRecorder.stop();
    }, 10000); // Limite 10 secondes
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
      // 1. Récupération des données brutes de l'IA
      const rawResults = isImage 
        ? await geminiService.analyzeVideoBurst([data], selectedLocation)
        : await geminiService.analyzeVideo(data, selectedLocation);

      if (rawResults && rawResults.length > 0) {
        // 2. Passage dans le sas de sécurité Zéro-Trust (PAVP V5.0)
        const certifiedItems = rawResults.map((item: any) => {
          const validation = validateLocateObject(item as ScanResult);
          return {
            ...item,
            _validationStatus: validation.status,
            _validationMessage: validation.message,
            // Si certifié, le label officiel devient la typographie exacte trouvée
            label: validation.status === "CERTIFIED" ? validation.label : item.label
          };
        }).filter((item: any) => item._validationStatus === "CERTIFIED"); // 3. On ne garde que ceux >= 70%

        // 4. Envoi à l'inventaire uniquement si la pièce est conforme
        if (certifiedItems.length > 0) {
          setPendingItems(certifiedItems);
        } else {
          console.warn("LOCATEHOME: Aucun objet n'a passé le sas de sécurité (seuil < 70%).");
          // Optionnel pour plus tard : Afficher une alerte visuelle à l'utilisateur ici
        }
      }
    } finally { 
      setIsAnalyzing(false); 
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white p-[2vh] overflow-hidden relative">
      <div className="flex justify-between items-center h-[8vh] mb-[1vh] shrink-0">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-[#1E1E1E] rounded-xl border border-white/10 active:scale-95">
          <span className="text-xl">←</span>
        </button>
        <h1 className="text-[#FF6600] font-black italic text-[1.1rem] tracking-widest">LOCATE HOME</h1>
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1E1E1E] border border-white/10 opacity-30">
          {flashOn ? '⚡' : '🌑'}
        </div>
      </div>

      <div className="relative flex-1 min-h-0 w-full max-w-lg mx-auto my-2 rounded-3xl overflow-hidden border-2 border-[#1E1E1E] bg-black shadow-[0_0_40px_rgba(255,102,0,0.05)]">
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        <div className="absolute inset-4 pointer-events-none z-10">
          <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-[#FF6600] rounded-tl-xl shadow-[0_0_15px_rgba(255,102,0,0.5)]"></div>
          <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-[#FF6600] rounded-tr-xl shadow-[0_0_15px_rgba(255,102,0,0.5)]"></div>
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-[#FF6600] rounded-bl-xl shadow-[0_0_15px_rgba(255,102,0,0.5)]"></div>
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-[#FF6600] rounded-br-xl shadow-[0_0_15px_rgba(255,102,0,0.5)]"></div>
          <div className={`absolute left-0 right-0 h-[2px] bg-[#FF6600] shadow-[0_0_15px_#FF6600] ${isScanning ? 'animate-scan-laser' : 'top-1/2 opacity-20'}`}></div>
        </div>
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
            <div className="w-16 h-16 border-4 border-[#1E1E1E] border-t-[#FF6600] rounded-full animate-spin mb-4"></div>
            <div className="text-[#FF6600] font-black tracking-widest text-sm animate-pulse uppercase">Analyse Vidéo Directe</div>
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar my-[2vh] px-2 shrink-0">
        {LOCATIONS.map(loc => (
          <button 
            key={loc.id} 
            onClick={() => setSelectedLocation(loc.label)} 
            className={`px-5 py-2 rounded-xl text-[10px] font-black border transition-all ${selectedLocation === loc.label ? 'bg-[#FF6600] border-[#FF6600] text-black' : 'bg-[#1E1E1E] border-white/5 text-white/50'}`}
          >
            {loc.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-end px-4 pb-10 mt-auto shrink-0 gap-4">
        <div className="flex flex-col items-center gap-2">
          <button onClick={() => fileInputRef.current?.click()} className="w-14 h-14 bg-[#1E1E1E] border border-white/10 rounded-2xl flex items-center justify-center active:scale-90">
            <img src="/icon-photo.png" className="w-8 h-8 opacity-60" alt="Galerie" />
          </button>
          <span className="text-[8px] text-white/30 font-bold uppercase tracking-widest">MAX 5MO</span>
          <input type="file" ref={fileInputRef} onChange={handleImport} hidden accept="image/*" />
        </div>

        <button onClick={handlePhotoClick} disabled={isScanning || isAnalyzing} className="flex-1 h-20 bg-[#FF6600] rounded-2xl flex flex-col items-center justify-center shadow-[0_10px_20px_rgba(255,102,0,0.2)] active:scale-95">
          <span className="text-black font-black uppercase text-sm">PHOTO</span>
          <span className="text-black/60 text-[8px] font-bold tracking-widest">HD MODE</span>
        </button>

        <div className="flex-1 flex flex-col items-center gap-2">
          <button onClick={handleVideoRecord} disabled={isScanning || isAnalyzing} className={`w-full h-20 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 ${isScanning ? 'bg-white text-black animate-pulse' : 'bg-[#FF6600] text-black shadow-[0_10px_20px_rgba(255,102,0,0.2)]'}`}>
            <span className="font-black uppercase text-sm">VIDÉO</span>
            <span className="text-[8px] font-bold opacity-60 uppercase">{isScanning ? 'En cours...' : '10S Direct'}</span>
          </button>
          <span className="text-[8px] text-[#FF6600] font-bold uppercase tracking-widest">MAX 10S</span>
        </div>
      </div>

      {pendingItems && (
        <div className="absolute inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex flex-col p-6 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mt-8 mb-6 border-b border-white/10 pb-4">
            <h2 className="text-[#FF6600] font-black text-2xl tracking-widest uppercase">Inventaire Vidéo</h2>
            <span className="bg-[#1E1E1E] px-4 py-2 rounded-xl text-[#FF6600] font-black">{pendingItems.length} OBJETS</span>
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
          <div className="flex gap-4 mt-6 pb-8">
            <button onClick={() => {setPendingItems(null);}} className="flex-1 py-4 rounded-2xl bg-[#1E1E1E] text-white font-black uppercase tracking-widest active:scale-95">Rejeter</button>
            <button onClick={() => onAnalysisComplete(pendingItems)} className="flex-[2] py-4 rounded-2xl bg-[#FF6600] text-black font-black uppercase tracking-widest active:scale-95">Intégrer</button>
          </div>
        </div>
      )}
    </div>
  );
};