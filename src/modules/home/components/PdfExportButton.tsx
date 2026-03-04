import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InsuranceReport } from './InsuranceReport';
import type { InventoryItem } from '../../../types';

interface PdfExportButtonProps {
  inventory: InventoryItem[];
  userInfo: { name: string; company?: string; address: string };
}

const PdfExportButton: React.FC<PdfExportButtonProps> = ({ inventory, userInfo }) => {
  const [isReady, setIsReady] = useState(false);

  // Sécurité : On attend que la page soit bien chargée avant d'allumer le moteur PDF
  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return (
    <div className="w-14 h-14 bg-[#1E1E1E] rounded-xl flex items-center justify-center opacity-50">
      <span className="text-[8px] font-black text-white">INIT...</span>
    </div>
  );

  return (
    <PDFDownloadLink
      document={<InsuranceReport items={inventory} userInfo={userInfo} />}
      fileName={`LocateHome_Assurance_${new Date().toISOString().split('T')[0]}.pdf`}
      className="w-14 h-14 active:scale-90 transition-transform block relative"
    >
      {({ loading, error }) => {
        if (error) console.error("Erreur moteur PDF :", error);

        return (
          <>
            <img
              src="/icon-assurance.png"
              alt="Assurance"
              className={`w-full h-full object-contain drop-shadow-lg transition-all ${loading ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}
            />
            {/* VOYANT DE CHARGEMENT CLAIR */}
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-xl shadow-inner">
                <div className="w-4 h-4 border-2 border-[#FF6600] border-t-transparent rounded-full animate-spin mb-1"></div>
                <span className="text-[#FF6600] text-[7px] font-black tracking-widest uppercase">Calcul</span>
              </div>
            )}
          </>
        );
      }}
    </PDFDownloadLink>
  );
};

export default PdfExportButton;