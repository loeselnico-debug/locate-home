import { ChevronLeft } from 'lucide-react';
import { memoryService } from '../services/memoryService';
import InventoryCard from './InventoryCard';
import type { InventoryItem } from '../types';

export default function Library({ onBack }: { onBack: () => void }) {
  const tools = memoryService.getTools();

  return (
    <div className="p-6 bg-[#121212] min-h-screen text-white">
      <button onClick={onBack} className="text-[#FF6600] mb-6 flex items-center gap-2 uppercase font-black text-xs">
        <ChevronLeft size={16} /> Dashboard
      </button>

      <h2 className="text-2xl font-black uppercase mb-6 italic">Mon Inventaire</h2>

      {tools.length === 0 ? (
        <div className="bg-[#1E1E1E] p-10 rounded-3xl border border-[#333] text-center text-gray-500">
          <p className="uppercase font-bold text-xs tracking-widest">Aucun outil rangé</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {tools.map((item: InventoryItem) => (
            <InventoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}