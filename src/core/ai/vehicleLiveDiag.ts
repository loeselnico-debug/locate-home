/**
 * LOCATE GARAGE - Moteur de Sécurité Live (M5)
 * Rôle : Validation visuelle avant intervention.
 */

export interface SafetyCheckResult {
  authorized: boolean;
  missingElement?: string;
  alertLevel: 'INFO' | 'WARNING' | 'CRITICAL';
}

export const checkMechanicalSafety = (
  mode: 'levage' | 'electrique' | 'hydraulique',
  visualTags: string[]
): SafetyCheckResult => {
  
  if (mode === 'levage') {
    const hasChandelles = visualTags.includes('chandelle_securite');
    return {
      authorized: hasChandelles,
      missingElement: hasChandelles ? undefined : "CHANDELLES DE SÉCURITÉ NON DÉTECTÉES",
      alertLevel: hasChandelles ? 'INFO' : 'CRITICAL'
    };
  }

  if (mode === 'electrique') {
    const hasGants = visualTags.includes('gants_classe_0');
    return {
      authorized: hasGants,
      missingElement: hasGants ? undefined : "GANTS ISOLANTS CLASSE 0 OBLIGATOIRES",
      alertLevel: 'CRITICAL'
    };
  }

  return { authorized: true, alertLevel: 'INFO' };
};