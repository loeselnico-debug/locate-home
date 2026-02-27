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

  // --- VOCAL PRO : PARSEUR D'INTENTION LOCAL ---
  const analyzeIntent = (transcript: string) => {
    let cleanedQuery = transcript.toLowerCase();
    let detectedLocation: string | null = null;

    // 1. Détection de la Zone (Location dynamique)
    locations.forEach(loc => {
      const locName = loc.label.toLowerCase();
      if (cleanedQuery.includes(locName)) {
        detectedLocation = loc.label;
        // On retire le nom de la zone de la recherche texte
        cleanedQuery = cleanedQuery.replace(locName, '').trim();
      }
    });

    // 2. Nettoyage des mots de liaison inutiles pour une recherche propre
    const stopWords = ['dans le', 'dans la', 'dans', 'sur le', 'sur la', 'sur', 'montre-moi', 'cherche', 'trouve', 'les', 'des'];
    stopWords.forEach(word => {
      cleanedQuery = cleanedQuery.replace(new RegExp(`\\b${word}\\b`, 'gi'), '').trim();
    });

    // 3. Application automatique des filtres HUD
    if (detectedLocation) {
      setSelectedLocation(detectedLocation);
    }

    // 4. On injecte l'essence de la recherche (ex: "perceuse bosch") dans l'input
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
    recognition.continuous = false; // Arrêt auto après la phrase
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      analyzeIntent(transcript); // Injection dans le parseur au lieu de setQuery direct
    };

    recognition.start();
  };

  // --- FILTRAGE INTELLIGENT MULTI-CRITÈRES ---
  const results = useMemo(() => {
    return inventory.filter(tool => {
      // Découpage de la requête en mots pour une recherche plus tolérante (ex: "bosch perceuse" trouve "Perceuse Bosch")
      const searchTerms = query.toLowerCase().split(' ').filter(word => word.length > 2);
      
      const matchesQuery = query.trim() === '' || searchTerms.every(term => 
        tool.toolName.toLowerCase().includes(term) || 
        tool.category.toLowerCase().includes(term) ||
        (tool.sku && tool.sku.toLowerCase().includes(term))
      );
      
      const matchesLocation = selectedLocation === 'ALL' || tool.location === selectedLocation;
      return matchesQuery && matchesLocation;
    });
  }, [query, selectedLocation, inventory]);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-[4vh] font-sans pb-[15vh]">
      
      {/* HEADER & RETOUR */}
      <div className="flex justify-between items-center mb-[4vh]">
        <button onClick={onBack} className="flex items-center gap-[2vw] active:scale-90 transition-transform">
          <img src="/icon-return.png" alt="Retour" className="w-[2.5rem] h-[2.5rem] object-contain" />
          <span className="text-[#FF6600] font-black uppercase text-[0.7rem] tracking-widest mt-1">Menu</span>
        </button>
        
        <div className="flex flex-col items-end text-right">
          <h2 className="text-[1.5rem] font-black italic uppercase tracking-tighter leading-none">Retrouver</h2>
          <div className="bg-[#FF6600] px-[1rem] py-[0.1rem] -rotate-2 mt-[0.5rem] shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
            <span className="text-[0.5rem] font-black text-white italic uppercase tracking-[0.2em]">Vocal Pro</span>
          </div>
        </div>
      </div>

      {/* INPUT DE RECHERCHE HDR */}
      <div className="relative mb-[4vh]">
        <div className="absolute inset-y-0 left-[4vw] flex items-center pointer-events-none">
          <SearchIcon size={20} className="text-gray-500" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un outil..."
          className="w-full bg-[#1E1E1E] border border-white/10 rounded-[1.5rem] py-[2vh] pl-[12vw] pr-[15vw] text-[1rem] focus:border-[#FF6600] transition-all outline-none shadow-inner text-white"
        />
        
        <button 
          onClick={startListening}
          className={`absolute right-[1.5vw] top-1/2 -translate-y-1/2 p-[1.5vh] rounded-[1rem] transition-all ${
            isListening ? 'bg-red-600 animate-pulse shadow-[0_0_20px_rgba(220,53,69,0.5)]' : 'bg-[#FF6600] shadow-[0_0_15px_rgba(255,102,0,0.3)]'
          }`}
        >
          {isListening ? <MicOff size={22} color="white" /> : <Mic size={22} color="black" />}
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
        {results.length > 0 ? (
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