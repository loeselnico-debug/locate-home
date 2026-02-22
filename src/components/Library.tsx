import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Hammer, Wrench, Zap, Nut, 
  Lightbulb, Paintbrush, Ruler, Leaf, Package 
} from 'lucide-react';
import { getInventory } from '../services/memoryService';
import type { InventoryItem } from '../types';
import { CATEGORIES } from '../types'; // Cible tes 9 vrais univers
import { useUserTier } from '../hooks/useUserTier'; // Importe ton hook de sécurité

interface LibraryProps {
  onBack: () => void;
}

const Library: React.FC<LibraryProps> = ({ onBack }) => {
const [tools, setTools] = useState<InventoryItem[]>([]);
const { currentTier } = useUserTier();
const [activeCategory, setActiveCategory] = useState<string | null>(null);


// On crée une variable booléenne simple : true si le mec a payé, false s'il est en Free
const isPremiumAccess = currentTier === 'PREMIUM' || currentTier === 'PRO';
  useEffect(() => {
    const data = getInventory();
    // Tri A-Z selon le Manifeste
    const sortedData = [...data].sort((a, b) => a.toolName.localeCompare(b.toolName));
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
    
    {/* --- DÉBUT VERROU FREEMIUM --- */}
{isPremiumAccess ? (
  <div className="mb-6">
    <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-3">Univers Métiers</h3>
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* Ici la boucle qui affiche tes 9 onglets */}
      {CATEGORIES.map((cat) => (
        <button 
  key={cat.id}
  onClick={() => setActiveCategory(cat.id)}
  className={`px-4 py-2 border rounded-lg text-sm whitespace-nowrap transition-colors ${
    activeCategory === cat.id 
      ? 'bg-[#FF6600] border-[#FF6600] text-black font-bold' 
      : 'bg-[#1A1A1A] border-gray-800 text-white hover:border-[#FF6600]/50'
  }`}
>
  {cat.label}
</button>
      ))}
    </div>
  </div>
) : (
  <div className="p-4 mb-6 bg-[#121212] border border-[#FF6600]/30 rounded-lg text-center">
    <p className="text-[#FF6600] text-sm font-bold mb-1">⭐ Mode Premium Requis</p>
    <p className="text-gray-400 text-xs">
      Débloquez le tri avancé par Univers Métiers (Électroportatif, Outillage à main, EPI...) et gagnez en efficacité.
    </p>
  </div>
)}
{/* --- FIN VERROU FREEMIUM --- */}
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
                <img src={tool.imageUrl} alt={tool.toolName} className="w-full h-full object-cover opacity-80" />
                {/* Badge Icône Catégorie */}
                <div className="absolute -bottom-1 -right-1 bg-[#FF6600] p-1.5 rounded-lg shadow-lg border-2 border-[#1E1E1E] text-white">
                  {renderCategoryIcon(tool.category)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm uppercase truncate pr-2">{tool.toolName}</h3>
                  <span className="text-[9px] bg-[#333] px-2 py-0.5 rounded text-[#B0BEC5] font-mono">
                    {tool.date}
                  </span>
                </div>
                
                <p className="text-[#FF6600] text-[10px] font-black uppercase tracking-tighter mt-1">
                  {tool.category}
                </p>
                
                <div className="flex items-center gap-1 mt-1.5">
                   <div className={`w-1.5 h-1.5 rounded-full ${tool.safetyStatus ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                   <p className="text-[#B0BEC5] text-[9px] italic truncate">Loc: {tool.location || 'Zone non définie'}</p>
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