import { useState, useEffect } from 'react';
import { type UserTier, TIERS_CONFIG, type TierConfig } from './tiers';
import { supabase } from './supabaseClient';

const TIER_STORAGE_KEY = 'locate_user_tier';
const DEFAULT_TIER: UserTier = 'FREE';

export const useUserTier = () => {
  const [currentTier, setCurrentTier] = useState<UserTier>(DEFAULT_TIER);
  const [tierConfig, setTierConfig] = useState<TierConfig>(TIERS_CONFIG[DEFAULT_TIER]);

  useEffect(() => {
    const fetchTierInfo = async () => {
      // 1. Lecture ultra-rapide du stockage local (pour l'affichage immédiat)
      const savedTier = localStorage.getItem(TIER_STORAGE_KEY) as UserTier;
      if (savedTier && ['FREE', 'PREMIUM', 'PRO'].includes(savedTier)) {
        setCurrentTier(savedTier);
        setTierConfig(TIERS_CONFIG[savedTier]);
      }

      // 2. Vérification sécurisée auprès de Supabase (La BDD a toujours raison)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // NOUVEAU : On interroge directement ta nouvelle table 'profiles'
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_plan')
          .eq('id', session.user.id)
          .single();

        if (error) console.warn("Information Supabase :", error.message);

        if (data && data.subscription_plan) {
          // On passe le 'free' de Supabase en 'FREE' pour React
          const realTier = data.subscription_plan.toUpperCase() as UserTier;
          
          if (['FREE', 'PREMIUM', 'PRO'].includes(realTier) && realTier !== savedTier) {
            setCurrentTier(realTier);
            setTierConfig(TIERS_CONFIG[realTier]);
            localStorage.setItem(TIER_STORAGE_KEY, realTier);
          }
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
    
    // 2. Synchronisation sécurisée dans Supabase (Backdoor Admin)
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase
        .from('profiles')
        .update({ subscription_plan: tier.toLowerCase() }) // On renvoie en minuscules
        .eq('id', session.user.id);
    }
    
    window.location.reload();
  };

  return { currentTier, tierConfig, setTier };
};