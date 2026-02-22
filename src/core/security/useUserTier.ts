import { useState, useEffect } from 'react';
import type { UserTier } from './tiers';

const TIER_STORAGE_KEY = 'locate_user_tier';

// Par défaut, on démarre en PRO pour honorer la promesse Beta
const DEFAULT_TIER: UserTier = 'PRO';

export const useUserTier = () => {
  const [currentTier, setCurrentTier] = useState<UserTier>(DEFAULT_TIER);

  useEffect(() => {
    // Chargement initial
    const savedTier = localStorage.getItem(TIER_STORAGE_KEY) as UserTier;
    if (savedTier && ['FREE', 'PREMIUM', 'PRO'].includes(savedTier)) {
      setCurrentTier(savedTier);
    }
  }, []);

  const setTier = (tier: UserTier) => {
    localStorage.setItem(TIER_STORAGE_KEY, tier);
    setCurrentTier(tier);
    // Force un reload pour que toute l'app prenne en compte le changement (utile pour le dev)
    window.location.reload();
  };

  return { currentTier, setTier };
};