import React, { useState, useRef, useEffect } from 'react';
import { geminiService, VALID_LOCATIONS } from '../services/geminiService';

interface ScannerProps {
  onBack: () => void;
  onAnalysisComplete: (newItems: any[]) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onBack, onAnalysisComplete }) => {
  const [selectedLocation, setSelectedLocation] = useState("Atelier");
  const [frames, setFrames] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { console.error("Caméra non accessible", err); }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureFrame = (quality = 0.8) => {
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

  const handleSinglePhoto = async () => {
    const photo = captureFrame(0.9);
    if (photo) {
      setFrames([photo]);
      setIsAnalyzing(true);
      try {
        const data = await geminiService.analyzeVideoBurst([photo], selectedLocation);
        setResults(data);
        if (data.length > 0) {
          setTimeout(() => onAnalysisComplete(data), 2000); // Délai pour laisser voir le résultat
        }
      } finally { setIsAnalyzing(false); }
    }
  };

  const handleBurstScan = () => {
    setFrames([]);
    setIsScanning(true);
    let count = 0;
    const burstInterval = setInterval(() => {
      const frame = captureFrame(0.7);
      if (frame) setFrames(prev => [...prev, frame].slice(-12));
      count++;
      if (count >= 12) {
        clearInterval(burstInterval);
        setIsScanning(false);
      }
    }, 800); // Un peu plus rapide pour le J5
  };

  const handleAnalyze = async () => {
    if (frames.length === 0) return;
    setIsAnalyzing(true);
    try {
      const data = await geminiService.analyzeVideoBurst(frames, selectedLocation);
      setResults(data);
      if (data.length > 0) {
        setTimeout(() => onAnalysisComplete(data), 2500);
      } else {
        alert("IA : Aucun outil détecté. Rapprochez-vous.");
      }
    } finally { setIsAnalyzing(false); }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white p-[1.5vh] overflow-hidden">
      
      {/* HEADER COMPACT (Optimisé J5) */}
      <div className="flex justify-between items-center mb-[1.5vh]">
        <button onClick={onBack} className="text-[1.2rem] p-[0.5rem]">←</button>
        <div className="flex flex-col items-center">
          <h1 className="text-[1.1rem] font-bold italic uppercase tracking-tighter">
            <span className="text-[#FF6600]">Locate</span> <span className="text-white">Home</span>
          </h1>
          <span className="text-[0.5rem] font-bold italic mt-[-0.2rem] opacity-70" style={{ color: '#FCF6BA' }}>by Systems</span>
        </div>
        <div className="text-[#FFCC00] border border-[#FFCC00] px-2 py-0.5 rounded-full text-[0.6rem] font-black">FREE</div>
      </div>

      {/* ZONE VISION 4:3 (Gain de place vertical pour J5) */}
      <div className="relative aspect-[4/3] w-full bg-black rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        {isScanning && <div className="absolute inset-0 border-[3px] border-[#FF6600] animate-pulse" />}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col">
            <div className="w-12 h-12 border-4 border-[#FF6600] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-[0.7rem] font-black uppercase tracking-widest text-[#FF6600]">Analyse IA...</p>
          </div>
        )}
      </div>

      {/* LOCALISATION (Compact) */}
      <div className="flex overflow-x-auto gap-[0.5rem] my-[1.5vh] no-scrollbar py-1">
        {VALID_LOCATIONS.map((loc) => (
          <button
            key={loc}
            onClick={() => setSelectedLocation(loc)}
            className={`px-[1rem] py-[0.4rem] rounded-full border text-[0.65rem] font-bold whitespace-nowrap transition-all ${
              selectedLocation === loc ? "bg-[#FF6600] border-[#FF6600]" : "border-white/10 text-gray-500"
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* ACTIONS 3D (Taille ajustée J5) */}
      <div className="flex justify-around items-center mb-[2vh]">
        <button onClick={handleSinglePhoto} className="w-[3.5rem] h-[3.5rem] active:scale-90">
          <img src="/icon-photo.png" alt="Photo" className="w-full h-full object-contain" />
        </button>

        <button onClick={handleBurstScan} disabled={isScanning} className="relative w-[4.5rem] h-[4.5rem] active:scale-90">
          <img src="/icon-video.png" alt="Burst" className={`w-full h-full object-contain ${isScanning ? "animate-pulse" : ""}`} />
        </button>

        <button onClick={handleAnalyze} disabled={frames.length === 0} className="relative w-[3.5rem] h-[3.5rem] active:scale-90">
          <img src="/icon-scanner.png" alt="Scan" className="w-full h-full object-contain" />
          <span className="absolute -top-1 -right-1 bg-[#FF6600] text-black text-[0.6rem] font-black px-1.5 rounded-full">
            {frames.length}
          </span>
        </button>
      </div>

      {/* RÉSULTATS ÉPHÉMÈRES (Derniers objets trouvés) */}
      <div className="flex-1 overflow-y-auto px-1">
        {results.map((item, i) => (
          <div key={i} className="bg-white/5 border-l-2 border-[#FF6600] p-2 rounded-r-lg mb-2 flex justify-between animate-fade-in">
            <span className="text-[0.7rem] font-bold">{item.toolName}</span>
            <span className="text-[0.6rem] text-[#FF6600]">{item.confidence}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};