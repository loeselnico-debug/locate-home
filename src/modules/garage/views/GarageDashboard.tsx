import React, { useState } from 'react';
import { Factory, Wrench, ChevronRight, QrCode, Mic, ClipboardCheck, ArrowLeft } from 'lucide-react';
import LiveAssistant from '../components/LiveAssistant';

interface GarageDashboardProps {
  onBack?: () => void;
}

type ViewState = 'home' | 'maintenance_live' | 'mecanique_menu' | 'mecanique_live' | 'prise_poste' | 'fin_poste';

const GarageDashboard: React.FC<GarageDashboardProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<ViewState>('home');

  // --- ROUTAGE VERS LE LIVE ASSISTANT ---
  if (activeMode === 'maintenance_live') {
    return <LiveAssistant mode="maintenance" onExit={() => setActiveMode('home')} />;
  }
  if (activeMode === 'mecanique_live') {
    return <LiveAssistant mode="mecanique" onExit={() => setActiveMode('mecanique_menu')} />;
  }

  // --- VUES TEMPORAIRES POUR LE POC FACOM ---
  if (activeMode === 'prise_poste' || activeMode === 'fin_poste') {
    return (
      <div className="w-full h-full bg-[#050505] flex flex-col items-center justify-center p-6 text-center font-sans">
        <QrCode className="text-[#DC2626] w-20 h-20 mb-6 animate-pulse" />
        <h2 className="text-white font-black text-2xl uppercase tracking-widest mb-2">
          {activeMode === 'prise_poste' ? 'INITIALISATION SERVANTE' : 'CLÔTURE & AUDIT'}
        </h2>
        <p className="text-[#DC2626] text-xs uppercase tracking-widest mb-8 max-w-md">
          {activeMode === 'prise_poste' 
            ? "Scan du QR Code en cours. Vérification de l'inventaire entrant..." 
            : "Contrôle visuel de la servante. Génération du rapport anti-perte (FOD)..."}
        </p>
        <button 
          onClick={() => setActiveMode('mecanique_menu')} 
          className="bg-[#1E1E1E] text-white border border-white/10 px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest active:scale-95 transition-transform"
        >
          Retour au terminal
        </button>
      </div>
    );
  }

  // --- SOUS-MENU OPÉRATEUR MÉCANIQUE ---
  if (activeMode === 'mecanique_menu') {
    return (
      <div className="w-full h-full bg-[#050505] flex flex-col font-sans">
        
        {/* HEADER DYNAMIQUE INTÉGRÉ */}
        <div className="shrink-0 p-6 flex items-start gap-4">
          <button onClick={() => setActiveMode('home')} className="w-12 h-12 bg-black/50 border border-white/10 rounded-xl flex items-center justify-center active:scale-90 transition-transform shrink-0">
            <ArrowLeft className="text-white opacity-80" size={24} />
          </button>
          <div className="mt-1">
            <h1 className="text-white font-black text-xl tracking-widest uppercase leading-none">MÉCANIQUE AUTO & P.L.</h1>
            <p className="text-[#DC2626] text-[10px] font-bold uppercase tracking-widest mt-1.5">Terminal Opérateur</p>
          </div>
        </div>

        {/* GRILLE 3 BOUTONS */}
        <div className="flex-1 flex flex-col md:flex-row pb-[env(safe-area-inset-bottom)]">
          
          <button onClick={() => setActiveMode('prise_poste')} className="flex-1 bg-[#0a0a0a] border-t md:border-t-0 border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center justify-center gap-4 hover:bg-[#111] transition-all group active:scale-[0.98]">
            <div className="w-16 h-16 bg-gray-900/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-gray-800">
              <QrCode size={32} className="text-[#DC2626]" />
            </div>
            <div className="text-center px-4 mt-2">
              <h3 className="text-white font-black text-xl uppercase tracking-widest mb-1">1. Prise de Poste</h3>
              <p className="text-[#DC2626] text-[10px] uppercase tracking-widest">Scan QR Servante</p>
            </div>
          </button>

          <button onClick={() => setActiveMode('mecanique_live')} className="flex-1 bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center justify-center gap-4 hover:bg-[#111] transition-all group active:scale-[0.98] relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            <div className="w-16 h-16 bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
              <Mic size={32} className="text-[#DC2626]" />
            </div>
            <div className="text-center px-4 relative z-10 mt-2">
              <h3 className="text-white font-black text-xl uppercase tracking-widest mb-1 drop-shadow-md">2. Assistant IA</h3>
              <p className="text-[#DC2626] text-[10px] uppercase tracking-widest">Diagnostic Vidéo & Audio</p>
            </div>
          </button>

          <button onClick={() => setActiveMode('fin_poste')} className="flex-1 bg-[#0a0a0a] flex flex-col items-center justify-center gap-4 hover:bg-[#111] transition-all group active:scale-[0.98]">
            <div className="w-16 h-16 bg-gray-900/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-gray-800">
              <ClipboardCheck size={32} className="text-[#DC2626]" />
            </div>
            <div className="text-center px-4 mt-2">
              <h3 className="text-white font-black text-xl uppercase tracking-widest mb-1">3. Fin de Poste</h3>
              <p className="text-[#DC2626] text-[10px] uppercase tracking-widest">Rapport Anti-Perte (FOD)</p>
            </div>
          </button>

        </div>
      </div>
    );
  }

  // --- MENU PRINCIPAL (HOME) ---
  return (
    <div className="w-full h-full bg-[#050505] flex flex-col font-sans">
      
      {/* HEADER DYNAMIQUE INTÉGRÉ */}
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

      {/* GRILLE 2 BOUTONS */}
      <div className="flex-1 flex flex-col md:flex-row pb-[env(safe-area-inset-bottom)]">
        
        {/* 🏭 BOUTON 1 : MAINTENANCE INDUSTRIELLE (80% Rouge / 20% Bleu Ciel) */}
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

        {/* 🚜 BOUTON 2 : MÉCANIQUE AUTO & PL (Rouge / Gris) */}
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