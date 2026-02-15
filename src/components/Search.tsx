import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Search as SearchIcon, MapPin, ChevronLeft } from 'lucide-react';
// Correction de l'import suite à notre modification du service
import { getInventory } from '../services/memoryService';
import type { ToolMemory } from '../types';

interface SearchProps {
  onBack: () => void;
}

const Search: React.FC<SearchProps> = ({ onBack }) => {
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ToolMemory[]>([]);
  const [allTools, setAllTools] = useState<ToolMemory[]>([]);

  // Chargement initial avec la nouvelle fonction getInventory
  useEffect(() => {
    const tools = getInventory();
    setAllTools(tools);
  }, []);

  // Logique de filtrage en temps réel
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
    } else {
      const filtered = allTools.filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.categorie.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  }, [query, allTools]);

  // Reconnaissance vocale (Web Speech API)
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 font-sans pb-32">
      
      {/* BOUTON RETOUR : Bleu Navigation selon Manifeste */}
      <button 
        onClick={onBack} 
        className="text-[#007BFF] font-bold flex items-center gap-1 mb-6 uppercase text-xs tracking-tighter"
      >
        <ChevronLeft size={18} /> Retour Dashboard
      </button>

      <header className="mb-8">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Retrouver</h2>
        <div className="h-1 w-12 bg-[#FF6600] mt-1 shadow-[0_0_8px_#FF6600]"></div>
        <p className="text-[10px] text-[#B0BEC5] font-bold uppercase tracking-widest mt-2">Assistant Vocal & Spatial</p>
      </header>

      {/* ZONE DE RECHERCHE */}
      <div className="relative mb-10">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Outil, catégorie, bac..."
          className="w-full bg-[#1E1E1E] border border-[#333] rounded-2xl py-5 pl-14 pr-16 text-sm focus:border-[#FF6600] transition-all outline-none shadow-inner"
        />
        <SearchIcon className="absolute left-5 top-5 text-[#B0BEC5]" size={20} />
        
        {/* BOUTON MICRO : Effet Glow Phoenix */}
        <button 
          onClick={startListening}
          className={`absolute right-2 top-2 p-3.5 rounded-xl transition-all ${
            isListening 
            ? 'bg-[#DC3545] animate-pulse shadow-[0_0_20px_#DC3545]' 
            : 'bg-[#FF6600] hover:scale-105 shadow-[0_0_15px_rgba(255,102,0,0.4)]'
          }`}
        >
          {isListening ? <MicOff size={22} /> : <Mic size={22} />}
        </button>
      </div>

      {/* RÉSULTATS : Look Industriel */}
      <div className="grid gap-4">
        {results.length > 0 ? (
          results.map(tool => (
            <div key={tool.id} className="bg-[#1E1E1E] border border-[#333] rounded-2xl p-4 flex items-center gap-4 hover:border-[#FF6600] transition-colors group">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-black border border-[#444] flex-shrink-0">
                <img src={tool.originalImage} alt={tool.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-base uppercase text-white truncate">{tool.name}</h3>
                <div className="flex items-center gap-1.5 text-[#FF6600] mt-1">
                  <MapPin size={12} />
                  <span className="text-[11px] font-bold uppercase tracking-tighter">Emplacement : {tool.localisation || 'Non défini'}</span>
                </div>
                <p className="text-[10px] text-[#B0BEC5] mt-2 line-clamp-1 italic">
                  Ref: {tool.details}
                </p>
              </div>
            </div>
          ))
        ) : query !== '' && (
          <div className="text-center py-20 border-2 border-dashed border-[#333] rounded-3xl">
            <p className="text-[#B0BEC5] text-sm font-medium italic">Aucun signal détecté pour "{query}"</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Search;