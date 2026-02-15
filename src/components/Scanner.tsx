import { useState } from 'react';
import { Camera, ChevronLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { memoryService } from '../services/memoryService';
import type { InventoryItem } from '../types';

interface ScannerProps {
  onBack: () => void;
}

export default function Scanner({ onBack }: ScannerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundTool, setFoundTool] = useState<InventoryItem | null>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result as string;
        const analysis = await geminiService.analyzeTool(base64.split(',')[1]);
        
        if (analysis) {
          setFoundTool({
            id: crypto.randomUUID(),
            ...analysis,
            originalImage: base64,
            date: new Date().toISOString(),
            localisation: "Atelier"
          });
        }
      } catch (err) {
        setError("L'IA n'a pas pu identifier l'outil.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveAndExit = () => {
    if (foundTool) {
      memoryService.addTool(foundTool);
      onBack();
    }
  };

  return (
    <div className="p-6 bg-[#121212] min-h-screen text-white">
      <button onClick={onBack} className="text-[#FF6600] mb-6 flex items-center gap-2 uppercase font-bold text-xs">
        <ChevronLeft size={16} /> Retour
      </button>

      <div className="bg-[#1E1E1E] border border-[#333] rounded-3xl p-8 text-center shadow-2xl">
        {!foundTool ? (
          <>
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 border border-[#FF6600]">
              {loading ? <Loader2 className="animate-spin text-[#FF6600]" /> : <Camera className="text-gray-600" />}
            </div>
            <label className="bg-[#FF6600] text-black font-black py-4 px-8 rounded-2xl block cursor-pointer uppercase active:scale-95 transition-all">
              {loading ? "ANALYSE..." : "SCANNER L'OUTIL"}
              <input type="file" accept="image/*" capture="environment" onChange={handleCapture} className="hidden" disabled={loading} />
            </label>
          </>
        ) : (
          <div className="space-y-4">
            <img src={foundTool.originalImage} className="w-full aspect-square object-cover rounded-xl border border-emerald-500" alt="" />
            <h2 className="text-xl font-black text-[#FF6600] uppercase text-left">{foundTool.name}</h2>
            <button onClick={saveAndExit} className="w-full bg-emerald-600 p-4 rounded-xl font-black flex items-center justify-center gap-2 uppercase">
              <CheckCircle size={20} /> VALIDER ET RANGER
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500 text-red-500 rounded-lg flex items-center gap-2 text-[10px] uppercase font-bold">
            <AlertCircle size={14} /> {error}
          </div>
        )}
      </div>
    </div>
  );
}