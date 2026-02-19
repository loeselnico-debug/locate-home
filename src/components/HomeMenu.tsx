import React from 'react';
import { Settings } from 'lucide-react'; // On utilise une icône standard pour la roue

interface HomeMenuProps {
  onNavigate: (view: 'inventory' | 'scanner' | 'search' | 'settings') => void; // <--- Ajout de settings
  tier?: 'FREE' | 'PREMIUM' | 'PRO';
}

const HomeMenu: React.FC<HomeMenuProps> = ({ onNavigate, tier = 'FREE' }) => {
  
  // Logique du dégradé métallique pour "by Systems"
  const metallicGold = {
    background: 'linear-gradient(to bottom, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] font-sans overflow-hidden">
      
      {/* --- TÊTE (HEADER) --- */}
      <header className="relative pt-6 pb-4 px-6 border-b border-gray-400/30">
        
        {/* Ligne 1 : Tier et Paramètres */}
        <div className="flex justify-between items-center mb-4">
          <button className="bg-gradient-to-r from-yellow-400 to-orange-600 px-4 py-1 rounded-full text-[10px] font-black text-black shadow-[0_0_15px_rgba(255,165,0,0.6)] uppercase tracking-tighter">
            {tier === 'FREE' ? 'Freemium' : tier}
          </button>
          
          <button 
            onClick={() => onNavigate('settings')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Settings size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Ligne 2 : Titre Central */}
        <div className="text-center relative py-2">
          <h1 className="text-4xl font-black tracking-tighter inline-block">
            <span className="text-orange-500">LOCATE</span>
            <span className="text-white ml-1">HOME</span>
          </h1>
          
          {/* Bandeau Oblique "by Systems" */}
          <div className="absolute -bottom-1 right-[15%] transform translate-x-1/4">
            <div className="bg-orange-600 px-3 py-0.5 rotate-[-2deg] shadow-lg">
              <span style={metallicGold} className="text-[11px] font-black uppercase tracking-widest">
                by Systems
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* --- CORPS (BODY) --- */}
      <main className="flex-1 flex flex-col justify-center items-center px-8 gap-8">
        
        {/* Grille de boutons */}
        <div className="grid grid-cols-2 gap-8 w-full max-w-sm">
          {/* RANGER */}
          <button 
            onClick={() => onNavigate('inventory')}
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-28 h-28 flex items-center justify-center">
              <img src="/icon-ranger.png" alt="Ranger" className="w-full h-full object-contain" />
            </div>
            <span className="mt-2 text-orange-500 font-black tracking-[0.2em] text-xs">RANGER</span>
          </button>

          {/* SCANNER */}
          <button 
            onClick={() => onNavigate('scanner')}
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-28 h-28 flex items-center justify-center">
              <img src="/icon-scanner.png" alt="Scanner" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,107,0,0.3)]" />
            </div>
            <span className="mt-2 text-orange-500 font-black tracking-[0.2em] text-xs">SCANNER</span>
          </button>
        </div>

        {/* RETROUVER (Bouton du bas) */}
        <button 
          onClick={() => onNavigate('search')}
          className="flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div className="w-32 h-32 flex items-center justify-center">
            <img src="/icon-retrouver.png" alt="Retrouver" className="w-full h-full object-contain" />
          </div>
          <span className="mt-2 text-orange-500 font-black tracking-[0.2em] text-xs uppercase">Retrouver</span>
        </button>

      </main>

      {/* FOOTER DISCRET */}
      <footer className="pb-6 text-center opacity-10">
        <span className="text-[8px] text-white tracking-[0.5em] uppercase">Industrial Interface v1.2</span>
      </footer>
    </div>
  );
};

export default HomeMenu;