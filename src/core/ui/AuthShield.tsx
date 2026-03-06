// ==========================================
// 📂 FICHIER : \src\core\ui\AuthShield.tsx
// ==========================================
import React, { useState } from 'react';
import { supabase } from '../security/supabaseClient';

interface AuthShieldProps {
  onSuccess: () => void;
}

export default function AuthShield({ onSuccess }: AuthShieldProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Logique d'inscription
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Compte créé ! Vérifiez vos emails pour valider l'inscription.");
      } else {
        // Logique de connexion
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Déverrouillage de l'application
        onSuccess(); 
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'authentification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center p-[5vw] font-sans">
      
      {/* Grille matricielle de fond */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

      {/* Conteneur Glassmorphism */}
      <div className="relative w-full max-w-sm bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(255,102,0,0.15)] z-10 flex flex-col">
        
        {/* En-tête / Logo */}
        <div className="text-center mb-8">
          <h1 className="text-white font-black text-3xl tracking-widest uppercase mb-1 drop-shadow-lg">
            LOCATE <span className="text-[#FF6600]">SYSTEMS</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">
            Portail Sécurisé
          </p>
        </div>

        {/* Formulaire interactif */}
        <form onSubmit={handleAuth} className="flex flex-col gap-5">
          
          {/* Bloc d'erreur dynamique */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg text-center font-bold tracking-wide">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
              Identifiant (Email)
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF6600] outline-none transition-colors shadow-inner"
              placeholder="technicien@locate.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
              Clé d'accès (Mot de passe)
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF6600] outline-none transition-colors shadow-inner"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Bouton de soumission primaire */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#FF6600] text-white font-black uppercase tracking-widest py-4 rounded-lg mt-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,102,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e65c00]"
          >
            {loading ? 'Connexion au serveur...' : (isSignUp ? 'Créer un compte' : 'Accéder au terminal')}
          </button>
        </form>

        {/* Switch Inscription / Connexion */}
        <button 
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null); // Réinitialise les erreurs au changement de mode
          }}
          className="mt-6 text-gray-500 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
        >
          {isSignUp ? 'Déjà accrédité ? Se connecter' : 'Nouvel opérateur ? Créer un profil'}
        </button>
      </div>
    </div>
  );
}