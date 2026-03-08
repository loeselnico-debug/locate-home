// ==========================================
// 📂 FICHIER : \src\core\storage\memoryService.ts
// ==========================================
import type { InventoryItem, Location } from '../../types';

const STORAGE_KEY = 'locatehome_inventory';

/**
 * Récupère la liste complète des outils de l'inventaire
 */
export const getInventory = (): InventoryItem[] => {
  if (typeof window === 'undefined') return []; // Sécurité pour le rendu côté serveur (SSR)
  
  const saved = localStorage.getItem(STORAGE_KEY);
  try {
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Erreur de lecture du stockage :", error);
    return [];
  }
};

/**
 * Ajoute un nouvel outil en haut de la liste
 */
export const addTool = (tool: InventoryItem) => {
  const tools = getInventory();
  const updated = [tool, ...tools];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export type ToolMemory = InventoryItem;

// ==========================================
// 🏗️ NOUVEAU : LES 4 PILIERS MÉTIERS (STATIQUES)
// ==========================================
export const DEFAULT_LOCATIONS: Location[] = [
  { id: 'atelier', label: 'Atelier', iconName: 'Wrench', description: 'Zone principale' },
  { id: 'fourgon', label: 'Fourgon', iconName: 'Truck', description: 'Véhicule d\'intervention' },
  { id: 'chantier', label: 'Chantier', iconName: 'HardHat', description: 'Chez le client' },
  { id: 'pret', label: 'En Prêt', iconName: 'Users', description: 'Matériel prêté' }
];

export const getCustomLocations = (): Location[] => {
  // Pour la V1, on by-pass le localStorage et on force ces 4 zones universelles
  return DEFAULT_LOCATIONS;
};