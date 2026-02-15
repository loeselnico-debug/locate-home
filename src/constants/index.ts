// Définition de la structure
export interface Category {
  id: string;
  label: string;
  iconName: string;
  description: string;
}

// Ta liste officielle PHOENIX-EYE
export const CATEGORIES: Category[] = [
  { id: 'electro', label: 'Outillage Électroportatif', iconName: 'Zap', description: 'Perceuse, visseuse, meuleuse...' },
  { id: 'main', label: 'Outillage à main', iconName: 'Hammer', description: 'Marteaux, scies, niveaux...' },
  { id: 'serrage', label: 'Serrage et Clés', iconName: 'Wrench', description: 'Clés, pinces, serre-joints...' },
  { id: 'quinc', label: 'Quincaillerie', iconName: 'Nut', description: 'Vis, clous, boulons...' },
  { id: 'elec', label: 'Électricité', iconName: 'Lightbulb', description: 'Multimètres, câbles, ampoules...' },
  { id: 'peinture', label: 'Peinture et Finition', iconName: 'Paintbrush', description: 'Pinceaux, rouleaux, enduits...' },
  { id: 'mesure', label: 'Mesure et Traçage', iconName: 'Ruler', description: 'Mètres, lasers, équerres...' },
  { id: 'jardin', label: 'Jardin et Extérieur', iconName: 'Leaf', description: 'Sécateurs, taille-haie, gants...' },
];