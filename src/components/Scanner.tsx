import { useRef, useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';

interface ScannerProps {
  onBack: () => void;
  onAnalysisComplete: (items: any[]) => void;
}

export default function Scanner({ onBack, onAnalysisComplete }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'processing'>('idle');
  const [timeLeft, setTimeLeft] = useState(10);

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
    onAnalysisComplete(results);
  };

  return (
    <div className="flex flex-col h-screen bg-black relative">
      <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-between p-10 bg-gradient-to-b from-black/40 via-transparent to-black/60">
        <button onClick={onBack} className="self-start text-white/50 uppercase tracking-widest text-xs">← Annuler</button>

        {status === 'idle' && (
          <button onClick={startBurstScan} className="w-20 h-20 bg-orange-500 rounded-full border-4 border-white shadow-[0_0_30px_rgba(255,107,0,0.5)] flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-sm" />
          </button>
        )}

        {status !== 'idle' && (
          <div className="bg-orange-600 px-8 py-4 rounded-2xl text-center shadow-2xl animate-pulse">
            <p className="text-white font-black text-xl">
              {status === 'scanning' ? `SCAN VIDÉO : ${Math.ceil(timeLeft)}s` : 'ANALYSE IA...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}