import React, { useState, useEffect } from 'react';
import { getInventory } from '../../../core/storage/memoryService';
import type { InventoryItem } from '../../../types';
import { CATEGORIES } from '../../../types'; 
import { useUserTier } from '../../../core/security/useUserTier';

interface LibraryProps {
  onBack: () => void;
}

const Library: React.FC<LibraryProps> = ({ onBack }) => {
  const [tools, setTools] = useState<InventoryItem[]>([]);
  const { currentTier } = useUserTier();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Verrou Premium
  const isPremiumAccess = currentTier === 'PREMIUM' || currentTier === 'PRO';

  useEffect(() => {
    const data = getInventory();
    const sortedData = [...data].sort((a, b) => a.toolName.localeCompare(b.toolName));
    setTools(sortedData);
  }, []);

  // FONCTION MAGIQUE : Transforme le texte de la catégorie en ID pour trouver la bonne image PNG 3D
  const getCategoryId = (categoryString: string): string => {
    if (!categoryString) return 'electro';
    const cat = categoryString.toLowerCase();
    if (cat.includes('electro')) return 'electro';
    if (cat.includes('main')) return 'main';
    if (cat.includes('serrage') || cat.includes('clés') || cat.includes('cles')) return 'serrage';
    if (cat.includes('quinc')) return 'quinc';
    if (cat.includes('elec')) return 'elec';
    if (cat.includes('peint')) return 'peinture';
    if (cat.includes('mesure')) return 'mesure';
    if (cat.includes('jardin')) return 'jardin';
    if (cat.includes('epi') || cat.includes('protect')) return 'epi';
    return 'electro'; // Image par défaut
  };

  // On applique le filtre UNIQUEMENT si une catégorie est sélectionnée
  const displayedTools = activeCategory 
    ? tools.filter(tool => getCategoryId(tool.category) === activeCategory)
    : tools;

  return (
    <div className="min-h-screen bg-[#121212] text-white p-[4vw] pb-[15vh]">
      
      {/* RETOUR : Navigation sans Lucide */}
      <button onClick={onBack} className="text-[#007BFF] font-bold flex items-center gap-[1vw] mb-[4vh] uppercase text-[0.75rem] tracking-widest active:scale-95 transition-transform">
        &lt; Retour Dashboard
      </button>

      <header className="mb-[4vh]">
        <h2 className="text-[2rem] font-black text-white italic uppercase tracking-tighter">Inventaire</h2>
        <div className="h-[0.25rem] w-[3rem] bg-[#FF6600] mt-[0.5vh] shadow-[0_0_8px_#FF6600]"></div>
        {/* CORRECTION : Remplacement de Phoenix-Eye par LOCATE HOME */}
        <p className="text-[0.65rem] text-[#B0BEC5] font-bold uppercase tracking-widest mt-[1vh] italic">Répertoire LOCATE HOME</p>
      </header>

      {/* --- DÉBUT VERROU FREEMIUM --- */}
      {isPremiumAccess ? (
        <div className="mb-[4vh]">
          <h3 className="text-[#B0BEC5] text-[0.75rem] uppercase tracking-widest mb-[1.5vh]">Univers Métiers</h3>
          <div className="flex gap-[2vw] overflow-x-auto pb-[1vh] scrollbar-hide">
            
            {/* Bouton pour réinitialiser le filtre */}
            <button 
              onClick={() => setActiveCategory(null)}
              className={`px-[1rem] py-[0.5rem] border rounded-lg text-[0.85rem] whitespace-nowrap transition-colors ${
                activeCategory === null 
                  ? 'bg-[#FF6600] border-[#FF6600] text-black font-bold' 
                  : 'bg-[#1A1A1A] border-[#333] text-white hover:border-[#FF6600]/50'
              }`}
            >
              Tous les outils
            </button>

            {/* Boucle sur les 9 onglets */}
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-[1vw] px-[1rem] py-[0.5rem] border rounded-lg text-[0.85rem] whitespace-nowrap transition-colors ${
                  activeCategory === cat.id 
                    ? 'bg-[#FF6600] border-[#FF6600] text-black font-bold' 
                    : 'bg-[#1A1A1A] border-[#333] text-white hover:border-[#FF6600]/50'
                }`}
              >
                {/* Injection de la mini icône 3D dans les boutons */}
                <img src={`/${cat.id}.png`} alt="" className="w-[1.2rem] h-[1.2rem] object-contain" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-[1rem] mb-[4vh] bg-[#121212] border border-[#FF6600]/30 rounded-lg text-center">
          <p className="text-[#FF6600] text-[0.85rem] font-bold mb-[0.5vh]">⭐ Mode Premium Requis</p>
          <p className="text-[#B0BEC5] text-[0.75rem]">
            Débloquez le tri avancé par Univers Métiers (Électroportatif, Outillage à main, EPI...) et gagnez en efficacité.
          </p>
        </div>
      )}
      {/* --- FIN VERROU FREEMIUM --- */}

      {/* LISTE DES OUTILS */}
      <div className="grid gap-[2vh]">
        {displayedTools.length > 0 ? (
          displayedTools.map((tool) => {
            const catId = getCategoryId(tool.category);
            return (
              <div key={tool.id} className="bg-[#1E1E1E] border border-[#333] rounded-2xl p-[1rem] flex items-center gap-[4vw] hover:border-[#FF6600] transition-all group">
                
                {/* Image de l'outil */}
                <div className="w-[4rem] h-[4rem] rounded-xl overflow-hidden bg-[#050505] border border-[#444] flex-shrink-0 relative">
                  {tool.imageUrl ? (
                    <img src={tool.imageUrl} alt={tool.toolName} className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#333] text-[0.6rem]">NO IMG</div>
                  )}
                  
                  {/* Badge Icône Catégorie 3D */}
                  <div className="absolute -bottom-1 -right-1 bg-[#1E1E1E] p-[0.2rem] rounded-lg shadow-lg border border-[#333] flex items-center justify-center">
                    <img src={`/${catId}.png`} alt="Catégorie" className="w-[1.2rem] h-[1.2rem] object-contain" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[0.85rem] uppercase truncate pr-[1vw] text-white">{tool.toolName}</h3>
                    <span className="text-[0.6rem] bg-[#333] px-[0.5rem] py-[0.1rem] rounded text-[#B0BEC5] font-mono">
                      {tool.date}
                    </span>
                  </div>
                  
                  <p className="text-[#FF6600] text-[0.65rem] font-black uppercase tracking-tighter mt-[0.5vh]">
                    {tool.category}
                  </p>
                  
                  <div className="flex items-center gap-[1vw] mt-[1vh]">
                     <div className={`w-[0.5rem] h-[0.5rem] rounded-full ${tool.safetyStatus ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                     <p className="text-[#B0BEC5] text-[0.65rem] italic truncate">Loc: {tool.location || 'Zone non définie'}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-[10vh] border-2 border-dashed border-[#333] rounded-3xl opacity-30 italic text-[0.85rem] text-[#B0BEC5]">
            {activeCategory ? "Aucun outil dans cette catégorie..." : "Soute vide..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;