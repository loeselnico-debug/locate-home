import { useRef, useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { LOCATIONS } from '../types';

interface ScannerProps {
  onBack: () => void;
  onAnalysisComplete: (items: any[]) => void;
}

export default function Scanner({ onBack, onAnalysisComplete }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  
  const [status, setStatus] = useState<'idle' | 'scanning' | 'processing'>('idle');
  const [timeLeft, setTimeLeft] = useState(20);
  const [torchOn, setTorchOn] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>(LOCATIONS[0].id);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          trackRef.current = stream.getVideoTracks()[0];
        }
      } catch (err) { console.warn("Caméra non accessible"); }
    };
    startCamera();
    return () => trackRef.current?.stop();
  }, []);

  // Utilisation de torchOn pour le linter
  const toggleTorch = async () => {
    if (trackRef.current) {
      try {
        const capabilities = trackRef.current.getCapabilities() as any;
        if (capabilities.torch) {
          const newState = !torchOn;
          await trackRef.current.applyConstraints({ advanced: [{ torch: newState }] } as any);
          setTorchOn(newState);
        } else {
          alert("Flash non supporté.");
        }
      } catch (e) { console.error(e); }
    }
  };

  const takeSinglePhoto = async () => {
    if (!videoRef.current) return;
    setStatus('processing');
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    handleProcessing([canvas.toDataURL('image/jpeg', 0.9)]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('processing');
    const reader = new FileReader();
    reader.onload = (event) => handleProcessing([event.target?.result as string]);
    reader.readAsDataURL(file);
  };

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
        capturedFrames.push(canvas.toDataURL('image/jpeg', 0.7));
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
    try {
      const results = await geminiService.analyzeVideoBurst(frames);
      onAnalysisComplete(results.map(item => ({ ...item, localisation: selectedLocation })));
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#121212] relative overflow-hidden">
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full object-cover opacity-50" />
      
      <div className="absolute inset-0 flex flex-col justify-between pt-10 pb-12 bg-gradient-to-b from-black/60 via-transparent to-[#121212]">
        <div className="px-6 flex justify-between items-center w-full">
          <button onClick={onBack} className="text-white/70 uppercase tracking-widest text-[10px] font-bold bg-black/40 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
            ← Annuler
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={toggleTorch}
              className={`px-3 py-2 rounded-lg border text-[10px] font-bold transition-all ${
                torchOn ? 'bg-yellow-500 border-yellow-400 text-black' : 'bg-black/40 border-white/10 text-white/50'
              }`}
            >
              {torchOn ? 'FLASH ON' : 'FLASH OFF'}
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600/40 text-white text-[10px] font-bold px-3 py-2 rounded-lg border border-blue-400/30">
              📁 IMPORT
            </button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,video/*" className="hidden" />
        </div>

        {status === 'idle' && (
          <div className="flex flex-col items-center w-full gap-6">
            <div className="w-full overflow-x-auto no-scrollbar flex gap-3 px-6 snap-x">
              {LOCATIONS.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`snap-center shrink-0 px-4 py-2 rounded-full border-2 text-[10px] font-black tracking-widest transition-all ${
                    selectedLocation === loc.id ? 'bg-[#FF6600] border-[#FF6600] text-black shadow-[0_0_15px_#FF6600]' : 'bg-black/60 border-white/10 text-white/50'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-10 mb-4">
              {/* BOUTON PHOTO UNIQUE */}
              <button onClick={takeSinglePhoto} className="w-16 h-16 bg-white/5 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md active:scale-90 transition-transform">
                <img src="/icon-photo.png" alt="Photo" className="w-10 h-10 object-contain" />
              </button>

              {/* BOUTON VIDEO BURST */}
              <button onClick={startBurstScan} className="w-24 h-24 bg-[#FF6600] rounded-full border-4 border-white shadow-[0_0_40px_rgba(255,102,0,0.5)] flex items-center justify-center active:scale-95 transition-transform">
                <img src="/icon-video.png" alt="Video" className="w-14 h-14 object-contain" />
              </button>
            </div>
          </div>
        )}

        {status !== 'idle' && (
          <div className="self-center mb-10 bg-[#FF6600] px-8 py-4 rounded-2xl text-center shadow-[0_0_40px_#FF6600] animate-pulse">
            <p className="text-[#121212] font-black text-xl tracking-wider uppercase">
              {status === 'scanning' ? `SCAN : ${Math.ceil(timeLeft)}s` : 'ANALYSE DATA...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}