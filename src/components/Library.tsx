import React, { useState, useEffect } from 'react';
import { Hammer, Zap, Wrench, Nut, Lightbulb, Paintbrush, Ruler, Leaf, ChevronLeft, Box } from 'lucide-react';
import { memoryService } from '../services/memoryService';
import type { ToolMemory } from '../types';

// Référentiel des 8 piliers (Point 3 du Manifeste)
const CATEGORIES_UI = [
  { id: 'electro', label: 'Électroportatif', icon: Zap, color: 'bg-orange-500' },
  { id: 'main', label: 'Outillage à main', icon: Hammer, color: 'bg-blue-500' },
  { id: 'serrage', label: 'Serrage et Clés', icon: Wrench, color: 'bg-slate-500' },
  { id: 'quinc', label: 'Quincaillerie', icon: Nut, color: 'bg-yellow-600' },
  { id: 'elec', label: 'Électricité', icon: Lightbulb, color: 'bg-emerald-500' },
  { id: 'peinture', label: 'Peinture', icon: Paintbrush, color: 'bg-purple-500' },
  { id: 'mesure', label: 'Mesure', icon: Ruler, color: 'bg-red-500' },
  { id: 'jardin', label: 'Jardin', icon: Leaf, color: 'bg-green-600' },
];

const Library: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [tools, setTools] = useState<ToolMemory[]>([]);

  useEffect(() => {
    setTools(memoryService.getTools());
  }, []);

  const filteredTools = selectedCat 
    ? tools.filter(t => t.categorie === selectedCat)
    : [];

  if (selectedCat) {
    const categoryInfo = CATEGORIES_UI.find(c => c.id === selectedCat);
    return (
      <div className="p-6 bg-slate-950 min-h-screen text-white">
        <button onClick={() => setSelectedCat(null)} className="flex items-center gap-2 text-orange-500 font-bold mb-6 uppercase text-xs">
          <ChevronLeft size={16} /> Retour Catégories
        </button>
        <h2 className="text-2xl font-black uppercase italic mb-6">
          {categoryInfo?.label} <span className="text-orange-500">({filteredTools.length})</span>
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {filteredTools.length > 0 ? filteredTools.map(tool => (
            <div key={tool.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
              <img src={tool.originalImage} className="w-16 h-16 rounded-lg object-cover bg-black" alt="" />
              <div>
                <h4 className="font-bold uppercase text-sm">{tool.name}</h4>
                <p className="text-[10px] text-slate-500">{tool.details.substring(0, 40)}...</p>
              </div>
            </div>
          )) : (
            <p className="text-center text-slate-600 py-10 italic">Aucun outil dans cette catégorie.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-white pb-32">
      <button onClick={onBack} className="flex items-center gap-2 text-orange-500 font-bold mb-6 uppercase text-xs">
        <ChevronLeft size={16} /> Retour Dashboard
      </button>
      
      <header className="mb-8">
  <h2 className="text-2xl font-black uppercase italic">Ranger</h2>
  <div className="flex items-center gap-2 mt-1">
    {/* On utilise enfin la Box ici ! */}
    <Box size={14} className="text-orange-500" strokeWidth={2.5} />
    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
      Inventaire par secteurs
    </p>
  </div>
</header>
      
      <header className="mb-8">
        <h2 className="text-2xl font-black uppercase italic">Ranger</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Inventaire par secteurs</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {CATEGORIES_UI.map((cat) => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-[2rem] hover:border-orange-500 transition-all active:scale-95 group"
          >
            <div className={`${cat.color} p-4 rounded-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
              <cat.icon size={24} className="text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-300">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Library;