import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="relative inline-flex flex-col items-center select-none pt-1">
      {/* Texte Principal : LOCATE (Orange) HOME (Blanc) */}
      <div className="flex font-black italic tracking-tighter text-[1.8rem] leading-none">
        <span className="text-[#FF6600]">LOCATE</span>
        <span className="text-white ml-1 uppercase">Home</span>
      </div>
      
      {/* Bandeau Oblique "By Systems" - Transparence 20% et Rotation 20° sous OME */}
      <div className="absolute top-[80%] right-[-5px] bg-[#FF6600]/20 px-[6px] py-[2px] transform rotate-[20deg] z-10">
        
        {/* Texte Métallique : Dégradé Gauche (Or Foncé) -> Droite (Or Clair) */}
        <span className="text-[10px] font-black italic tracking-[0.15em] block leading-tight bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#FDE047] bg-clip-text text-transparent">
          By Systems
        </span>
        
      </div>
    </div>
  );
};

export default Logo;