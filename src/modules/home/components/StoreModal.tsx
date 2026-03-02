import React from 'react';
import { LOCATE_CATALOG } from '../../../data/catalog';
import { useAppSettings } from '../../../core/storage/useAppSettings'; // NOUVEAU : Import de nos paramètres

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoreModal: React.FC<StoreModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useAppSettings(); // NOUVEAU : Récupération du choix de l'utilisateur

  if (!isOpen) return null;

  // NOUVEAU : Fonction utilitaire pour convertir dynamiquement les mm en inches
  const formatDimension = (valueInMm: number) => {
    if (settings.unitSystem === 'IMPERIAL') {
      return (valueInMm / 25.4).toFixed(1); // Conversion avec 1 chiffre après la virgule
    }
    return valueInMm;
  };

  const unitLabel = settings.unitSystem === 'IMPERIAL' ? 'in' : 'mm';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Overlay flouté (cliquable pour fermer) */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Conteneur de la Modale (Slide up) */}
      <div className="relative w-full max-w-md bg-[#121212] rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh] animate-slide-up">

        {/* En-tête du magasin */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#0a0a0a]">
          <div>
            <h2 className="text-white font-black text-xl tracking-widest uppercase">Boutique LOCATE</h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">Écosystème Certifié IA</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-[#1E1E1E] rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Liste des produits (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {LOCATE_CATALOG.map((product) => (
            <div key={product.id} className="bg-[#1E1E1E] rounded-2xl p-4 border border-white/5 shadow-lg flex flex-col gap-3 group">

              <div className="flex gap-4">
                {/* Image Produit */}
                <div className="w-24 h-24 bg-[#0a0a0a] rounded-xl border border-white/5 flex items-center justify-center shrink-0 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 pointer-events-none"></div>
                  <span className="text-3xl opacity-50">📦</span>
                </div>

                {/* Infos Produit */}
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-white font-black text-sm leading-tight mb-1">{product.name}</h3>
                  <p className="text-gray-400 text-[10px] leading-snug line-clamp-2 mb-2">
                    {product.description}
                  </p>

                  {/* Badge Dimension Dynamique */}
                  {product.isContainer && product.dimensions && (
                    <span className="self-start px-2 py-0.5 bg-black/50 border border-white/10 rounded text-[9px] text-[#FF6600] font-mono tracking-wider transition-all">
                      {formatDimension(product.dimensions.length)}x{formatDimension(product.dimensions.width)}x{formatDimension(product.dimensions.height)} {unitLabel}
                    </span>
                  )}
                </div>
              </div>

              {/* Bouton d'Achat (Préparé pour Revolut) */}
              <button className="w-full bg-white text-black py-3 rounded-xl font-black text-xs uppercase tracking-widest flex justify-between items-center px-5 active:scale-95 transition-transform hover:bg-gray-200">
                <span>Commander</span>
                <span className="bg-black text-white px-2 py-1 rounded-lg text-[10px]">{product.price.toFixed(2)} €</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer sécurisé Revolut */}
        <div className="p-4 bg-[#0a0a0a] border-t border-white/5 flex justify-center items-center gap-2">
          <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Paiement Sécurisé</span>
          <span className="text-white text-[10px] font-black tracking-widest">REVOLUT PAY</span>
        </div>

      </div>
    </div>
  );
};

export default StoreModal;