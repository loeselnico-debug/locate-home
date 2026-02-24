import React from 'react';
import { CATEGORIES } from '../views/Dashboard';
import type { InventoryItem } from '../../../types';

interface ToolDetailProps {
  tool: InventoryItem;
  onBack: () => void;
}

const ToolDetail: React.FC<ToolDetailProps> = ({ tool, onBack }) => {
  // Récupération de l'icône de la catégorie correspondante
  const category = CATEGORIES.find(c => c.id === tool.category);
  const categoryIcon = category ? `/${category.id}.png` : '/icon-photo.png';

  return (
    <div className="flex flex-col h-full bg-transparent">
      
      {/* 1. EN-TÊTE : Actions */}
      <div className="flex justify-between items-center px-[4vw] py-4 shrink-0">
        <button className="w-12 h-12 bg-[#1E1E1E] border border-white/10 rounded-xl flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.5)] active:scale-95 transition-transform">
          <span className="text-white font-black text-[10px] uppercase tracking-widest text-center">Édit<br/>er</span>
        </button>

        <button onClick={onBack} className="w-14 h-14 active:scale-90 transition-transform">
          <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain drop-shadow-lg" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-[4vw] pb-[12vh] no-scrollbar">
        
        {/* 2. HERO IMAGE & STATUT */}
        <div className="w-full h-56 bg-[#0a0a0a] rounded-2xl border-2 border-[#1E1E1E] overflow-hidden relative shadow-[0_10px_20px_rgba(0,0,0,0.6)] mb-6 flex items-center justify-center group">
          {tool.imageUrl ? (
            <img src={tool.imageUrl} className="w-full h-full object-cover" alt={tool.toolName} />
          ) : (
            <div className="flex flex-col items-center opacity-30">
              <span className="text-5xl mb-2 drop-shadow-lg">📷</span>
              <span className="text-white text-[10px] font-black tracking-widest uppercase">Photo requise</span>
            </div>
          )}
          
          {/* Pastille de Statut Superposée */}
          <div className={`absolute top-4 right-4 px-4 py-1.5 rounded shadow-2xl backdrop-blur-md border ${tool.safetyStatus ? 'bg-red-500/90 border-red-300 text-white' : 'bg-green-500/90 border-green-300 text-white'}`}>
            <span className="font-black text-[10px] uppercase tracking-widest drop-shadow-md">
              {tool.safetyStatus ? '⚠️ ALERTE SÉCURITÉ' : '✓ OPÉRATIONNEL'}
            </span>
          </div>
        </div>

        {/* 3. PLAQUE D'IDENTITÉ (Design D3D3D3) */}
        <div className="w-full bg-[#D3D3D3] rounded-xl flex items-center gap-4 p-4 shadow-[0_5px_15px_rgba(0,0,0,0.4)] border border-gray-300 mb-6">
          <img src={categoryIcon} className="w-16 h-16 object-contain drop-shadow-xl shrink-0" alt="Catégorie" />
          <div className="flex-1 min-w-0">
            <h1 className="text-[#121212] font-black text-lg uppercase leading-tight truncate">
              {tool.toolName}
            </h1>
            <p className="text-[#FF6600] text-[11px] font-black mt-1.5 tracking-widest uppercase truncate drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              📍 {tool.location || 'ZONE NON DÉFINIE'}
            </p>
          </div>
        </div>

        {/* 4. BLOC TECHNIQUE (Numéro de série) */}
        <div className="bg-[#1E1E1E] rounded-r-xl rounded-l-sm border-l-4 border-[#FF6600] p-5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex flex-col gap-4">
          <h3 className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase border-b border-white/10 pb-2">
            Spécifications Techniques
          </h3>
          
          {/* Champ Numéro de Série */}
          <div className="bg-[#121212] rounded-lg p-3 border border-white/5 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
            <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">
              Numéro de Série / S-N
            </span>
            <div className="flex items-center justify-between">
              {/* Le bypass (any) est là en attendant qu'on ajoute serialNumber dans ton fichier types.ts */}
              <span className="text-[#FF6600] font-mono font-black text-sm tracking-[0.15em] bg-black/50 px-3 py-1.5 rounded shadow-inner">
                {(tool as any).serialNumber || 'S/N MANQUANT'}
              </span>
              <button className="w-8 h-8 bg-[#252525] rounded flex items-center justify-center active:scale-90 transition-transform">
                <span className="text-white text-xs">✏️</span>
              </button>
            </div>
          </div>

          {/* Champ Date */}
          <div className="flex justify-between items-center bg-[#121212] rounded-lg p-3 border border-white/5 mt-1">
            <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Date d'enregistrement</span>
            <span className="text-white font-bold text-xs tracking-wider">{tool.date}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ToolDetail;