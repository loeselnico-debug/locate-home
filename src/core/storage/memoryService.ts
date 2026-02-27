import type { InventoryItem } from '../../types';

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

// --- AJOUTER À LA FIN DU FICHIER ---
import type { Location } from '../../types'; // Assurez-vous que l'import est présent en haut du fichier

const LOCATIONS_KEY = 'locatehome_custom_locations';

// Zones par défaut au premier lancement de l'application
const DEFAULT_LOCATIONS: Location[] = [
  { id: 'fourgon', label: 'Fourgon', iconName: 'Truck', description: 'Véhicule d\'intervention' },
  { id: 'atelier', label: 'Atelier', iconName: 'Wrench', description: 'Zone principale' }
];

export const getCustomLocations = (): Location[] => {
  if (typeof window === 'undefined') return DEFAULT_LOCATIONS;
  const saved = localStorage.getItem(LOCATIONS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Erreur de lecture des lieux personnalisés :", error);
    }
  }
  // Initialisation si la mémoire est vierge
  localStorage.setItem(LOCATIONS_KEY, JSON.stringify(DEFAULT_LOCATIONS));
  return DEFAULT_LOCATIONS;
};

export const addCustomLocation = (label: string): boolean => {
  const current = getCustomLocations();
  if (current.length >= 4) return false; // Bloque strictement à 4 zones

  const newLocation: Location = {
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label: label.trim(),
    iconName: 'MapPin' // Icône générique pour les zones créées
  };

  const updated = [...current, newLocation];
  localStorage.setItem(LOCATIONS_KEY, JSON.stringify(updated));
  return true;
};

// Fonction utilitaire pour une future vue "Paramètres des zones"
export const deleteCustomLocation = (id: string): void => {
  const current = getCustomLocations();
  if (current.length <= 1) return; // Sécurité : impossible de supprimer la toute dernière zone
  const updated = current.filter(loc => loc.id !== id);
  localStorage.setItem(LOCATIONS_KEY, JSON.stringify(updated));
};