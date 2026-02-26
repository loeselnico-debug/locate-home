import React from 'react';

const Logo: React.FC = () => {
  return (
    // 1. Conteneur strict 1/8 de l'écran (12.5vh)
    <div className="w-full h-[12.5vh] flex items-center justify-center shrink-0">
      <div className="relative inline-flex flex-col items-center select-none pt-[1vh]">
        
        {/* 2. Texte Principal : Taille fluide (clamp) sécurisée pour J5 jusqu'à iPhone 17 */}
        <div className="flex font-black italic tracking-wide text-[clamp(1.5rem,6.5vw,2.2rem)] leading-none">
          <span className="text-[#FF6600]">LOCATE</span>
          <span className="text-white ml-[1vw] uppercase">Home</span>
        </div>
        
        {/* 3. Bandeau Oblique "By Systems" : Unités fluides Zéro Pixel */}
        <div className="absolute bottom-[-10%] right-[2%] bg-[#FF6600] px-[1vw] py-[0.5vh] z-10 shadow-sm">
          
          <span className="text-[clamp(0.4rem,1.8vw,0.6rem)] font-black italic tracking-[0.15em] block leading-tight bg-gradient-to-r from-[#70706f] via-[#f1f1ef] to-[#FDE047] bg-clip-text text-transparent">
            By Systems
          </span>
          
        </div>
        
      </div>
    </div>
  );
};

export default Logo;