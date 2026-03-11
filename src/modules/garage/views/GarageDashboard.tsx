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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center font-sans">
        <QrCode className="text-[#FF6600] w-20 h-20 mb-6 animate-pulse" />
        <h2 className="text-white font-black text-2xl uppercase tracking-widest mb-2">
          {activeMode === 'prise_poste' ? 'INITIALISATION SERVANTE' : 'CLÔTURE & AUDIT'}
        </h2>
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-8 max-w-md">
          {activeMode === 'prise_poste' 
            ? "Scan du QR Code FACOM en cours. Vérification de l'inventaire entrant..." 
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
      <div className="min-h-screen bg-[#050505] flex flex-col font-sans p-[4vw]">
        {/* Header Sous-menu */}
        <div className="flex items-center gap-4 mb-8 mt-2">
          <button onClick={() => setActiveMode('home')} className="w-12 h-12 bg-black/50 border border-white/10 rounded-xl flex items-center justify-center active:scale-90 transition-transform">
            <ArrowLeft className="text-white" size={24} />
          </button>
          <div>
            <h1 className="text-white font-black text-xl tracking-widest uppercase">MÉCANIQUE AUTO & P.L.</h1>
            <p className="text-[#FF6600] text-[10px] font-bold uppercase tracking-widest mt-1">Terminal Opérateur</p>
          </div>
        </div>

        {/* Grille d'actions Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 mb-8">
          
          {/* ÉTAPE 1 : PRISE DE POSTE */}
          <button onClick={() => setActiveMode('prise_poste')} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 hover:border-[#FF6600]/50 transition-all group active:scale-95">
            <div className="w-20 h-20 bg-[#FF6600]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <QrCode size={40} className="text-[#FF6600]" />
            </div>
            <div className="text-center">
              <h3 className="text-white font-black text-xl uppercase tracking-widest mb-2">1. Prise de Poste</h3>
              <p className="text-gray-500 text-xs">Scan Servante FACOM<br/>Inventaire Entrant</p>
            </div>
          </button>

          {/* ÉTAPE 2 : ASSISTANT IA (Existant) */}
          <button onClick={() => setActiveMode('mecanique_live')} className="bg-[#1A0505] border border-red-900/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 hover:border-red-500/50 transition-all group active:scale-95 relative overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.1)]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative z-10 border border-red-500/30">
              <Mic size={40} className="text-red-500" />
            </div>
            <div className="text-center relative z-10">
              <h3 className="text-red-500 font-black text-xl uppercase tracking-widest mb-2 drop-shadow-md">2. Assistant IA</h3>
              <p className="text-gray-400 text-xs">Diagnostic Live<br/>Vidéo & Audio</p>
            </div>
          </button>

          {/* ÉTAPE 3 : FIN DE POSTE */}
          <button onClick={() => setActiveMode('fin_poste')} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 hover:border-green-500/50 transition-all group active:scale-95">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <ClipboardCheck size={40} className="text-green-500" />
            </div>
            <div className="text-center">
              <h3 className="text-white font-black text-xl uppercase tracking-widest mb-2">3. Fin de Poste</h3>
              <p className="text-gray-500 text-xs">Contrôle Servante<br/>Rapport PDF Sécurisé</p>
            </div>
          </button>

        </div>
      </div>
    );
  }

  // --- MENU PRINCIPAL (HOME) ---
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Header HUD & Retour */}
      <div className="absolute top-6 left-6 z-10 pointer-events-auto flex items-start gap-4">
        {onBack && (
          <button onClick={onBack} className="w-12 h-12 bg-black/50 backdrop-blur border border-white/10 rounded-xl flex items-center justify-center active:scale-90 transition-transform">
            <img src="/icon-return.png" alt="Retour" className="w-[60%] h-[60%] object-contain opacity-80" />
          </button>
        )}
        <div className="pointer-events-none">
          <h1 className="text-white font-black text-xl tracking-widest uppercase">Locate Garage</h1>
          <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest mt-1">Terminal de Diagnostic IA</p>
        </div>
      </div>

      {/* 🏭 BOUTON 1 : MAINTENANCE INDUSTRIELLE */}
      <button
        onClick={() => setActiveMode('maintenance_live')}
        className="flex-1 group relative overflow-hidden bg-[#0a0a0a] hover:bg-[#111] transition-all duration-500 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center items-center p-8 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Factory size={72} className="text-white/60 mb-6 group-hover:text-red-500 group-hover:scale-110 transition-all duration-500" />
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-2 text-center">Maintenance<br/>Industrielle</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-12">Usines • Stations • Automatisme</p>
        <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] bg-red-950/30 px-6 py-3 rounded-full border border-red-500/20">
          Système OSA/CBM <ChevronRight size={14} />
        </div>
      </button>

      {/* 🚜 BOUTON 2 : MÉCANIQUE AUTO & PL (Ouvre le sous-menu) */}
      <button
        onClick={() => setActiveMode('mecanique_menu')}
        className="flex-1 group relative overflow-hidden bg-[#080808] hover:bg-[#111] transition-all duration-500 flex flex-col justify-center items-center p-8 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Wrench size={72} className="text-white/60 mb-6 group-hover:text-red-500 group-hover:scale-110 transition-all duration-500" />
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-2 text-center">Mécanique<br/>Auto & P.L.</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-12">Véhicules Légers • Poids Lourds</p>
        <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] bg-red-950/30 px-6 py-3 rounded-full border border-red-500/20">
          Terminal Opérateur <ChevronRight size={14} />
        </div>
      </button>

    </div>
  );
};

export default GarageDashboard;