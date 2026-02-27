/**
 * LOCATEHOME - CATALOGUE PRODUITS (V1.0)
 * Référentiel Zéro-Serveur pour le dropshipping (Marque Blanche)
 * Les dimensions sont utilisées par l'IA pour le calcul absolu des volumes.
 */

export interface ProductDimensions {
  length: number; // en mm
  width: number;  // en mm
  height: number; // en mm
  volumeCapacity?: number; // en Litres
}

export interface CatalogItem {
  id: string;
  name: string;
  price: number; // Prix en Euros (€) pour Revolut
  description: string;
  imageUrl: string;
  isContainer: boolean;
  dimensions?: ProductDimensions;
}

export const LOCATE_CATALOG: CatalogItem[] = [
  {
    id: 'loc-qr-pack',
    name: 'Pack Découverte QR Codes',
    price: 14.90,
    description: 'Lot de 50 étiquettes industrielles ultra-résistantes (hydrocarbures, UV). Parfait pour identifier vos outils existants.',
    imageUrl: '/catalog/qr-pack.png',
    isContainer: false,
  },
  {
    id: 'loc-bac-5l',
    name: 'Bac LOCATE Hype 5L',
    price: 12.50,
    description: "Bac de rangement normé. L'IA reconnaît ce format instantanément pour calculer vos consommables au gramme près.",
    imageUrl: '/catalog/bac-5l.png',
    isContainer: true,
    dimensions: {
      length: 300,
      width: 200,
      height: 114,
      volumeCapacity: 5
    }
  },
  {
    id: 'loc-bac-10l',
    name: 'Bac LOCATE Industriel 10L',
    price: 18.90,
    description: 'Conçu pour les chantiers et la maintenance. Ultra-robuste, empilable et pré-calibré pour la vision artificielle LOCATE.',
    imageUrl: '/catalog/bac-10l.png',
    isContainer: true,
    dimensions: {
      length: 400,
      width: 300,
      height: 114,
      volumeCapacity: 10
    }
  }
];

// Fonction utilitaire pour récupérer un produit au moment du paiement
export const getProductById = (id: string): CatalogItem | undefined => {
  return LOCATE_CATALOG.find(product => product.id === id);
};