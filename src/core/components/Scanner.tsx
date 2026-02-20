import React, { useState, useRef, useEffect } from 'react';
import { geminiService, VALID_LOCATIONS } from '../services/geminiService';

// 1. Définition des propriétés pour la communication avec App.tsx
interface ScannerProps {
  onBack: () => void;
  onAnalysisComplete: (newItems: any[]) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onBack, onAnalysisComplete }) => {
  // --- ÉTATS (Hooks de contrôle) ---
  const [selectedLocation, setSelectedLocation] = useState("Atelier");
  const [frames, setFrames] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- LOGIQUE CAMÉRA (VRAIS YEUX) ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Erreur caméra:", err);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      // Nettoyage des flux à la fermeture du module
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureFrame = (quality = 0.7) => {
    if (!videoRef.current) return "";
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      return canvas.toDataURL('image/jpeg', quality);
    }
    return "";
  };

  // --- MODES DE CAPTURE ---

  // MODE A : Photo Unique (HD pour OCR précis)
  const handleSinglePhoto = async () => {
    const photo = captureFrame(0.9); // Haute qualité
    if (photo) {
      setFrames([photo]);
      const data = await geminiService.analyzeVideoBurst([photo], selectedLocation);
      setResults(data);
      onAnalysisComplete(data);
    }
  };

  // MODE B : Burst Vidéo (Standard 12 frames / 20s)
  const handleBurstScan = () => {
    setIsScanning(true);
    let count = 0;
    const burstInterval = setInterval(() => {
      const frame = captureFrame();
      if (frame) setFrames(prev => [...prev, frame].slice(-12));
      count++;
      if (count >= 12) {
        clearInterval(burstInterval);
        setIsScanning(false);
      }
    }, 1500);
  };

  // MODE C : Analyse Manuelle
  const handleAnalyze = async () => {
    if (frames.length === 0) return;
    try {
      const data = await geminiService.analyzeVideoBurst(frames, selectedLocation);
      setResults(data);
      onAnalysisComplete(data);
    } catch (error) {
      console.error("Erreur analyse:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white p-[2vh]">
      
      {/* HEADER : BRANDING LOCATE SYSTEMS */}
      <div className="flex justify-between items-center mb-[4vh]">
        <button onClick={onBack} className="text-[1.5rem] p-[1rem] active:scale-90 transition-transform">←</button>
        <div className="flex flex-col items-center">
          <h1 className="text-[1.3rem] font-bold tracking-tighter italic uppercase">
            <span className="text-[#FF6600]">Locate</span> <span className="text-white">Home</span>
          </h1>
          <div className="relative self-end mt-[-0.4rem]">
            <span className="text-[0.6rem] font-bold italic pr-[0.5rem]" 
                  style={{ background: 'linear-gradient(90deg, #BF953F, #FCF6BA, #B38728)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              by Systems
            </span>
          </div>
        </div>
        <div className="border border-[#FFCC00] text-[#FFCC00] px-[1rem] py-[0.2rem] rounded-full text-[0.7rem] font-black shadow-[0_0_10px_rgba(255,204,0,0.2)]">
          FREE
        </div>
      </div>

      {/* BARRE DE LOCALISATION DE VÉRITÉ */}
      <div className="flex overflow-x-auto gap-[0.8rem] mb-[4vh] no-scrollbar">
        {VALID_LOCATIONS.map((loc) => (
          <button
            key={loc}
            onClick={() => setSelectedLocation(loc)}
            className={`px-[1.2rem] py-[0.6rem] rounded-full border text-[0.8rem] whitespace-nowrap transition-all duration-300 ${
              selectedLocation === loc 
                ? "bg-[#FF6600] border-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.4)] scale-105" 
                : "border-gray-800 text-gray-500 bg-black/20"
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* ZONE VISION HDR AVEC LASER */}
      <div className="relative aspect-[3/4] w-full bg-black rounded-[2.5rem] overflow-hidden border border-gray-800 shadow-2xl">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        
        {/* FILTRE INDUSTRIEL / LASER */}
        {isScanning && (
          <div className="absolute inset-0 border-[4px] border-[#FF6600] animate-pulse pointer-events-none" />
        )}
        <div className="absolute inset-x-0 h-[2px] bg-[#FF6600] shadow-[0_0_15px_#FF6600] top-1/2 animate-bounce opacity-40 pointer-events-none" />
        
        <div className="absolute top-[2vh] left-1/2 -translate-x-1/2 bg-black/50 px-[1rem] py-[0.4rem] rounded-full text-[0.6rem] border border-white/10 uppercase tracking-widest">
          {isScanning ? "Capture Burst..." : "Système Prêt"}
        </div>
      </div>

      {/* ACTIONS : COMMANDES 3D BY SYSTEMS */}
      <div className="flex justify-around items-center py-[5vh] px-[2vw]">
        
        {/* PHOTO HD */}
        <button onClick={handleSinglePhoto} disabled={isScanning} className="relative w-[4.5rem] h-[4.5rem] transition-transform active:scale-90">
          <img src="/icon-photo.png" alt="HD" className="w-full h-full object-contain" />
          <span className="absolute -bottom-[1vh] left-1/2 -translate-x-1/2 text-[0.5rem] font-black text-white/40">HD</span>
        </button>

        {/* BURST VIDÉO */}
        <button onClick={handleBurstScan} disabled={isScanning} className="relative w-[5.5rem] h-[5.5rem] transition-all active:scale-90">
          <img src="/icon-video.png" alt="Burst" className={`w-full h-full object-contain ${isScanning ? "animate-pulse" : ""}`} />
          {isScanning && (
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-[80%] h-[80%] border-[3px] border-[#FF6600] border-t-transparent rounded-full animate-spin" />
             </div>
          )}
        </button>

        {/* ANALYSEUR IA */}
        <button onClick={handleAnalyze} disabled={frames.length === 0 || isScanning} className={`relative w-[4.5rem] h-[4.5rem] transition-transform active:scale-90 ${frames.length === 0 ? "opacity-30" : ""}`}>
          <img src="/icon-scanner.png" alt="Analyze" className="w-full h-full object-contain" />
          <span className="absolute -top-[1vh] right-0 bg-[#FF6600] text-black text-[0.6rem] font-black px-[0.6rem] py-[0.2rem] rounded-full italic shadow-lg">
            {frames.length}
          </span>
        </button>

      </div>

      {/* RÉSULTATS DYNAMIQUES */}
      <div className="flex-1 space-y-[1.2rem] pb-[5vh]">
        {results.map((item, index) => (
          <div key={index} className="bg-[#111111] p-[1.2rem] rounded-[1.5rem] border-l-[4px] border-[#FF6600] flex justify-between items-center animate-fade-in">
            <div>
              <p className="font-bold text-[0.9rem] text-white">{item.toolName}</p>
              <p className="text-[0.6rem] text-gray-500 uppercase tracking-tighter">
                {item.location} • SKU: {item.sku}
              </p>
            </div>
            <div className="text-[0.6rem] font-black text-green-500 bg-green-500/10 px-[0.8rem] py-[0.3rem] rounded-md uppercase">
              {item.safetyStatus}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};