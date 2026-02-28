import React, { useState } from 'react';
import { Factory, Wrench, ChevronRight } from 'lucide-react';
import LiveAssistant from '../components/LiveAssistant';

const GarageDashboard: React.FC = () => {
  // L'état central : Menu (Aiguillage), ou Cockpit (Maintenance/Mécanique)
  const [activeMode, setActiveMode] = useState<'menu' | 'maintenance' | 'mecanique'>('menu');

  // Si le technicien a cliqué, on zappe le menu et on ouvre directement le Cockpit
  if (activeMode !== 'menu') {
    // On passe le mode à l'assistant pour qu'il charge la bonne "Bible" IA
    return <LiveAssistant mode={activeMode} onExit={() => setActiveMode('menu')} />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Header HUD Minimaliste */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-white font-black text-xl tracking-widest uppercase">Locate Garage</h1>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Terminal de Diagnostic IA</p>
      </div>

      {/* 🏭 BOUTON 1 : MAINTENANCE INDUSTRIELLE */}
      <button
        onClick={() => setActiveMode('maintenance')}
        className="flex-1 group relative overflow-hidden bg-[#080808] hover:bg-[#111] transition-all duration-500 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center items-center p-8 active:scale-95"
      >
        {/* Halo visuel au clic/survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF6600]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <Factory size={72} className="text-white/80 mb-6 group-hover:text-[#FF6600] group-hover:scale-110 transition-all duration-500" />
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-2 text-center">Maintenance<br/>Industrielle</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-12">Usines • Stations d'épuration • Automatisme</p>

        <div className="flex items-center gap-2 text-[#FF6600] font-black text-[10px] uppercase tracking-[0.2em] bg-[#FF6600]/10 px-6 py-3 rounded-full border border-[#FF6600]/20">
          Activer le Cockpit <ChevronRight size={14} />
        </div>
      </button>

      {/* 🚜 BOUTON 2 : MÉCANIQUE AUTO & PL */}
      <button
        onClick={() => setActiveMode('mecanique')}
        className="flex-1 group relative overflow-hidden bg-[#050505] hover:bg-[#111] transition-all duration-500 flex flex-col justify-center items-center p-8 active:scale-95"
      >
        {/* Halo visuel au clic/survol (Bleu technique pour différencier de l'orange industriel) */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <Wrench size={72} className="text-white/80 mb-6 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500" />
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-2 text-center">Mécanique<br/>Auto & P.L.</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-12">Véhicules Légers • Poids Lourds • Hydraulique BTP</p>

        <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.2em] bg-blue-500/10 px-6 py-3 rounded-full border border-blue-500/20">
          Activer le Cockpit <ChevronRight size={14} />
        </div>
      </button>

    </div>
  );
};

export default GarageDashboard;