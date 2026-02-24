import React, { useState, useEffect } from 'react';
import { getInventory } from '../../../core/storage/memoryService';
import { CATEGORIES } from '../views/Dashboard'; 
import type { InventoryItem } from '../../../types';

interface LibraryProps {
  onBack: () => void;
  selectedCategoryId: string | null;
  onStartScan: () => void; 
}

const Library: React.FC<LibraryProps> = ({ onBack, selectedCategoryId }) => {
  const [tools, setTools] = useState<InventoryItem[]>([]);

  // Récupération de la catégorie active
  const activeCategoryIndex = CATEGORIES.findIndex(c => c.id === selectedCategoryId);
  const activeCategory = CATEGORIES[activeCategoryIndex];
  
  const categoryLabel = activeCategory ? activeCategory.label : 'TOUT L\'INVENTAIRE';
  const categoryIcon = activeCategory ? `/${activeCategory.id}.png` : '/icon-photo.png';
  const categoryNumber = activeCategoryIndex !== -1 ? String(activeCategoryIndex + 1).padStart(2, '0') + '.' : '';

  // Restauration de ta vraie fonction de lecture mémoire
  useEffect(() => {
    const data = getInventory();
    const filtered = selectedCategoryId 
      ? data.filter(t => t.category === selectedCategoryId)
      : data;
    setTools(filtered.sort((a, b) => a.toolName.localeCompare(b.toolName)));
  }, [selectedCategoryId]);

  return (
    <div className="flex flex-col h-full bg-transparent">
      
      {/* EN-TÊTE : Assurance (Gauche) / Retour vers 01A (Droite) */}
      <div className="flex justify-between items-center px-[4vw] py-4 shrink-0">
        <button className="w-12 h-12 bg-[#D3D3D3] rounded-xl flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.5)] active:scale-95 transition-transform border-b-2 border-gray-400">
          <span className="text-[#121212] font-black text-[10px] uppercase tracking-widest leading-none text-center">
            Assur<br/>ance
          </span>
        </button>

        <button onClick={onBack} className="w-14 h-14 active:scale-90 transition-transform">
          <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain drop-shadow-lg" />
        </button>
      </div>

      {/* HERO BANNER : Barre Grise */}
      {activeCategory && (
        <div className="px-[4vw] mb-6 shrink-0">
          <div className="w-full bg-[#D3D3D3] rounded-xl flex items-center justify-between p-3 shadow-[0_5px_15px_rgba(0,0,0,0.4)] border border-gray-300">
            <div className="flex items-center gap-4">
              <span className="text-[#FF6600] font-black italic text-2xl tracking-widest [-webkit-text-stroke:1.5px_#121212] drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
                {categoryNumber}
              </span>
              <h2 className="text-[#121212] font-black uppercase text-[0.85rem] tracking-tight leading-none text-left">
                {categoryLabel}
              </h2>
            </div>
            <img src={categoryIcon} alt={categoryLabel} className="w-14 h-14 object-contain drop-shadow-xl shrink-0" />
          </div>
        </div>
      )}

      {/* LISTE DES OUTILS SCANNÉS */}
      <div className="flex-1 overflow-y-auto px-[4vw] pb-[12vh] no-scrollbar">
        {tools.length > 0 ? (
          <div className="flex flex-col gap-4">
            {tools.map((tool) => (
              <div 
                key={tool.id} 
                className="bg-[#1E1E1E] rounded-r-xl rounded-l-sm border-l-4 border-[#FF6600] p-4 flex gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              >
                {/* Photo miniature */}
                <div className="w-16 h-16 rounded-lg bg-black/50 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                  {tool.imageUrl ? (
                    <img src={tool.imageUrl} className="w-full h-full object-cover" alt={tool.toolName} />
                  ) : (
                    <span className="text-[8px] font-black text-white/20">NO IMG</span>
                  )}
                </div>

                {/* Détails */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-black text-sm uppercase truncate leading-tight">
                      {tool.toolName}
                    </h3>
                    <p className="text-[#FF6600] text-[10px] font-bold mt-0.5 tracking-wider truncate">
                      📍 {tool.location || 'ZONE NON DÉFINIE'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-widest border ${tool.safetyStatus ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-green-500/10 text-green-500 border-green-500/30'}`}>
                      {tool.safetyStatus ? 'ALERTE' : 'OPÉRATIONNEL'}
                    </span>
                    <span className="text-[#B0BEC5] text-[9px] italic opacity-60">
                      {tool.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-30">
             <div className="w-16 h-16 border-2 border-dashed border-white/50 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">?</span>
             </div>
            <p className="text-sm font-bold uppercase tracking-widest text-center text-white">Inventaire Vide</p>
            <p className="text-[10px] mt-2 text-center text-white">Aucun outil scanné dans cette catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;