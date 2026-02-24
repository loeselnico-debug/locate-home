import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Texte Principal : LOCATE (Orange) HOME (Blanc) */}
      <div className="flex font-black italic tracking-tighter text-[1.6rem] leading-none">
        <span className="text-[#FF6600]">LOCATE</span>
        <span className="text-white ml-1 uppercase">Home</span>
      </div>
      
      {/* Bandeau Oblique "By Systems" - Étape 5 */}
      <div className="absolute top-[65%] -right-4 bg-[#FF6600] px-2 py-0.5 transform -skew-x-12 border-b-2 border-r-2 border-yellow-500/40 shadow-lg">
        <span className="text-[9px] font-black text-white uppercase italic tracking-widest block">
          By Systems
        </span>
      </div>
    </div>
  );
};

export default Logo;