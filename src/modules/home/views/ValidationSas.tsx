import React, { useState } from 'react';

// 1. Définition stricte du format renvoyé par l'IA Gemini
export interface AIScanResult {
  nom: string;
  marque: string;
  categorie_id: string;
  etat: string;
  description: string;
  score_confiance: number;
  isConsumable?: boolean;
  consumableLevel?: number;
}

interface ValidationSasProps {
  pendingItems: AIScanResult[];
  onValidateAll: (items: AIScanResult[]) => void;
  onRejectAll: () => void;
}

const ValidationSas: React.FC<ValidationSasProps> = ({ pendingItems, onValidateAll, onRejectAll }) => {
  const [itemsToValidate, setItemsToValidate] = useState<AIScanResult[]>(pendingItems);

  const handleRemoveItem = (index: number) => {
    setItemsToValidate(prev => prev.filter((_, i) => i !== index));
  };

  if (itemsToValidate.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-[5vw] text-center gap-[2vh]">
        <h2 className="text-[#FF6600] font-black uppercase tracking-widest text-[clamp(1rem,4vw,1.5rem)]">Scan Vide</h2>
        <p className="text-white/70 text-[clamp(0.8rem,2.5vw,1rem)]">Aucun outil détecté ou validé.</p>
        <button onClick={onRejectAll} className="mt-[4vh] bg-[#333333] text-white px-[6vw] py-[1.5vh] rounded-md font-bold uppercase tracking-wide">
          Retour au Hub
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#121212] px-[5vw] pt-[2vh] pb-[calc(2vh+env(safe-area-inset-bottom))]">
      
      {/* HEADER DU SAS */}
      <div className="flex flex-col mb-[3vh]">
        <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.2rem,5vw,1.8rem)]">
          SAS DE VALIDATION <span className="text-[#FF6600]">(01 C1)</span>
        </h2>
        <p className="text-white/60 text-[clamp(0.7rem,2.5vw,0.9rem)] italic mt-[0.5vh]">
          Vérification métier requise avant injection base de données.
        </p>
      </div>

      {/* LISTE DES OUTILS DÉTECTÉS */}
      <div className="flex-1 overflow-y-auto space-y-[2vh] pr-[1vw]">
        {itemsToValidate.map((item, index) => {
          const score = item.score_confiance || 0;
          const scoreColor = score >= 90 ? 'text-green-500' : score >= 70 ? 'text-[#FF6600]' : 'text-red-500';

          return (
            <div key={index} className="bg-[#1E1E1E] border border-white/10 p-[3vw] rounded-lg flex flex-col relative">
              
              <button 
                onClick={() => handleRemoveItem(index)}
                className="absolute top-[2vw] right-[2vw] text-white/40 hover:text-red-500 font-bold text-[clamp(1rem,4vw,1.5rem)] leading-none"
              >
                ×
              </button>

              <div className="flex justify-between items-start pr-[6vw]">
                <div>
                  <h3 className="text-white font-bold text-[clamp(0.9rem,3.5vw,1.2rem)]">{item.nom || 'Outil Inconnu'}</h3>
                  <p className="text-white/60 uppercase tracking-widest text-[clamp(0.6rem,2vw,0.8rem)] mt-[0.5vh]">
                    {item.marque || 'Marque N/A'}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`font-black text-[clamp(1.2rem,5vw,1.8rem)] ${scoreColor}`}>
                    {score}%
                  </span>
                  <span className="text-white/40 text-[clamp(0.5rem,1.5vw,0.6rem)] uppercase tracking-widest">
                    Confiance
                  </span>
                </div>
              </div>

              {item.description && (
                <div className="mt-[2vh] p-[2vw] bg-[#121212] rounded border border-white/5">
                  <p className="text-white/70 italic text-[clamp(0.7rem,2vw,0.85rem)] leading-snug">
                    " {item.description} "
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* THUMB ZONE : ACTIONS GLOBALES */}
      <div className="mt-auto pt-[2vh] flex justify-between gap-[3vw]">
        <button 
          onClick={onRejectAll}
          className="flex-1 bg-[#333333] active:bg-[#444] text-white py-[2vh] rounded-md font-black uppercase tracking-widest text-[clamp(0.8rem,3vw,1rem)] transition-colors"
        >
          Rejeter
        </button>
        <button 
          onClick={() => onValidateAll(itemsToValidate)}
          className="flex-[2] bg-[#FF6600] active:bg-[#e65c00] text-white py-[2vh] rounded-md font-black uppercase tracking-widest text-[clamp(0.8rem,3vw,1rem)] shadow-[0_0_15px_rgba(255,102,0,0.3)] transition-colors"
        >
          Valider & Ranger
        </button>
      </div>

    </div>
  );
};

export default ValidationSas;