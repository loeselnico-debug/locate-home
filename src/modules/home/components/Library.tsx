import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../views/Dashboard';
import type { InventoryItem } from '../../../types';

interface LibraryProps {
  onBack: () => void;
  selectedCategoryId: string | null;
  onStartScan: () => void;
  inventory?: InventoryItem[];
  onSelectTool: (tool: InventoryItem) => void;
  // NOUVEAU : Ajout de la commande de suppression
  onDelete: (id: string) => void; 
}

const Library: React.FC<LibraryProps> = ({ onBack, selectedCategoryId, inventory, onSelectTool, onDelete }) => {
  const [tools, setTools] = useState<InventoryItem[]>([]);

  // Récupération de la catégorie active
  const activeCategoryIndex = CATEGORIES.findIndex(c => c.id === selectedCategoryId);
  const activeCategory = CATEGORIES[activeCategoryIndex];

  const categoryLabel = activeCategory ? activeCategory.label : 'TOUT L\'INVENTAIRE';
  const categoryIcon = activeCategory ? `/${activeCategory.id}.png` : '/icon-photo.png';
  const categoryNumber = activeCategoryIndex !== -1 ? String(activeCategoryIndex + 1).padStart(2, '0') + '.' : '';

  // Filtre Zéro-Bug (Gère les espaces et la casse)
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
    <div className="flex flex-col h-full bg-transparent">
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
                onClick={() => onSelectTool(tool)}
                // NOUVEAU : Ajout de "relative" ici pour positionner la croix
                className="relative bg-[#1E1E1E] rounded-r-xl rounded-l-sm border-l-4 border-[#FF6600] p-4 flex gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer active:scale-[0.98] transition-transform"
              >
                {/* NOUVEAU : BOUTON SUPPRIMER (Croix discrète) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Empêche l'ouverture de la fiche détail
                    onDelete(tool.id);   // Déclenche l'alerte de suppression
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
                  <div>
                    <h3 className="text-white font-black text-sm uppercase truncate leading-tight pr-6">
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