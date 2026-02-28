import { useState } from 'react';

interface HubProps {
  onSelectModule: (module: 'home' | 'asset' | 'kitchen' | 'garage' | 'care') => void;
}

export default function Hub({ onSelectModule }: HubProps) {
  // État pour suivre le module survolé/actif (Gère la couleur du noyau et des flux)
  const [hoveredModule, setHoveredModule] = useState<string>('home');

  const modules = [
    { id: 'home', name: 'HOME', color: '#FF6600', iconName: 'home', active: true },
    { id: 'asset', name: 'ASSET', color: '#007BFF', iconName: 'asset', active: false },
    // MODIFICATION ICI : On passe active à true pour déverrouiller la section
    { id: 'garage', name: 'GARAGE', color: '#DC3545', iconName: 'garage', active: true },
    { id: 'kitchen', name: 'KITCHEN', color: '#28A745', iconName: 'kitchen', active: false },
    { id: 'care', name: 'CARE', color: '#E0E0E0', iconName: 'care', active: false }
  ];

  // Couleur dynamique du noyau central selon le module survolé
  const activeColor = modules.find(m => m.id === hoveredModule)?.color || '#FF6600';

  return (
    <div className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-between py-[5vh] px-[2vw] font-sans overflow-hidden">
      
      {/* INJECTION CSS : Animation du flux d'énergie liquide */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dashFlow {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        .animate-dash {
          animation: dashFlow 2s linear infinite;
        }
      `}} />

      {/* FOND GRILLE : Circuit imprimé */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

      {/* SVG : LES FLUX D'ÉNERGIE VERS LE NOYAU */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        {modules.map((mod, index) => {
          // Calcul des positions proportionnelles (liquides)
          const startX = 10 + (index * 20); // Départs : 10%, 30%, 50%, 70%, 90%
          const startY = 25; // Hauteur de départ sous les boutons
          const endX = 50;   // Centre absolu
          const endY = 65;   // Cible du noyau central
          
          const isHovered = mod.id === hoveredModule;

          return (
            <path
              key={`path-${mod.id}`}
              d={`M ${startX} ${startY} C ${startX} ${startY + 20}, ${endX} ${endY - 20}, ${endX} ${endY}`}
              stroke={mod.color}
              strokeWidth={isHovered ? "0.4" : "0.1"}
              fill="none"
              strokeDasharray="2 2"
              className={isHovered ? "animate-dash" : ""}
              style={{ opacity: isHovered ? 1 : 0.2, transition: 'all 0.4s ease' }}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* RANGÉE SUPÉRIEURE : LES 5 MODULES (Boutons 3D) */}
      <div className="flex justify-between items-start w-full max-w-[95%] z-10 mt-[4vh] px-[2vw]">
        {modules.map((mod) => {
          const isHovered = mod.id === hoveredModule;
          return (
            <div 
              key={mod.id} 
              className="flex flex-col items-center group w-[18%]"
              onMouseEnter={() => setHoveredModule(mod.id)}
              onClick={() => {
                setHoveredModule(mod.id);
                if (mod.active) onSelectModule(mod.id as any);
              }}
            >
              {/* Titre du module */}
              <h3 className={`text-[0.55rem] sm:text-[0.75rem] font-black uppercase tracking-widest mb-[1.5vh] text-center h-[2vh] transition-colors duration-300 ${isHovered ? 'text-white' : 'text-[#B0BEC5]'}`}>
                {mod.name}
              </h3>
              
              {/* Bouton du module avec rendu 3D */}
              <button
                className={`relative w-[13vw] h-[13vw] max-w-[4.5rem] max-h-[4.5rem] rounded-2xl border-b-[0.25rem] flex items-center justify-center transition-all duration-300
                  ${mod.active ? 'cursor-pointer' : 'cursor-not-allowed opacity-40 grayscale'}
                  ${isHovered && mod.active ? 'translate-y-[-0.5vh]' : ''}
                `}
                style={{
                  backgroundColor: '#1A1A1A',
                  borderColor: mod.color,
                  boxShadow: isHovered ? `0 0 20px ${mod.color}80, inset 0 2px 10px rgba(255,255,255,0.1)` : '0 4px 6px rgba(0,0,0,0.3)'
                }}
              >
                <img 
                  src={`/${mod.iconName}.png`} 
                  alt={mod.name} 
                  className="w-[65%] h-[65%] object-contain drop-shadow-md"
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* NOYAU CENTRAL : LOCATE SYSTEMS */}
      <div className="relative z-10 flex flex-col items-center mt-[12vh] sm:mt-[15vh]">
        
        {/* Halo Pulsant (Couleur dynamique selon le module actif) */}
        <div 
          className="absolute inset-0 blur-[50px] rounded-full w-[40vw] h-[40vw] max-w-[14rem] max-h-[14rem] -z-10 animate-pulse transition-colors duration-500"
          style={{ backgroundColor: activeColor, opacity: 0.25 }}
        ></div>

        {/* Le Processeur */}
        <div 
          className="w-[28vw] h-[28vw] max-w-[10rem] max-h-[10rem] bg-[#121212] border-t-[0.15rem] border-b-[0.35rem] rounded-[2rem] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group transition-colors duration-500"
          style={{ borderColor: activeColor }}
        >
            {/* Reflet de vitre 3D */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            
            {/* Cœur 3D (core.png) */}
            <div className="relative w-[45%] h-[45%] mb-[1vh] flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              <img src="/core.png" alt="Core Scanner" className="w-full h-full object-contain" />
            </div>
            
            <span className="text-white font-black tracking-[0.2em] text-[0.55rem] sm:text-[0.7rem] relative z-10 drop-shadow-md">
              SYSTEMS
            </span>
        </div>
      </div>

      {/* PIED DE PAGE : LA CITATION */}
      <div className="z-10 text-center mb-[4vh] px-[4vw] max-w-[90%]">
        <p className="text-[#B0BEC5] text-[0.6rem] sm:text-[0.8rem] font-medium italic leading-loose tracking-wide">
          "L'homme ne parle pas à l'IA pour l'écouter, <br className="hidden sm:block"/>
          mais pour qu'elle devienne le prolongement de son expertise terrain."
        </p>
      </div>
    </div>
  );
}