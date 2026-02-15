import type { InventoryItem } from '../types';

interface InventoryCardProps {
  item: InventoryItem;
}

export default function InventoryCard({ item }: InventoryCardProps) {
  return (
    <div className="bg-[#1E1E1E] border border-[#333] rounded-2xl overflow-hidden shadow-lg">
      <img 
        src={item.originalImage} 
        alt={item.name} 
        className="w-full h-32 object-cover border-b border-[#333]" 
      />
      <div className="p-4">
        {/* On utilise item.name au lieu de item.objet */}
        <h3 className="text-[#FF6600] font-black uppercase text-sm truncate">{item.name}</h3>
        <p className="text-gray-500 text-[10px] mt-1 italic">{item.categorie}</p>
        <div className="mt-3 flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase">
          <span>{item.etat}</span>
          <span className="text-emerald-500">{item.score_confiance}%</span>
        </div>
      </div>
    </div>
  );
}