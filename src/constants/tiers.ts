export type UserTier = 'FREE' | 'PREMIUM' | 'PRO';

export const TIERS_CONFIG = {
  FREE: { label: "L'Anti-Oubli", itemLimit: 50, safetyAudit: false },
  PREMIUM: { label: "Le Garage Intelligent", itemLimit: 9999, safetyAudit: false },
  PRO: { label: "L'Exigence Industrielle", itemLimit: 9999, safetyAudit: true }
};