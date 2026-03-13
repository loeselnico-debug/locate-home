import React, { useState, useRef, useEffect } from 'react';
import { QrCode, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';

interface PriseDePosteProps {
  onBack: () => void;
}

// 🧬 PROFIL TYPE D'UNE SERVANTE (Ce que le QR Code est censé télécharger)
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
  
  // Compteur de tir (ex: Tiroir 1 sur 6)
  const [currentShot, setCurrentShot] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Démarrage de la caméra lors du passage à l'étape 'shooting'
  useEffect(() => {
    if (step === 'shooting') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Erreur d'accès à la caméra", err));
    }
    
    // Nettoyage de la caméra si on quitte l'étape
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step]);

  // SIMULATION DU SCAN QR
  const handleSimulateScan = () => {
    // Le QR code télécharge instantanément ces données :
    setProfile({
      id: 'FACOM-JET-001',
      name: 'Servante Châssis Moteur',
      totalDrawers: 6, // 6 tiroirs moussés
      foamColor: 'Rouge'
    });
    setStep('shooting');
  };

  // LE DÉCLENCHEUR DE LA RAFALE
  const handleCapture = () => {
    if (!profile) return;
    
    // Le nombre total de photos = Tiroirs + 1 (Le plateau libre)
    const maxShots = profile.totalDrawers + 1;

    // TODO: Ici on fera le canvas.toDataURL() pour sauvegarder la photo en mémoire

    if (currentShot < maxShots) {
      setCurrentShot(prev => prev + 1); // On passe au tiroir suivant instantanément
    } else {
      setStep('analyzing'); // Fini, on passe à l'analyse
    }
  };

  // ==========================================
  // VUE 1 : LE SCAN DU QR CODE (Handshake)
  // ==========================================
  if (step === 'scan_qr') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col px-[4vw] pt-[2vh] pb-[4vh] font-sans">
        {/* Header simple */}
        <div className="h-[10vh] flex items-center shrink-0">
          <button onClick={onBack} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
            <ArrowLeft className="text-white" size={24} />
          </button>
          <div className="ml-4">
            <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.1rem,4vw,1.4rem)] leading-none">Prise de Poste</h2>
            <span className="text-[#DC2626] font-bold uppercase tracking-widest text-[10px]">Étape 1 : Identification</span>
          </div>
        </div>

        {/* Le Viseur QR */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-[60vw] h-[60vw] max-w-[250px] max-h-[250px] border-2 border-[#DC2626] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.15)] mb-8">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-[#DC2626] rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-[#DC2626] rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-[#DC2626] rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-[#DC2626] rounded-br-lg"></div>
            
            <QrCode size={80} className="text-[#DC2626] opacity-80 animate-pulse" />
            
            {/* Ligne laser */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#FF6600] shadow-[0_0_15px_#FF6600]"></div>
          </div>
          
          <h3 className="text-white font-black text-xl uppercase tracking-widest text-center">Scanner la servante</h3>
          <p className="text-gray-400 text-xs text-center mt-2 px-[10vw]">
            Visez le QR Code principal situé sur le flanc ou le plateau de votre servante.
          </p>

          {/* BOUTON TEMPORAIRE POUR SIMULER LE SCAN */}
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
  // VUE 2 : LE MITRAILLAGE (Appareil Photo)
  // ==========================================
  if (step === 'shooting' && profile) {
    const isPlateauLibre = currentShot > profile.totalDrawers;

    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden font-sans select-none">
        {/* Flux Caméra en plein écran */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-80" 
        />

        {/* HUD Tête Haute */}
        <div className="absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start z-10">
          <div>
            <span className="text-[#DC2626] font-black text-[10px] uppercase tracking-widest block mb-1">
              {profile.id}
            </span>
            <h1 className="text-white font-black text-2xl uppercase tracking-wider drop-shadow-md">
              {isPlateauLibre ? "Plateau Libre" : `Tiroir ${currentShot}/${profile.totalDrawers}`}
            </h1>
          </div>
          <button onClick={() => setStep('scan_qr')} className="w-10 h-10 bg-black/50 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md active:scale-90">
            <span className="text-white font-bold text-xl leading-none mb-1">×</span>
          </button>
        </div>

        {/* Cadre Fantôme / Guide visuel */}
        <div className="absolute inset-x-[5vw] top-[20vh] bottom-[25vh] border-2 border-dashed border-white/30 rounded-2xl flex items-center justify-center pointer-events-none z-10">
          <p className="text-white/50 font-bold uppercase tracking-widest text-[10px] bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
            {isPlateauLibre ? "Cadrer le dessus de la servante" : "Aligner le tiroir complet ici"}
          </p>
        </div>

        {/* Zone de déclenchement (Bottom) */}
        <div className="absolute bottom-0 left-0 w-full h-[20vh] bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-center z-10 pb-[env(safe-area-inset-bottom)]">
          <button 
            onClick={handleCapture}
            className="w-[20vw] h-[20vw] max-w-[80px] max-h-[80px] rounded-full border-[4px] border-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <div className={`w-[85%] h-[85%] rounded-full transition-colors ${isPlateauLibre ? 'bg-[#FF6600]' : 'bg-white'}`}></div>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VUE 3 & 4 : ANALYSE ET RAPPORT (Placeholder)
  // ==========================================
  return (
    <div className="w-full h-full bg-[#121212] flex flex-col items-center justify-center px-6 text-center">
      <CheckCircle2 size={64} className="text-green-500 mb-6" />
      <h2 className="text-white font-black uppercase text-2xl tracking-widest mb-2">Acquisition Terminée</h2>
      <p className="text-gray-400 text-sm">Les 7 clichés sont prêts pour l'analyse IA.</p>
      
      <button 
        onClick={onBack}
        className="mt-12 w-full bg-[#1A1A1A] border border-white/10 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95"
      >
        Retour au menu
      </button>
    </div>
  );
};

export default PriseDePoste;