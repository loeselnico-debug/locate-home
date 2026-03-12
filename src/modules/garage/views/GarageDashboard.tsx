import React, { useState } from 'react';
import { ArrowLeft, ScanQrCode, Mic, ClipboardCheck, Power, Factory, Wrench, ChevronRight } from 'lucide-react';
import LiveAssistant from '../components/LiveAssistant';

interface GarageDashboardProps {
  onBack?: () => void;
}

type ViewState = 'home' | 'maintenance_live' | 'mecanique_menu' | 'mecanique_live' | 'prise_poste' | 'fin_poste';

const GarageDashboard: React.FC<GarageDashboardProps> = ({ onBack }) => {
  // RETOUR À LA NORMALE : On démarre sur l'aiguilleur principal
  const [activeMode, setActiveMode] = useState<ViewState>('home');

  // --- ROUTAGE VERS LE LIVE ASSISTANT ---
  if (activeMode === 'maintenance_live') {
    return <LiveAssistant mode="maintenance" onExit={() => setActiveMode('home')} />;
  }
  if (activeMode === 'mecanique_live') {
    return <LiveAssistant mode="mecanique" onExit={() => setActiveMode('mecanique_menu')} />;
  }

  // =======================================================================
  // VUE 1 : SOUS-MENU MÉCANIQUE (Celui qu'on a designé au millimètre)
  // =======================================================================
  if (activeMode === 'mecanique_menu') {
    return (
      <div className="h-full bg-[#121212] text-white flex flex-col overflow-hidden font-sans">
        {/* SOUS-HEADER STRICT - 10vh */}
        <section className="h-[10vh] border-b border-white/5 flex items-center justify-between px-[4vw] shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveMode('home')} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors active:scale-90 shrink-0">
              <ArrowLeft className="text-white" size={24} />
            </button>
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

        {/* CONTENEUR DES 3 BOUTONS (77.5vh restants) */}
        <main className="flex-1 px-[4vw] pb-[4.5vh] flex flex-col gap-[2vh]">
          {/* BOUTON 1: PRISE DE POSTE */}
          <button 
            onClick={() => setActiveMode('prise_poste')}
            className="h-[23vh] w-full rounded-2xl border border-[#DC2626]/30 group transition-all duration-300 hover:border-[#DC2626] hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] active:scale-[0.98] relative overflow-hidden bg-black/40 shrink-0 flex flex-col items-center justify-center gap-4 text-center px-6"
          >
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.06)_1px,transparent_1px)] bg-[size:3vw_3vw]"></div>
            <ScanQrCode className="text-[#DC2626] group-hover:scale-110 transition-transform relative z-10" size={48} />
            <div className="flex flex-col gap-1.5 relative z-10">
              <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none">Prise de Poste</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626]">SCAN QR SERVANTE</span>
            </div>
          </button>

          {/* BOUTON 2: ASSISTANT IA */}
          <button 
            onClick={() => setActiveMode('mecanique_live')}
            className="h-[23vh] w-full rounded-2xl border border-white/10 group transition-all duration-300 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-[0.98] relative overflow-hidden bg-black/40 shrink-0 flex flex-col items-center justify-center gap-4 text-center px-6"
          >
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3vw_3vw]"></div>
            <Mic className="text-[#DC2626] group-hover:scale-110 transition-transform relative z-10" size={48} />
            <div className="flex flex-col gap-1.5 relative z-10">
              <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none">Assistant IA</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626]">DIAGNOSTIC VIDÉO & AUDIO</span>
            </div>
          </button>

          {/* BOUTON 3: FIN DE POSTE */}
          <button 
            onClick={() => setActiveMode('fin_poste')}
            className="h-[23vh] w-full rounded-2xl border border-[#DC2626]/30 group transition-all duration-300 hover:border-[#DC2626] hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] active:scale-[0.98] relative overflow-hidden bg-black/40 shrink-0 flex flex-col items-center justify-center gap-4 text-center px-6"
          >
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.06)_1px,transparent_1px)] bg-[size:3vw_3vw]"></div>
            <ClipboardCheck className="text-[#DC2626] group-hover:scale-110 transition-transform relative z-10" size={48} />
            <div className="flex flex-col gap-1.5 relative z-10">
              <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none">Fin de Poste</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626]">RAPPORT ANTI-PERTE (FOD)</span>
            </div>
          </button>
        </main>
      </div>
    );
  }

  // =======================================================================
  // VUE 0 : MENU PRINCIPAL (AIGUILLEUR) - Celui que j'avais écrasé
  // =======================================================================
  return (
    <div className="w-full h-full bg-[#050505] flex flex-col font-sans">
      
      <div className="shrink-0 p-6 flex items-start gap-4">
        {onBack && (
          <button onClick={onBack} className="w-12 h-12 bg-black/50 border border-white/10 rounded-xl flex items-center justify-center active:scale-90 transition-transform shrink-0">
            <ArrowLeft className="text-white opacity-80" size={24} />
          </button>
        )}
        <div className="mt-1">
          <h1 className="text-white font-black text-xl tracking-widest uppercase leading-none">Locate Garage</h1>
          <p className="text-[#DC2626] text-[10px] font-bold uppercase tracking-widest mt-1.5">Terminal de Diagnostic IA</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row pb-[env(safe-area-inset-bottom)]">
        
        {/* BOUTON 1 : MAINTENANCE INDUSTRIELLE */}
        <button
          onClick={() => setActiveMode('maintenance_live')}
          className="flex-1 group relative overflow-hidden bg-[#080808] hover:bg-[#0c0c0c] transition-all duration-500 border-t md:border-t-0 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center items-center p-6 active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#DC2626]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Factory size={64} className="text-white/60 mb-6 group-hover:text-[#00E5FF] group-hover:scale-110 transition-all duration-500" />
          <h2 className="text-white font-black text-[clamp(1.5rem,5vw,2rem)] uppercase tracking-tighter mb-2 text-center leading-tight">
            Maintenance<br/>Industrielle
          </h2>
          <p className="text-[#DC2626] text-[10px] uppercase tracking-widest text-center mb-8">
            Usines • Stations • Automatisme
          </p>
          <div className="flex items-center gap-2 text-[#DC2626] font-black text-[10px] uppercase tracking-[0.2em] bg-red-950/30 px-5 py-2.5 rounded-full border border-[#DC2626]/20 group-hover:border-[#00E5FF]/40 transition-colors">
            Système OSA/CBM <ChevronRight size={14} className="text-[#00E5FF]" />
          </div>
        </button>

        {/* BOUTON 2 : MÉCANIQUE AUTO & P.L. */}
        <button
          onClick={() => setActiveMode('mecanique_menu')}
          className="flex-1 group relative overflow-hidden bg-[#050505] hover:bg-[#0a0a0a] transition-all duration-500 flex flex-col justify-center items-center p-6 active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#DC2626]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Wrench size={64} className="text-white/60 mb-6 group-hover:text-[#DC2626] group-hover:scale-110 transition-all duration-500" />
          <h2 className="text-white font-black text-[clamp(1.5rem,5vw,2rem)] uppercase tracking-tighter mb-2 text-center leading-tight">
            Mécanique<br/>Auto & P.L.
          </h2>
          <p className="text-[#DC2626] text-[10px] uppercase tracking-widest text-center mb-8">
            Véhicules Légers • Poids Lourds
          </p>
          <div className="flex items-center gap-2 text-[#DC2626] font-black text-[10px] uppercase tracking-[0.2em] bg-red-950/30 px-5 py-2.5 rounded-full border border-[#DC2626]/20">
            Diagnostic OBD2 <ChevronRight size={14} />
          </div>
        </button>

      </div>
    </div>
  );
};

export default GarageDashboard;