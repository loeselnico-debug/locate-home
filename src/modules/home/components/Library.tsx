import React, { useState, useEffect } from 'react';
import { getInventory } from '../../../core/storage/memoryService';
import { CATEGORIES } from '../../../types'; // Import de la source de vérité pour le nom complet
import type { InventoryItem } from '../../../types';

interface LibraryProps {
  onBack: () => void;
  selectedCategoryId: string | null;
  onStartScan: () => void; // Ajout de la fonction pour le bouton de gauche
}

const Library: React.FC<LibraryProps> = ({ onBack, selectedCategoryId, onStartScan }) => {
  const [tools, setTools] = useState<InventoryItem[]>([]);

  // Point 2 : Récupération du nom complet et de l'icône via la Source de Vérité
  const activeCategory = CATEGORIES.find(c => c.id === selectedCategoryId);
  const categoryLabel = activeCategory ? activeCategory.label : 'TOUT L\'INVENTAIRE';
  const categoryIcon = activeCategory ? `/${activeCategory.id}.png` : '/icon-photo.png';

  useEffect(() => {
    const data = getInventory();
    const filtered = selectedCategoryId 
      ? data.filter(t => t.category === selectedCategoryId)
      : data;
    setTools(filtered.sort((a, b) => a.toolName.localeCompare(b.toolName)));
  }, [selectedCategoryId]);

  return (
    <div className="flex flex-col h-full bg-[#121212] pt-4">
      
      {/* BARRE DE NAVIGATION INTERNE (Points 1 & 2) */}
      <div className="flex justify-between items-center px-[5vw] mb-6">
        
        {/* Point 1 : Bouton Scanner (Haut Gauche - w-10 h-10) */}
        <button onClick={onStartScan} className="w-10 h-10 active:scale-90 transition-transform">
          <img src="/icon-scanner.png" alt="Scanner" className="w-full h-full object-contain" />
        </button>

        {/* Point 2 : Icône + Titre Complet (Centre) */}
        <div className="flex flex-col items-center flex-1 mx-2">
          <img src={categoryIcon} className="w-10 h-10 object-contain drop-shadow-lg" alt="Catégorie" />
          <h2 className="text-white font-black uppercase text-[11px] tracking-widest text-center mt-1 leading-tight">
            {categoryLabel}
          </h2>
        </div>
        
        {/* Bouton Retour (Haut Droite - w-10 h-10) */}
        <button onClick={onBack} className="w-10 h-10 active:scale-90 transition-transform">
          <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain" />
        </button>
      </div>

      {/* LISTE DES OUTILS */}
      <div className="flex-1 overflow-y-auto px-[5vw] pb-[5vh] no-scrollbar">
        {tools.length > 0 ? (
          <div className="grid gap-4">
            {tools.map((tool) => (
              <div key={tool.id} className="bg-[#1E1E1E] rounded-2xl p-4 flex items-center gap-4 border border-white/5 active:border-[#FF6600]/50 transition-colors">
                <div className="w-16 h-16 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0">
                  {tool.imageUrl ? (
                    <img src={tool.imageUrl} className="w-full h-full object-cover" alt={tool.toolName} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[8px] opacity-20">NO IMG</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm uppercase truncate">{tool.toolName}</h3>
                  <p className="text-[#FF6600] text-[10px] font-black">{tool.location || 'ZONE SCAN'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${tool.safetyStatus ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <span className="text-[#B0BEC5] text-[10px] italic">{tool.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-20 italic">
            <p className="text-sm">Aucun outil dans cette rubrique</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;