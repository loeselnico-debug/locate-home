import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InsuranceReport } from './InsuranceReport';
import type { InventoryItem } from '../../../types';

interface PdfExportButtonProps {
  inventory: InventoryItem[];
  userInfo: { name: string; address: string };
}

// Ce composant contient la logique lourde et sera chargé en différé (Lazy Load)
const PdfExportButton: React.FC<PdfExportButtonProps> = ({ inventory, userInfo }) => {
  return (
    <PDFDownloadLink
      document={<InsuranceReport items={inventory} userInfo={userInfo} />}
      fileName={`LocateHome_Assurance_${new Date().toISOString().split('T')[0]}.pdf`}
      className="w-14 h-14 active:scale-90 transition-transform block"
    >
      {({ loading }) => (
        <img
          src="/icon-assurance.png"
          alt="Assurance"
          className={`w-full h-full object-contain drop-shadow-lg ${loading ? 'opacity-50 animate-pulse' : ''}`}
        />
      )}
    </PDFDownloadLink>
  );
};

export default PdfExportButton;