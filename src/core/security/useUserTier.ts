import { useState, useEffect } from 'react';
import { type UserTier, TIERS_CONFIG, type TierConfig } from './tiers';
import { supabase } from './supabaseClient'; // NOUVEAU : Connexion à la base

const TIER_STORAGE_KEY = 'locate_user_tier';

// NOUVEAU : On passe le défaut à FREE (logique pour vendre le Premium)
const DEFAULT_TIER: UserTier = 'FREE';

export const useUserTier = () => {
  const [currentTier, setCurrentTier] = useState<UserTier>(DEFAULT_TIER);
  const [tierConfig, setTierConfig] = useState<TierConfig>(TIERS_CONFIG[DEFAULT_TIER]);

  useEffect(() => {
    const fetchTierInfo = async () => {
      // 1. Lecture ultra-rapide du stockage local
      const savedTier = localStorage.getItem(TIER_STORAGE_KEY) as UserTier;
      if (savedTier && ['FREE', 'PREMIUM', 'PRO'].includes(savedTier)) {
        setCurrentTier(savedTier);
        setTierConfig(TIERS_CONFIG[savedTier]);
      }

      // 2. Vérification silencieuse et sécurisée auprès de Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.tier) {
        const realTier = session.user.user_metadata.tier as UserTier;
        
        // Si Supabase dit autre chose que le local, on écrase le local (La BDD a toujours raison)
        if (['FREE', 'PREMIUM', 'PRO'].includes(realTier) && realTier !== savedTier) {
          setCurrentTier(realTier);
          setTierConfig(TIERS_CONFIG[realTier]);
          localStorage.setItem(TIER_STORAGE_KEY, realTier);
        }
      }
    };

    fetchTierInfo();
  }, []);

  const setTier = async (tier: UserTier) => {
    // 1. Mise à jour visuelle immédiate
    localStorage.setItem(TIER_STORAGE_KEY, tier);
    setCurrentTier(tier);
    setTierConfig(TIERS_CONFIG[tier]);
    
    // 2. Synchronisation sécurisée dans Supabase (métadonnées)
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.auth.updateUser({
        data: { tier: tier }
      });
    }
    
    // 3. Rechargement pour appliquer les droits partout
    window.location.reload();
  };

  return { 
    currentTier, 
    tierConfig, 
    setTier 
  };
};