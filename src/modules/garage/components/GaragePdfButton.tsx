import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { GarageReport } from './GarageReport';
import { FileDown } from 'lucide-react';

interface GaragePdfButtonProps {
  reportData: any;
}

// Composant isolé pour éviter de faire crasher le LiveAssistant
const GaragePdfButton: React.FC<GaragePdfButtonProps> = ({ reportData }) => {
  return (
    <PDFDownloadLink
      document={<GarageReport reportData={reportData} />}
      fileName={`${reportData.metadata.reportId}.pdf`}
      className="flex-1 bg-[#DC2626] hover:bg-red-700 text-white py-4 px-6 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)] active:scale-95"
    >
      {({ loading }) => (
        <>
          <FileDown size={18} />
          {loading ? "Génération PDF en cours..." : "Télécharger Rapport PDF"}
        </>
      )}
    </PDFDownloadLink>
  );
};

export default GaragePdfButton;