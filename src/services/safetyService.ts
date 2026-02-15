/**
 * PHOENIX-EYE - Module de Sécurité Industrielle
 * Rôle : Détection des défauts de gainage et conformité VAT
 */

export interface ToolSafetyStatus {
  isConform: boolean;
  alertMessage: string | null;
  status: 'DISPONIBLE' | 'HORS SERVICE' | 'MAINTENANCE';
}

export const checkToolSafety = (toolName: string, analysisData: { hasGripDamage: boolean }): ToolSafetyStatus => {
  // Les outils critiques qui activent le verrou de sécurité
  const criticalTools = ['VAT', '1000V', 'Multimètre'];
  const isCritical = criticalTools.some(keyword => toolName.includes(keyword));

  // Si l'outil est critique et qu'un défaut de gainage est détecté
  if (isCritical && analysisData.hasGripDamage) {
    return {
      isConform: false,
      alertMessage: `🛑 DANGER : Défaut d'isolement détecté sur ${toolName}. Utilisation interdite.`,
      status: 'HORS SERVICE'
    };
  }

  return {
    isConform: true,
    alertMessage: null,
    status: 'DISPONIBLE'
  };
};