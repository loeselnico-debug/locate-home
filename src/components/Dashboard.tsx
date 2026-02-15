import React, { useState, useEffect } from 'react';
import { Settings, PlusCircle, LayoutGrid, Search } from 'lucide-react';
import { getInventory } from '../services/memoryService'; 

// C'est ici qu'on définit les "bornes" pour brancher la navigation
interface DashboardProps {
  onNavigate: (page: 'search' | 'dashboard' | 'scanner' | 'library') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [itemCount, setItemCount] = useState<number>(0);
  const MAX_CAPACITY = 50; 

  const percentage = Math.min((itemCount / MAX_CAPACITY) * 100, 100);

  useEffect(() => {
    const refreshData = () => {
      const items = getInventory();
      setItemCount(items.length);
    };
    refreshData();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 font-sans">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF6600] rounded-sm shadow-[0_0_10px_#FF6600]"></div>
          <h1 className="text-xl font-black tracking-tighter italic">PHOENIX-EYE</h1>
        </div>
        <Settings className="text-[#B0BEC5] hover:rotate-90 transition-transform cursor-pointer" />
      </header>

      {/* JAUGE DYNAMIQUE */}
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

        <div className="h-4 bg-[#000] rounded-full overflow-hidden border border-[#333]">
          <div 
            className="h-full bg-[#FF6600] transition-all duration-1000 ease-out shadow-[0_0_15px_#FF6600]"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </section>

      {/* NAVIGATION : On a branché les fonctions onNavigate ici */}
      <nav className="grid grid-cols-2 gap-4">
        {/* BOUTON SCANNER */}
        <button 
          onClick={() => onNavigate('scanner')}
          className="flex flex-col items-center justify-center aspect-square bg-[#1E1E1E] border border-[#333] rounded-2xl hover:border-[#FF6600] transition-colors group"
        >
          <div className="p-4 bg-[#000] rounded-full mb-3 group-hover:shadow-[0_0_10px_#FF6600] transition-all">
             <PlusCircle className="text-[#FF6600]" size={32} />
          </div>
          <span className="font-bold text-sm">SCANNER</span>
        </button>

        {/* BOUTON RANGER (LIBRARY) */}
        <button 
          onClick={() => onNavigate('library')}
          className="flex flex-col items-center justify-center aspect-square bg-[#1E1E1E] border border-[#333] rounded-2xl hover:border-[#FF6600] transition-colors group"
        >
          <div className="p-4 bg-[#000] rounded-full mb-3 group-hover:shadow-[0_0_10px_#FF6600] transition-all">
             <LayoutGrid className="text-[#FF6600]" size={32} />
          </div>
          <span className="font-bold text-sm">RANGER</span>
        </button>

        {/* BOUTON RETROUVER (SEARCH) */}
        <button 
          onClick={() => onNavigate('search')}
          className="flex flex-col items-center justify-center aspect-square bg-[#1E1E1E] border border-[#333] rounded-2xl hover:border-[#FF6600] transition-colors group"
        >
          <div className="p-4 bg-[#000] rounded-full mb-3 group-hover:shadow-[0_0_10px_#FF6600] transition-all">
             <Search className="text-[#FF6600]" size={32} />
          </div>
          <span className="font-bold text-sm">RETROUVER</span>
        </button>

        {/* BOUTON DESACTIVER (STOCK V2) */}
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