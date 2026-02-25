import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="relative inline-flex flex-col items-center select-none pt-1">
      
      {/* Texte Principal : Taille fluide (min 1.5rem, idéal 7vw, max 2.2rem) */}
      <div className="flex font-black italic tracking-tighter text-[clamp(1.5rem,7vw,2.2rem)] leading-none">
        <span className="text-[#FF6600]">LOCATE</span>
        <span className="text-white ml-1 uppercase">Home</span>
      </div>
      
      {/* Bandeau Oblique "By Systems" : Positionné en bas à droite, dimensionné sans scale */}
      <div className="absolute bottom-[-5%] right-[2%] bg-[#FF6600] px-[4px] py-[2px] z-10 shadow-sm">
        
        {/* Texte Métallique : Taille proportionnelle et ajustée */}
        <span className="text-[clamp(0.35rem,1.8vw,0.45rem)] font-black italic tracking-[0.15em] block leading-tight bg-gradient-to-r from-[#70706f] via-[#f1f1ef] to-[#FDE047] bg-clip-text text-transparent">
          By Systems
        </span>
        
      </div>
      
    </div>
  );
};

export default Logo;