import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { InsuranceReport } from './InsuranceReport';
import type { InventoryItem } from '../../../types';

interface PdfExportButtonProps {
  inventory: InventoryItem[];
  userInfo: { name: string; company?: string; address: string };
}

const PdfExportButton: React.FC<PdfExportButtonProps> = ({ inventory, userInfo }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    // Sécurité : empêche de cliquer 10 fois d'affilée
    if (isGenerating) return; 
    
    setIsGenerating(true);
    
    try {
      // 1. On crée le document PDF à la volée (Zéro-Serveur)
      const blob = await pdf(<InsuranceReport items={inventory} userInfo={userInfo} />).toBlob();
      const url = URL.createObjectURL(blob);
      
      // 2. On simule un clic pour forcer le téléchargement sur le navigateur/téléphone
      const link = document.createElement('a');
      link.href = url;
      link.download = `LocateHome_Assurance_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // 3. On nettoie la mémoire
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur de génération PDF :", error);
      alert("Erreur lors de la création du document. Réessayez.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={isGenerating}
      className={`w-14 h-14 active:scale-90 transition-transform flex items-center justify-center ${isGenerating ? 'opacity-50 animate-pulse' : ''}`}
      title="Télécharger le rapport certifié"
    >
      <img
        src="/icon-assurance.png"
        alt="Assurance"
        className="w-full h-full object-contain drop-shadow-lg"
      />
    </button>
  );
};

export default PdfExportButton;