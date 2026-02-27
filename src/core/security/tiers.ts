export type UserTier = 'FREE' | 'PREMIUM' | 'PRO';

// On crée un "moule" strict pour éviter les erreurs de frappe dans VSCode
export interface TierConfig {
  label: string;
  itemLimit: number;
  safetyAudit: boolean;
  canExportPdf: boolean; // Autorisation pour le Module Assurance
  canUseRanger: boolean; // Autorisation pour le Module Rangement
}

// On applique le moule à notre configuration
export const TIERS_CONFIG: Record<UserTier, TierConfig> = {
  FREE: { 
    label: "LOCATE HOME Basic", 
    itemLimit: 15, // Aligné sur la V1.4 - Limite stricte
    safetyAudit: false,
    canExportPdf: false, // Bloqué en version gratuite
    canUseRanger: true   // On laisse l'accès basique au rangement
  },
  PREMIUM: { 
    label: "LOCATE HOME Premium", 
    itemLimit: 1000, 
    safetyAudit: false,
    canExportPdf: true,  // Débloqué
    canUseRanger: true
  },
  PRO: { 
    label: "LOCATE SYSTEMS Expert", 
    itemLimit: 9999, 
    safetyAudit: true,
    canExportPdf: true,  // Débloqué
    canUseRanger: true
  }
};