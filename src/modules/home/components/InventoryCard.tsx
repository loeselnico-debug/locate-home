import type { InventoryItem } from '../../../types';

interface InventoryCardProps {
  item: InventoryItem;
}

export default function InventoryCard({ item }: InventoryCardProps) {
  return (
    <div className="bg-[#1E1E1E] border border-[#333] rounded-[1.5rem] overflow-hidden group shadow-lg active:scale-95 transition-all">
      {/* Visualisation HDR */}
      <div className="relative h-[12vh] overflow-hidden bg-black">
        <img 
          src={item.imageUrl || "/placeholder-tool.png"} 
          alt={item.toolName} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent"></div>
      </div>

      <div className="p-[1rem]">
        <h3 className="text-[#FF6600] font-black uppercase text-[0.8rem] truncate tracking-tighter">
          {item.toolName}
        </h3>
        <p className="text-gray-500 text-[0.6rem] mt-[0.2rem] italic uppercase tracking-widest">
          {item.category}
        </p>
        
        <div className="mt-[1.5vh] flex justify-between items-center text-[0.6rem] font-bold text-gray-400 uppercase">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></span>
            {item.safetyStatus || "OK"}
          </span>
          <span className="text-emerald-500 font-black">
            {item.confidence ? `${Math.round(item.confidence * 100)}%` : '100%'}
          </span>
        </div>
      </div>
    </div>
  );
}