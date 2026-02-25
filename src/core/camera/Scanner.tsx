import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../ai/geminiService';
import { LOCATIONS } from '../../types';

interface ScannerProps {
  onBack: () => void;
  onAnalysisComplete: (newItems: any[]) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onBack, onAnalysisComplete }) => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].label);
  const [frames, setFrames] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  
  // LE SAS DE VALIDATION (Zéro-Trust)
  const [pendingItems, setPendingItems] = useState<any[] | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- GESTION CAMÉRA & FLASH ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { console.error("Accès caméra refusé", err); }
  };

  const toggleFlash = async () => {
    if (!videoRef.current?.srcObject) return;
    const track = (videoRef.current.srcObject as MediaStream).getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;
    if (capabilities.torch) {
      try {
        await track.applyConstraints({ advanced: [{ torch: !flashOn }] } as any);
        setFlashOn(!flashOn);
      } catch (err) { console.error(err); }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // --- LOGIQUE DE CAPTURE ---
  const handleBurst = () => {
    setFrames([]);
    setIsScanning(true);
    let count = 0;
    const interval = setInterval(() => {
      if (!videoRef.current) return;
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const img = canvas.toDataURL('image/jpeg', 0.6);
      setFrames(prev => [...prev, img]);
      count++;
      if (count >= 12) {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 400);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFrames([base64]);
        runAnalysis([base64]);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (imgs: string[]) => {
    if (imgs.length === 0) return;
    setIsAnalyzing(true);
    try {
      const data = await geminiService.analyzeVideoBurst(imgs, selectedLocation);
      if (data && data.length > 0) {
        // ON BLOQUE L'ENVOI AUTOMATIQUE ET ON AFFICHE LE SAS
        setPendingItems(data);
      }
    } finally { setIsAnalyzing(false); }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white p-[2vh] overflow-hidden relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center h-[8vh] mb-[1vh] shrink-0">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-[#1E1E1E] rounded-xl border border-white/10 active:scale-95 transition-transform">
          <span className="text-xl">←</span>
        </button>
        <h1 className="text-[#FF6600] font-black italic text-[1.1rem] tracking-widest">LOCATE HOME</h1>
        <button onClick={toggleFlash} className={`w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 active:scale-95 transition-colors ${flashOn ? 'bg-[#FF6600] text-black border-[#FF6600]' : 'bg-[#1E1E1E] text-white/50'}`}>
          {flashOn ? '⚡' : '🌑'}
        </button>
      </div>

      {/* COCKPIT IA (LE SCANNER) - CORRIGÉ POUR LENOVO */}
      <div className="relative flex-1 min-h-0 w-full max-w-lg mx-auto my-2 rounded-3xl overflow-hidden border-2 border-[#1E1E1E] bg-black shadow-[0_0_40px_rgba(255,102,0,0.05)] group">
        
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-90" />
        
        {/* Grille millimétrique */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>

        {/* Le Collimateur & Laser */}
        <div className="absolute inset-4 pointer-events-none z-10">
          {/* Les 4 coins */}
          <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-[#FF6600] rounded-tl-xl shadow-[0_0_15px_rgba(255,102,0,0.5)]"></div>
          <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-[#FF6600] rounded-tr-xl shadow-[0_0_15px_rgba(255,102,0,0.5)]"></div>
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-[#FF6600] rounded-bl-xl shadow-[0_0_15px_rgba(255,102,0,0.5)]"></div>
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-[#FF6600] rounded-br-xl shadow-[0_0_15px_rgba(255,102,0,0.5)]"></div>

          {/* Faisceau Animé */}
          <div className="absolute left-0 right-0 h-[2px] bg-[#FF6600] shadow-[0_0_15px_#FF6600,0_0_30px_#FF6600] animate-scan-laser"></div>
        </div>

        {/* Badges System Ready */}
        <div className="absolute bottom-6 w-full flex justify-center z-20 pointer-events-none">
          <div className="bg-[#121212]/90 backdrop-blur-md border border-[#FF6600]/30 px-5 py-2 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.8)] flex flex-col items-center">
            <span className="text-[#FF6600] font-black text-[11px] tracking-[0.2em] uppercase">System Ready</span>
            <span className="text-white/50 text-[8px] tracking-widest uppercase mt-0.5">AI Morphological Active</span>
          </div>
        </div>

        {/* Overlay d'Analyse (Quand Gemini réfléchit) */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
            <div className="w-16 h-16 border-4 border-[#1E1E1E] border-t-[#FF6600] rounded-full animate-spin mb-4 shadow-[0_0_30px_rgba(255,102,0,0.4)]"></div>
            <div className="text-[#FF6600] font-black tracking-widest text-sm animate-pulse uppercase">
              Analyse Bible V1.4
            </div>
          </div>
        )}
      </div>

      {/* SÉLECTEUR DE ZONE */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar my-[3vh] px-2 shrink-0">
        {LOCATIONS.map(loc => (
          <button 
            key={loc.id} 
            onClick={() => setSelectedLocation(loc.label)} 
            className={`px-5 py-2.5 rounded-xl text-[10px] whitespace-nowrap font-black border transition-all shadow-lg ${selectedLocation === loc.label ? 'bg-[#FF6600] border-[#FF6600] text-black' : 'bg-[#1E1E1E] border-white/5 text-white/70 hover:border-[#FF6600]/50 hover:text-white'}`}
          >
            {loc.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* BOUTONS D'ACTION (LE MOTEUR) */}
      <div className="flex justify-evenly items-center mt-auto pb-4 shrink-0">
        
        {/* Bouton Galerie */}
        <button onClick={() => fileInputRef.current?.click()} className="w-[18vw] max-w-[70px] aspect-square relative active:scale-95 transition-transform">
          <img src="/icon-photo.png" className="w-full h-full object-contain drop-shadow-xl" alt="Import" />
          <input type="file" ref={fileInputRef} onChange={handleImport} hidden accept="image/*" />
        </button>

        {/* Bouton Burst Vidéo (Le gros central) */}
        <button onClick={handleBurst} className={`w-[28vw] max-w-[100px] aspect-square transition-all ${isScanning ? 'scale-110 drop-shadow-[0_0_30px_rgba(255,102,0,0.6)]' : 'hover:scale-105 active:scale-90'}`}>
          <img src="/icon-video.png" className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" alt="Video" />
        </button>

        {/* Bouton Analyser */}
        <button onClick={() => runAnalysis(frames)} className={`w-[18vw] max-w-[70px] aspect-square relative transition-all active:scale-95 ${frames.length > 0 ? 'opacity-100 scale-105 drop-shadow-[0_0_15px_rgba(255,102,0,0.3)]' : 'opacity-40 grayscale'}`}>
          <img src="/icon-scanner.png" className="w-full h-full object-contain drop-shadow-xl" alt="Scan" />
          {frames.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#FF6600] text-black text-[11px] px-2 py-0.5 rounded-md font-black border border-black z-10 shadow-lg">
              {frames.length}
            </span>
          )}
        </button>

      </div>

      {/* ========================================= */}
      {/* VUE 01 C1 : LE SAS DE VALIDATION (OVERLAY) */}
      {/* ========================================= */}
      {pendingItems && pendingItems.length > 0 && (
        <div className="absolute inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between mt-8 mb-6 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-[#FF6600] font-black text-2xl tracking-widest uppercase">Rapport d'Analyse</h2>
              <p className="text-white/50 text-xs tracking-widest uppercase mt-1">Zone : {selectedLocation}</p>
            </div>
            <div className="bg-[#1E1E1E] border border-[#FF6600]/30 px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(255,102,0,0.2)]">
              <span className="material-symbols-outlined text-[#FF6600]">memory</span>
              <span className="text-[#FF6600] font-black text-lg">{pendingItems.length}</span>
            </div>
          </div>

          {/* Liste des objets détectés */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
            {pendingItems.map((item, idx) => (
              <div key={idx} className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg">{item.toolName}</span>
                  <span className="text-[#B0BEC5] text-[10px] tracking-widest uppercase">{item.category}</span>
                </div>
                {/* Indicateur de confiance */}
                <div className="flex flex-col items-end">
                  <div className={`px-3 py-1 rounded-lg border text-xs font-black flex items-center gap-1 ${item.score_confiance > 80 ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {item.score_confiance > 80 ? 'check_circle' : 'warning'}
                    </span>
                    {item.score_confiance}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Boutons d'action (Valider ou Rejeter) */}
          <div className="flex gap-4 mt-6 pb-8">
            <button 
              onClick={() => {
                setPendingItems(null);
                setFrames([]);
              }} 
              className="flex-1 py-4 rounded-2xl bg-[#1E1E1E] border border-white/10 text-white font-black tracking-widest uppercase active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">delete</span>
              Rejeter
            </button>
            
            <button 
              onClick={() => onAnalysisComplete(pendingItems)} 
              className="flex-[2] py-4 rounded-2xl bg-[#FF6600] text-black font-black tracking-widest uppercase shadow-[0_0_30px_rgba(255,102,0,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">check_circle</span>
              Intégrer
            </button>
          </div>
        </div>
      )}

    </div>
  );
};