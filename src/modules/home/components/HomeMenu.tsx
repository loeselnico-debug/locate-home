import React from 'react';

interface HomeMenuProps {
  onNavigate: (view: 'inventory' | 'scanner' | 'search') => void;
  tier: string;
}

const HomeMenu: React.FC<HomeMenuProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full bg-transparent px-[8vw] pt-[8vh] pb-[5vh]">
      
      {/* Pyramide 3D avec les actifs PNG originaux */}
      <div className="flex-1 flex flex-col items-center justify-center gap-[6vh]">
        
        {/* Ligne 1 : RANGER / SCANNER */}
        <div className="flex justify-between w-full max-w-sm">
          <button 
            onClick={() => onNavigate('inventory')} 
            className="flex flex-col items-center gap-4 active:scale-95 transition-transform"
          >
            {/* Utilisation de ton image 3D pré-rendue */}
            <img src="/icon-ranger.png" alt="Ranger" className="w-[35vw] max-w-[140px] object-contain drop-shadow-2xl" />
            <span className="text-[#FF6600] font-black uppercase tracking-[0.3em] text-[0.65rem]">
              Ranger
            </span>
          </button>

          <button 
            onClick={() => onNavigate('scanner')} 
            className="flex flex-col items-center gap-4 active:scale-95 transition-transform"
          >
            <img src="/icon-scanner.png" alt="Scanner" className="w-[35vw] max-w-[140px] object-contain drop-shadow-2xl" />
            <span className="text-[#FF6600] font-black uppercase tracking-[0.3em] text-[0.65rem]">
              Scanner
            </span>
          </button>
        </div>

        {/* Ligne 2 : RETROUVER (Centré et légèrement plus grand) */}
        <div className="flex justify-center w-full">
          <button 
            onClick={() => onNavigate('search')} 
            className="flex flex-col items-center gap-4 active:scale-95 transition-transform"
          >
            <img src="/icon-retrouver.png" alt="Retrouver" className="w-[40vw] max-w-[160px] object-contain drop-shadow-2xl" />
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