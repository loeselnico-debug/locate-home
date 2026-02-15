import React, { useState, useEffect } from 'react';
import { Settings, PlusCircle, LayoutGrid, Search } from 'lucide-react';
// Importation du service de mémoire (vérifie bien le chemin vers ton dossier services)
import { getInventory } from '../services/memoryService'; 

const Dashboard: React.FC = () => {
  const [itemCount, setItemCount] = useState<number>(0);
  const MAX_CAPACITY = 50; // Limite PRO définie dans ton manifeste

  // Calcul du pourcentage pour la jauge
  // Formule : $\text{pourcentage} = (\text{itemCount} / \text{MAX\_CAPACITY}) \times 100$
  const percentage = Math.min((itemCount / MAX_CAPACITY) * 100, 100);

  useEffect(() => {
    // Fonction pour charger les données au démarrage
    const refreshData = () => {
      const items = getInventory();
      setItemCount(items.length);
    };

    refreshData();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 font-sans">
      
      {/* HEADER : Logo Phoenix-Eye */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF6600] rounded-sm shadow-[0_0_10px_#FF6600]"></div>
          <h1 className="text-xl font-black tracking-tighter italic">PHOENIX-EYE</h1>
        </div>
        <Settings className="text-[#B0BEC5] hover:rotate-90 transition-transform cursor-pointer" />
      </header>

      {/* JAUGE D'INVENTAIRE DYNAMIQUE */}
      <section className="bg-[#1E1E1E] border border-[#333] rounded-xl p-6 mb-8 shadow-2xl">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[#B0BEC5] text-xs uppercase tracking-widest mb-1">Capacité Inventaire</p>
            <h2 className="text-3xl font-bold text-white">
              {itemCount} <span className="text-[#B0BEC5] text-lg font-normal">/ {MAX_CAPACITY}</span>
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[#FF6600] font-mono font-bold text-lg">{Math.round(percentage)}%</span>
          </div>
        </div>

        {/* Barre de progression avec effet Glow Orange */}
        <div className="h-4 bg-[#000] rounded-full overflow-hidden border border-[#333]">
          <div 
            className="h-full bg-[#FF6600] transition-all duration-1000 ease-out shadow-[0_0_15px_#FF6600]"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-[10px] text-[#B0BEC5] mt-3 italic">* Mode PRO activé : Optimisé pour iPhone 12 Pro</p>
      </section>

      {/* BOUTONS D'ACTION (Grille 2x2) */}
      <nav className="grid grid-cols-2 gap-4">
        <button className="flex flex-col items-center justify-center aspect-square bg-[#1E1E1E] border border-[#333] rounded-2xl hover:border-[#FF6600] transition-colors group">
          <div className="p-4 bg-[#000] rounded-full mb-3 group-hover:shadow-[0_0_10px_#FF6600] transition-all">
             <PlusCircle className="text-[#FF6600]" size={32} />
          </div>
          <span className="font-bold text-sm">SCANNER</span>
        </button>

        <button className="flex flex-col items-center justify-center aspect-square bg-[#1E1E1E] border border-[#333] rounded-2xl hover:border-[#FF6600] transition-colors group">
          <div className="p-4 bg-[#000] rounded-full mb-3 group-hover:shadow-[0_0_10px_#FF6600] transition-all">
             <LayoutGrid className="text-[#FF6600]" size={32} />
          </div>
          <span className="font-bold text-sm">RANGER</span>
        </button>

        <button className="flex flex-col items-center justify-center aspect-square bg-[#1E1E1E] border border-[#333] rounded-2xl hover:border-[#FF6600] transition-colors group">
          <div className="p-4 bg-[#000] rounded-full mb-3 group-hover:shadow-[0_0_10px_#FF6600] transition-all">
             <Search className="text-[#FF6600]" size={32} />
          </div>
          <span className="font-bold text-sm">RETROUVER</span>
        </button>

        <button className="flex flex-col items-center justify-center aspect-square bg-[#1E1E1E] border border-[#333] rounded-2xl opacity-40 grayscale cursor-not-allowed">
          <div className="p-4 bg-[#000] rounded-full mb-3">
             <div className="w-8 h-8 border-2 border-[#B0BEC5] rounded-full flex items-center justify-center text-[10px]">BT</div>
          </div>
          <span className="font-bold text-sm uppercase">Stock (V2)</span>
        </button>
      </nav>

    </div>
  );
};

export default Dashboard;