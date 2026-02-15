import type { InventoryItem } from '../types';

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

/**
 * Optionnel : Alias pour ToolMemory si nécessaire dans ton projet
 */
export type ToolMemory = InventoryItem;