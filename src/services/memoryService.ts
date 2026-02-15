import type { InventoryItem } from '../types';

const STORAGE_KEY = 'locatehome_inventory';

export const memoryService = {
  getTools: (): InventoryItem[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  addTool: (tool: InventoryItem) => {
    const tools = memoryService.getTools();
    const updated = [tool, ...tools];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};