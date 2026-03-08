// ==========================================
// 📂 FICHIER : \src\modules\home\components\Library.tsx
// ==========================================
import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../views/Dashboard';
import type { InventoryItem } from '../../../types';
import { useUserTier } from '../../../core/security/useUserTier';

interface LibraryProps {
  onBack: () => void;
  selectedCategoryId: string | null;
  onStartScan: () => void;
  inventory?: InventoryItem[];
  onSelectTool: (tool: InventoryItem) => void;
  onDelete: (id: string) => void; 
}

const Library: React.FC<LibraryProps> = ({ onBack, selectedCategoryId, inventory, onSelectTool, onDelete }) => {
  const [tools, setTools] = useState<InventoryItem[]>([]);
  const { currentTier } = useUserTier(); // <-- NOUVEAU : On invoque la sécurité

  const activeCategoryIndex = CATEGORIES.findIndex(c => c.id === selectedCategoryId);
  const activeCategory = CATEGORIES[activeCategoryIndex];

  const categoryLabel = activeCategory ? activeCategory.label : 'TOUT L\'INVENTAIRE';
  const categoryIcon = activeCategory ? `/${activeCategory.id}.png` : '/icon-photo.png';
  const categoryNumber = activeCategoryIndex !== -1 ? String(activeCategoryIndex + 1).padStart(2, '0') + '.' : '';

  useEffect(() => {
    const data = inventory || [];
    const safeCategoryId = selectedCategoryId?.trim().toLowerCase();

    const filtered = safeCategoryId
      ? data.filter(t => {
          const cat = t.category?.trim().toLowerCase();
          const label = activeCategory?.label.trim().toLowerCase();
          return cat === safeCategoryId || cat === label;
        })
      : data;

    setTools(filtered.sort((a, b) => a.toolName.localeCompare(b.toolName)));
  }, [selectedCategoryId, inventory, activeCategory]);

  return (
    <div className="flex flex-col h-full bg-transparent font-sans">
      {/* EN-TÊTE PREMIUM 3D */}
      <div className="flex justify-between items-center px-[4vw] py-4 shrink-0">
        <button className="w-14 h-14 active:scale-90 transition-transform">
          <img src="/icon-assurance.png" alt="Assurance" className="w-full h-full object-contain drop-shadow-lg" />
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
                onClick={() => {
                  // <-- NOUVEAU : VERROU PREMIUM POUR L'ÉDITION
                  if (currentTier === 'FREE') {
                    alert("🔒 La fiche détaillée et l'édition sont réservées aux membres PREMIUM.");
                  } else {
                    onSelectTool(tool);
                  }
                }}
                className="relative bg-[#1E1E1E] rounded-r-xl rounded-l-sm border-l-4 border-[#FF6600] p-4 flex gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer active:scale-[0.98] transition-transform"
              >
                {/* BOUTON SUPPRIMER */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(tool.id);   
                  }}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors z-10"
                >
                  <span className="text-xl font-bold leading-none mb-1">×</span>
                </button>

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
                  <div className="pr-6">
                    <span className="text-gray-400 font-black text-[9px] uppercase tracking-widest leading-none block mb-0.5">
                      {tool.brand || 'MARQUE N/A'}
                    </span>
                    <h3 className="text-white font-bold text-[clamp(0.9rem,3.5vw,1.1rem)] uppercase leading-tight whitespace-normal">
                      {tool.toolName}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {/* <-- NOUVEAU : L'énergie est un privilège PREMIUM/PRO */}
                      {currentTier !== 'FREE' && (
                        <span className="bg-[#FF6600]/10 text-[#FF6600] border border-[#FF6600]/30 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                          ⚡ {(tool as any).energy || 'N/A'}
                        </span>
                      )}
                      <span className="text-[#D3D3D3] text-[9px] font-bold uppercase tracking-widest truncate">
                        📍 {tool.location || 'ZONE NON DÉFINIE'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 border-t border-white/5 pt-2">
                    <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${tool.safetyStatus ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-green-500/10 text-green-500 border-green-500/30'}`}>
                      {tool.safetyStatus ? 'ALERTE' : 'OPÉRATIONNEL'}
                    </span>
                    <span className="text-[#B0BEC5] text-[8px] italic opacity-60">
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