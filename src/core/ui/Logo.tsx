import React from 'react';

const Logo: React.FC = () => {
  return (
    // Conteneur strict 1/8 de l'écran (12.5vh)
    <div className="w-full h-[12.5vh] flex items-center justify-center shrink-0">
      <div className="relative inline-flex flex-col items-center select-none pt-[1vh]">
        
        {/* Texte Principal : Taille fluide (clamp) sécurisée */}
        <div className="flex font-black italic tracking-wide text-[clamp(1.5rem,6.5vw,2.2rem)] leading-none drop-shadow-md">
          <span className="text-[#FF6600]">LOCATE</span>
          <span className="text-white ml-[1vw] uppercase">Home</span>
        </div>
        
      </div>
    </div>
  );
};

export default Logo;