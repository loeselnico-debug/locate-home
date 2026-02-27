import React from 'react';
import { CATEGORIES } from '../views/Dashboard';
import type { InventoryItem } from '../../../types';

interface ToolDetailProps {
  tool: InventoryItem;
  onBack: () => void;
}

const ToolDetail: React.FC<ToolDetailProps> = ({ tool, onBack }) => {
  const category = CATEGORIES.find(c => c.id === tool.category);
  const categoryIcon = category ? `/${category.id}.png` : '/icon-photo.png';

  // --- LOGIQUE DE LA JAUGE DYNAMIQUE ---
  const level = tool.consumableLevel ?? 0;
  const isLow = level <= 20;
  
  // Calcul de la couleur de la jauge
  const getLevelColor = () => {
    if (level <= 20) return 'bg-red-500 shadow-[0_0_10px_#ef4444]';
    if (level <= 50) return 'bg-orange-500 shadow-[0_0_10px_#f97316]';
    return 'bg-green-500 shadow-[0_0_10px_#22c55e]';
  };

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
        
        {/* 2. HERO IMAGE & JAUGE CONSOMMABLE */}
        <div className="w-full bg-[#0a0a0a] rounded-2xl border-2 border-[#1E1E1E] overflow-hidden relative shadow-[0_10px_20px_rgba(0,0,0,0.6)] mb-6 group">
          <div className="h-56 w-full flex items-center justify-center">
            {tool.imageUrl ? (
              <img src={tool.imageUrl} className="w-full h-full object-cover" alt={tool.toolName} />
            ) : (
              <div className="flex flex-col items-center opacity-30">
                <span className="text-5xl mb-2 drop-shadow-lg">📷</span>
                <span className="text-white text-[10px] font-black tracking-widest uppercase">Photo requise</span>
              </div>
            )}
          </div>
          
          {/* JAUGE MINIMALISTE (Uniquement si isConsumable est true) */}
          {tool.isConsumable && (
            <div className="absolute bottom-0 left-0 w-full h-2 bg-black/40 backdrop-blur-sm">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${getLevelColor()}`}
                style={{ width: `${level}%` }}
              />
              <div className="absolute -top-6 right-3 bg-black/60 px-2 py-0.5 rounded text-[9px] font-black text-white uppercase tracking-tighter">
                Stock: {level}%
              </div>
            </div>
          )}

          {/* Pastille de Statut Superposée */}
          <div className={`absolute top-4 right-4 px-4 py-1.5 rounded shadow-2xl backdrop-blur-md border ${tool.safetyStatus ? 'bg-red-500/90 border-red-300 text-white' : 'bg-green-500/90 border-green-300 text-white'}`}>
            <span className="font-black text-[10px] uppercase tracking-widest drop-shadow-md">
              {tool.safetyStatus ? '⚠️ ALERTE SÉCURITÉ' : '✓ OPÉRATIONNEL'}
            </span>
          </div>
        </div>

        {/* 3. PLAQUE D'IDENTITÉ */}
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

        {/* 4. APPEL À L'ACTION DROPSHIPPING (Conditionnel) */}
        {tool.isConsumable && isLow && (
          <button className="w-full bg-[#FF6600] py-4 rounded-xl mb-6 flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(255,102,0,0.2)] active:scale-95 transition-all animate-pulse">
            <span className="text-white font-black uppercase text-xs tracking-[0.2em]">Réapprovisionner Stock</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-white text-[10px] font-bold">PRO</span>
          </button>
        )}

        {/* 5. BLOC TECHNIQUE */}
        <div className="bg-[#1E1E1E] rounded-r-xl rounded-l-sm border-l-4 border-[#FF6600] p-5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex flex-col gap-4">
          <h3 className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase border-b border-white/10 pb-2">
            Spécifications Techniques
          </h3>
          
          <div className="bg-[#121212] rounded-lg p-3 border border-white/5 flex flex-col gap-2 relative overflow-hidden">
            <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">
              Numéro de Série / S-N
            </span>
            <div className="flex items-center justify-between">
              <span className="text-[#FF6600] font-mono font-black text-sm tracking-[0.15em] bg-black/50 px-3 py-1.5 rounded shadow-inner">
                {tool.serialNumber || 'S/N MANQUANT'}
              </span>
              <button className="w-8 h-8 bg-[#252525] rounded flex items-center justify-center active:scale-90 transition-transform">
                <span className="text-white text-xs">✏️</span>
              </button>
            </div>
          </div>

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