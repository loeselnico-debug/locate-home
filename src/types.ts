export type AppView = 'home' | 'categories' | 'inventory' | 'analysis' | 'ar_view';

export interface InventoryItem {
  id: string;
  objet: string;         // Ex: Perceuse Makita
  categorie: string;     // ID de catégorie
  localisation: string;  // Ex: Établi, Tiroir du haut
  etat: string;          // Neuf, Bon, Usagé...
  confiance: string;     // Ex: "98%"
  originalImage: string; // Base64
  dateAjout: string;     // ISO Date
  tags?: string[];
}

export interface MediaPart {
  mimeType: string;
  data: string;
}