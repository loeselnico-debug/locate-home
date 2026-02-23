import type { InventoryItem } from '../../../types';
import { CATEGORIES } from '../../../types'; 
import { Settings } from 'lucide-react'; 
import { useUserTier } from '../../../core/security/useUserTier';

// On définit strictement les commandes que le Dashboard est autorisé à recevoir
interface DashboardProps {
  onNavigateBack: () => void;
  onSelectCategory: (catId: string) => void;
  inventory?: InventoryItem[]; // Optionnel, au cas où le système parent l'envoie toujours
}

// On visse l'interface sur le composant (on remplace le "any")
const Dashboard = ({ onNavigateBack, onSelectCategory }: DashboardProps) => {
  const { currentTier } = useUserTier();

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] font-sans overflow-hidden select-none">
      
      {/* ========================================= */}
      {/* HEADER INALTÉRABLE (Design de Référence)  */}
      {/* ========================================= */}
      <header className="pt-[5vh] px-[6vw] w-full flex flex-col relative">
        
        {/* ÉTAPE 5 : LOCATE HOME Centré + By Systems sous OME */}
        <div className="flex justify-center items-center w-full mb-[3vh] relative">
          <h1 className="text-[2.2rem] font-black tracking-tighter leading-none italic relative">
            <span className="text-[#FF6600]">LOCATE</span>
            <span className="text-white ml-2">HOME</span>
            
            <div className="absolute right-[-0.5rem] bottom-[-0.8rem] bg-[#FF6600] px-[0.6rem] py-[0.1rem] rotate-[-12deg] shadow-lg">
              <span className="text-[0.45rem] font-black uppercase text-white tracking-[0.2em] whitespace-nowrap">
                by Systems
              </span>
            </div>
          </h1>
        </div>

        {/* ÉTAPE 6 : PREMIUM (Gauche) + Paramètres (Droite) */}
        <div className="flex justify-between items-center w-full mb-[1.5vh]">
          <span className="text-[0.8rem] font-black text-[#D3D3D3] tracking-widest uppercase">
            {currentTier}
          </span>
          <button className="text-[#D3D3D3] hover:text-[#FF6600] transition-colors active:rotate-45">
            <Settings size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* ÉTAPE 7 : Ligne Grise de démarcation (#D3D3D3) */}
        <div className="w-full h-[1px] bg-[#D3D3D3] mb-[2vh]"></div>

      </header>

      {/* ========================================= */}
      {/* ZONE D'ACTION : RETOUR & LISTE SCROLLABLE */}
      {/* ========================================= */}
      <main className="flex-1 flex flex-col px-[6vw] pb-[5vh]">
        
        {/* ÉTAPE 3 : Bouton Retour (/public/icon-return.png) */}
        <div className="w-full flex justify-end mb-[2vh]">
          <button 
            onClick={onNavigateBack} 
            className="active:scale-90 transition-transform flex items-center justify-center bg-[#1E1E1E] border border-[#D3D3D3]/20 rounded-lg p-[1vh]"
          >
            <img 
              src="/icon-return.png" 
              alt="Retour" 
              className="h-[1.5rem] w-auto object-contain" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }} 
            />
          </button>
        </div>

        {/* LISTE DES 9 RUBRIQUES (Calibrage : 01 à 04 visibles) */}
        {/* Hauteur verrouillée à 52.5vh (4 * 12vh + 3 * 1.5vh d'écart) */}
        <div className="w-full h-[52.5vh] flex flex-col gap-[1.5vh] overflow-y-auto scrollbar-hide snap-y snap-mandatory rounded-xl">
          {CATEGORIES.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory?.(cat.id)}
              className="flex items-center w-full min-h-[12vh] max-h-[12vh] bg-[#1E1E1E] border border-white/5 hover:border-[#FF6600]/50 rounded-xl px-[4vw] snap-start shrink-0 transition-all active:scale-[0.98] group"
            >
              {/* Numérotation (01, 02...) */}
              <span className="text-[#FF6600] font-black text-[1.2rem] italic w-[15%] text-left">
                {String(index + 1).padStart(2, '0')}.
              </span>

              {/* Icône 3D Signature (Couleur intégrale) */}
              <div className="w-[30%] h-[70%] flex items-center justify-center">
                <img 
                  src={`/${cat.id}.png`} 
                  alt={cat.label} 
                  className="h-full w-full object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300" 
                  onError={(e) => (e.currentTarget.src = '/icon-placeholder.png')}
                />
              </div>

              {/* Nom de la Catégorie */}
              <span className="flex-1 text-left text-white text-[0.85rem] font-bold uppercase tracking-tight pl-[3vw] leading-tight">
                {cat.label}
              </span>
            </button>
          ))}
        </div>

      </main>

    </div>
  );
};

export default Dashboard;