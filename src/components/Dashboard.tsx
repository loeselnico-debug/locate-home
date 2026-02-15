import { useState, useEffect } from 'react';
import { ChevronRight, Settings } from 'lucide-react';
import { memoryService } from '../services/memoryService';
import type { InventoryItem } from '../types';

interface DashboardProps {
  onNavigate: (page: 'dashboard' | 'scanner' | 'library' | 'search') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [tools, setTools] = useState<InventoryItem[]>([]);

  useEffect(() => {
    setTools(memoryService.getTools());
  }, []);

  return (
    <div className="p-6 bg-[#121212] min-h-screen text-white">
      <div className="flex justify-between items-center mb-10">
        <img src="/logo.png" alt="LocateHome" className="h-10 w-auto" />
        <Settings className="text-gray-600" />
      </div>

      <div className="bg-[#1E1E1E] border border-[#333] rounded-3xl p-6 mb-8 shadow-xl">
        <div className="flex justify-between items-end mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF6600]">État Stock</p>
          <span className="text-3xl font-black">{tools.length} <span className="text-sm text-gray-600">/ 50</span></span>
        </div>
        <div className="w-full bg-black h-2 rounded-full overflow-hidden">
          <div className="bg-[#FF6600] h-full transition-all duration-1000" style={{ width: `${(tools.length/50)*100}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        {/* BOUTON SCANNER */}
        <button onClick={() => onNavigate('scanner')} className="w-full bg-[#FF6600] p-5 rounded-2xl flex items-center gap-4 text-black font-black active:scale-95 transition-all">
          <img src="/icon-scanner.png" className="w-14 h-14 object-contain" alt="" />
          <div className="text-left">
            <p className="uppercase text-xl leading-none">Scanner</p>
            <p className="text-[9px] uppercase opacity-70 mt-1">Identification IA</p>
          </div>
          <ChevronRight className="ml-auto opacity-40" />
        </button>

        {/* BOUTON RANGER */}
        <button onClick={() => onNavigate('library')} className="w-full bg-[#1E1E1E] border border-[#333] p-5 rounded-2xl flex items-center gap-4 text-white font-black active:scale-95 transition-all">
          <img src="/icon-ranger.png" className="w-14 h-14 object-contain" alt="" />
          <div className="text-left">
            <p className="uppercase text-xl leading-none">Ranger</p>
            <p className="text-[9px] uppercase text-gray-500 mt-1">Ma Bibliothèque</p>
          </div>
          <ChevronRight className="ml-auto text-gray-700" />
        </button>

        {/* BOUTON RETROUVER */}
        <button onClick={() => onNavigate('search')} className="w-full bg-[#1E1E1E] border border-[#333] p-5 rounded-2xl flex items-center gap-4 text-white font-black active:scale-95 transition-all">
          <img src="/icon-retrouver.png" className="w-14 h-14 object-contain" alt="" />
          <div className="text-left">
            <p className="uppercase text-xl leading-none">Retrouver</p>
            <p className="text-[9px] uppercase text-gray-500 mt-1">Assistant Vocal</p>
          </div>
          <ChevronRight className="ml-auto text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;