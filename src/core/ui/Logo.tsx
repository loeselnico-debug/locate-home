import React from 'react';

// Référérentiel strict des couleurs par module
export type AppModule = 'HOME' | 'ASSET' | 'KITCHEN' | 'GARAGE' | 'CARE';

const MODULE_CONFIG: Record<AppModule, { color: string; label: string }> = {
  HOME: { color: '#FF6600', label: 'HOME' },
  ASSET: { color: '#007BFF', label: 'ASSET' },
  KITCHEN: { color: '#28A745', label: 'KITCHEN' },
  GARAGE: { color: '#DC3545', label: 'GARAGE' },
  CARE: { color: '#E0E0E0', label: 'CARE' }
};

interface LogoProps {
  activeModule?: AppModule;
}

const Logo: React.FC<LogoProps> = ({ activeModule = 'HOME' }) => {
  const config = MODULE_CONFIG[activeModule];

  return (
    // Conteneur s'adaptant parfaitement au 12.5vh du header, avec marges de sécurité bord d'écran (px-[5vw])
    <div className="w-full h-full flex justify-between items-center px-[5vw] select-none">
      
      {/* BLOC GAUCHE : LOCATE + NOM DU MODULE */}
      <div 
        className="flex items-center gap-[2vw]"
        style={{ fontFamily: "'Intro Rust', sans-serif" }} // Appel de ta police Canva
      >
        <span 
          className="font-black text-white uppercase tracking-widest text-[clamp(1.2rem,6vw,2.2rem)] leading-none"
          style={{ WebkitTextStroke: '1px #000000' }} // Effet bordure 50 de Canva
        >
          LOCATE
        </span>
        <span 
          className="font-black uppercase tracking-widest text-[clamp(1.2rem,6vw,2.2rem)] leading-none transition-colors duration-500"
          style={{ 
            color: config.color,
            WebkitTextStroke: '1px #000000' // Effet bordure 50 de Canva
          }}
        >
          {config.label}
        </span>
      </div>

      {/* BLOC DROITE : By Systems */}
      <div 
        className="self-end mb-[2.5vh] flex flex-col items-end" // Alignement au 1/3 bas
        style={{ fontFamily: "'Rebel', cursive, sans-serif" }} // Appel de ta police Canva
      >
        <span className="text-[#a6a6a6] text-[clamp(0.7rem,3.5vw,1.2rem)] leading-none drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">
          By Systems
        </span>
      </div>

    </div>
  );
};

export default Logo;