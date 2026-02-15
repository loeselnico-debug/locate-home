import React, { useState, useRef } from 'react';
import { ChevronLeft, Camera, ScanLine, Loader2, CheckCircle2 } from 'lucide-react';
import { addTool } from '../services/memoryService';
import { geminiService } from '../services/geminiService';
import type { InventoryItem } from '../types';

interface ScannerProps {
  onBack: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState("Prêt pour scan environnement");
  const [scanSuccess, setScanSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Déclenchement de l'appareil photo iPhone
  const handleTrigger = () => {
    fileInputRef.current?.click();
  };

  const processCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setStatus("Analyse de l'environnement...");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;

      try {
        // Appel au cerveau Gemini (Optimisé pour multi-détection et contexte)
        const results = await geminiService.analyzeTool(base64Image);

        if (results && results.length > 0) {
          setStatus(`${results.length} outils détectés`);
          
          // Sauvegarde en série dans le stockage local
          results.forEach((toolData: any) => {
            const newItem: InventoryItem = {
              id: crypto.randomUUID(),
              name: toolData.name,
              details: toolData.details,
              etat: toolData.etat,
              categorie: toolData.categorie,
              score_confiance: toolData.score_confiance,
              alerte_securite: toolData.alerte_securite,
              originalImage: base64Image,
              date: new Date().toLocaleDateString(),
              localisation: toolData.localisation || "Non défini"
            };
            addTool(newItem);
          });

          setScanSuccess(true);
          setTimeout(() => {
            onBack(); // Retour auto au dashboard après succès
          }, 2000);

        } else {
          setStatus("Aucun outil identifié");
          alert("L'IA n'a pas pu isoler d'outils. Vérifiez l'éclairage.");
        }
      } catch (error) {
        console.error("Erreur Scanner:", error);
        setStatus("Erreur système");
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 flex flex-col font-sans">
      
      {/* HEADER DE NAVIGATION (Bleu Standard) */}
      <button 
        onClick={onBack} 
        className="text-[#007BFF] font-bold flex items-center gap-1 mb-8 uppercase text-xs tracking-tighter"
      >
        <ChevronLeft size={20} /> Retour Dashboard
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        
        {/* ZONE DE VISÉE INDUSTRIELLE */}
        <div className={`relative w-full aspect-square max-w-sm rounded-[3rem] overflow-hidden border-2 transition-all duration-500 ${
          scanSuccess ? 'border-[#28A745] shadow-[0_0_40px_rgba(40,167,69,0.3)]' : 'border-[#333] bg-black shadow-2xl'
        }`}>
          
          {/* ANIMATION LASER (Pendant l'analyse) */}
          {isScanning && (
            <div className="absolute inset-0 z-20">
              <div className="w-full h-[2px] bg-[#FF6600] shadow-[0_0_15px_#FF6600] absolute animate-scan-move"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#FF6600]/10 to-transparent h-1/2 animate-scan-move"></div>
            </div>
          )}

          {/* ÉCRAN DE SUCCÈS */}
          {scanSuccess ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212]/90 z-30 animate-in fade-in zoom-in">
              <CheckCircle2 size={80} className="text-[#28A745] mb-4" />
              <p className="text-xl font-black uppercase tracking-tighter">Inventaire à jour</p>
              <p className="text-[#B0BEC5] text-xs mt-2">Redirection vers Dashboard...</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <Camera size={120} />
            </div>
          )}

          {/* LOADER IA */}
          {isScanning && !scanSuccess && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-40">
              <Loader2 size={40} className="text-[#FF6600] animate-spin mb-4" />
              <p className="text-[#FF6600] font-black text-[10px] uppercase tracking-[0.3em]">Traitement IA Flash 1.5</p>
            </div>
          )}
        </div>

        {/* INPUT CAMERA INVISIBLE */}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          ref={fileInputRef}
          onChange={processCapture}
          className="hidden"
        />

        {/* DÉCLENCHEUR PRINCIPAL (Orange Industriel) */}
        <button 
          onClick={handleTrigger}
          disabled={isScanning || scanSuccess}
          className={`mt-12 w-24 h-24 rounded-full flex items-center justify-center transition-all ${
            isScanning || scanSuccess
            ? 'bg-[#1E1E1E] scale-90 cursor-not-allowed' 
            : 'bg-[#FF6600] shadow-[0_10px_30px_rgba(255,102,0,0.3)] hover:scale-105 active:scale-95'
          }`}
        >
          <ScanLine size={40} className="text-white" />
        </button>
        
        {/* BARRE DE STATUT */}
        <div className="mt-8 text-center">
          <p className={`text-sm font-black uppercase tracking-widest ${isScanning ? 'text-[#FF6600]' : 'text-[#B0BEC5]'}`}>
            {status}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#28A745]"></span>
            <p className="text-[10px] text-[#444] font-bold uppercase tracking-tighter">Système de Vision LocateHome v1.4</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;