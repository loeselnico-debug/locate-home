import React from 'react';
import { Settings } from 'lucide-react';

interface HomeMenuProps {
  onNavigate: (view: 'inventory' | 'scanner' | 'search' | 'settings') => void;
  tier?: 'FREE' | 'PREMIUM' | 'PRO';
}

const HomeMenu: React.FC<HomeMenuProps> = ({ onNavigate, tier = 'FREE' }) => {
  
  // Rendu du dégradé métallique doré pour la signature
  const metallicGoldStyle = {
    background: 'linear-gradient(to bottom, #BF953F 0%, #FCF6BA 45%, #B38728 55%, #FBF5B7 90%, #AA771C 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] font-sans overflow-hidden select-none">
      
      {/* --- HEADER : ADN VISUEL "BY SYSTEMS" --- */}
      <header className="relative pt-[4vh] pb-[2vh] px-[6vw] border-b border-white/5">
        
        {/* Ligne 1 : Tier Néon & Paramètres */}
        <div className="flex justify-between items-center mb-[3vh]">
          <div className="relative group">
            <div className="absolute inset-0 bg-orange-600 blur-[8px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <button className="relative bg-gradient-to-r from-[#FFD700] to-[#FF6600] px-[1.2rem] py-[0.3rem] rounded-full text-[0.65rem] font-black text-black uppercase tracking-widest shadow-[0_0_15px_rgba(255,102,0,0.4)] border border-white/20">
              {tier === 'FREE' ? 'FREEMIUM' : tier}
            </button>
          </div>
          
          <button 
            onClick={() => onNavigate('settings')}
            className="text-white/40 hover:text-white transition-all active:rotate-45"
          >
            <Settings size={28} strokeWidth={1.2} />
          </button>
        </div>

        {/* Ligne 2 : Titre Centralisé & Signature Calibrée */}
        <div className="text-center relative py-[1vh]">
          <h1 className="text-[2.8rem] font-black tracking-tighter leading-none flex justify-center items-center italic">
            <span className="text-[#FF6600]">LOCATE</span>
            <span className="text-white ml-[0.5rem]">HOME</span>
          </h1>
          
          {/* Signature : Bandeau Oblique sous le "E" de HOME */}
          <div className="absolute right-[15%] bottom-[-0.5rem]">
            <div className="bg-[#FF6600] px-[1.2rem] py-[0.15rem] rotate-[-12deg] shadow-[4px_4px_10px_rgba(0,0,0,0.5)] border-b border-black/20">
              <span style={metallicGoldStyle} className="text-[0.65rem] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                by Systems
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* --- CORPS : HUB D'ACTIONS 3D --- */}
      <main className="flex-1 flex flex-col justify-center items-center px-[8vw] gap-[6vh]">
        
        {/* Grille : RANGER & SCANNER */}
        <div className="grid grid-cols-2 gap-[8vw] w-full max-w-[400px]">
          {/* RANGER */}
          <button 
            onClick={() => onNavigate('inventory')}
            className="flex flex-col items-center group active:scale-90 transition-all"
          >
            <div className="relative w-full aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500"></div>
              <img src="/icon-ranger.png" alt="Ranger" className="w-[85%] h-[85%] object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.6)]" />
            </div>
            <span className="mt-[1.5vh] text-[#FF6600] font-black tracking-[0.3em] text-[0.7rem] uppercase">Ranger</span>
          </button>

          {/* SCANNER */}
          <button 
            onClick={() => onNavigate('scanner')}
            className="flex flex-col items-center group active:scale-90 transition-all"
          >
            <div className="relative w-full aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-[#FF6600]/5 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500"></div>
              <img src="/icon-scanner.png" alt="Scanner" className="w-[85%] h-[85%] object-contain drop-shadow-[0_15px_20px_rgba(255,102,0,0.3)]" />
            </div>
            <span className="mt-[1.5vh] text-[#FF6600] font-black tracking-[0.3em] text-[0.7rem] uppercase">Scanner</span>
          </button>
        </div>

        {/* RETROUVER : ACTION MAÎTRE */}
        <div className="w-full max-w-[280px]">
          <button 
            onClick={() => onNavigate('search')}
            className="flex flex-col items-center w-full group active:scale-95 transition-all"
          >
            <div className="relative w-[60%] aspect-square flex items-center justify-center">
              <img src="/icon-retrouver.png" alt="Retrouver" className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]" />
              <div className="absolute -bottom-[10%] w-[80%] h-[10%] bg-black/40 blur-md rounded-full"></div>
            </div>
            <span className="mt-[2vh] text-[#FF6600] font-black tracking-[0.4em] text-[0.8rem] uppercase bg-white/5 px-[2rem] py-[0.5rem] rounded-full border border-white/5">
              Retrouver
            </span>
          </button>
        </div>

      </main>

      {/* --- FOOTER : VERSIONING SYSTÈME --- */}
      <footer className="pb-[4vh] text-center">
        <div className="h-[1px] w-[20%] bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto mb-[2vh]"></div>
        <span className="text-[0.5rem] text-white/20 font-medium tracking-[0.6em] uppercase">
          Locate Systems Industrial Interface v3.1
        </span>
      </footer>
    </div>
  );
};

export default HomeMenu;