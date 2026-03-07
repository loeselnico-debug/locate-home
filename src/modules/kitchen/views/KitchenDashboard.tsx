import React, { useState } from 'react';
import { UtensilsCrossed, ShieldCheck, ChevronRight } from 'lucide-react';

interface KitchenDashboardProps {
  onBack?: () => void;
}

const KitchenDashboard: React.FC<KitchenDashboardProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<'menu' | 'inventory' | 'haccp'>('menu');

  // CORRECTION : Utilisation de activeMode pour changer de vue
  if (activeMode !== 'menu') {
    // On réutilise la logique du scanner asynchrone mais filtrée pour la cuisine
    // Cette partie sera développée juste après ta validation
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center font-sans">
        <UtensilsCrossed className="text-[#28A745] w-16 h-16 mb-4 animate-bounce" />
        <h2 className="text-white font-black text-2xl uppercase tracking-widest mb-2">
          SCANNER {activeMode === 'inventory' ? 'STOCKS' : 'HACCP'}
        </h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-8">
          Initialisation du moteur de vision M4...
        </p>
        <button 
          onClick={() => setActiveMode('menu')} 
          className="bg-[#28A745] text-black px-8 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] active:scale-95 transition-transform"
        >
          Annuler le Scan
        </button>
      </div>
    );
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
          <h1 className="text-white font-black text-xl tracking-widest uppercase">Locate Kitchen</h1>
          <p className="text-[#28A745] text-[10px] font-bold uppercase tracking-widest mt-1">Terminal de Gestion Culinaire</p>
        </div>
      </div>

      {/* 📦 BOUTON 1 : INVENTAIRE PÉRISSABLES */}
      <button
        onClick={() => setActiveMode('inventory')}
        className="flex-1 group relative overflow-hidden bg-[#0a0a0a] hover:bg-[#0c1a10] transition-all duration-500 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center items-center p-8 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#28A745]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <UtensilsCrossed size={72} className="text-white/60 mb-6 group-hover:text-[#28A745] group-hover:scale-110 transition-all duration-500" />
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-2 text-center">Inventaire<br/>Périssables</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-12">Chambre Froide • Épicerie • DLC/DDM</p>

        <div className="flex items-center gap-2 text-[#28A745] font-black text-[10px] uppercase tracking-[0.2em] bg-green-950/30 px-6 py-3 rounded-full border border-[#28A745]/20">
          Système FEFO <ChevronRight size={14} />
        </div>
      </button>

      {/* 🛡️ BOUTON 2 : CONTRÔLE HACCP */}
      <button
        onClick={() => setActiveMode('haccp')}
        className="flex-1 group relative overflow-hidden bg-[#080808] hover:bg-[#0c1a10] transition-all duration-500 flex flex-col justify-center items-center p-8 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#28A745]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <ShieldCheck size={72} className="text-white/60 mb-6 group-hover:text-[#28A745] group-hover:scale-110 transition-all duration-500" />
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-2 text-center">Contrôle<br/>HACCP</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-12">Traçabilité • Hygiène • Planches de coupe</p>

        <div className="flex items-center gap-2 text-[#28A745] font-black text-[10px] uppercase tracking-[0.2em] bg-green-950/30 px-6 py-3 rounded-full border border-[#28A745]/20">
          Audit IA <ChevronRight size={14} />
        </div>
      </button>

    </div>
  );
};

export default KitchenDashboard;