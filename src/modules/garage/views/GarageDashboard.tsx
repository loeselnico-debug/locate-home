import React, { useState } from 'react';
import { Factory, Wrench, ChevronRight } from 'lucide-react';
import LiveAssistant from '../components/LiveAssistant';


interface GarageDashboardProps {
  onBack?: () => void;
}

const GarageDashboard: React.FC<GarageDashboardProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<'menu' | 'maintenance' | 'mecanique'>('menu');

  if (activeMode !== 'menu') {
    return <LiveAssistant mode={activeMode} onExit={() => setActiveMode('menu')} />;
  }

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
        onClick={() => setActiveMode('maintenance')}
        className="flex-1 group relative overflow-hidden bg-[#0a0a0a] hover:bg-[#111] transition-all duration-500 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center items-center p-8 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <Factory size={72} className="text-white/60 mb-6 group-hover:text-red-500 group-hover:scale-110 transition-all duration-500" />
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-2 text-center">Maintenance<br/>Industrielle</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-12">Usines • Stations d'épuration • Automatisme</p>

        <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] bg-red-950/30 px-6 py-3 rounded-full border border-red-500/20">
          Système OSA/CBM <ChevronRight size={14} />
        </div>
      </button>

      {/* 🚜 BOUTON 2 : MÉCANIQUE AUTO & PL */}
      <button
        onClick={() => setActiveMode('mecanique')}
        className="flex-1 group relative overflow-hidden bg-[#080808] hover:bg-[#111] transition-all duration-500 flex flex-col justify-center items-center p-8 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <Wrench size={72} className="text-white/60 mb-6 group-hover:text-red-500 group-hover:scale-110 transition-all duration-500" />
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-2 text-center">Mécanique<br/>Auto & P.L.</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-12">Véhicules Légers • Poids Lourds • Hydraulique</p>

        <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] bg-red-950/30 px-6 py-3 rounded-full border border-red-500/20">
          Diagnostic OBD2 <ChevronRight size={14} />
        </div>
      </button>

    </div>
  );
};

export default GarageDashboard;