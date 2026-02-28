/**
 * LOCATE GARAGE - REPORT SERVICE (V1.0)
 * Génération de rapports d'intervention certifiés GMAO
 * Norme : AFNOR & OSA/CBM
 */

// CORRECTION : Le bon chemin vers le dossier core
import type { LiveDiagnostic } from '../../../core/ai/liveService';

export interface ReportData {
  technicianId: string;
  location: string;
  equipmentId: string;
  safetyChecks: { label: string; validated: boolean }[];
  diagnostic: LiveDiagnostic;
  startTime: Date;
  endTime: Date;
}

class ReportService {
  private calculateMTTR(start: Date, end: Date): string {
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} min`;
  }

  async generateMaintenanceReport(data: ReportData) {
    const mttr = this.calculateMTTR(data.startTime, data.endTime);
    
    const reportContent = {
      title: `RAPPORT D'INTERVENTION - ${data.equipmentId}`,
      meta: {
        date: new Date().toLocaleDateString(),
        technician: data.technicianId,
        mttr: mttr
      },
      safety: data.safetyChecks,
      result: {
        conclusion: data.diagnostic.hypothesis,
        nextStep: data.diagnostic.nextStep,
        confidence: `${(data.diagnostic.confidence * 100).toFixed(0)}%`
      }
    };

    console.log("📄 Rapport compilé pour intégration GMAO :", reportContent);
    return reportContent;
  }
}

export const reportService = new ReportService();