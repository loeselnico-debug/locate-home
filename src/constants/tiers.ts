export type UserTier = 'FREE' | 'PREMIUM' | 'PRO';

export const TIERS_CONFIG = {
  FREE: { 
    label: "LOCATE HOME Basic", 
    itemLimit: 15, // Aligné sur la V1.4
    safetyAudit: false 
  },
  PREMIUM: { 
    label: "LOCATE HOME Premium", 
    itemLimit: 1000, 
    safetyAudit: false 
  },
  PRO: { 
    label: "LOCATE SYSTEMS Expert", 
    itemLimit: 9999, 
    safetyAudit: true 
  }
};