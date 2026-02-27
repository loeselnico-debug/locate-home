import React, { useState, useEffect } from 'react';
import { getCustomLocations, addCustomLocation } from '../storage/memoryService';
import type { Location } from '../../types';

interface LocationBarProps {
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
}

export const LocationBar: React.FC<LocationBarProps> = ({ selectedLocation, setSelectedLocation }) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    // Charge les lieux depuis le Zéro-Serveur (IndexedDB/LocalStorage) au montage
    setLocations(getCustomLocations());
  }, []);

  const handleAddLocation = () => {
    if (locations.length >= 4) {
      alert("Limite système : 4 zones maximum. Pour le détail (bacs/boîtes), utilisez notre système d'étiquettes QR.");
      return;
    }
    
    // UI native simple pour ne pas alourdir l'application
    const newLabel = window.prompt("Nom de la nouvelle zone d'intervention (ex: Chantier B) :");
    
    if (newLabel && newLabel.trim() !== '') {
      const success = addCustomLocation(newLabel);
      if (success) {
        setLocations(getCustomLocations()); // Rafraîchit l'affichage HUD
        setSelectedLocation(newLabel.trim()); // Auto-focus sur la nouvelle zone
      }
    }
  };

  return (
    <div className="flex overflow-x-auto gap-[0.8rem] mb-[3vh] no-scrollbar px-[4vw]">
      {locations.map((loc) => (
        <button
          key={loc.id}
          onClick={() => setSelectedLocation(loc.label)}
          className={`px-[1.2rem] py-[0.5rem] rounded-full border text-[0.8rem] whitespace-nowrap transition-all duration-300 ${
            selectedLocation === loc.label
              ? "bg-[#FF6600] border-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.3)]"
              : "bg-transparent border-gray-700 text-gray-400"
          }`}
        >
          {loc.label.toUpperCase()}
        </button>
      ))}
      
      {/* Rendu conditionnel du bouton d'ajout si limite non atteinte */}
      {locations.length < 4 && (
        <button
          onClick={handleAddLocation}
          className="w-8 h-8 rounded-full border border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-[#FF6600] hover:border-[#FF6600] transition-colors shrink-0"
          title="Ajouter une nouvelle zone"
        >
          +
        </button>
      )}
    </div>
  );
};