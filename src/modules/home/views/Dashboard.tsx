import type { InventoryItem } from '../../../types';
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
  const { currentTier } = useUserTier(); // <-- Récupération dynamique de l'abonnement
  const progress = (inventory.length / limit) * 100;

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
        {/* Affichage dynamique du TIER */}
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

      {/* LISTE */}
      <div className="grid gap-4">
        {inventory.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-[#333] rounded-3xl opacity-30">
            <Box size={40} className="mb-2" />
            <p className="text-sm">Aucun outil scanné</p>
          </div>
        ) : (
          inventory.map((item: any) => (
            <div key={item.id} className="bg-[#1E1E1E] p-4 rounded-2xl border-l-4 border-[#FF6600] flex flex-col gap-3">
              
              {/* Ligne Haut : Infos principales */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Tolérance pour l'ancien format (name) et le nouveau (toolName) */}
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

              {/* Ligne Bas : INJECTION DU CERVEAU DE SÉCURITÉ */}
              <div className="mt-1 pt-3 border-t border-[#333]">
                <SafetyBadge 
                  hasDanger={item.safetyAlert} 
                  details={item.safetyDetails || "RAS - Conforme visuellement"} 
                  level={item.safetyLevel} 
                  userTier={currentTier} 
                />
              </div>

            </div>
          ))
        )}
      </div>

      {/* SCAN BUTTON */}
      <button 
        onClick={onStartScan}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#FF6600] text-white px-8 py-4 rounded-full font-black flex items-center gap-3 shadow-lg active:scale-95 z-50"
      >
        <Plus size={24} /> LANCER LE SCAN
      </button>
    </div>
  );
};

export default Dashboard;