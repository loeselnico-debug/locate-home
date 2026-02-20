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
  description: string;
}

export const LOCATIONS: Location[] = [
  { id: 'fourgon', label: 'Fourgon', iconName: 'Truck', description: 'Véhicule d\'intervention et transport' },
  { id: 'atelier', label: 'Atelier', iconName: 'Wrench', description: 'Zone de maintenance principale' },
  { id: 'etabli', label: 'Établi', iconName: 'Hammer', description: 'Plan de travail direct' },
  { id: 'garage', label: 'Garage', iconName: 'Car', description: 'Stockage des grands volumes' },
  { id: 'cabanon', label: 'Cabanon', iconName: 'Home', description: 'Stockage extérieur et matériel divers' }
];

export interface InventoryItem {
  id: string;
  toolName: string;      // Nom de l'outil identifié par l'IA
  location: string;      // Une des 6 zones de vérité
  category: string;      // Type d'outil
  sku?: string;          // Code article (6 chiffres)
  safetyStatus?: string; // État de sécurité
  imageUrl?: string;     // Lien vers la photo capturée
  date: string;          // Date d'ajout
}

// Alias de compatibilité pour les anciens fichiers (à supprimer en V2.0)
export type ToolMemory = InventoryItem;