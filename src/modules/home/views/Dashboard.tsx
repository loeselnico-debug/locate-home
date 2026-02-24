import React from 'react';
import type { InventoryItem } from '../../../types';

// Intégration stricte des 9 catégories du Manifeste
export const CATEGORIES = [
  { id: 'electro', label: 'Outillage Électroportatif' },
  { id: 'main', label: 'Outillage à main' },
  { id: 'serrage', label: 'Serrage et Clés' },
  { id: 'quinc', label: 'Quincaillerie et Consommables' },
  { id: 'elec', label: 'Électricité et Éclairage' },
  { id: 'peinture', label: 'Peinture et Finition' },
  { id: 'mesure', label: 'Mesure et Traçage' },
  { id: 'jardin', label: 'Jardin et Extérieur' },
  { id: 'epi', label: 'Équipements De Protection' }, // La 9ème catégorie
];

interface DashboardProps {
  inventory: InventoryItem[];
  onStartScan: () => void;
  onDelete: (id: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onBack?: () => void; // Ajout sécurisé pour le retour vers 01
}

const Dashboard: React.FC<DashboardProps> = ({ inventory, onSelectCategory, onBack, onDelete }) => {
  
  // Fonction de retour robuste
  const handleReturn = () => {
    if (onBack) onBack();
    else window.history.back(); // Fallback de sécurité
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      
      {/* EN-TÊTE : Assurance (Gauche) / Retour (Droite) */}
      <div className="flex justify-between items-center px-[4vw] py-4 shrink-0">
        
        {/* Bouton Assurance (#D3D3D3) */}
        <button className="w-12 h-12 bg-[#D3D3D3] rounded-xl flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.5)] active:scale-95 transition-transform border-b-2 border-gray-400">
          <span className="text-[#121212] font-black text-[10px] uppercase tracking-widest leading-none text-center">
            Assur<br/>ance
          </span>
        </button>

        {/* Bouton Retour 3D vers Accueil (01) */}
        <button onClick={handleReturn} className="w-14 h-14 active:scale-90 transition-transform">
          <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain drop-shadow-lg" />
        </button>
      </div>

      {/* LISTE DES 9 CATÉGORIES */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-[4vw] pb-[12vh]">
        <div className="flex flex-col gap-4">
          {CATEGORIES.map((cat, index) => {
            // Formatage du numéro "01.", "02.", etc.
            const number = String(index + 1).padStart(2, '0') + '.';
            // Comptage dynamique des outils
            const itemCount = inventory.filter(item => item.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="w-full bg-[#D3D3D3] rounded-xl flex items-center justify-between p-3 shadow-[0_5px_15px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all border border-gray-300"
              >
                
                <div className="flex items-center gap-4">
                  {/* Numérotation Orange avec fort contour Noir */}
                  <span className="text-[#FF6600] font-black italic text-2xl tracking-widest [-webkit-text-stroke:1.5px_#121212] drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
                    {number}
                  </span>

                  {/* Titre et Compteur */}
                  <div className="flex flex-col items-start text-left">
                    <h3 className="text-[#121212] font-black uppercase text-[0.85rem] tracking-tight leading-none">
                      {cat.label}
                    </h3>
                    <span className="text-gray-700 text-[10px] font-bold mt-1">
                      {itemCount} OBJET{itemCount > 1 ? 'S' : ''}
                    </span>
                  </div>
                </div>

                {/* Icône 3D de la rubrique */}
                <img 
                  src={`/${cat.id}.png`} 
                  alt={cat.label} 
                  className="w-14 h-14 object-contain drop-shadow-xl shrink-0"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Nettoyage technique pour éviter un warning sur l'usage des props */}
      <div className="hidden">{onDelete.name}</div>
    </div>
  );
};

export default Dashboard;