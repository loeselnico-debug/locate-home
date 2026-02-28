/**
 * LOCATE GARAGE - REPORT SERVICE (V1.2 - Dualité Métier)
 * Génération de rapports : Maintenance Industrielle (AFNOR) & Mécanique (OBD2)
 */

import type { LiveDiagnostic } from '../../../core/ai/liveService';

export interface ReportData {
  mode: 'maintenance' | 'mecanique'; // <-- NOUVEAU : On exige le mode
  technicianId: string;
  location: string;
  equipmentId: string; // Sert aussi d'Immatriculation pour la mécanique
  safetyChecks: { id: string; label: string; validated: boolean }[];
  diagnostic: LiveDiagnostic;
  startTime: Date;
  endTime: Date;
}

class ReportService {
  private calculateDuration(start: Date, end: Date): string {
    const diffMs = Math.max(0, end.getTime() - start.getTime());
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  }

  private estimateAfnorLevel(confidence: number): string {
    if (confidence >= 0.95) return "Niveau 2 (Dépannage par échange standard)";
    if (confidence >= 0.80) return "Niveau 3 (Identification d'origine de panne complexe)";
    return "Niveau 4/5 (Travaux importants / Atelier)";
  }

  async generateMaintenanceReport(data: ReportData) {
    const duration = this.calculateDuration(data.startTime, data.endTime);
    const isMeca = data.mode === 'mecanique';

    const reportContent = {
      metadata: {
        reportId: `M5-${isMeca ? 'MEC' : 'IND'}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        technician: data.technicianId,
        duration: duration,
        mode: data.mode, // On passe le mode au PDF
        standard: isMeca ? "Standard Garagiste" : "OSA/CBM"
      },
      context: {
        location: data.location,
        // Adaptation du vocabulaire selon le métier
        equipmentLabel: isMeca ? "Véhicule / Plaque" : "Équipement ID",
        equipmentId: data.equipmentId,
        classificationLabel: isMeca ? "Type d'intervention" : "Niveau AFNOR",
        classificationValue: isMeca ? "Diagnostic & Contrôle Visuel" : this.estimateAfnorLevel(data.diagnostic.confidence)
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

    console.log("📄 [GMAO] Rapport formaté :", reportContent);
    return reportContent;
  }

  exportReportLocally(report: any) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${report.metadata.reportId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}

export const reportService = new ReportService();