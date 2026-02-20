import { useRef, useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { LOCATIONS } from '../types';

interface ScannerProps {
  onBack: () => void;
  onAnalysisComplete: (items: any[]) => void;
}

export default function Scanner({ onBack, onAnalysisComplete }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'processing'>('idle');
  const [timeLeft, setTimeLeft] = useState(20);
  const [torchOn, setTorchOn] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>(LOCATIONS[0].id);

  // --- GESTION CAMÉRA & FLUX ---
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          trackRef.current = stream.getVideoTracks()[0];
        }
      } catch (err) {
        console.error("Erreur accès caméra :", err);
      }
    };
    startCamera();
    return () => {
      trackRef.current?.stop();
    };
  }, []);

  // --- FONCTION FORCE FLASH ---
  const toggleTorch = async () => {
    if (trackRef.current) {
      try {
        const capabilities = trackRef.current.getCapabilities() as any;
        if (capabilities.torch) {
          const newState = !torchOn;
          await trackRef.current.applyConstraints({
            advanced: [{ torch: newState }]
          } as any);
          setTorchOn(newState);
        } else {
          alert("La torche n'est pas supportée sur cet appareil.");
        }
      } catch (e) {
        console.error("Erreur contrôle torche :", e);
      }
    }
  };

  // --- SCANNER 12 FRAMES / 20 SECONDES ---
  const startBurstScan = async () => {
    setStatus('scanning');
    const capturedFrames: string[] = [];
    let shots = 0;

    const interval = setInterval(() => {
      if (videoRef.current && shots < 12) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
        // Qualité 0.8 pour la netteté des étiquettes
        capturedFrames.push(canvas.toDataURL('image/jpeg', 0.8));
        shots++;
        setTimeLeft(20 - shots * 1.66);
      } else {
        clearInterval(interval);
        handleProcessing(capturedFrames);
      }
    }, 1666);
  };

  const handleProcessing = async (frames: string[]) => {
    setStatus('processing');
    const results = await geminiService.analyzeVideoBurst(frames);
    const localizedResults = results.map(item => ({
      ...item,
      localisation: selectedLocation
    }));
    onAnalysisComplete(localizedResults);
  };

  return (
    <div className="flex flex-col h-screen bg-[#121212] relative overflow-hidden">
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full object-cover" />
      
      <div className="absolute inset-0 flex flex-col justify-between pt-10 pb-12 bg-gradient-to-b from-black/60 via-transparent to-[#121212]/90">
        <div className="px-6 flex justify-between items-center w-full">
          <button onClick={onBack} className="text-white/70 uppercase tracking-widest text-xs font-bold bg-black/40 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
            ← Annuler
          </button>

          {/* BOUTON FLASH */}
          <button 
            onClick={toggleTorch}
            className={`px-4 py-2 rounded-lg border font-black text-[10px] tracking-widest transition-all ${
              torchOn ? 'bg-yellow-500 border-yellow-400 text-black shadow-[0_0_15px_#eab308]' : 'bg-black/40 border-white/20 text-white/70 backdrop-blur-sm'
            }`}
          >
            {torchOn ? '🔦 FLASH ON' : '🔦 FLASH OFF'}
          </button>
        </div>

        {status === 'idle' && (
          <div className="flex flex-col items-center w-full gap-6">
            <div className="w-full overflow-x-auto no-scrollbar flex gap-3 px-6 snap-x">
              {LOCATIONS.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`snap-center shrink-0 px-5 py-2.5 rounded-full border-2 text-sm font-black tracking-wide transition-all ${
                    selectedLocation === loc.id
                      ? 'bg-[#FF6600] border-[#FF6600] text-black shadow-[0_0_20px_rgba(255,102,0,0.4)]'
                      : 'bg-[#121212]/80 border-white/20 text-white/70 backdrop-blur-md'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <button onClick={startBurstScan} className="w-20 h-20 bg-[#FF6600] rounded-full border-4 border-white shadow-[0_0_30px_rgba(255,102,0,0.5)] flex items-center justify-center transition-transform active:scale-95">
              <div className="w-8 h-8 bg-white rounded-sm" />
            </button>
          </div>
        )}

        {status !== 'idle' && (
          <div className="self-center mb-10 bg-[#FF6600] px-8 py-4 rounded-2xl text-center shadow-[0_0_40px_rgba(255,102,0,0.6)] animate-pulse">
            <p className="text-[#121212] font-black text-xl tracking-wider">
              {status === 'scanning' ? `SCAN VIDÉO : ${Math.ceil(timeLeft)}s` : 'ANALYSE IA...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}