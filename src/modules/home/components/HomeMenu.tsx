import React from 'react';

interface HomeMenuProps {
  onNavigate: (view: 'inventory' | 'scanner' | 'search') => void;
  tier: string;
}

const HomeMenu: React.FC<HomeMenuProps> = ({ onNavigate }) => {
  return (
    // 1. Modification du padding bas pour sécuriser la zone Apple et repousser le contenu
    <div className="flex flex-col h-full bg-transparent px-[8vw] pb-[calc(10vh+env(safe-area-inset-bottom))]">
      
      {/* 2. justify-end au lieu de justify-center pour aligner par le bas */}
      <div className="flex-1 flex flex-col items-center justify-end gap-[3vh]">
        
        {/* Ligne 1 : RANGER / SCANNER */}
        <div className="flex justify-between w-full max-w-sm px-[2vw]">
          <button 
            onClick={() => onNavigate('inventory')} 
            className="flex flex-col items-center gap-3 active:scale-95 transition-transform"
          >
            <img src="/icon-ranger.png" alt="Ranger" className="w-[32vw] max-w-[130px] object-contain drop-shadow-2xl" />
            <span className="text-[#FF6600] font-black uppercase tracking-[0.3em] text-[0.65rem]">
              Ranger
            </span>
          </button>

          <button 
            onClick={() => onNavigate('scanner')} 
            className="flex flex-col items-center gap-3 active:scale-95 transition-transform"
          >
            <img src="/icon-scanner.png" alt="Scanner" className="w-[32vw] max-w-[130px] object-contain drop-shadow-2xl" />
            <span className="text-[#FF6600] font-black uppercase tracking-[0.3em] text-[0.65rem]">
              Scanner
            </span>
          </button>
        </div>

        {/* Ligne 2 : RETROUVER (Au plus près du pouce) */}
        <div className="flex justify-center w-full mt-[1vh]">
          <button 
            onClick={() => onNavigate('search')} 
            className="flex flex-col items-center gap-3 active:scale-95 transition-transform"
          >
            <img src="/icon-retrouver.png" alt="Retrouver" className="w-[38vw] max-w-[150px] object-contain drop-shadow-2xl" />
            <span className="text-[#FF6600] font-black uppercase tracking-[0.3em] text-[0.65rem]">
              Retrouver
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default HomeMenu;