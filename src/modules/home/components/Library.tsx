// ==========================================
// 📂 FICHIER : \src\modules\home\components\Library.tsx
// ==========================================
import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../views/Dashboard';
import type { InventoryItem } from '../../../types';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InsuranceReport } from '../components/InsuranceReport';


interface LibraryProps {
  onBack: () => void;
  selectedCategoryId: string | null;
  onStartScan: () => void;
  inventory?: InventoryItem[];
  onSelectTool: (tool: InventoryItem) => void; 
}

const Library: React.FC<LibraryProps> = ({ onBack, selectedCategoryId, inventory, onSelectTool }) => {
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
        
        {/* NOUVEAU BOUTON PDF DYNAMIQUE */}
        <PDFDownloadLink
          document={<InsuranceReport items={tools} userInfo={{ name: 'Opérateur', address: 'Atelier / ' + categoryLabel }} />}
          fileName={`Rapport_Inventaire_${categoryLabel.replace(/\s+/g, '_')}.pdf`}
          className="w-14 h-14 active:scale-90 transition-transform"
        >
          {({ loading }) => (
            <div className="w-full h-full relative flex items-center justify-center">
              <img 
                src="/icon-assurance.png" 
                alt="Assurance" 
                className={`w-full h-full object-contain drop-shadow-lg transition-opacity ${loading ? 'opacity-30' : 'opacity-100'}`} 
              />
              {/* Petit indicateur de chargement si le PDF est lourd */}
              {loading && <span className="absolute text-[8px] font-black text-[#FF6600] tracking-widest uppercase">Calc...</span>}
            </div>
          )}
        </PDFDownloadLink>

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

      {/* LISTE DES OUTILS (Format "Croquis C") */}
      <div className="flex-1 overflow-y-auto px-[4vw] pb-[12vh] no-scrollbar">
        {tools.length > 0 ? (
          <div className="flex flex-col gap-4">
            {tools.map((tool) => {
              
              // Logique Anti-Redondance (séparation Marque / Modèle)
              const brandName = tool.brand || 'Marque N/A';
              const cleanToolName = tool.toolName.toLowerCase().startsWith(brandName.toLowerCase())
                ? tool.toolName.substring(brandName.length).trim()
                : tool.toolName;

              return (
                <div
                  key={tool.id}
                  onClick={() => onSelectTool(tool)}
                  className="bg-[#1E1E1E] rounded-xl border border-white/10 p-3 flex gap-4 shadow-[0_8px_20px_rgba(0,0,0,0.4)] cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden group"
                >
                  {/* Petit liseré orange sur la gauche */}
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FF6600]"></div>

                  {/* 1. PHOTO ISOLÉE (Gauche) */}
                  <div className="w-24 h-24 rounded-lg bg-[#0a0a0a] border border-white/5 overflow-hidden shrink-0 flex items-center justify-center shadow-inner relative ml-1">
                    {tool.imageUrl ? (
                      <img src={tool.imageUrl} className="w-full h-full object-contain p-2 drop-shadow-lg" alt={tool.toolName} />
                    ) : (
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">No IMG</span>
                    )}
                  </div>

                  {/* 2. DÉTAILS (Droite) */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    
                    {/* Bloc Titre (Marque + Désignation) */}
                    <div>
                      <h4 className="text-gray-400 font-black text-[9px] uppercase tracking-[0.2em] mb-0.5 truncate">
                        {brandName}
                      </h4>
                      <h3 className="text-white font-black text-[clamp(0.9rem,3.5vw,1.1rem)] uppercase leading-tight truncate">
                        {cleanToolName}
                      </h3>
                    </div>

                    {/* Bloc Infos (Énergie + Lieu) */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="bg-[#FF6600]/10 text-[#FF6600] px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border border-[#FF6600]/20">
                        ⚡ {(tool as any).energy || 'N/A'}
                      </span>
                      <span className="text-[#D3D3D3] text-[9px] font-bold uppercase tracking-widest truncate">
                        📍 {tool.location || 'ZONE INCONNUE'}
                      </span>
                    </div>

                    {/* Ligne du bas : Statut + Date */}
                    <div className="flex items-end justify-between mt-auto pt-2">
                      <span className={`px-2 py-1 rounded font-black text-[8px] uppercase tracking-widest shadow-sm ${tool.safetyStatus ? 'bg-red-500 text-white' : 'bg-[#2EA043] text-white'}`}>
                        {tool.safetyStatus ? '⚠️ ALERTE' : '✓ OPÉRATIONNEL'}
                      </span>
                      <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest text-right">
                        {tool.date}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
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