import type { InventoryItem } from '../../../types';

interface InventoryCardProps {
  item: InventoryItem;
}

export default function InventoryCard({ item }: InventoryCardProps) {
  return (
    <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-3 flex items-center gap-4 shadow-[0_4px_10px_rgba(0,0,0,0.3)] group active:scale-[0.98] transition-all w-full mb-3">
      
      {/* 1. MINIATURE PHOTO (Carré gauche) */}
      <div className="w-16 h-16 bg-black rounded-xl border border-white/10 overflow-hidden shrink-0 flex items-center justify-center relative shadow-inner">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.toolName} 
            className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" 
          />
        ) : (
          <span className="text-xl opacity-30 drop-shadow-md">📷</span>
        )}
      </div>

      {/* 2. INFOS VITALES (Au centre, sans texte tronqué) */}
      <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
        <h3 className="text-white font-black uppercase text-[clamp(0.8rem,3.5vw,1rem)] leading-snug">
          {item.toolName}
        </h3>
        
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[#FF6600] text-[10px] font-black uppercase tracking-widest drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            📍 {item.location || 'N/A'}
          </span>
        </div>
      </div>

      {/* 3. STATUT OPÉRATIONNEL (Badge à droite) */}
      <div className="shrink-0 flex flex-col items-end justify-center">
         <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm ${
           item.safetyStatus 
            ? 'bg-red-500/20 text-red-500 border-red-500/30 animate-pulse' 
            : 'bg-green-500/10 text-green-500 border-green-500/30'
         }`}>
           {item.safetyStatus ? 'ALERTE' : 'OK'}
         </span>
      </div>

    </div>
  );
}