import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

const Scanner = () => {
  const [analysis, setAnalysis] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [isBlocking, setIsBlocking] = useState<boolean>(false);

  // Simulation de la réception du résultat de Gemini
  const handleScanResult = (text: string) => {
    // On extrait le chiffre après "CERTITUDE:"
    const scoreMatch = text.match(/CERTITUDE:\s*(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
    
    setAnalysis(text);
    setConfidence(score);
    setIsBlocking(score < 70); // VERROU : Bloque si < 70%
  };

  return (
    <div className="p-4 space-y-4">
      {/* Zone de Prévisualisation Photo (Simulée ici) */}
      <div className="w-full h-64 bg-slate-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300">
        <span className="text-slate-400 text-sm italic">Flux caméra actif</span>
      </div>

      {/* Résultat de l'Analyse */}
      {analysis && (
        <div className={`p-4 rounded-2xl border-2 transition-all ${isBlocking ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isBlocking ? (
              <AlertTriangle className="text-red-600 animate-bounce" size={20} />
            ) : (
              <CheckCircle2 className="text-green-600" size={20} />
            )}
            <span className={`font-bold text-sm ${isBlocking ? 'text-red-700' : 'text-green-700'}`}>
              Certitude IA : {confidence}%
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed mb-4">{analysis}</p>

          {/* VERROU : Message d'alerte spécifique Electricien */}
          {isBlocking && (
            <div className="bg-white p-3 rounded-lg border border-red-200 mb-4">
              <div className="flex gap-2 items-start text-red-800">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold uppercase leading-tight">
                  IDENTIFICATION INCERTAINE. <br/>
                  Vérification manuelle requise du gainage et de la norme (NF/EN).
                </p>
              </div>
            </div>
          )}

          {/* Boutons d'Action */}
          <div className="flex gap-3">
            {isBlocking ? (
              <button 
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-200 active:scale-95"
                onClick={() => setIsBlocking(false)} // L'utilisateur valide manuellement
              >
                VALIDER MANUELLEMENT
              </button>
            ) : (
              <button className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-200 active:scale-95">
                ENREGISTRER À L'INVENTAIRE
              </button>
            )}
            <button className="px-4 py-3 bg-slate-100 text-slate-500 rounded-xl text-sm font-bold">
              RESCANNER
            </button>
          </div>
        </div>
      )}
      
      {/* Rappel métier constant */}
      <p className="text-[10px] text-slate-400 text-center italic">
        Système Locate Home - Normes Françaises 2026. <br/>
        Rappel : Vérification d'Absence de Tension (VAT) avant analyse.
      </p>
    </div>
  );
};

export default Scanner;