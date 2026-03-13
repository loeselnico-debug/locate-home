import React, { useState, useRef, useEffect } from 'react';
import { QrCode, ArrowLeft, CheckCircle2, Zap, Loader2, RotateCcw } from 'lucide-react';

interface PriseDePosteProps {
  onBack: () => void;
}

interface ServanteProfile {
  id: string;
  name: string;
  totalDrawers: number;
  foamColor: string;
}

type Step = 'scan_qr' | 'shooting' | 'analyzing' | 'report';

const PriseDePoste: React.FC<PriseDePosteProps> = ({ onBack }) => {
  const [step, setStep] = useState<Step>('scan_qr');
  const [profile, setProfile] = useState<ServanteProfile | null>(null);
  
  const [currentShot, setCurrentShot] = useState<number>(1);
  const [flashOn, setFlashOn] = useState(false);
  const [showFlash, setShowFlash] = useState(false); // NOUVEAU : Effet Flash visuel
  
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (step === 'shooting') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Erreur caméra:", err));
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step]);

  const toggleTorch = async () => {
    if (!videoRef.current?.srcObject) return;
    const track = (videoRef.current.srcObject as MediaStream).getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;
    if (capabilities.torch) {
      try {
        const newState = !flashOn;
        await track.applyConstraints({ advanced: [{ torch: newState }] } as any);
        setFlashOn(newState);
      } catch (err) { 
        console.error("Erreur Torche:", err); 
      }
    }
  };

  const handleSimulateScan = () => {
    setProfile({
      id: 'FACOM-JET-001',
      name: 'Servante Châssis Moteur',
      totalDrawers: 6,
      foamColor: 'Rouge'
    });
    setCapturedImages([]);
    setCurrentShot(1);
    setStep('shooting');
  };

  const handleCapture = () => {
    if (!profile || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // 1. Capture et compression
    if (context && video.videoWidth > 0) {
      const targetWidth = 1280;
      const targetHeight = (video.videoHeight / video.videoWidth) * targetWidth;

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      context.drawImage(video, 0, 0, targetWidth, targetHeight);
      
      const base64Image = canvas.toDataURL('image/jpeg', 0.7);
      setCapturedImages(prev => [...prev, base64Image]);
    }

    // 2. Effet visuel Flash (Feedback)
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 150);

    const maxShots = profile.totalDrawers + 1;

    // 3. Enchaînement
    if (currentShot < maxShots) {
      setCurrentShot(prev => prev + 1);
    } else {
      if (flashOn) toggleTorch();
      setStep('analyzing');
      setTimeout(() => {
        setStep('report');
      }, 3000);
    }
  };

  // NOUVEAU : Fonction pour annuler la dernière photo
  const handleUndo = () => {
    if (capturedImages.length > 0) {
      setCapturedImages(prev => prev.slice(0, -1)); // Retire la dernière image
      setCurrentShot(prev => prev - 1); // Recule le compteur
    }
  };

  // ==========================================
  // VUE 1 : LE SCAN DU QR CODE
  // ==========================================
  if (step === 'scan_qr') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col px-[4vw] pt-[2vh] pb-[4vh] font-sans">
        <div className="h-[10vh] flex items-center shrink-0">
          <button onClick={onBack} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
            <ArrowLeft className="text-white" size={24} />
          </button>
          <div className="ml-4">
            <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.1rem,4vw,1.4rem)] leading-none">Prise de Poste</h2>
            <span className="text-[#D3D3D3] font-bold uppercase tracking-widest text-[10px]">Étape 1 : Identification</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-[60vw] h-[60vw] max-w-[250px] max-h-[250px] border-2 border-[#DC2626] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.15)] mb-8">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-[#DC2626] rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-[#DC2626] rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-[#DC2626] rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-[#DC2626] rounded-br-lg"></div>
            <QrCode size={80} className="text-[#DC2626] opacity-80 animate-pulse" />
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#FF6600] shadow-[0_0_15px_#FF6600]"></div>
          </div>
          
          <h3 className="text-white font-black text-xl uppercase tracking-widest text-center">Scanner la servante</h3>
          <p className="text-gray-400 text-xs text-center mt-2 px-[10vw]">
            Visez le QR Code principal situé sur le flanc ou le plateau de votre servante.
          </p>

          <button 
            onClick={handleSimulateScan}
            className="mt-12 bg-[#DC2626] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          >
            <Zap size={16} /> Simuler Détection
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VUE 2 : LE MITRAILLAGE
  // ==========================================
  if (step === 'shooting' && profile) {
    const isPlateauLibre = currentShot > profile.totalDrawers;

    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden font-sans select-none">
        {/* NOUVEAU : EFFET FLASH BLANC */}
        {showFlash && <div className="absolute inset-0 bg-white z-40 opacity-80 transition-opacity duration-150"></div>}
        
        <canvas ref={canvasRef} className="hidden" />

        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-80" 
        />

        <div className="absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start z-10">
          <div>
            <span className="text-[#DC2626] font-black text-[10px] uppercase tracking-widest block mb-1">
              {profile.id}
            </span>
            <h1 className="text-white font-black text-2xl uppercase tracking-wider drop-shadow-md">
              {isPlateauLibre ? "Plateau Libre" : `Tiroir ${currentShot}/${profile.totalDrawers}`}
            </h1>
          </div>
          <button onClick={() => {
            if (flashOn) toggleTorch();
            setStep('scan_qr');
          }} className="w-10 h-10 bg-black/50 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md active:scale-90">
            <span className="text-white font-bold text-xl leading-none mb-1">×</span>
          </button>
        </div>

        <div className="absolute inset-x-[5vw] top-[20vh] bottom-[25vh] border-2 border-dashed border-white/30 rounded-2xl flex items-center justify-center pointer-events-none z-10">
          <p className="text-white/50 font-bold uppercase tracking-widest text-[10px] bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
            {isPlateauLibre ? "Cadrer le dessus de la servante" : "Aligner le tiroir complet ici"}
          </p>
        </div>

        {/* NOUVEAU : BANDEAU DES MINIATURES EN DIRECT */}
        {capturedImages.length > 0 && (
          <div className="absolute bottom-[22vh] left-0 w-full px-[5vw] flex gap-3 overflow-x-auto no-scrollbar z-20 items-end pb-2">
            {capturedImages.map((img, idx) => (
              <div key={idx} className="relative w-14 h-14 shrink-0 rounded-lg border-2 border-[#DC2626] overflow-hidden shadow-lg animate-in fade-in zoom-in duration-200">
                <img src={img} className="w-full h-full object-cover opacity-90" alt={`Miniature ${idx}`} />
                <div className="absolute bottom-0 left-0 w-full bg-black/80 text-[8px] text-white text-center font-black py-0.5">
                  {idx === profile.totalDrawers ? 'PLAT.' : `T${idx + 1}`}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full h-[20vh] bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between z-10 pb-[env(safe-area-inset-bottom)] px-[8vw]">
          
          {/* BOUTON ANNULER (UNDO) */}
          <div className="w-14 flex justify-start">
            {capturedImages.length > 0 && (
              <button 
                onClick={handleUndo}
                className="w-12 h-12 bg-black/60 border border-white/20 rounded-full flex flex-col items-center justify-center active:scale-90 transition-all text-white/70 hover:text-white"
              >
                <RotateCcw size={18} className="mb-0.5" />
                <span className="text-[6px] font-black uppercase tracking-widest">Refaire</span>
              </button>
            )}
          </div>

          {/* DÉCLENCHEUR */}
          <button 
            onClick={handleCapture}
            className="w-[20vw] h-[20vw] max-w-[80px] max-h-[80px] rounded-full border-[4px] border-white/20 flex items-center justify-center active:scale-90 transition-transform shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          >
            <div className={`w-[85%] h-[85%] rounded-full transition-colors ${isPlateauLibre ? 'bg-[#FF6600]' : 'bg-white'}`}></div>
          </button>

          {/* BOUTON FLASH */}
          <div className="w-14 flex justify-end">
            <button 
              onClick={toggleTorch} 
              className={`w-14 h-14 rounded-2xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 ${
                flashOn 
                  ? 'bg-[#DC2626]/20 border-[#DC2626] shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                  : 'bg-black/40 border-white/10'
              }`}
            >
              <Zap size={24} className={flashOn ? 'text-[#DC2626] fill-[#DC2626]' : 'text-white/50'} />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VUE 3 : EN COURS D'ANALYSE IA
  // ==========================================
  if (step === 'analyzing') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col items-center justify-center px-6 text-center font-sans">
        <Loader2 size={64} className="text-[#DC2626] mb-6 animate-spin" />
        <h2 className="text-white font-black uppercase text-2xl tracking-widest mb-2 animate-pulse">
          Analyse FOD...
        </h2>
        <p className="text-gray-400 text-xs uppercase tracking-widest mt-4">
          Traitement de {capturedImages.length} clichés par le système Locate M5.
        </p>
      </div>
    );
  }

  // ==========================================
  // VUE 4 : LE RAPPORT / SAS DE VALIDATION
  // ==========================================
  return (
    <div className="w-full h-full bg-[#121212] flex flex-col px-[4vw] pt-[2vh] pb-[4vh] font-sans">
      <div className="h-[10vh] flex items-center shrink-0 border-b border-white/5 mb-4">
        <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.1rem,4vw,1.4rem)] leading-none">
          Validation Servante
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
        
        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-4">
          <CheckCircle2 className="text-green-500 shrink-0" size={32} />
          <div>
            <h3 className="text-green-500 font-black uppercase tracking-widest text-sm">Contrôle Réussi</h3>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-1">L'IA n'a détecté aucune empreinte vide.</p>
          </div>
        </div>

        <h4 className="text-[#D3D3D3] font-bold text-[10px] uppercase tracking-widest mt-6 mb-2 border-b border-white/10 pb-2">
          Clichés enregistrés ({capturedImages.length})
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {capturedImages.map((img, idx) => {
            const isPlateau = idx === capturedImages.length - 1;
            return (
              <div key={idx} className="relative aspect-square bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
                <img src={img} alt={`Shot ${idx}`} className="w-full h-full object-cover opacity-80" />
                <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-md p-1.5 text-center border-t border-white/10">
                  <span className="text-[9px] font-black uppercase text-white tracking-widest">
                    {isPlateau ? 'Plateau' : `Tiroir ${idx + 1}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <button 
        onClick={onBack}
        className="mt-6 w-full bg-[#DC2626] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
      >
        Signer & Clôturer
      </button>
    </div>
  );
};

export default PriseDePoste;