import React from 'react';

interface HomeMenuProps {
  onNavigate: (view: 'inventory' | 'scanner' | 'search' | 'settings' | any) => void;
  tier: string;
}

const HomeMenu: React.FC<HomeMenuProps> = ({ onNavigate, tier }) => {
  return (
    // NOUVEAU : Hauteur absolue calculée (Écran total - Header) et padding bas réduit
    <div className="h-[calc(100dvh-12.5vh)] w-full flex flex-col px-[5vw] pt-[2vh] pb-[calc(2vh+env(safe-area-inset-bottom))]">
      
      {/* ========================================== */}
      {/* STRATE HAUTE (Contrôles du Module)         */}
      {/* ========================================== */}
      <div className="w-full flex justify-between items-center shrink-0">
        <div className="bg-[#1E1E1E] px-[3vw] sm:px-4 py-[0.5vh] rounded-xl border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center">
          <span className="text-[clamp(0.6rem,2vw,0.7rem)] font-black uppercase tracking-widest bg-[linear-gradient(180deg,#858489,#e7e4ef,#858489,#b9b9b9,#858489)] bg-clip-text text-transparent">
            {tier}
          </span>
        </div>

        <button 
          onClick={() => onNavigate('settings')} 
          className="opacity-90 hover:opacity-100 transition-opacity active:scale-90 p-1"
        >
          <img 
            src="/gear.png" 
            className="w-[8vw] h-[8vw] max-w-[35px] max-h-[35px] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" 
            alt="Paramètres" 
          />
        </button>
      </div>

      {/* ========================================== */}
      {/* STRATE MÉDIANE (Le Manifeste - "Le Ressort") */}
      {/* ========================================== */}
      {/* NOUVEAU : Le flex-1 est ici pour pousser le contenu bas vers le fond */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-[85vw] mx-auto min-h-[15vh]">
        <p className="text-center text-white font-black uppercase tracking-wide leading-tight text-[clamp(0.6rem,2.5vw,0.9rem)] drop-shadow-md">
          "L'homme ne parle pas à l'IA pour l'écouter,<br />
          mais pour qu'elle devienne le prolongement de son<br />
          expertise terrain."
        </p>
        <p className="mt-[1.5vh] text-center font-black uppercase tracking-[0.2em] text-[clamp(0.6rem,2vw,0.8rem)] bg-[linear-gradient(180deg,#858489,#e7e4ef,#858489,#b9b9b9,#858489)] bg-clip-text text-transparent drop-shadow-sm">
          - Locate Systems -
        </p>
      </div>

      {/* ========================================== */}
      {/* STRATE BASSE (Thumb Zone - Boutons 3D)     */}
      {/* ========================================== */}
      <div className="w-full flex flex-col items-center gap-[4vh] shrink-0">
        
        {/* LIGNE 1 : RANGER / SCANNER */}
        <div className="flex justify-between w-full max-w-[80vw] sm:max-w-sm">
          <button 
            onClick={() => onNavigate('inventory')} 
            className="flex flex-col items-center gap-[1.5vh] active:scale-95 transition-transform w-[45%]"
          >
            <img src="/icon-ranger.png" alt="Ranger" className="w-[28vw] max-w-[120px] object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]" />
            <span className="text-[#FF6600] font-black uppercase tracking-widest text-[clamp(0.7rem,2.5vw,1rem)]">
              Ranger
            </span>
          </button>

          <button 
            onClick={() => onNavigate('scanner')} 
            className="flex flex-col items-center gap-[1.5vh] active:scale-95 transition-transform w-[45%]"
          >
            <img src="/icon-scanner.png" alt="Scanner" className="w-[28vw] max-w-[120px] object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]" />
            <span className="text-[#FF6600] font-black uppercase tracking-widest text-[clamp(0.7rem,2.5vw,1rem)]">
              Scanner
            </span>
          </button>
        </div>

        {/* LIGNE 2 : RETROUVER (Action Maîtresse) */}
        <div className="flex justify-center w-full mt-[1vh]">
          <button 
            onClick={() => onNavigate('search')} 
            className="flex flex-col items-center gap-[1.5vh] active:scale-95 transition-transform"
          >
            <img src="/icon-retrouver.png" alt="Retrouver" className="w-[32vw] max-w-[140px] object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]" />
            <span className="text-[#FF6600] font-black uppercase tracking-widest text-[clamp(0.8rem,3vw,1.1rem)]">
              Retrouver
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default HomeMenu;