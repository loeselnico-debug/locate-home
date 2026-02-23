import { useState } from 'react';
import type { InventoryItem } from '../../../types';
import { CATEGORIES } from '../../../types'; 
// Purge totale des icônes métiers ! On ne garde que les icônes utilitaires système.
import { Plus, Trash2, Box, ShieldCheck } from 'lucide-react'; 
import { useUserTier } from '../../../core/security/useUserTier';
import { SafetyBadge } from '../../../core/ui/SafetyBadge';

interface DashboardProps {
  inventory: InventoryItem[];
  onStartScan: () => void;
  onDelete: (id: string) => void;
  limit: number;
}

const Dashboard = ({ inventory, onStartScan, onDelete, limit }: DashboardProps) => {
  const { currentTier } = useUserTier();
  const progress = (inventory.length / limit) * 100;
  
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredInventory = inventory.filter(item => {
    if (activeFilter === 'all') return true;
    return item.category?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="flex flex-col gap-[3vh] pb-[12vh] px-[4vw] sm:px-[2vw]">
      
      {/* HEADER LIQUIDE */}
      <div className="flex justify-between items-center py-[2vh] border-b border-[#333]">
        <div className="flex flex-col">
          <h1 className="text-[1.5rem] font-bold tracking-tighter leading-none">
            <span className="text-[#FF6600]">LOCATE</span>
            <span className="text-white">HOME</span>
          </h1>
          <div className="bg-[#FF6600] text-[0.6rem] font-bold text-white px-[0.5rem] py-[0.1rem] rounded-sm mt-[0.2vh] self-start transform -skew-x-12 shadow-sm">
            by Systems
          </div>
        </div>
        <div className="px-[0.8rem] py-[0.2rem] rounded-full bg-gradient-to-r from-yellow-500 to-[#FF6600] text-black text-[0.7rem] font-black uppercase shadow-[0_0_10px_rgba(255,102,0,0.3)]">
          {currentTier}
        </div>
      </div>

      {/* CAPACITÉ DE LA SOUTE */}
      <div className="bg-[#1E1E1E] p-[4vw] sm:p-[1.5rem] rounded-2xl border border-[#333]">
        <div className="flex justify-between items-end mb-[1vh]">
          <span className="text-[0.7rem] uppercase tracking-widest text-[#B0BEC5]">Inventaire</span>
          <span className="text-[0.85rem] font-bold text-white">{inventory.length} / {limit}</span>
        </div>
        <div className="w-full h-[0.5rem] bg-black rounded-full overflow-hidden">
          <div className="h-full bg-[#FF6600] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* RUBRIQUES (FILTRES 3D CONNECTÉS À LA SOURCE DE VÉRITÉ) */}
      <div className="flex gap-[3vw] overflow-x-auto pb-[1vh] scrollbar-hide -mx-[4vw] px-[4vw] snap-x">
        
        {/* BOUTON "TOUT" (Filtre Global) */}
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex flex-col items-center justify-center min-w-[18vw] h-[18vw] max-w-[5rem] max-h-[5rem] rounded-2xl border snap-center transition-all ${
            activeFilter === 'all' 
              ? 'bg-[#FF6600]/20 border-[#FF6600] text-[#FF6600] scale-105 shadow-[0_0_15px_rgba(255,102,0,0.2)]' 
              : 'bg-[#1E1E1E] border-[#333] text-[#B0BEC5] hover:border-[#FF6600]/50'
          }`}
        >
          <Box className="mb-[0.5vh] w-[1.5rem] h-[1.5rem]" />
          <span className="text-[0.55rem] font-bold uppercase tracking-wider">Tout</span>
        </button>

        {/* BOUTONS CATÉGORIES 3D */}
        {CATEGORIES.map((cat) => {
          const isActive = activeFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`flex flex-col items-center justify-center min-w-[18vw] h-[18vw] max-w-[5rem] max-h-[5rem] p-[1vw] rounded-2xl border snap-center transition-all group ${
                isActive 
                  ? 'bg-[#FF6600]/20 border-[#FF6600] text-[#FF6600] scale-105 shadow-[0_0_15px_rgba(255,102,0,0.2)]' 
                  : 'bg-[#1E1E1E] border-[#333] text-[#B0BEC5] hover:border-[#FF6600]/50'
              }`}
            >
              <img 
                src={`/${cat.id}.png`} 
                alt={cat.label} 
                className={`w-[45%] h-[45%] object-contain mb-[0.5vh] transition-all duration-300 ${
                  isActive ? 'drop-shadow-[0_0_8px_rgba(255,102,0,0.8)]' : 'opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100'
                }`} 
              />
              <span className="text-[0.5rem] font-bold uppercase tracking-wider truncate w-full text-center px-[0.2rem]">
                {cat.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* LISTE DE L'INVENTAIRE */}
      <div className="grid gap-[2vh]">
        {filteredInventory.length === 0 ? (
          <div className="h-[20vh] flex flex-col items-center justify-center border-2 border-dashed border-[#333] rounded-3xl opacity-30 mt-[2vh]">
            <Box className="w-[2.5rem] h-[2.5rem] mb-[1vh]" />
            <p className="text-[0.85rem] font-bold uppercase">Zone Vide</p>
            <p className="text-[0.65rem] text-center mt-[1vh] px-[4vw]">Aucun outil détecté dans cette rubrique.</p>
          </div>
        ) : (
          filteredInventory.map((item: any) => (
            <div key={item.id} className="bg-[#1E1E1E] p-[4vw] sm:p-[1.5rem] rounded-2xl border-l-[0.25rem] border-[#FF6600] flex flex-col gap-[1.5vh]">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-white uppercase text-[0.85rem] mb-[0.5vh]">
                    {item.toolName || item.name || "Outil Inconnu"}
                  </h3>
                  <p className="text-[0.65rem] text-[#B0BEC5] italic mb-[1vh]">
                    {item.description || item.details}
                  </p>
                  <div className="flex gap-[2vw] sm:gap-[1rem] items-center">
                    <span className="text-[0.6rem] bg-black/40 px-[0.5rem] py-[0.15rem] rounded text-[#007BFF] font-bold uppercase">
                      {item.localisation || 'À RANGER'}
                    </span>
                    <div className={`flex items-center gap-[0.25rem] text-[0.6rem] font-bold ${(item.score_confiance || 100) > 70 ? 'text-green-500' : 'text-yellow-500'}`}>
                      {(item.score_confiance || 100) > 70 && <ShieldCheck className="w-[0.8rem] h-[0.8rem]" />}
                      <span>{item.score_confiance || 100}% Certifié</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => onDelete(item.id)} className="p-[1vw] text-red-900/50 hover:text-red-500 transition-colors">
                  <Trash2 className="w-[1.2rem] h-[1.2rem]" />
                </button>
              </div>
              <div className="mt-[0.5vh] pt-[1.5vh] border-t border-[#333]">
                <SafetyBadge hasDanger={item.safetyAlert} details={item.safetyDetails || "RAS - Conforme visuellement"} level={item.safetyLevel} userTier={currentTier} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* BOUTON FLOTTANT SCAN */}
      <button onClick={onStartScan} className="fixed bottom-[4vh] left-1/2 -translate-x-1/2 bg-[#FF6600] text-white px-[6vw] sm:px-[2rem] py-[2vh] rounded-full font-black flex items-center gap-[2vw] sm:gap-[0.5rem] shadow-lg active:scale-95 z-50 text-[0.85rem]">
        <Plus className="w-[1.5rem] h-[1.5rem]" /> LANCER LE SCAN
      </button>
    </div>
  );
};

export default Dashboard;