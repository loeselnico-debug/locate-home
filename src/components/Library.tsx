import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Hammer, Wrench, Zap, Nut, 
  Lightbulb, Paintbrush, Ruler, Leaf, Package 
} from 'lucide-react';
import { getInventory } from '../services/memoryService';
import type { InventoryItem } from '../types';

interface LibraryProps {
  onBack: () => void;
}

const Library: React.FC<LibraryProps> = ({ onBack }) => {
  const [tools, setTools] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const data = getInventory();
    // Tri A-Z selon le Manifeste
    const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
    setTools(sortedData);
  }, []);

  // FONCTION MAGIQUE : Utilise enfin tes imports !
  const renderCategoryIcon = (category: string) => {
    const iconSize = 16;
    const cat = category.toLowerCase();
    
    if (cat.includes('electro')) return <Zap size={iconSize} />;
    if (cat.includes('main')) return <Hammer size={iconSize} />;
    if (cat.includes('serrage') || cat.includes('clés')) return <Wrench size={iconSize} />;
    if (cat.includes('quinc')) return <Nut size={iconSize} />;
    if (cat.includes('elec')) return <Lightbulb size={iconSize} />;
    if (cat.includes('peint')) return <Paintbrush size={iconSize} />;
    if (cat.includes('mesure')) return <Ruler size={iconSize} />;
    if (cat.includes('jardin')) return <Leaf size={iconSize} />;
    
    return <Package size={iconSize} />; // Icône par défaut
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 pb-32">
      {/* RETOUR : Bleu Navigation */}
      <button onClick={onBack} className="text-[#007BFF] font-bold flex items-center gap-1 mb-6 uppercase text-[10px] tracking-widest">
        <ChevronLeft size={16} /> Retour Dashboard
      </button>

      <header className="mb-8">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Ranger</h2>
        <div className="h-1 w-12 bg-[#FF6600] mt-1 shadow-[0_0_8px_#FF6600]"></div>
        <p className="text-[10px] text-[#B0BEC5] font-bold uppercase tracking-widest mt-2 italic">Répertoire Phoenix-Eye</p>
      </header>

      <div className="grid gap-4">
        {tools.length > 0 ? (
          tools.map((tool) => (
            <div key={tool.id} className="bg-[#1E1E1E] border border-[#333] rounded-2xl p-4 flex items-center gap-4 hover:border-[#FF6600] transition-all group">
              {/* Image de l'outil */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-black border border-[#444] flex-shrink-0 relative">
                <img src={tool.originalImage} alt={tool.name} className="w-full h-full object-cover opacity-80" />
                {/* Badge Icône Catégorie */}
                <div className="absolute -bottom-1 -right-1 bg-[#FF6600] p-1.5 rounded-lg shadow-lg border-2 border-[#1E1E1E] text-white">
                  {renderCategoryIcon(tool.categorie)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm uppercase truncate pr-2">{tool.name}</h3>
                  <span className="text-[9px] bg-[#333] px-2 py-0.5 rounded text-[#B0BEC5] font-mono">
                    {tool.date}
                  </span>
                </div>
                
                <p className="text-[#FF6600] text-[10px] font-black uppercase tracking-tighter mt-1">
                  {tool.categorie}
                </p>
                
                <div className="flex items-center gap-1 mt-1.5">
                   <div className={`w-1.5 h-1.5 rounded-full ${tool.alerte_securite ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                   <p className="text-[#B0BEC5] text-[9px] italic truncate">Loc: {tool.localisation || 'Zone non définie'}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-[#333] rounded-3xl opacity-30 italic text-xs">
            Aucun outil dans la base de données...
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;