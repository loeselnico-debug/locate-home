import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../ai/geminiService';
import { LOCATIONS } from '../../types';

interface ScannerProps {
  onBack: () => void;
  onAnalysisComplete: (newItems: any[]) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onBack, onAnalysisComplete }) => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].label);
  const [frames, setFrames] = useState<string[]>([]); // Maintenant utilisé pour l'analyse
  const [isScanning, setIsScanning] = useState(false); // Utilisé pour l'état du Burst
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  
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
    setIsScanning(true); // Utilisation de setIsScanning
    let count = 0;
    const interval = setInterval(() => {
      if (!videoRef.current) return;
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const img = canvas.toDataURL('image/jpeg', 0.6);
      setFrames(prev => [...prev, img]); // Utilisation de frames
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
    if (imgs.length === 0) return; // Sécurité si frames est vide
    setIsAnalyzing(true);
    try {
      const data = await geminiService.analyzeVideoBurst(imgs, selectedLocation);
      if (data && data.length > 0) onAnalysisComplete(data);
    } finally { setIsAnalyzing(false); }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white p-[2vh] overflow-hidden">
      
      <div className="flex justify-between items-center h-[8vh] mb-[1vh]">
        <button onClick={onBack} className="p-2 text-xl">←</button>
        <h1 className="text-[#FF6600] font-black italic text-[1.1rem]">LOCATE HOME</h1>
        <button onClick={toggleFlash} className={`p-2 rounded-full ${flashOn ? 'bg-yellow-500 text-black' : 'text-white/50'}`}>
          {flashOn ? '⚡' : '🌑'}
        </button>
      </div>

      <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden border border-white/10 bg-black">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center animate-pulse text-orange-500 font-black">
            ANALYSE BIBLE V1.4...
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar my-[2vh] px-4">
     {LOCATIONS.map(loc => (
       <button 
         key={loc.id} 
         onClick={() => setSelectedLocation(loc.label)} 
         className={`px-4 py-1.5 rounded-full text-[10px] whitespace-nowrap font-black border transition-colors ${selectedLocation === loc.label ? 'bg-orange-600 border-orange-600' : 'border-white/10 hover:border-orange-600/50'}`}
       >
         {loc.label.toUpperCase()}
       </button>
     ))}
   </div>

      <div className="flex justify-around items-center h-[12vh] border-t border-white/5 mt-auto">
        {/* GALERIE */}
        <button onClick={() => fileInputRef.current?.click()} className="w-14 h-14">
          <img src="/icon-photo.png" className="w-full h-full object-contain" alt="Import" />
          <input type="file" ref={fileInputRef} onChange={handleImport} hidden accept="image/*" />
        </button>

        {/* BURST VIDÉO */}
        <button onClick={handleBurst} className={`w-18 h-18 transition-all ${isScanning ? 'scale-110 animate-pulse' : ''}`}>
          <img src="/icon-video.png" className="w-full h-full object-contain" alt="Video" />
        </button>

        {/* ANALYSER (Utilise frames pour l'affichage du compteur) */}
        <button onClick={() => runAnalysis(frames)} className="w-14 h-14 relative">
          <img src="/icon-scanner.png" className={`w-full h-full object-contain ${frames.length > 0 ? 'opacity-100' : 'opacity-30'}`} alt="Scan" />
          {frames.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-600 text-[10px] px-1.5 rounded-full font-black">
              {frames.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};