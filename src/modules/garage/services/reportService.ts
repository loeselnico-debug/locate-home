/**
 * LOCATE GARAGE - REPORT SERVICE (V1.1)
 * Génération de rapports d'intervention certifiés GMAO
 * Norme : AFNOR & OSA/CBM
 */

import type { LiveDiagnostic } from '../../../core/ai/liveService';

export interface ReportData {
  technicianId: string;
  location: string;
  equipmentId: string;
  safetyChecks: { id: string; label: string; validated: boolean }[];
  diagnostic: LiveDiagnostic;
  startTime: Date;
  endTime: Date;
}

class ReportService {
  // Calcul précis du MTTR (Temps Moyen de Réparation)
  private calculateMTTR(start: Date, end: Date): string {
    const diffMs = Math.max(0, end.getTime() - start.getTime());
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  }

  // Classification AFNOR (Norme NF EN 13306) selon la confiance IA
  private estimateAfnorLevel(confidence: number): string {
    if (confidence >= 0.95) return "Niveau 2 (Dépannage par échange standard / Procédure simple)";
    if (confidence >= 0.80) return "Niveau 3 (Identification d'origine de panne complexe)";
    return "Niveau 4/5 (Travaux importants / Retour en atelier requis)";
  }

  async generateMaintenanceReport(data: ReportData) {
    const mttr = this.calculateMTTR(data.startTime, data.endTime);
    const afnorLevel = this.estimateAfnorLevel(data.diagnostic.confidence);

    const reportContent = {
      metadata: {
        reportId: `M5-GMAO-${Date.now()}`,
        timestamp: new Date().toISOString(),
        technician: data.technicianId,
        mttr: mttr,
        standard: "OSA/CBM"
      },
      context: {
        location: data.location,
        equipmentId: data.equipmentId,
        afnorClassification: afnorLevel
      },
      safetyGates: data.safetyChecks.map(check => ({
        step: check.label,
        status: check.validated ? "CONFORME" : "NON VALIDE"
      })),
      diagnostic: {
        hypothesis: data.diagnostic.hypothesis,
        actionPlan: data.diagnostic.nextStep,
        aiConfidence: `${(data.diagnostic.confidence * 100).toFixed(1)}%`
      }
    };

    console.log("📄 [GMAO] Rapport généré :", reportContent);
    return reportContent;
  }

  // Protocole Souverain : Téléchargement local (Simulation d'injection GMAO externe)
  exportReportLocally(report: any) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${report.metadata.reportId}.json`);
    document.body.appendChild(downloadAnchorNode); // Requis pour compatibilité navigateur
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}

export const reportService = new ReportService();