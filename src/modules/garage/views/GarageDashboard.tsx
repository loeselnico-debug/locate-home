import React, { useState } from 'react';
import { ArrowLeft, ScanQrCode, Mic, ClipboardCheck, Power } from 'lucide-react';
import LiveAssistant from '../components/LiveAssistant';

interface GarageDashboardProps {
  onBack?: () => void;
}

type ViewState = 'mecanique_menu' | 'mecanique_live' | 'prise_poste' | 'fin_poste';

const GarageDashboard: React.FC<GarageDashboardProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<ViewState>('mecanique_menu');

  if (activeMode === 'mecanique_live') {
    return <LiveAssistant mode="mecanique" onExit={() => setActiveMode('mecanique_menu')} />;
  }

  return (
    <div className="h-full bg-[#121212] text-white flex flex-col overflow-hidden font-sans">
      
      {/* SOUS-HEADER STRICT - 10vh */}
      <section className="h-[10vh] border-b border-white/5 flex items-center justify-between px-[4vw] shrink-0">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors active:scale-90 shrink-0">
              <ArrowLeft className="text-white" size={24} />
            </button>
          )}
          <div className="flex flex-col">
            <h2 className="text-[clamp(1.2rem,4vw,1.5rem)] font-black uppercase tracking-widest text-white leading-none">
              Mécanique Auto & P.L.
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626] mt-1">
              Terminal Opérateur
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 shrink-0">
          <Power className="text-green-500" size={14} />
          <span className="text-[10px] font-black uppercase text-white">Connecté</span>
        </div>
      </section>

      {/* CONTENEUR DES BOUTONS - HAUTEUR RESTANTE (Exactement 77.5vh) */}
      <main className="flex-1 px-[4vw] pt-[2vh] pb-[4.5vh] flex flex-col gap-[2vh]">
        
        {/* BOUTON 1: PRISE DE POSTE (23vh) */}
        <button 
          onClick={() => setActiveMode('prise_poste')}
          className="h-[23vh] w-full rounded-2xl border border-[#DC2626]/30 group transition-all duration-300 hover:border-[#DC2626] hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] active:scale-[0.98] relative overflow-hidden bg-black/40 shrink-0 flex flex-col items-center justify-center gap-4 text-center px-6"
        >
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.06)_1px,transparent_1px)] bg-[size:3vw_3vw]"></div>
          <ScanQrCode className="text-[#DC2626] group-hover:scale-110 transition-transform relative z-10" size={48} />
          <div className="flex flex-col gap-1.5 relative z-10">
            <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none">
              Prise de Poste
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626]">
              SCAN QR SERVANTE
            </span>
          </div>
        </button>

        {/* BOUTON 2: ASSISTANT IA (23vh) */}
        <button 
          onClick={() => setActiveMode('mecanique_live')}
          className="h-[23vh] w-full rounded-2xl border border-white/10 group transition-all duration-300 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-[0.98] relative overflow-hidden bg-black/40 shrink-0 flex flex-col items-center justify-center gap-4 text-center px-6"
        >
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3vw_3vw]"></div>
          <Mic className="text-[#DC2626] group-hover:scale-110 transition-transform relative z-10" size={48} />
          <div className="flex flex-col gap-1.5 relative z-10">
            <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none">
              Assistant IA
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626]">
              DIAGNOSTIC VIDÉO & AUDIO
            </span>
          </div>
        </button>

        {/* BOUTON 3: FIN DE POSTE (23vh) */}
        <button 
          onClick={() => setActiveMode('fin_poste')}
          className="h-[23vh] w-full rounded-2xl border border-[#DC2626]/30 group transition-all duration-300 hover:border-[#DC2626] hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] active:scale-[0.98] relative overflow-hidden bg-black/40 shrink-0 flex flex-col items-center justify-center gap-4 text-center px-6"
        >
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.06)_1px,transparent_1px)] bg-[size:3vw_3vw]"></div>
          <ClipboardCheck className="text-[#DC2626] group-hover:scale-110 transition-transform relative z-10" size={48} />
          <div className="flex flex-col gap-1.5 relative z-10">
            <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none">
              Fin de Poste
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626]">
              RAPPORT ANTI-PERTE (FOD)
            </span>
          </div>
        </button>

      </main>
    </div>
  );
};

export default GarageDashboard;