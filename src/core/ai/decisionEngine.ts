// Logique de validation selon la "Charte de Vérité" Phoenix
export interface ScanResult {
  typography?: string;  // Étape 4 : Modèle exact (ex: DHP484)
  zoomDetail?: string;  // Étape 3 : Mandrin, sabot, etc.
  morphology: string;   // Étape 2 : Type d'objet
  brandColor: string;   // Étape 1 : Hypothèse de marque
  confidence: number;   // Seuil de certitude
}

export const validatePhoenixObject = (data: ScanResult) => {
  // Seuil de Vigilance : 70% minimum pour agir
  if (data.confidence < 0.70) {
    return { status: "MANUAL_VALIDATION", message: "Certitude insuffisante" };
  }

  // Application de la hiérarchie stricte : 4 -> 3 -> 2 -> 1
  const isFullyValidated = !!(data.typography && data.zoomDetail && data.morphology);

  if (isFullyValidated) {
    return {
      status: "CERTIFIED",
      label: data.typography,
      safetyCheck: "OK" 
    };
  }

  return { status: "ANALYZING", message: "Analyse morphologique en cours..." };
};