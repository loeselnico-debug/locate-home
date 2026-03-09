import React, { useState } from 'react';
import { useUserTier } from '../../../core/security/useUserTier';

export interface AIScanResult {
  typography?: string;
  brandColor?: string;
  categorie_id?: string;
  type?: string; 
  morphology?: string; 
  confidence?: number;
  etat?: string;
  description?: string;
  label?: string;
  isConsumable?: boolean;
  consumableLevel?: number;
  imageUrl?: string;
  location?: string;
  energy?: string; // <-- NOUVEAU : Champ Énergie
  safetyStatus?: boolean; // <-- NOUVEAU : Statut opérationnel (false = OK, true = Alerte)
}

interface ValidationSasProps {
  pendingItems: AIScanResult[];
  onValidateAll: (items: AIScanResult[]) => void;
  onRejectAll: () => void;
}

const ValidationSas: React.FC<ValidationSasProps> = ({ pendingItems, onValidateAll, onRejectAll }) => {
  const [itemsToValidate, setItemsToValidate] = useState<AIScanResult[]>(pendingItems);
  const [selectedItems, setSelectedItems] = useState<boolean[]>(pendingItems.map(() => true));
  const { currentTier } = useUserTier();

  // NOUVEAUX ÉTATS POUR L'ÉDITION RAPIDE
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<AIScanResult>>({});

  const handleRemoveItem = (indexToRemove: number) => {
    setItemsToValidate(prev => prev.filter((_, i) => i !== indexToRemove));
    setSelectedItems(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const toggleSelection = (index: number) => {
    const newSelection = [...selectedItems];
    newSelection[index] = !newSelection[index];
    setSelectedItems(newSelection);
  };

  // OUVERTURE DE LA MODALE D'ÉDITION
  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...itemsToValidate[index] });
  };

  // SAUVEGARDE DES MODIFICATIONS
  const saveEdit = () => {
    if (editingIndex !== null) {
      const updatedItems = [...itemsToValidate];
      updatedItems[editingIndex] = { ...updatedItems[editingIndex], ...editForm };
      setItemsToValidate(updatedItems);
      setEditingIndex(null);
    }
  };

  const handleFinalValidation = () => {
    const itemsToKeep = itemsToValidate.filter((_, index) => selectedItems[index]);
    if (itemsToKeep.length > 0) {
      onValidateAll(itemsToKeep);
    } else {
      alert("Aucun outil n'est sélectionné pour l'intégration.");
    }
  };

  if (itemsToValidate.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-[5vw] text-center gap-[2vh] font-sans">
        <h2 className="text-[#FF6600] font-black uppercase tracking-widest text-[clamp(1rem,4vw,1.5rem)]">Scan Vide</h2>
        <p className="text-white/70 text-[clamp(0.8rem,2.5vw,1rem)]">Aucun outil détecté ou validé.</p>
        <button onClick={onRejectAll} className="mt-[4vh] bg-[#333333] text-white px-[6vw] py-[1.5vh] rounded-md font-bold uppercase tracking-wide">
          Retour au Hub
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#121212] px-[5vw] pt-[2vh] pb-[calc(2vh+env(safe-area-inset-bottom))] font-sans relative">
      
      <div className="flex flex-col mb-[3vh]">
        <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.2rem,5vw,1.8rem)]">
          SAS DE VALIDATION <span className="text-[#FF6600]">(SCAN)</span>
        </h2>
        <p className="text-white/60 text-[clamp(0.7rem,2.5vw,0.9rem)] italic mt-[0.5vh]">
          Vérification métier requise avant injection base de données.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-[3vh] pr-[1vw] no-scrollbar">
        {itemsToValidate.map((item, index) => {
          const score = item.confidence ? Math.round(item.confidence * 100) : 0;
          const scoreColor = score >= 90 ? 'text-green-500' : score >= 70 ? 'text-[#FF6600]' : 'text-red-500';
          const isSelected = selectedItems[index];

          return (
            <div 
              key={index} 
              className={`bg-[#1E1E1E] border rounded-xl flex flex-col overflow-hidden transition-all duration-300 ${isSelected ? 'border-[#FF6600] shadow-[0_0_15px_rgba(255,102,0,0.15)]' : 'border-white/5 opacity-50 grayscale-[50%]'}`}
            >
              <div className="flex p-[3vw] gap-[3vw]">
                <div className="w-[22vw] h-[22vw] max-w-[90px] max-h-[90px] bg-[#0a0a0a] border border-white/10 rounded-lg flex items-center justify-center p-2 shrink-0 relative">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.label} 
                      className={`w-full h-full object-contain ${currentTier !== 'FREE' ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]' : ''}`}
                    />
                  ) : (
                    <span className="text-2xl opacity-30">📷</span>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <span className="text-gray-400 font-black text-[9px] uppercase tracking-widest leading-none block mb-1">
                        {item.brandColor || 'Marque N/A'}
                      </span>
                      <h3 className="text-white font-bold text-[clamp(0.9rem,3.5vw,1.1rem)] leading-tight whitespace-normal">
                        {item.label || item.typography || 'Outil Inconnu'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[#FF6600] text-[10px] font-bold tracking-wider uppercase">
                          {item.type || item.categorie_id}
                        </span>
                        {item.energy && (
                          <span className="bg-[#FF6600]/20 text-[#FF6600] px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                            ⚡ {item.energy}
                          </span>
                        )}
                        {item.safetyStatus !== undefined && (
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${item.safetyStatus ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                            {item.safetyStatus ? 'ALERTE' : 'OPÉRATIONNEL'}
                          </span>
                        )}
                      </div>
                    </div>
                    {currentTier !== 'FREE' && (
                      <div className="flex flex-col items-end shrink-0">
                        <span className={`font-black text-[clamp(1.1rem,4vw,1.4rem)] leading-none ${scoreColor}`}>
                          {score}%
                        </span>
                        <span className="text-white/40 text-[8px] uppercase tracking-widest mt-1">
                          IA CONF.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex border-t border-white/10 bg-[#121212]">
                <button 
                  onClick={() => toggleSelection(index)}
                  className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors ${isSelected ? 'text-[#FF6600] bg-[#FF6600]/10' : 'text-gray-500 hover:text-white'}`}
                >
                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${isSelected ? 'border-[#FF6600] bg-[#FF6600]' : 'border-gray-500'}`}>
                    {isSelected && <span className="text-black text-[10px] font-black leading-none">✓</span>}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {isSelected ? 'Prêt' : 'Ignoré'}
                  </span>
                </button>

                <button 
                  onClick={() => currentTier === 'FREE' ? alert("L'édition détaillée est réservée aux membres PREMIUM.") : openEditModal(index)}
                  className="flex-1 py-3 border-l border-white/10 flex items-center justify-center gap-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm">{currentTier === 'FREE' ? '🔒' : '✎'}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Éditer</span>
                </button>

                <button 
                  onClick={() => handleRemoveItem(index)}
                  className="w-[15%] py-3 border-l border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Supprimer définitivement"
                >
                  <span className="text-lg font-black leading-none">×</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-[2vh] flex justify-between gap-[3vw] shrink-0">
        <button 
          onClick={onRejectAll}
          className="flex-1 bg-[#333333] active:bg-[#444] text-white py-[2vh] rounded-xl font-black uppercase tracking-widest text-[clamp(0.8rem,3vw,1rem)] transition-colors border border-white/5"
        >
          Rejeter
        </button>
        <button 
          onClick={handleFinalValidation}
          className="flex-[2] bg-[#FF6600] active:bg-[#e65c00] text-black py-[2vh] rounded-xl font-black uppercase tracking-widest text-[clamp(0.8rem,3vw,1rem)] shadow-[0_0_20px_rgba(255,102,0,0.4)] transition-transform active:scale-95"
        >
          Valider & Ranger ({selectedItems.filter(Boolean).length})
        </button>
      </div>

      {/* ========================================== */}
      {/* MODALE D'ÉDITION RAPIDE (QUICK EDIT)       */}
      {/* ========================================== */}
      {editingIndex !== null && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-end">
          <div className="bg-[#1E1E1E] rounded-t-3xl border-t border-[#FF6600]/50 p-[5vw] flex flex-col gap-[2.5vh] animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.8)] pb-[max(5vh,env(safe-area-inset-bottom))]">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-white font-black uppercase tracking-widest text-[1.2rem]">Correction IA</h3>
              <button onClick={() => setEditingIndex(null)} className="text-white/50 text-2xl font-light active:scale-90">×</button>
            </div>

            {/* Champ 1 : Marque */}
            <div>
              <label className="text-[#FF6600] text-[10px] font-black uppercase tracking-widest ml-1 mb-1 block">Marque</label>
              <input 
                type="text" 
                value={editForm.brandColor || ''} 
                onChange={(e) => setEditForm({...editForm, brandColor: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#FF6600]"
                placeholder="Ex: DeWalt, Makita..."
              />
            </div>

            {/* Champ 2 : Genre / Modèle */}
            <div>
              <label className="text-[#FF6600] text-[10px] font-black uppercase tracking-widest ml-1 mb-1 block">Genre / Modèle</label>
              <input 
                type="text" 
                value={editForm.label || editForm.typography || ''} 
                onChange={(e) => setEditForm({...editForm, label: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#FF6600]"
                placeholder="Ex: Visseuse à choc, Scie circulaire..."
              />
            </div>

            {/* Champ 3 : Énergie */}
            <div>
              <label className="text-[#FF6600] text-[10px] font-black uppercase tracking-widest ml-1 mb-1 block">Énergie (Batterie / Secteur)</label>
              <input 
                type="text" 
                value={editForm.energy || ''} 
                onChange={(e) => setEditForm({...editForm, energy: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#FF6600]"
                placeholder="Ex: 18V, Filaire 220V, Thermique..."
              />
            </div>

            {/* Champ 4 : Statut Opérationnel (Toggle) */}
            <div className="mt-2">
              <label className="text-[#FF6600] text-[10px] font-black uppercase tracking-widest ml-1 mb-2 block">Statut Machine</label>
              <div className="flex bg-[#0a0a0a] rounded-lg p-1 border border-white/10">
                <button 
                  onClick={() => setEditForm({...editForm, safetyStatus: false})}
                  className={`flex-1 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${!editForm.safetyStatus ? 'bg-green-500 text-black shadow-md' : 'text-gray-500'}`}
                >
                  ✓ Opérationnel
                </button>
                <button 
                  onClick={() => setEditForm({...editForm, safetyStatus: true})}
                  className={`flex-1 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${editForm.safetyStatus ? 'bg-red-500 text-white shadow-md' : 'text-gray-500'}`}
                >
                  ⚠️ En Panne
                </button>
              </div>
            </div>

            {/* Bouton de Validation */}
            <button 
              onClick={saveEdit}
              className="w-full bg-[#FF6600] text-black py-4 rounded-xl font-black uppercase tracking-widest mt-4 active:scale-95 transition-transform"
            >
              Appliquer la correction
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default ValidationSas;