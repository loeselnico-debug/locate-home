import React, { useState } from 'react';
import { ArrowLeft, ScanQrCode, Mic, ClipboardCheck, Power } from 'lucide-react';
import LiveAssistant from '../components/LiveAssistant';

interface GarageDashboardProps {
  onBack?: () => void;
}

type ViewState = 'mecanique_menu' | 'mecanique_live' | 'prise_poste' | 'fin_poste';

const GarageDashboard: React.FC<GarageDashboardProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<ViewState>('mecanique_menu');

  // --- ROUTAGE INTERNE DU MODULE GARAGE ---
  if (activeMode === 'mecanique_live') {
    return <LiveAssistant mode="mecanique" onExit={() => setActiveMode('mecanique_menu')} />;
  }

  // Simulation des habilitations (pour l'exemple d'affichage)
  const operatorHabilitations = ["B1VL", "B2VL", "B1L", "H2S"];

  return (
    <div className="h-[100dvh] bg-[#121212] text-white flex flex-col overflow-hidden font-sans">
      
      {/* 1. SECTION LOGO/HEADER - HAUTEUR STRICTE 12.5vh */}
      <header className="h-[12.5vh] border-b border-white/5 flex items-center justify-between px-6 pt-2 shrink-0">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors active:scale-90 shrink-0">
              <ArrowLeft className="text-white" size={20} />
            </button>
          )}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black uppercase tracking-wider text-white">LOCATE</span>
              <span className="text-4xl font-black uppercase tracking-wider text-[#DC2626]">GARAGE</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-white/60">by Systems</span>
                <span className="text-xs text-white/20">|</span>
                <div className="flex items-center gap-1">
                   {operatorHabilitations.map(hab => (
                     <span key={hab} className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-white/5 text-white/70 border border-white/10">
                       {hab}
                     </span>
                   ))}
                </div>
            </div>
          </div>
        </div>
        
        {/* Rappel statut global du terminal */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/30 border border-white/10">
          <Power className="text-green-500" size={16} />
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/50 uppercase font-black">Statut Terminal</span>
            <span className="text-xs text-white font-bold">CONNECTÉ</span>
          </div>
        </div>
      </header>

      {/* 2. SECTION SOUS-HEADER - HAUTEUR STRICTE 10vh */}
      <section className="h-[10vh] border-b border-white/5 flex items-center justify-between px-10 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black uppercase tracking-widest text-white">
            Mécanique Auto & P.L.
          </h2>
          <span className="text-xs font-bold uppercase tracking-widest text-[#DC2626] mt-1">
            TERMINAL OPÉRATEUR (Module M5)
          </span>
        </div>
        
        {/* Indicateur de phase */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626]">
          <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
          <span className="text-[10px] font-black uppercase">Phase DÉPART ATELIER</span>
        </div>
      </section>

      {/* 3. SECTION CONTENEUR DES BOUTONS - HAUTEUR RESTANTE */}
      <main className="flex-1 px-10 pt-[2vh] pb-[4.5vh] flex flex-col gap-[2vh]">
        
        {/* -- BOUTON 1: PRISE DE POSTE (H = 23vh, Quadrillage Rouge) -- */}
        <button 
          onClick={() => setActiveMode('prise_poste')}
          className="h-[23vh] w-full rounded-2xl border border-[#DC2626]/30 group transition-all duration-300 hover:border-[#DC2626] hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden bg-black/40 shrink-0"
        >
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.06)_1px,transparent_1px)] bg-[size:3vw_3vw]"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 text-center px-6">
            <ScanQrCode className="text-[#DC2626] group-hover:scale-110 transition-transform" size={48} />
            <div className="flex flex-col gap-1.5">
              <h3 className="text-3xl font-black uppercase tracking-widest text-white group-hover:text-white transition-colors">
                Prise de Poste
              </h3>
              <span className="text-xs font-bold uppercase tracking-widest text-[#DC2626] group-hover:text-[#DC2626] transition-colors">
                SCAN QR SERVANTE (Validation FOD)
              </span>
            </div>
          </div>
        </button>

        {/* -- BOUTON 2: ASSISTANT IA (H = 23vh, Quadrillage Blanc) -- */}
        <button 
          onClick={() => setActiveMode('mecanique_live')}
          className="h-[23vh] w-full rounded-2xl border border-white/10 group transition-all duration-300 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden bg-black/40 shrink-0"
        >
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3vw_3vw]"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 text-center px-6">
            <Mic className="text-[#DC2626] group-hover:scale-110 transition-transform" size={48} />
            <div className="flex flex-col gap-1.5">
              <h3 className="text-3xl font-black uppercase tracking-widest text-white group-hover:text-white transition-colors">
                Assistant IA
              </h3>
              <span className="text-xs font-bold uppercase tracking-widest text-[#DC2626] group-hover:text-[#DC2626] transition-colors">
                DIAGNOSTIC VIDÉO & AUDIO (Bidi Gemini)
              </span>
            </div>
          </div>
        </button>

        {/* -- BOUTON 3: FIN DE POSTE (H = 23vh, Quadrillage Rouge) -- */}
        <button 
          onClick={() => setActiveMode('fin_poste')}
          className="h-[23vh] w-full rounded-2xl border border-[#DC2626]/30 group transition-all duration-300 hover:border-[#DC2626] hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden bg-black/40 shrink-0"
        >
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.06)_1px,transparent_1px)] bg-[size:3vw_3vw]"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 text-center px-6">
            <ClipboardCheck className="text-[#DC2626] group-hover:scale-110 transition-transform" size={48} />
            <div className="flex flex-col gap-1.5">
              <h3 className="text-3xl font-black uppercase tracking-widest text-white group-hover:text-white transition-colors">
                Fin de Poste
              </h3>
              <span className="text-xs font-bold uppercase tracking-widest text-[#DC2626] group-hover:text-[#DC2626] transition-colors">
                GÉNÉRATION RAPPORT FOD & TMA
              </span>
            </div>
          </div>
        </button>

      </main>
    </div>
  );
};

export default GarageDashboard;