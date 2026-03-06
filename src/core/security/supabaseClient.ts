// ==========================================
// 📂 FICHIER : \src\core\security\supabaseClient.ts
// ==========================================
import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement depuis le .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Garde-fou : Avertissement si les clés sont introuvables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🔴 ERREUR CRITIQUE : Variables d'environnement Supabase introuvables. Vérifiez le fichier .env.local");
}

// Création et exportation de l'instance unique du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);