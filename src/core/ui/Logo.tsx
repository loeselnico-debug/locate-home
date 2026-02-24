import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="relative inline-flex flex-col items-center select-none pt-1">
      {/* Texte Principal : LOCATE (Orange) HOME (Blanc) */}
      <div className="flex font-black italic tracking-tighter text-[1.8rem] leading-none">
        <span className="text-[#FF6600]">LOCATE</span>
        <span className="text-white ml-1 uppercase">Home</span>
      </div>
      
      {/* Bandeau Oblique "By Systems" - Réduit de 40% (scale-0.6) et Rotation -18° */}
      {/* Ajustement léger des positions top/right pour compenser la réduction de taille */}
      <div className="absolute top-[78%] right-[-3px] bg-[#FF6600] px-[6px] py-[2px] transform -rotate-[0deg] scale-[0.4] z-10">
        
        {/* Texte Métallique : Dégradé Gauche (Or Foncé) -> Droite (Or Clair) */}
        <span className="text-[10px] font-black italic tracking-[0.15em] block leading-tight bg-gradient-to-r from-[#70706f] via-[#f1f1ef] to-[#FDE047] bg-clip-text text-transparent">
          By Systems
        </span>
        
      </div>
    </div>
  );
};

export default Logo;