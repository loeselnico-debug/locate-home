import { useRef, useEffect, useState } from 'react'; // Retrait de 'React'
import { RefreshCw, Zap, ArrowLeft } from 'lucide-react'; // Retrait de 'Camera', ajout de 'ArrowLeft'
import { geminiService } from '../services/geminiService';

const LiveScanner = ({ 
  onAnalysisComplete, 
  onBack 
}: { 
  onAnalysisComplete: (items: any[]) => void;
  onBack: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (err) {
        console.error("Erreur accès caméra:", err);
      }
    }
    startCamera();
    return () => stream?.getTracks().forEach(track => track.stop());
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsAnalyzing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    const results = await geminiService.analyzeTool(imageData);
    onAnalysisComplete(results);
    setIsAnalyzing(false);
  };

  return (
    <div className="relative w-full h-[85vh] bg-[#121212] overflow-hidden rounded-3xl border-2 border-[#1E1E1E]">
      {/* BOUTON RETOUR (Utilisation de onBack) */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 z-30 p-3 bg-black/50 rounded-full text-white backdrop-blur-md border border-white/10 active:scale-90 transition-transform"
      >
        <ArrowLeft size={24} />
      </button>

      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

      {/* LASER ANIMÉ */}
      <div className={`z-20 ${isAnalyzing ? 'animate-scan-fast' : 'animate-scan-slow'}`} />

      {/* CADRE DE VISÉE */}
      <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
        <div className="w-64 h-64 border-2 border-[#FF6600]/30 rounded-2xl relative">
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-[#FF6600]"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-[#FF6600]"></div>
        </div>
      </div>

      <button
        onClick={handleCapture}
        disabled={isAnalyzing}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#FF6600] rounded-full border-4 border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,102,0,0.4)] active:scale-90 transition-transform z-30"
      >
        {isAnalyzing ? <RefreshCw className="text-white animate-spin" size={32} /> : <Zap className="text-white fill-current" size={32} />}
      </button>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default LiveScanner;