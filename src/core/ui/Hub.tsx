
interface HubProps {
  onSelectModule: (module: 'home' | 'asset' | 'kitchen' | 'garage' | 'care') => void;
}

export default function Hub({ onSelectModule }: HubProps) {
  // Définition des modules avec les couleurs exactes de ton image
  const modules = [
    { id: 'home', name: 'HOME', color: '#FF6600', icon: '🏠', active: true },
    { id: 'asset', name: 'ASSET', color: '#007BFF', icon: '📦', active: false },
    { id: 'garage', name: 'GARAGE', color: '#DC3545', icon: '🔧', active: false },
    { id: 'kitchen', name: 'KITCHEN', color: '#28A745', icon: '🍳', active: false },
    { id: 'care', name: 'CARE', color: '#E0E0E0', icon: '⚕️', active: false }
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-between py-12 px-2 font-sans overflow-hidden">
      
      {/* EFFET DE FOND : Grille de circuit imprimé subtile */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

      {/* RANGÉE SUPÉRIEURE : LES 5 MODULES */}
      <div className="flex justify-center items-start gap-2 sm:gap-6 w-full max-w-4xl z-10 mt-8">
        {modules.map((mod) => (
          <div key={mod.id} className="flex flex-col items-center group w-1/5">
            {/* Titre du module */}
            <h3 className="text-white text-[8px] sm:text-xs font-black uppercase tracking-widest mb-3 text-center h-4">
              {mod.name}
            </h3>
            
            {/* Bouton du module (Look 3D) */}
            <button
              onClick={() => mod.active && onSelectModule(mod.id as any)}
              className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-2xl border-b-4 flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300
                ${mod.active ? 'cursor-pointer hover:-translate-y-1' : 'cursor-not-allowed opacity-40 grayscale'}
              `}
              style={{
                backgroundColor: '#1E1E1E',
                borderColor: mod.color,
                boxShadow: mod.active ? `0 0 20px ${mod.color}60, inset 0 2px 10px rgba(255,255,255,0.1)` : 'none'
              }}
            >
              {mod.icon}
            </button>
            
            {/* Faisceau d'énergie descendant */}
            <div
              className="w-0.5 h-24 sm:h-32 mt-2 opacity-70"
              style={{
                background: `linear-gradient(to bottom, ${mod.color}, transparent)`
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* NOYAU CENTRAL : LOCATE SYSTEMS */}
      <div className="relative z-10 flex flex-col items-center mt-[-60px]">
        {/* Aura lumineuse centrale (combine les couleurs) */}
        <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full w-48 h-48 -z-10"></div>
        <div className="absolute inset-0 bg-orange-500/10 blur-[40px] rounded-full w-32 h-32 -z-10"></div>

        {/* Le Processeur */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#121212] border-t-2 border-b-4 border-white/20 rounded-3xl flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)] relative overflow-hidden group">
            {/* Reflet de vitre 3D */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <span className="text-4xl sm:text-5xl mb-2 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">🔍</span>
            <span className="text-white font-black tracking-[0.2em] text-[10px] sm:text-xs">SYSTEMS</span>
        </div>
      </div>

      {/* PIED DE PAGE : LA CITATION */}
      <div className="z-10 text-center mb-8 px-4 max-w-lg">
        <p className="text-[#B0BEC5] text-[10px] sm:text-xs font-medium italic leading-loose tracking-wide">
          "L'homme ne parle pas à l'IA pour l'écouter, <br className="hidden sm:block"/>
          mais pour qu'elle devienne le prolongement de son expertise terrain."
        </p>
      </div>
    </div>
  );
}