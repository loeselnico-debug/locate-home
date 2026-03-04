import React, { Suspense, lazy } from 'react';
import { useUserTier } from '../../../core/security/useUserTier';
import type { InventoryItem } from '../../../types';

// Import différé (Lazy Loading) pour éviter le crash au Runtime
const PdfExportButton = lazy(() => import('../components/PdfExportButton'));

export const CATEGORIES = [
  { id: 'electro', label: 'Outillage Électroportatif' },
  { id: 'main', label: 'Outillage à main' },
  { id: 'serrage', label: 'Serrage et Clés' },
  { id: 'quinc', label: 'Quincaillerie et Consommables' },
  { id: 'elec', label: 'Électricité et Éclairage' },
  { id: 'peinture', label: 'Peinture et Finition' },
  { id: 'mesure', label: 'Mesure et Traçage' },
  { id: 'jardin', label: 'Jardin et Extérieur' },
  { id: 'epi', label: 'Équipements De Protection' },
];

interface DashboardProps {
  inventory: InventoryItem[];
  onStartScan: () => void;
  onDelete: (id: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onBack?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ inventory, onSelectCategory, onBack, onDelete }) => {
  const { currentTier } = useUserTier();
  const canExportPdf = currentTier === 'PREMIUM' || currentTier === 'PRO';

  const dummyUserInfo = {
    name: 'Utilisateur Premium',
    address: 'Atelier Principal / Fourgon'
  };
 
  const handleReturn = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
     
      {/* EN-TÊTE PREMIUM 3D */}
      <div className="flex justify-between items-center px-[4vw] py-4 shrink-0">
       
        {/* Actions Gauche : Assurance uniquement */}
        <div className="flex gap-4">
          {canExportPdf ? (
            <Suspense fallback={<div className="w-14 h-14 opacity-50 animate-pulse bg-gray-300 rounded-full" />}>
              <PdfExportButton inventory={inventory} userInfo={dummyUserInfo} />
            </Suspense>
          ) : (
            <button
              onClick={() => alert("L'export PDF Assurance est réservé aux comptes PREMIUM et PRO.")}
              className="w-14 h-14 active:scale-90 transition-transform opacity-50 cursor-not-allowed"
              title="Passer Premium pour exporter"
            >
              <img
                src="/icon-assurance.png"
                alt="Assurance (Verrouillé)"
                className="w-full h-full object-contain drop-shadow-lg grayscale"
              />
            </button>
          )}
        </div>

        {/* Action Droite : Retour */}
        <button onClick={handleReturn} className="w-14 h-14 active:scale-90 transition-transform">
          <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain drop-shadow-lg" />
        </button>
      </div>

      {/* LISTE DES 9 CATÉGORIES */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-[4vw] pb-[12vh]">
        <div className="flex flex-col gap-4">
          {CATEGORIES.map((cat, index) => {
            const number = String(index + 1).padStart(2, '0') + '.';
           
            // Comptage Blindé (Gère la casse et les espaces)
            const itemCount = inventory.filter(item =>
              item.category?.trim().toLowerCase() === cat.id.toLowerCase() ||
              item.category?.trim().toLowerCase() === cat.label.toLowerCase()
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="w-full bg-[#D3D3D3] rounded-xl flex items-center justify-between p-3 shadow-[0_5px_15px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all border border-gray-300"
              >
               
                <div className="flex items-center gap-4">
                  <span className="text-[#FF6600] font-black italic text-2xl tracking-widest [-webkit-text-stroke:1.5px_#121212] drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
                    {number}
                  </span>

                  <div className="flex flex-col items-start text-left">
                    <h3 className="text-[#121212] font-black uppercase text-[0.85rem] tracking-tight leading-none">
                      {cat.label}
                    </h3>
                    <span className="text-gray-700 text-[10px] font-bold mt-1">
                      {itemCount} OBJET{itemCount > 1 ? 'S' : ''}
                    </span>
                  </div>
                </div>

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

      <div className="hidden">{onDelete.name}</div>
    </div>
  );
};

export default Dashboard;