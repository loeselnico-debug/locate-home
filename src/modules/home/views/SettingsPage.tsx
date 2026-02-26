import { useState, useEffect } from 'react';
import { useUserTier } from '../../../core/security/useUserTier';
import { TIERS_CONFIG, type UserTier } from '../../../core/security/tiers';
import PrivacyPolicy from './PrivacyPolicy';

export default function SettingsPage() {
  const { currentTier, setTier } = useUserTier();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [storageSize, setStorageSize] = useState<string>('< 0.1 Mo');

  // Calcul en temps réel du poids de la base de données locale
  useEffect(() => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(({ usage }) => {
        if (usage) {
          const mb = (usage / (1024 * 1024)).toFixed(2);
          setStorageSize(`${mb} Mo`);
        }
      });
    }
  }, []);

  // Si on clique sur la politique, on affiche le composant
  if (showPrivacy) {
    return <PrivacyPolicy onBack={() => setShowPrivacy(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 pb-24 overflow-y-auto">
      {/* Header Interne */}
      <div className="mb-8 border-b border-gray-800 pb-4 mt-12">
        <h2 className="text-2xl font-black text-[#FF6600] uppercase tracking-tighter">Paramètres</h2>
        <p className="text-xs text-gray-500">Configuration du système Locate Home</p>
      </div>

      {/* --- ZONE PRIVACY BY DESIGN --- */}
      <div className="mb-8 space-y-4">
        <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest border-l-2 border-[#FF6600] pl-2">
          Sécurité & Données
        </h3>

        {/* Badge Zéro Serveur */}
        <div className="bg-[#1A2E1A] border border-[#2EA043] rounded-lg p-4 flex flex-col gap-2 shadow-[0_0_15px_rgba(46,160,67,0.1)]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2EA043] animate-pulse"></div>
            <span className="text-[#2EA043] font-black uppercase tracking-widest text-xs">Architecture Zéro-Serveur</span>
          </div>
          <p className="text-white/80 text-sm leading-snug">
            Vos données sont stockées <strong className="text-white">exclusivement et localement</strong> sur cet appareil.
          </p>
          <div className="mt-2 bg-[#121212] rounded p-2 border border-[#2EA043]/30 inline-block self-start">
            <span className="text-xs text-white/60 uppercase tracking-widest">Volume occupé : </span>
            <span className="text-xs font-bold text-[#2EA043]">{storageSize}</span>
          </div>
        </div>

        {/* Bouton CGU / Privacy */}
        <button 
          onClick={() => setShowPrivacy(true)}
          className="w-full bg-[#1E1E1E] border border-white/10 hover:border-[#FF6600]/50 p-4 rounded-lg flex justify-between items-center transition-colors active:scale-95"
        >
          <div className="flex flex-col text-left">
            <span className="font-bold text-white text-sm uppercase tracking-wide">Politique de Confidentialité</span>
            <span className="text-xs text-white/50 mt-1">CGU, CGV & Gestion des données</span>
          </div>
          <span className="text-[#FF6600] font-bold">→</span>
        </button>
      </div>

      {/* --- DEV DEBUG ZONE --- */}
      <div className="mt-12 p-4 border border-dashed border-gray-700 rounded-xl bg-gray-900/50">
        <h3 className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest">
          Dev Debug Zone (Simulation Tiers)
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(TIERS_CONFIG) as UserTier[]).map((tier) => (
            <button
              key={tier}
              onClick={() => setTier(tier)}
              className={`
                px-3 py-2 text-xs font-bold rounded border transition-colors
                ${currentTier === tier 
                  ? 'bg-[#FF6600] border-[#FF6600] text-white shadow-[0_0_10px_rgba(255,102,0,0.5)]' 
                  : 'bg-transparent border-gray-700 text-gray-500 hover:border-gray-500'}
              `}
            >
              {tier}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-gray-600 mt-2 text-center italic">
          Cette zone simule votre abonnement pour tester l'interface.
        </p>
      </div>
    </div>
  );
}