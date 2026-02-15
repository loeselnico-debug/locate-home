import React, { useState } from 'react';
import { ChevronLeft, Camera, ScanLine } from 'lucide-react';
import { addTool } from '../services/memoryService';
import type { InventoryItem } from '../types';

interface ScannerProps {
  onBack: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onBack }) => {
  const [isScanning, setIsScanning] = useState(false);

  // Simulation de capture pour le moment (en attente de Gemini Flash 1.5 réel)
  const handleCapture = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: "Nouvel Outil",
        details: "Scan automatique",
        etat: "Bon",
        categorie: "Outillage",
        score_confiance: 0.95,
        alerte_securite: false,
        originalImage: "https://via.placeholder.com/150",
        date: new Date().toLocaleDateString(),
        localisation: "Bac Alpha"
      };
      
      addTool(newItem);
      setIsScanning(false);
      alert("Outil enregistré dans le Phoenix-Eye !");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 flex flex-col">
      <button onClick={onBack} className="text-[#007BFF] font-bold flex items-center gap-1 mb-6 uppercase text-xs">
        <ChevronLeft size={18} /> Retour
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-full aspect-square max-w-sm bg-black border-2 border-[#333] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)]">
          {/* EFFET LASER SCANNER */}
          {isScanning && (
            <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6600] shadow-[0_0_15px_#FF6600] animate-scan-move z-10"></div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Camera size={80} className="text-[#B0BEC5]" />
          </div>
        </div>

        <button 
          onClick={handleCapture}
          disabled={isScanning}
          className={`mt-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${
            isScanning ? 'bg-[#333] scale-90' : 'bg-[#FF6600] hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,102,0,0.5)]'
          }`}
        >
          <ScanLine size={32} className="text-white" />
        </button>
        
        <p className="mt-4 text-[#B0BEC5] text-[10px] font-bold uppercase tracking-[0.2em]">
          {isScanning ? "Analyse Gemini en cours..." : "Prêt pour Scan HDR"}
        </p>
      </div>
    </div>
  );
};

export default Scanner;