import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Search as SearchIcon, MapPin, ChevronLeft } from 'lucide-react';
import { memoryService } from '../services/memoryService';
import type { ToolMemory } from '../types';

const Search: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ToolMemory[]>([]);
  const [allTools, setAllTools] = useState<ToolMemory[]>([]);

  useEffect(() => {
    setAllTools(memoryService.getTools());
  }, []);

  // Logique de filtrage
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

  // Fonction de reconnaissance vocale
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
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
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-white pb-32">
      <button onClick={onBack} className="text-orange-500 font-black flex items-center gap-2 mb-4 uppercase text-xs">
        <ChevronLeft size={16} /> Retour Dashboard
      </button>

      <header>
        <h2 className="text-2xl font-black text-white italic uppercase">Retrouver</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Assistant Vocal & Spatial</p>
      </header>

      {/* Barre de recherche interactive */}
      <div className="relative group">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nom de l'outil ou catégorie..."
          className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-4 pl-12 pr-16 text-sm focus:border-orange-500 transition-all outline-none"
        />
        <SearchIcon className="absolute left-4 top-4 text-slate-500" size={18} />
        
        <button 
          onClick={startListening}
          className={`absolute right-2 top-2 p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-orange-600 hover:bg-orange-500'}`}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
      </div>

      {/* Liste des résultats (Charte de Vérité) */}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map(tool => (
            <div key={tool.id} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-5 flex items-center gap-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black flex-shrink-0 border border-slate-700">
                <img src={tool.originalImage} alt="" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm uppercase text-white">{tool.name}</h3>
                <div className="flex items-center gap-1 text-emerald-500 mt-1">
                  <MapPin size={10} />
                  <span className="text-[10px] font-black uppercase">Localisation : {tool.localisation}</span>
                </div>
                <p className="text-[9px] text-slate-500 mt-1 italic">"À côté de : {tool.details.substring(0, 30)}..."</p>
              </div>
            </div>
          ))
        ) : query !== '' && (
          <p className="text-center text-slate-600 text-xs py-10">Aucun outil correspondant trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default Search;