import { useState } from 'react';
import type { InventoryItem } from '../../../types';
import { CATEGORIES } from '../../../types'; // <-- IMPORTATION DE LA SOURCE DE VÉRITÉ
import { Plus, Trash2, Box, ShieldCheck, Zap, Hammer, Wrench, Nut, Lightbulb, Paintbrush, Ruler, Leaf, Shield } from 'lucide-react';
import { useUserTier } from '../../../core/security/useUserTier';
import { SafetyBadge } from '../../../core/ui/SafetyBadge';

interface DashboardProps {
  inventory: InventoryItem[];
  onStartScan: () => void;
  onDelete: (id: string) => void;
  limit: number;
}

// Traducteur pour convertir le texte de la source de vérité en vraie icône visuelle
const IconMap: Record<string, any> = {
  'Zap': Zap,
  'Hammer': Hammer,
  'Wrench': Wrench,
  'Nut': Nut,
  'Lightbulb': Lightbulb,
  'Paintbrush': Paintbrush,
  'Ruler': Ruler,
  'Leaf': Leaf,
  'Shield': Shield
};

const Dashboard = ({ inventory, onStartScan, onDelete, limit }: DashboardProps) => {
  const { currentTier } = useUserTier();
  const progress = (inventory.length / limit) * 100;
  
  const [activeFilter, setActiveFilter] = useState('all');

  // On crée les boutons dynamiquement : Le bouton "Tout", puis on branche le reste sur la Source de Vérité
  const filterTabs = [
    { id: 'all', label: 'Tout', Icon: Box },
    ...CATEGORIES.map(cat => ({
      id: cat.id,
      label: cat.label.split(' ')[0], // Garde juste le premier mot pour que le bouton reste petit
      Icon: IconMap[cat.iconName] || Box
    }))
  ];

  const filteredInventory = inventory.filter(item => {
    if (activeFilter === 'all') return true;
    return item.category?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* HEADER */}
      <div className="flex justify-between items-center py-4 border-b border-[#333]">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tighter">
            <span className="text-[#FF6600]">LOCATE</span>
            <span className="text-white">HOME</span>
          </h1>
          <div className="bg-[#FF6600] text-[10px] font-bold text-white px-2 py-0.5 rounded-sm -mt-1 self-start transform -skew-x-12">
            by Systems
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-[#FF6600] text-black text-xs font-black uppercase shadow-[0_0_10px_rgba(255,102,0,0.3)]">
          {currentTier}
        </div>
      </div>

      {/* CAPACITÉ */}
      <div className="bg-[#1E1E1E] p-4 rounded-2xl border border-[#333]">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs uppercase tracking-widest text-[#B0BEC5]">Inventaire</span>
          <span className="text-sm font-bold text-white">{inventory.length} / {limit}</span>
        </div>
        <div className="w-full h-2 bg-black rounded-full overflow-hidden">
          <div className="h-full bg-[#FF6600] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* RUBRIQUES (FILTRES CONNECTÉS À TYPES.TS) */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 snap-x">
        {filterTabs.map((tab) => {
          const Icon = tab.Icon;
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[70px] h-[70px] rounded-2xl border snap-center transition-all ${
                isActive 
                  ? 'bg-[#FF6600]/20 border-[#FF6600] text-[#FF6600] scale-105 shadow-[0_0_15px_rgba(255,102,0,0.2)]' 
                  : 'bg-[#1E1E1E] border-[#333] text-gray-500 hover:border-gray-500'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* LISTE */}
      <div className="grid gap-4">
        {filteredInventory.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-[#333] rounded-3xl opacity-30 mt-4">
            <Box size={40} className="mb-2" />
            <p className="text-sm font-bold uppercase">Zone Vide</p>
            <p className="text-xs text-center mt-2 px-8">Aucun outil détecté dans cette rubrique. Lancez un scan.</p>
          </div>
        ) : (
          filteredInventory.map((item: any) => (
            <div key={item.id} className="bg-[#1E1E1E] p-4 rounded-2xl border-l-4 border-[#FF6600] flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-white uppercase text-sm mb-1">
                    {item.toolName || item.name || "Outil Inconnu"}
                  </h3>
                  <p className="text-[11px] text-[#B0BEC5] italic mb-2">
                    {item.description || item.details}
                  </p>
                  <div className="flex gap-3 items-center">
                    <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded text-[#007BFF] font-bold uppercase">
                      {item.localisation || 'À RANGER'}
                    </span>
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${(item.score_confiance || 100) > 70 ? 'text-green-500' : 'text-yellow-500'}`}>
                      {(item.score_confiance || 100) > 70 && <ShieldCheck size={12} />}
                      <span>{item.score_confiance || 100}% Certifié</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => onDelete(item.id)} className="p-2 text-red-900/50 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="mt-1 pt-3 border-t border-[#333]">
                <SafetyBadge hasDanger={item.safetyAlert} details={item.safetyDetails || "RAS - Conforme visuellement"} level={item.safetyLevel} userTier={currentTier} />
              </div>
            </div>
          ))
        )}
      </div>

      <button onClick={onStartScan} className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#FF6600] text-white px-8 py-4 rounded-full font-black flex items-center gap-3 shadow-lg active:scale-95 z-50">
        <Plus size={24} /> LANCER LE SCAN
      </button>
    </div>
  );
};

export default Dashboard;