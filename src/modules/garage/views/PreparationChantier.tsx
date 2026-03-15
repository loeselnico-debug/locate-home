import React, { useState } from 'react';
import { ArrowLeft, HardHat, AlertTriangle, Hammer, Wrench, ShieldAlert, Loader2, Send } from 'lucide-react';
import { geminiService } from '../../../core/ai/geminiService';
import { getInventory } from '../../../core/storage/memoryService';

interface PreparationChantierProps {
  onBack: () => void;
}

const PreparationChantier: React.FC<PreparationChantierProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prepData, setPrepData] = useState<any>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setPrepData(null);

    // On récupère l'inventaire actuel pour que l'IA sache ce qu'on possède
    const tools = getInventory().map(t => t.toolName).join(', ');

    const result = await geminiService.generateChantierPrep(prompt, tools);
    setPrepData(result);
    setIsGenerating(false);
  };

  return (
    <div className="w-full h-full bg-[#121212] flex flex-col font-sans px-[4vw] pt-[2vh] pb-[4vh]">
      
      {/* HEADER */}
      <div className="h-[10vh] flex items-center shrink-0 border-b border-white/5 mb-6">
        <button onClick={onBack} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
          <ArrowLeft className="text-white" size={24} />
        </button>
        <div className="ml-4 flex flex-col">
          <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.1rem,4vw,1.4rem)] leading-none">
            Prépa. Chantier
          </h2>
          <span className="text-[#00E5FF] font-bold uppercase tracking-widest text-[10px] mt-1">
            Analyse IA & Outillage
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        
        {/* ZONE DE SAISIE */}
        <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/10 shadow-inner">
          <label className="flex items-center gap-2 text-[#00E5FF] text-[10px] font-black uppercase tracking-widest mb-3">
            <Wrench size={14} /> Description de l'intervention
          </label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Remplacement du moteur de la pompe de relevage P2 (400V)..."
            className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-4 focus:border-[#00E5FF] outline-none transition-colors text-sm min-h-[100px] resize-none"
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`w-full mt-4 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
              isGenerating || !prompt.trim() 
                ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                : 'bg-[#00E5FF] text-black shadow-[0_0_20px_rgba(0,229,255,0.3)] active:scale-95'
            }`}
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {isGenerating ? 'Analyse IA en cours...' : 'Générer le Plan de Prévention'}
          </button>
        </div>

        {/* RÉSULTAT IA */}
        {prepData && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            
            <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/30 p-4 rounded-xl">
              <h3 className="text-[#00E5FF] font-black uppercase text-sm">{prepData.titre}</h3>
            </div>

            {/* RISQUES & EPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-red-950/30 border border-red-500/20 p-4 rounded-xl">
                <h4 className="text-red-400 font-bold uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                  <AlertTriangle size={14} /> Analyse des Risques
                </h4>
                <ul className="space-y-2">
                  {prepData.analyseRisques.map((risque: string, i: number) => (
                    <li key={i} className="text-white/80 text-xs flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span> {risque}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-950/30 border border-orange-500/20 p-4 rounded-xl">
                <h4 className="text-orange-400 font-bold uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                  <HardHat size={14} /> EPI Obligatoires
                </h4>
                <div className="flex flex-wrap gap-2">
                  {prepData.epiRequis.map((epi: string, i: number) => (
                    <span key={i} className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-1 rounded text-[10px] font-bold uppercase">
                      {epi}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* OUTILLAGE */}
            <div className="bg-[#1A1A1A] border border-white/10 p-4 rounded-xl">
              <h4 className="text-white font-bold uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                <Hammer size={14} className="text-[#00E5FF]" /> Outillage Recommandé
              </h4>
              <div className="space-y-2">
                {prepData.outillageRecommande.map((outil: any, i: number) => (
                  <div key={i} className="flex items-center justify-between bg-black/50 p-2.5 rounded-lg border border-white/5">
                    <span className="text-white/90 text-xs font-bold">{outil.nom}</span>
                    {outil.possede ? (
                      <span className="text-green-500 text-[9px] font-black uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded border border-green-500/20">En stock</span>
                    ) : (
                      <span className="text-red-400 text-[9px] font-black uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded border border-red-500/20">À préparer</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* PIÈCES */}
            {prepData.piecesRechange && prepData.piecesRechange.length > 0 && (
              <div className="bg-[#1A1A1A] border border-white/10 p-4 rounded-xl">
                <h4 className="text-white font-bold uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                  <ShieldAlert size={14} className="text-yellow-500" /> Pièces & Consommables
                </h4>
                <div className="flex flex-wrap gap-2">
                  {prepData.piecesRechange.map((piece: string, i: number) => (
                    <span key={i} className="text-gray-300 text-xs bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                      {piece}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default PreparationChantier;