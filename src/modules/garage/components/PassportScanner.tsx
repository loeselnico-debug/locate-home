import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Loader2, } from 'lucide-react';
import { geminiService } from '../../../core/ai/geminiService';

interface PassportScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { fullName: string; company: string; techId: string; habilitations: string[] }) => void;
}

const PassportScanner: React.FC<PassportScannerProps> = ({ isOpen, onClose, onSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isOpen) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Erreur caméra:", err));
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [isOpen]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);
      setIsAnalyzing(true);
      
      // Appel à notre nouvelle fonction métier
      const result = await geminiService.analyzePasseportSecurite(base64Image);
      
      setIsAnalyzing(false);
      if (result) {
        onSuccess(result);
      } else {
        alert("L'IA n'a pas réussi à lire les données. Veuillez réessayer avec un meilleur éclairage.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col font-sans">
      {isAnalyzing && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
          <Loader2 size={64} className="text-[#FF6600] mb-4 animate-spin" />
          <h2 className="text-white font-black uppercase tracking-widest animate-pulse">Lecture OCR en cours...</h2>
          <p className="text-gray-400 text-xs mt-2">Extraction des habilitations de sécurité</p>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />

      {/* HUD Scanner */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h1 className="text-[#FF6600] font-black text-xl uppercase tracking-widest">SCAN PASSEPORT</h1>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Acquisition Sécurité M5</p>
        </div>
        <button onClick={onClose} className="w-12 h-12 bg-black/50 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md active:scale-90">
          <X className="text-white" size={24} />
        </button>
      </div>

      {/* Cadre de visée */}
      <div className="absolute inset-x-[10vw] top-[25vh] bottom-[30vh] border-2 border-[#FF6600] border-dashed rounded-xl flex items-center justify-center pointer-events-none z-10 shadow-[0_0_20px_rgba(255,102,0,0.3)]">
        <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-[#FF6600]/30">
          <span className="text-[#FF6600] font-bold text-[10px] uppercase tracking-widest">Cadrer la carte ici</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[25vh] bg-gradient-to-t from-black to-transparent flex items-center justify-center z-10 pb-[env(safe-area-inset-bottom)]">
        <button onClick={handleCapture} disabled={isAnalyzing} className="w-20 h-20 bg-[#FF6600] rounded-full border-4 border-black ring-2 ring-[#FF6600] flex items-center justify-center active:scale-90 transition-transform shadow-[0_0_30px_rgba(255,102,0,0.6)]">
          <Camera size={32} className="text-black" />
        </button>
      </div>
    </div>
  );
};

export default PassportScanner;
