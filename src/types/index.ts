/**
 * LOCATEHOME - Source de Vérité Unique (V1.4)
 * Toute modification de ce schéma doit être validée par l'Architecte.
 */

export interface Category {
  id: string;
  label: string;
  iconName: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { id: 'electro', label: 'Outillage Électroportatif', iconName: 'Zap', description: 'Perceuse, visseuse, meuleuse...' },
  { id: 'main', label: 'Outillage à main', iconName: 'Hammer', description: 'Marteaux, scies, niveaux...' },
  { id: 'serrage', label: 'Serrage et Clés', iconName: 'Wrench', description: 'Clés, pinces, serre-joints...' },
  { id: 'quinc', label: 'Quincaillerie', iconName: 'Nut', description: 'Vis, clous, boulons...' },
  { id: 'elec', label: 'Électricité', iconName: 'Lightbulb', description: 'Multimètres, câbles, ampoules...' },
  { id: 'peinture', label: 'Peinture et Finition', iconName: 'Paintbrush', description: 'Pinceaux, rouleaux, enduits...' },
  { id: 'mesure', label: 'Mesure et Traçage', iconName: 'Ruler', description: 'Mètres, lasers, équerres...' },
  { id: 'jardin', label: 'Jardin et Extérieur', iconName: 'Leaf', description: 'Sécateurs, taille-haie, gants...' },
  { id: 'epi', label: 'Protection & EPI', iconName: 'Shield', description: 'Gants, lunettes, masques, casques...' },
];

export interface Location {
  id: string;
  label: string;
  iconName: string;
  description?: string;
};

export interface InventoryItem {
  [x: string]: any;
  brand: string;
  id: string;
  toolName: string;
  location: string;
  category: string;
  sku?: string;
  safetyStatus?: string;
  imageUrl?: string;
  date: string;
  confidence?: number; // <--- Ajout de la propriété manquante (optionnelle avec ?)
  price?: number;           // Valeur estimée de remplacement
  serialNumber?: string;    // Numéro de série (S/N)
  condition?: string;       // État : Neuf, Usagé, etc.
  isConsumable?: boolean;   // Détermine si l'objet est un consommable (vis, mastic...)
  consumableLevel?: number; // Jauge de remplissage stricte de 0 à 100 (Entier pur)
}

// Alias de compatibilité pour les anciens fichiers (à supprimer en V2.0)
export type ToolMemory = InventoryItem;

// --- EXTENSION LOCATE GARAGE (M5) ---

export type DiagnosticMode = 'maintenance' | 'mecanique';

export interface J1939DTC {
  spn: number; // Suspect Parameter Number
  fmi: number; // Failure Mode Identifier (3, 4, 5...)
  label: string;
}

export interface MetalThermalProfile {
  zone: 1 | 2 | 3 | 4 | 5;
  colorName: string;
  tempCelsius: number;
  isCritical: boolean;
  instruction: string;
}

export const METAL_ZONES: Record<number, MetalThermalProfile> = {
  1: { zone: 1, colorName: "Jaune Paille", tempCelsius: 220, isCritical: false, instruction: "Dureté max, attention au glaçage." },
  4: { zone: 4, colorName: "Bleu", tempCelsius: 295, isCritical: true, instruction: "DANGER : Acier détrempé. Remplacement obligatoire." },
  5: { zone: 5, colorName: "Gris", tempCelsius: 350, isCritical: true, instruction: "DESTRUCTION : Structure compromise." }
};