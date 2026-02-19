import { useRef, useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { LOCATIONS } from '../types';

interface ScannerProps {
  onBack: () => void;
  onAnalysisComplete: (items: any[]) => void;
}

export default function Scanner({ onBack, onAnalysisComplete }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'processing'>('idle');
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedLocation, setSelectedLocation] = useState<string>(LOCATIONS[0].id);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; });
  }, []);

  const startBurstScan = async () => {
    setStatus('scanning');
    const capturedFrames: string[] = [];
    let shots = 0;

    const interval = setInterval(() => {
      if (videoRef.current && shots < 6) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
        capturedFrames.push(canvas.toDataURL('image/jpeg', 0.5));
        shots++;
        setTimeLeft(10 - shots * 1.5);
      } else {
        clearInterval(interval);
        handleProcessing(capturedFrames);
      }
    }, 1500);
  };

  const handleProcessing = async (frames: string[]) => {
    setStatus('processing');
    const results = await geminiService.analyzeVideoBurst(frames);
    
    // Injection de la "Localisation de Vérité" dans les résultats
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
        <div className="px-6 w-full">
          <button onClick={onBack} className="text-white/70 uppercase tracking-widest text-xs font-bold bg-black/40 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
            ← Annuler
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