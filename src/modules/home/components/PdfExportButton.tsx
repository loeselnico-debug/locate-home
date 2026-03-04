import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InsuranceReport } from './InsuranceReport';
import type { InventoryItem } from '../../../types';

// 🛡️ LE DISJONCTEUR (Error Boundary)
// Empêche le plantage de la librairie PDF de se propager au reste de l'application
class SafePdfBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-14 h-14 bg-[#1E1E1E] rounded-xl border-2 border-red-500 flex flex-col items-center justify-center cursor-pointer active:scale-95" onClick={() => window.location.reload()}>
          <span className="text-[8px] text-red-500 font-black uppercase tracking-widest leading-tight text-center">Crash<br/>Moteur</span>
        </div>
      );
    }
    return this.props.children;
  }
}

interface PdfExportButtonProps {
  inventory: InventoryItem[];
  userInfo: { name: string; company?: string; address: string };
}

const PdfExportButton: React.FC<PdfExportButtonProps> = ({ inventory, userInfo }) => {
  // L'état qui garde le moteur PDF éteint par défaut
  const [isActivated, setIsActivated] = useState(false);

  // ÉTAT 1 : Moteur éteint (Protection maximale de la page)
  if (!isActivated) {
    return (
      <button
        onClick={() => setIsActivated(true)}
        className="w-14 h-14 active:scale-90 transition-transform block relative"
        title="Préparer le rapport PDF"
      >
        <img src="/icon-assurance.png" alt="Assurance" className="w-full h-full object-contain drop-shadow-lg" />
      </button>
    );
  }

  // ÉTAT 2 : Moteur allumé (Dans son caisson de confinement)
  return (
    <SafePdfBoundary>
      <PDFDownloadLink
        document={<InsuranceReport items={inventory} userInfo={userInfo} />}
        fileName={`LocateHome_Assurance_${new Date().toISOString().split('T')[0]}.pdf`}
        className="w-14 h-14 active:scale-90 transition-transform block relative"
      >
        {({ loading, error }) => {
          
          if (error) {
            console.error("Crash silencieux capturé :", error);
            return (
              <div className="w-full h-full bg-red-900/50 rounded-xl flex items-center justify-center border border-red-500">
                <span className="text-[10px] font-black text-red-500 uppercase">Erreur</span>
              </div>
            );
          }

          return (
            <>
              <img
                src="/icon-assurance.png"
                alt="Assurance"
                className={`w-full h-full object-contain drop-shadow-lg transition-all ${loading ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}
              />
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl shadow-inner">
                  <div className="w-4 h-4 border-2 border-[#FF6600] border-t-transparent rounded-full animate-spin mb-1"></div>
                  <span className="text-[#FF6600] text-[6px] font-black tracking-widest uppercase">Calcul...</span>
                </div>
              )}
            </>
          );
        }}
      </PDFDownloadLink>
    </SafePdfBoundary>
  );
};

export default PdfExportButton;