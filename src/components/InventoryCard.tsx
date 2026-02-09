import React from 'react';
import type { InventoryItem } from '../types';
import { CATEGORIES } from '../constants';

export const InventoryCard = ({ item }: { item: InventoryItem }) => {
  // On trouve le label lisible (ex: "Électroportatif") à partir de l'ID (ex: "power_tools")
  const catLabel = CATEGORIES.find(c => c.id === item.categorie)?.label || item.categorie;

  return (
    <div className="bg-anthracite border border-gray-700 rounded-xl overflow-hidden flex flex-row h-32 hover:border-brand-orange transition-all animate-fade-in shadow-md mb-3">
      {/* Zone Image */}
      <div className="w-32 h-full bg-black relative shrink-0">
        <img 
          src={`data:image/jpeg;base64,${item.originalImage}`} 
          alt={item.objet} 
          className="w-full h-full object-cover opacity-90"
        />
        {/* Badge de confiance IA */}
        <div className="absolute top-1 left-1 bg-black/60 px-1.5 rounded text-[10px] text-white border border-white/10">
          {item.confiance}
        </div>
      </div>

      {/* Zone Infos */}
      <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
        <div>
          <h3 className="font-bold text-white text-sm truncate">{item.objet}</h3>
          <p className="text-xs text-brand-orange font-medium uppercase">{catLabel}</p>
        </div>
        
        <div className="mt-2">
          <p className="text-[10px] text-gray-400 uppercase">Localisation</p>
          <p className="text-xs text-gray-200 line-clamp-2 leading-tight">{item.localisation}</p>
        </div>
        
        {/* Badge État */}
        <div className="mt-1">
           <span className="text-[10px] text-gray-500 border border-gray-700 px-1 rounded">{item.etat}</span>
        </div>
      </div>
    </div>
  );
};