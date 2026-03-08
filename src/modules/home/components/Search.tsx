// ==========================================
// 📂 FICHIER : \src\modules\home\components\Search.tsx
// ==========================================
import React, { useState, useMemo, useEffect } from 'react';
import { Mic, MicOff, Search as SearchIcon, MapPin } from 'lucide-react';
import type { InventoryItem, Location } from '../../../types';
import { getCustomLocations } from '../../../core/storage/memoryService';

interface SearchProps {
  onBack: () => void;
  inventory: InventoryItem[];
}

const Search: React.FC<SearchProps> = ({ onBack, inventory }) => {
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | 'ALL'>('ALL');
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    setLocations(getCustomLocations());
  }, []);

  const analyzeIntent = (transcript: string) => {
    let cleanedQuery = transcript.toLowerCase();
    let detectedLocation: string | null = null;

    locations.forEach(loc => {
      const locName = loc.label.toLowerCase();
      if (cleanedQuery.includes(locName)) {
        detectedLocation = loc.label;
        cleanedQuery = cleanedQuery.replace(locName, '').trim();
      }
    });

    const stopWords = ['dans le', 'dans la', 'dans', 'sur le', 'sur la', 'sur', 'montre-moi', 'cherche', 'trouve', 'les', 'des'];
    stopWords.forEach(word => {
      cleanedQuery = cleanedQuery.replace(new RegExp(`\\b${word}\\b`, 'gi'), '').trim();
    });

    if (detectedLocation) {
      setSelectedLocation(detectedLocation);
    }

    setQuery(cleanedQuery.replace(/\s+/g, ' ').trim());
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      analyzeIntent(transcript);
    };

    recognition.start();
  };

  const results = useMemo(() => {
    return inventory.filter(tool => {
      const searchTerms = query.toLowerCase().split(' ').filter(word => word.length > 1);
      
      const toolIndex = [
        tool.toolName,
        tool.brand,
        tool.category,
        tool.sku,
        tool.location,
        tool.notes,
        (tool as any).energy,
        (tool as any).motor,
        (tool as any).type
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesQuery = query.trim() === '' || searchTerms.every(term => toolIndex.includes(term));
      const matchesLocation = selectedLocation === 'ALL' || tool.location === selectedLocation;
      
      return matchesQuery && matchesLocation;
    });
  }, [query, selectedLocation, inventory]);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-[4vh] font-sans pb-[15vh]">
      
      {/* HEADER & RETOUR INVERSÉS */}
      <div className="flex justify-between items-center mb-[6vh]">
        {/* Titre à gauche, format système standard */}
        <div className="flex flex-col items-start text-left">
          <h2 className="text-[1.5rem] font-sans font-black uppercase tracking-widest leading-none">RETROUVER</h2>
        </div>

        {/* Bouton retour à droite, w-14 h-14, sans le mot "Menu" */}
        <button onClick={onBack} className="w-14 h-14 flex items-center justify-center active:scale-90 transition-transform shrink-0">
          <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain" />
        </button>
      </div>

      {/* ZONE DE RECHERCHE TEXTUELLE */}
      <div className="relative mb-[4vh]">
        <div className="absolute inset-y-0 left-[4vw] flex items-center pointer-events-none">
          <SearchIcon size={20} className="text-[#FF6600]/50" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un outil..."
          className="w-full bg-[#1E1E1E] border border-white/10 rounded-2xl py-[2.5vh] pl-[12vw] pr-[4vw] text-[1rem] font-bold tracking-wide focus:border-[#FF6600] transition-all outline-none shadow-inner text-white placeholder-white/30 text-center"
        />
      </div>

      {/* BOUTON MICRO GÉANT */}
      <div className="flex justify-center mb-[5vh]">
        <button 
          onClick={startListening}
          className={`w-[20vw] h-[20vw] max-w-[80px] max-h-[80px] rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening 
              ? 'bg-red-600 scale-110 shadow-[0_0_30px_rgba(220,53,69,0.6)] animate-pulse' 
              : 'bg-[#FF6600] shadow-[0_0_20px_rgba(255,102,0,0.4)] hover:scale-105 active:scale-95'
          }`}
        >
          {isListening ? <MicOff size={32} color="white" /> : <Mic size={32} color="white" />}
        </button>
      </div>

      {/* FILTRES DE ZONES DYNAMIQUES */}
      <div className="flex overflow-x-auto no-scrollbar gap-[1rem] mb-[5vh] pb-[1vh] snap-x">
        <button 
          onClick={() => setSelectedLocation('ALL')}
          className={`snap-center shrink-0 px-[1.5rem] py-[0.5rem] rounded-full border text-[0.7rem] font-black transition-all ${
            selectedLocation === 'ALL' ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-white/10 text-gray-500'
          }`}
        >
          TOUT
        </button>
        
        {locations.map(loc => (
          <button 
            key={loc.id}
            onClick={() => setSelectedLocation(loc.label)}
            className={`snap-center shrink-0 px-[1.5rem] py-[0.5rem] rounded-full border text-[0.7rem] font-black transition-all ${
              selectedLocation === loc.label ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-[0_0_10px_#FF6600]' : 'border-white/10 text-gray-500'
            }`}
          >
            {loc.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* LISTE DES RÉSULTATS */}
      <div className="grid gap-[2vh]">
        {(query.trim() !== '' || selectedLocation !== 'ALL') && results.length > 0 ? (
          results.map(tool => (
            <div key={tool.id} className="relative bg-[#1E1E1E] border border-white/5 rounded-[1.5rem] p-[1rem] flex items-center gap-[4vw] overflow-hidden group active:scale-[0.98] transition-transform">
              
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF6600] shadow-[0_0_10px_#FF6600] opacity-0 group-active:opacity-100"></div>
              
              <div className="w-[5rem] h-[5rem] rounded-[1rem] overflow-hidden bg-black border border-white/10 flex-shrink-0 relative">
                <img src={tool.imageUrl || "/placeholder-tool.png"} alt={tool.toolName} className="w-full h-full object-cover opacity-80" />
                <div className="absolute bottom-1 right-1 w-4 h-4">
                  <img src={`/${tool.category}.png`} className="w-full h-full object-contain" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-black text-[0.9rem] uppercase text-white truncate leading-tight">{tool.toolName}</h3>
                <div className="flex items-center gap-[0.5rem] text-[#FF6600] mt-[0.5vh]">
                  <MapPin size={12} />
                  <span className="text-[0.6rem] font-black uppercase tracking-tighter">{tool.location}</span>
                </div>
                <p className="text-[0.5rem] text-gray-500 mt-[1vh] font-mono opacity-50">ID: {tool.sku || tool.id.split('-')[0].toUpperCase()}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-[10vh] border-2 border-dashed border-white/5 rounded-[2rem]">
            <img src="/icon-retrouver.png" className="w-[4rem] opacity-20 mb-[2vh]" alt="" />
            <p className="text-gray-600 text-[0.7rem] uppercase font-bold tracking-widest italic text-center px-[10vw]">
              {query ? "Aucun actif identifié" : "En attente d'une commande vocale ou textuelle"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;