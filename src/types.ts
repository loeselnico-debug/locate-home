export interface InventoryItem {
  id: string;
  name: string;           
  details: string;        
  etat: string;           
  categorie: string;      
  localisation: string;
  score_confiance: number; 
  alerte_securite: string; 
  originalImage: string;
  date: string;

  // --- AJOUTE CES DEUX LIGNES ICI ---
  objet?: string;         // Alias pour compatibilité
  confiance?: number;     // Alias pour compatibilité
}

export type ToolMemory = InventoryItem;