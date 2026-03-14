import React, { useState, useRef, useEffect } from 'react';
import { QrCode, ArrowLeft, CheckCircle2, Zap, Loader2, RotateCcw, AlertOctagon } from 'lucide-react';
import { supabase } from '../../../core/security/supabaseClient';

interface FinDePosteProps {
  onBack: () => void;
}

interface ServanteProfile {
  id: string;
  name: string;
  totalDrawers: number;
  foamColor: string;
}

type Step = 'scan_qr' | 'shooting' | 'analyzing' | 'report';
type ShiftStatus = 'CONFORME' | 'DEGRADE';

const ANOMALY_TAGS = [
  "Outil sur chantier",
  "Rangement chaos",
  "Outil cassé / rebut",
  "Outil perdu / volé"
];

// LE CATALOGUE ISSU DE TES PDF (QR CODES)
const SERVANTE_CATALOG: Record<string, ServanteProfile> = {
  "JETM4X-FDW": {
    id: "JETM4X-FDW",
    name: "Servante FACOM JET M4 (8 Tiroirs)",
    totalDrawers: 8,
    foamColor: "Rouge"
  },
  "OPSIAL-MEC": {
    id: "OPSIAL-MEC",
    name: "Servante OPSIAL Standard (6 Tiroirs)",
    totalDrawers: 6,
    foamColor: "Noir"
  }
};

const MOCK_MORNING_BASE64 = "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

const FinDePoste: React.FC<FinDePosteProps> = ({ onBack }) => {
  const [step, setStep] = useState<Step>('scan_qr');
  const [profile, setProfile] = useState<ServanteProfile | null>(null);
  
  const [currentShot, setCurrentShot] = useState<number>(1);
  const [flashOn, setFlashOn] = useState(false);
  const [showFlash, setShowFlash] = useState(false); 
  
  const [eveningImages, setEveningImages] = useState<string[]>([]);
  const [morningImagesMock, setMorningImagesMock] = useState<string[]>([]); 
  
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus>('CONFORME');
  const [justification, setJustification] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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
      } catch (err) { console.error("Erreur Torche:", err); }
    }
  };

  const handleSimulateScan = () => {
    // ON SIMULE LE SCAN DU QR CODE FACOM (8 Tiroirs)
    const scannedCode = "JETM4X-FDW";
    const foundProfile = SERVANTE_CATALOG[scannedCode];

    if (foundProfile) {
      setProfile(foundProfile);
      setEveningImages([]);
      
      const savedMorningShots = localStorage.getItem(`locatem5_morning_${scannedCode}`);
      if (savedMorningShots) {
        setMorningImagesMock(JSON.parse(savedMorningShots));
      } else {
        setMorningImagesMock(Array(foundProfile.totalDrawers + 1).fill(MOCK_MORNING_BASE64));
      }
      
      setCurrentShot(1);
      setShiftStatus('CONFORME');
      setJustification('');
      setSelectedTags([]);
      setStep('shooting');
    } else {
      alert("QR Code inconnu.");
    }
  };

  const handleCapture = () => {
    if (!profile || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context && video.videoWidth > 0) {
      // On force un ratio Paysage standard (16:9)
      const targetWidth = 1280;
      const targetHeight = 720; 

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // On dessine l'image en forçant le remplissage du rectangle 16:9
      // (Cela évite les bandes noires si l'écran du tel a un ratio bizarre)
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // On compresse légèrement plus (0.6) car les images larges pèsent plus lourd dans le PDF
      const base64Image = canvas.toDataURL('image/jpeg', 0.6);
      setEveningImages(prev => [...prev, base64Image]);
    }

    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 150);

    const maxShots = profile.totalDrawers + 1;

    if (currentShot < maxShots) {
      setCurrentShot(prev => prev + 1);
    } else {
      if (flashOn) toggleTorch();
      setStep('analyzing');
      setTimeout(() => setStep('report'), 1500);
    }
  };

  const handleUndo = () => {
    if (eveningImages.length > 0) {
      setEveningImages(prev => prev.slice(0, -1));
      setCurrentShot(prev => prev - 1);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  if (step === 'scan_qr') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col px-[4vw] pt-[2vh] pb-[4vh] font-sans">
        <div className="h-[10vh] flex items-center shrink-0">
          <button onClick={onBack} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
            <ArrowLeft className="text-white" size={24} />
          </button>
          <div className="ml-4">
            <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.1rem,4vw,1.4rem)] leading-none">Fin de Poste</h2>
            <span className="text-[#00E5FF] font-bold uppercase tracking-widest text-[10px]">Étape 1 : Clôture</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-[60vw] h-[60vw] max-w-[250px] max-h-[250px] border-2 border-[#00E5FF] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(0,229,255,0.15)] mb-8">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-[#00E5FF] rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-[#00E5FF] rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-[#00E5FF] rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-[#00E5FF] rounded-br-lg"></div>
            <QrCode size={80} className="text-[#00E5FF] opacity-80 animate-pulse" />
          </div>
          <h3 className="text-white font-black text-xl uppercase tracking-widest text-center">Clôturer la servante</h3>
          <p className="text-gray-400 text-xs text-center mt-2 px-[10vw]">Scannez pour valider l'état final de l'outillage.</p>
          <button onClick={handleSimulateScan} className="mt-12 bg-[#00E5FF] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
            <Zap size={16} /> Simuler Détection
          </button>
        </div>
      </div>
    );
  }

  if (step === 'shooting' && profile) {
    const isPlateauLibre = currentShot > profile.totalDrawers;
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden font-sans select-none">
        {showFlash && <div className="absolute inset-0 bg-white z-40 opacity-80 transition-opacity duration-150"></div>}
        <canvas ref={canvasRef} className="hidden" />
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />
        
        <div className="absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start z-10">
          <div>
            <span className="text-[#00E5FF] font-black text-[10px] uppercase tracking-widest block mb-1">{profile.id}</span>
            <h1 className="text-white font-black text-2xl uppercase tracking-wider drop-shadow-md">
              {isPlateauLibre ? "Plateau Libre" : `Tiroir ${currentShot}/${profile.totalDrawers}`}
            </h1>
          </div>
          <button onClick={() => { if (flashOn) toggleTorch(); setStep('scan_qr'); }} className="w-10 h-10 bg-black/50 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md active:scale-90">
            <span className="text-white font-bold text-xl leading-none mb-1">×</span>
          </button>
        </div>

        <div className="absolute inset-x-[5vw] top-[20vh] bottom-[25vh] border-2 border-dashed border-[#00E5FF]/40 rounded-2xl flex items-center justify-center pointer-events-none z-10">
          <p className="text-[#00E5FF]/70 font-bold uppercase tracking-widest text-[10px] bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-sm">
            Cadrage de Clôture
          </p>
        </div>

        {eveningImages.length > 0 && (
          <div className="absolute bottom-[22vh] left-0 w-full px-[5vw] flex gap-3 overflow-x-auto no-scrollbar z-20 items-end pb-2">
            {eveningImages.map((img, idx) => (
              <div key={idx} className="relative w-14 h-14 shrink-0 rounded-lg border-2 border-[#00E5FF] overflow-hidden shadow-lg animate-in fade-in zoom-in duration-200">
                <img src={img} className="w-full h-full object-cover opacity-90" alt={`Miniature ${idx}`} />
                <div className="absolute bottom-0 left-0 w-full bg-black/80 text-[8px] text-[#00E5FF] text-center font-black py-0.5">
                  {idx === profile.totalDrawers ? 'PLAT.' : `T${idx + 1}`}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full h-[20vh] bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between z-10 pb-[env(safe-area-inset-bottom)] px-[8vw]">
          <div className="w-14 flex justify-start">
            {eveningImages.length > 0 && (
              <button onClick={handleUndo} className="w-12 h-12 bg-black/60 border border-white/20 rounded-full flex flex-col items-center justify-center active:scale-90 transition-all text-white/70 hover:text-white">
                <RotateCcw size={18} className="mb-0.5" />
                <span className="text-[6px] font-black uppercase tracking-widest">Refaire</span>
              </button>
            )}
          </div>
          <button onClick={handleCapture} className="w-[20vw] h-[20vw] max-w-[80px] max-h-[80px] rounded-full border-[4px] border-white/20 flex items-center justify-center active:scale-90 transition-transform shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className={`w-[85%] h-[85%] rounded-full transition-colors ${isPlateauLibre ? 'bg-[#FF6600]' : 'bg-[#00E5FF]'}`}></div>
          </button>
          <div className="w-14 flex justify-end">
            <button onClick={toggleTorch} className={`w-14 h-14 rounded-2xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 ${flashOn ? 'bg-[#00E5FF]/20 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'bg-black/40 border-white/10'}`}>
              <Zap size={24} className={flashOn ? 'text-[#00E5FF] fill-[#00E5FF]' : 'text-white/50'} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'analyzing') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col items-center justify-center px-6 text-center font-sans">
        <Loader2 size={64} className="text-[#00E5FF] mb-6 animate-spin" />
        <h2 className="text-white font-black uppercase text-2xl tracking-widest mb-2 animate-pulse">Comparaison...</h2>
        <p className="text-gray-400 text-xs uppercase tracking-widest mt-4">Traitement croisé Avant/Après en cours.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#121212] flex flex-col px-[4vw] pt-[2vh] pb-[4vh] font-sans">
      <div className="h-[10vh] flex items-center shrink-0 border-b border-white/5 mb-4">
        <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.1rem,4vw,1.4rem)] leading-none">Clôture Servante</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 pb-[2vh]">
        <div className="flex gap-3">
          <button onClick={() => { setShiftStatus('CONFORME'); setSelectedTags([]); setJustification(''); }} className={`flex-1 py-4 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all ${shiftStatus === 'CONFORME' ? 'bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-[#1A1A1A] border-white/5 text-gray-500'}`}>
            <CheckCircle2 size={24} />
            <span className="font-black text-[10px] uppercase tracking-widest">Conforme</span>
          </button>
          <button onClick={() => setShiftStatus('DEGRADE')} className={`flex-1 py-4 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all ${shiftStatus === 'DEGRADE' ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-[#1A1A1A] border-white/5 text-gray-500'}`}>
            <AlertOctagon size={24} />
            <span className="font-black text-[10px] uppercase tracking-widest">Incomplet</span>
          </button>
        </div>

        {shiftStatus === 'DEGRADE' && (
          <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
            <label className="text-red-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 mb-3"><AlertOctagon size={14} /> Déclaration d'anomalie</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {ANOMALY_TAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${selectedTags.includes(tag) ? 'bg-red-500 text-white border-red-500' : 'bg-black/50 text-red-300/60 border-red-500/20'}`}>{tag}</button>
              ))}
            </div>
            <textarea value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Précisions..." className="w-full bg-black/50 border border-red-500/20 rounded-lg p-3 text-white text-sm outline-none focus:border-red-500 min-h-[60px] resize-none" />
          </div>
        )}

        <h4 className="text-[#D3D3D3] font-bold text-[10px] uppercase tracking-widest pt-2 border-b border-white/10 pb-2">Clichés de Fin de Poste</h4>
        <div className="grid grid-cols-2 gap-3">
          {eveningImages.map((img, idx) => (
            <div key={idx} className="relative aspect-square bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
              <img src={img} alt={`Shot ${idx}`} className="w-full h-full object-cover opacity-80" />
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={async () => {
          if (shiftStatus === 'DEGRADE' && selectedTags.length === 0 && justification.trim() === '') { alert("Saisir un motif."); return; }
          setIsGenerating(true);
          try {
            // TRANSMISSION SATELLITE À LA TOUR DE CONTRÔLE
            const { error: dbError } = await supabase.from('servantes_status').upsert({
              id: profile?.id || 'FACOM-JET-001',
              technician_id: 'TECH-01',
              technician_name: 'Alexandre (TECH-01)',
              status: shiftStatus,
              tags: selectedTags,
              details: justification,
              updated_at: new Date().toISOString()
            });

            if (dbError) {
              console.warn("Erreur de transmission :", dbError.message);
            }

            const { pdf } = await import('@react-pdf/renderer');
            const { FinDePosteReport } = await import('../components/FinDePosteReport');
            const reportData = {
              profileId: profile?.id || 'INCONNU', profileName: profile?.name || 'Servante',
              timestamp: new Date().toLocaleString('fr-FR'),
              status: shiftStatus, tags: selectedTags, justification: justification,
              morningImages: morningImagesMock, eveningImages: eveningImages,
              totalDrawers: profile?.totalDrawers || 6
            };
            const blob = await pdf(<FinDePosteReport data={reportData} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url; link.download = `Cloture_FOD_${profile?.id}_${Date.now()}.pdf`; link.click(); URL.revokeObjectURL(url);
            onBack();
          } catch (error) { console.error("Erreur PDF:", error); setIsGenerating(false); }
        }}
        disabled={isGenerating}
        className={`mt-4 w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all flex items-center justify-center gap-3 ${shiftStatus === 'CONFORME' ? 'bg-green-600 text-white' : 'bg-[#DC2626] text-white'} ${isGenerating ? 'opacity-70 grayscale' : ''}`}
      >
        {isGenerating && <Loader2 size={18} className="animate-spin" />}
        {isGenerating ? 'Archivage en cours...' : 'Signer & Clôturer'}
      </button>
    </div>
  );
};

export default FinDePoste;