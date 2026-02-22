
import { useUserTier } from '../../../core/security/useUserTier';
import { TIERS_CONFIG, type UserTier } from '../../../core/security/tiers'; // <--- Import unifié ici

export default function SettingsPage() {
  const { currentTier, setTier } = useUserTier();

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 pb-24">
      {/* Header Interne */}
      <div className="mb-8 border-b border-gray-800 pb-4">
        <h2 className="text-2xl font-black text-orange-500 uppercase tracking-tighter">Paramètres</h2>
        <p className="text-xs text-gray-500">Configuration du système Locate Home</p>
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
                  ? 'bg-orange-600 border-orange-500 text-white shadow-[0_0_10px_rgba(255,102,0,0.5)]' 
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