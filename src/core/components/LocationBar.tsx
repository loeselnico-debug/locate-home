import React from 'react';
import { LOCATIONS } from '../../types';

interface LocationBarProps {
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
}

export const LocationBar: React.FC<LocationBarProps> = ({ selectedLocation, setSelectedLocation }) => {
  return (
    <div className="flex overflow-x-auto gap-[0.8rem] mb-[3vh] no-scrollbar">
      {LOCATIONS.map((loc) => (
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
    </div>
  );
};