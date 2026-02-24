import React from 'react';
import { CATEGORIES } from '../../../types';

interface DashboardProps {
  inventory: any[];
  onStartScan: () => void;
  onDelete: (id: string) => void;
  onSelectCategory: (id: string) => void; // Pour la navigation vers Library
}

const Dashboard: React.FC<DashboardProps> = ({ inventory, onStartScan, onDelete, onSelectCategory }) => {
  return (
    <div className="flex flex-col h-full bg-[#121212]">
      
      {/* Étape 3 : Bouton Retour (Haut Droite) conforme au Modèle 01 */}
      <div className="flex justify-end px-4 py-2 shrink-0">
        <button 
          onClick={() => window.history.back()} 
          className="w-10 h-10 active:scale-90 transition-transform"
        >
          <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain" />
        </button>
      </div>

      {/* Container des 9 Rubriques (Scrollable Ratio 1-4) */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-[4vw] pb-4">
        <div className="flex flex-col gap-3">
          {CATEGORIES.map((cat, index) => {
            // Comptage dynamique des outils par catégorie
            const itemCount = inventory.filter(item => item.category === cat.id).length;

            return (
              <div 
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="w-full h-[15vh] min-h-[100px] bg-[#1E1E1E] rounded-xl border border-white/5 flex items-center px-6 gap-6 active:bg-[#252525] active:scale-[0.98] transition-all cursor-pointer group"
              >
                {/* Indexation (Couleur #D3D3D3) */}
                <span className="text-[#D3D3D3] font-black italic text-xl opacity-20 shrink-0">
                  0{index + 1}.
                </span>

                <div className="flex-1">
                  <h3 className="text-white font-black uppercase text-sm tracking-widest leading-tight">
                    {cat.label}
                  </h3>
                  <span className="text-[#FF6600] text-[10px] font-bold">
                    {itemCount} OBJET{itemCount > 1 ? 'S' : ''}
                  </span>
                </div>

                {/* Icône 3D de la rubrique */}
                <img 
                  src={`/${cat.id}.png`} 
                  className="w-14 h-14 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform" 
                  alt={cat.label} 
                />
              </div>
            );
          })}

          {/* Étape 4 & Option B : Bouton Assurance (Fin de scroll) */}
          <div className="w-full flex flex-col items-center pt-8 pb-12 gap-4">
            <button 
              className="w-20 h-20 bg-[#D3D3D3] rounded-2xl flex items-center justify-center shadow-2xl active:scale-95 transition-all border-b-4 border-gray-400 group"
            >
               <div className="w-10 h-10 border-[3px] border-gray-600 rounded-lg flex items-center justify-center relative">
                 <div className="w-6 h-1 bg-gray-600 rounded-full rotate-45 absolute group-hover:bg-[#FF6600]"></div>
                 <div className="w-6 h-1 bg-gray-600 rounded-full -rotate-45 absolute group-hover:bg-[#FF6600]"></div>
               </div>
            </button>
            <span className="text-[#D3D3D3] text-[9px] font-black uppercase tracking-widest opacity-40">
              Rapport Assurance PDF
            </span>
          </div>
        </div>
      </div>

      {/* Bouton de Scan Flottant (Rappel du Modèle 01) */}
      <button 
        onClick={onStartScan}
        className="absolute bottom-6 right-6 w-14 h-14 bg-[#FF6600] rounded-full shadow-[0_0_20px_rgba(255,102,0,0.5)] flex items-center justify-center active:scale-90 transition-transform z-50"
      >
        <img src="/icon-scanner.png" className="w-8 h-8 invert" alt="Scan" />
      </button>

      {/* Nettoyage technique pour onDelete (invisible) */}
      <div className="hidden">{onDelete.name}</div>
    </div>
  );
};

export default Dashboard;