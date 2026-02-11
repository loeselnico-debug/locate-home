import { useState, type ChangeEvent } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { analyzeInventory } from '../services/geminiService';

const Scanner = () => {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [certainty, setCertainty] = useState<number | null>(null);

  const processValidation = (text: string) => {
    const match = text.match(/CERTITUDE:\s*(\d+)/i);
    const score = match ? parseInt(match[1]) : 0;
    setCertainty(score);
    return score;
  };

  const handleCapture = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult("");
    setCertainty(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const response = await analyzeInventory(base64);
      processValidation(response);
      setResult(response);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Scanner Phoenix</h2>
      
      <div className="relative group">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-3xl bg-white hover:bg-slate-50 transition-all cursor-pointer overflow-hidden shadow-inner">
          {loading ? (
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
          ) : (
            <>
              <Camera className="w-12 h-12 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span className="mt-2 text-sm text-slate-500 font-medium">Prendre une photo</span>
            </>
          )}
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
        </label>
      </div>

      {result && (
        <div className={`p-5 rounded-2xl border-2 transition-all ${certainty && certainty >= 70 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            {certainty && certainty >= 70 ? <CheckCircle className="text-green-600" size={20} /> : <AlertTriangle className="text-amber-600" size={20} />}
            <span className="font-bold text-slate-700">Analyse IA</span>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">{result}</p>
          {certainty && certainty >= 70 ? (
            <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-transform">
              ENREGISTRER À L'INVENTAIRE
            </button>
          ) : (
            <div className="text-center p-3 border border-amber-300 rounded-xl text-amber-700 text-xs font-bold bg-white/50">
              ⚠️ CERTITUDE TROP FAIBLE ({certainty}%) - REFAIRE LE SCAN
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scanner;