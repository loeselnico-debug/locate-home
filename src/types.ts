export interface InventoryItem {
  id: string;
  name: string;
  details: string;
  etat: string;
  categorie: string;
  score_confiance: number;
  alerte_securite: boolean;
  originalImage: string;
  date: string;
  localisation: string;
}

// Cette ligne règle l'erreur "no exported member ToolMemory"
export type ToolMemory = InventoryItem;

export interface Category {
  id: string;
  label: string;
  iconName: string;
  description: string;
}