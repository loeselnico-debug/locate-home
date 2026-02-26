import React from 'react';

interface HomeMenuProps {
  onNavigate: (view: 'inventory' | 'scanner' | 'search') => void;
  tier: string;
}

const HomeMenu: React.FC<HomeMenuProps> = ({ onNavigate }) => {
  return (
    // 1. flex-1 pour prendre tout l'espace sous le logo, pb fluide pour le safe-area
    <div className="flex-1 flex flex-col justify-end bg-transparent px-[8vw] pb-[calc(2vh+env(safe-area-inset-bottom))]">
      
      {/* 2. mt-auto agit comme un ressort pour plaquer le bloc en bas */}
      <div className="w-full flex flex-col items-center mt-auto">
        
        {/* NIVEAU 2 : RANGER / SCANNER (Espacement de 4vh avec Retrouver) */}
        <div className="flex justify-between w-full max-w-sm px-[2vw] mb-[4vh]">
          <button 
            onClick={() => onNavigate('inventory')} 
            className="flex flex-col items-center gap-[1.5vh] active:scale-95 transition-transform w-[45%]"
          >
            <img src="/icon-ranger.png" alt="Ranger" className="w-[32vw] max-w-[130px] object-contain drop-shadow-2xl" />
            <span className="text-[#FF6600] font-black uppercase tracking-[0.2em] text-[clamp(0.6rem,2vw,0.8rem)]">
              Ranger
            </span>
          </button>

          <button 
            onClick={() => onNavigate('scanner')} 
            className="flex flex-col items-center gap-[1.5vh] active:scale-95 transition-transform w-[45%]"
          >
            <img src="/icon-scanner.png" alt="Scanner" className="w-[32vw] max-w-[130px] object-contain drop-shadow-2xl" />
            <span className="text-[#FF6600] font-black uppercase tracking-[0.2em] text-[clamp(0.6rem,2vw,0.8rem)]">
              Scanner
            </span>
          </button>
        </div>

        {/* NIVEAU 1 : RETROUVER (Action Maîtresse isolée au plus près du pouce) */}
        <div className="flex justify-center w-full">
          <button 
            onClick={() => onNavigate('search')} 
            className="flex flex-col items-center gap-[1.5vh] active:scale-95 transition-transform"
          >
            <img src="/icon-retrouver.png" alt="Retrouver" className="w-[38vw] max-w-[150px] object-contain drop-shadow-2xl" />
            <span className="text-[#FF6600] font-black uppercase tracking-[0.3em] text-[clamp(0.7rem,2.5vw,0.9rem)]">
              Retrouver
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default HomeMenu;