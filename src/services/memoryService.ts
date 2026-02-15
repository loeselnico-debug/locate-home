import type { InventoryItem } from '../types';

// 1. On exporte le type pour que les autres fichiers puissent l'utiliser
export type ToolMemory = InventoryItem;

const STORAGE_KEY = 'phoenix_inventory_v1';

// 2. On définit et on exporte les fonctions individuellement
export const getTools = (): ToolMemory[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTool = (tool: ToolMemory) => {
  const inventory = getTools();
  inventory.push(tool);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
};

// 3. On exporte aussi l'objet global pour la compatibilité avec Library.tsx
export const memoryService = {
  getTools,
  saveTool
};