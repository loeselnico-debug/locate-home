import React, { useState } from 'react';
import { Camera, Save, Loader2, ShieldAlert } from 'lucide-react';
import { applyIndustrialHDR } from '../services/imageService';
import { analyzeInventory } from '../services/geminiService';
import { saveTool } from '../services/memoryService';
import type { ToolMemory } from '../types';

const Scanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [foundTool, setFoundTool] = useState<ToolMemory | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. La fonction de capture
  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Original = reader.result as string;
        
        // HDR Automatique
        const processedImage = await applyIndustrialHDR(base64Original);

        // Analyse IA
        const iaData = await analyzeInventory(processedImage, 'PRO');

        if (iaData) {
          setFoundTool({
            id: crypto.randomUUID(),
            name: iaData.name || "Outil inconnu",
            details: iaData.details || "",
            etat: iaData.etat || "usage",
            categorie: iaData.categorie || "electro",
            score_confiance: iaData.score_confiance || 0,
            alerte_securite: iaData.alerte_securite || "",
            localisation: "Atelier",
            originalImage: processedImage,
            date: new Date().toISOString()
          });
        }
      } catch (err) {
        setError("L'analyse a échoué.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // 2. La fonction d'enregistrement (Celle qui manquait !)
  const handleSave = () => {
    if (foundTool) {
      saveTool(foundTool);
      setFoundTool(null);
      alert("✅ Outil enregistré avec succès !");
    }
  };

  // Verrou de sécurité 70%
  const isLocked = foundTool ? foundTool.score_confiance < 0.7 : true;

  return (
    <div className="flex flex-col items-center p-6 space-y-6 bg-slate-900 min-h-screen text-white font-sans">
      <header className="text-center">
        <h2 className="text-xl font-bold text-orange-500 uppercase">Scanner Phoenix-Eye</h2>
        <p className="text-[10px] text-slate-500 italic">Vision HDR & Audit Sécurité</p>
      </header>

    {/* --- AJOUTE CE BLOC ICI POUR FIXER L'ERREUR --- */}
    {error && (
      <div className="w-full max-w-sm p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-xs animate-pulse">
        <ShieldAlert size={18} />
        <p className="font-bold uppercase tracking-tighter">{error}</p>
      </div>
    )}
      {/* Zone de Capture */}
      <label className="relative flex flex-col items-center justify-center w-56 h-56 border-2 border-dashed border-slate-700 rounded-full cursor-pointer hover:border-orange-500 transition-all overflow-hidden bg-slate-800/50">
        {loading ? (
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        ) : (
          <Camera className="w-10 h-10 text-slate-500" />
        )}
        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
      </label>

      {/* Fiche de Résultat */}
      {foundTool && (
        <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black uppercase italic text-sm">{foundTool.name}</h3>
            <span className={`text-[10px] font-bold px-2 py-1 rounded ${isLocked ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
              {(foundTool.score_confiance * 100).toFixed(0)}% CONFIDENCE
            </span>
            {loading && (
  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-full">
    <div className="animate-laser"></div>
  </div>
)}
          </div>

          <p className="text-xs text-slate-400 mb-4">{foundTool.details}</p>

          {foundTool.alerte_securite && (
            <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] mb-4">
              <ShieldAlert size={14} className="shrink-0" />
              {foundTool.alerte_securite}
            </div>
          )}

          {!isLocked ? (
            <button 
              onClick={handleSave} 
              className="w-full py-4 bg-orange-600 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-500 transition-all active:scale-95"
            >
              <Save size={18} />
              ENREGISTRER
            </button>
          ) : (
            <div className="text-center p-3 bg-slate-900 rounded-xl border border-orange-500/30">
              <p className="text-[10px] text-orange-500 font-bold uppercase">⚠️ Sécurité : Confiance insuffisante</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scanner;