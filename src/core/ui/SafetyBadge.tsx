
import { AlertTriangle, ShieldCheck, Lock } from 'lucide-react'; // Icônes temporaires Lucide
import type { UserTier } from '../security/tiers';
interface SafetyBadgeProps {
  hasDanger: boolean;
  details: string;
  level?: 'LOW' | 'MEDIUM' | 'HIGH';
  userTier: UserTier;
}

export const SafetyBadge: React.FC<SafetyBadgeProps> = ({ hasDanger, details, level, userTier }) => {
  
  if (!hasDanger) {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-800 rounded-lg text-green-500">
        <ShieldCheck size={20} />
        <span className="text-sm font-medium">Sécurité : Conforme (Visuel)</span>
      </div>
    );
  }

  // Logique d'affichage selon le Tier
  const isFree = userTier === 'FREE';
  const isPremium = userTier === 'PREMIUM';
  const isPro = userTier === 'PRO';

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-lg border ${
      isFree ? 'bg-yellow-900/20 border-yellow-800' : 'bg-red-900/20 border-red-800'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className={isFree ? "text-yellow-500" : "text-red-500"} />
          <span className={`font-bold ${isFree ? "text-yellow-500" : "text-red-500"}`}>
            {isFree ? "Vigilance Requise" : "DANGER DÉTECTÉ"}
          </span>
        </div>
        {isFree && <Lock size={16} className="text-gray-500" />}
      </div>

      {/* Contenu filtré */}
      <div className="text-sm text-gray-300">
        {isFree && (
          <p className="italic opacity-60">
            Une anomalie potentielle a été détectée sur cet outil. 
            <br/><span className="text-orange-500 font-bold">Disponible en version PREMIUM.</span>
          </p>
        )}

        {isPremium && (
          <div>
            <p className="font-semibold text-red-400">Anomalie critique identifiée.</p>
            <p className="blur-[3px] select-none mt-1 opacity-50">
              Câble d'alimentation sectionné au niveau de la gaine principale. Risque d'électrisation.
            </p>
            <span className="text-xs text-orange-500 mt-2 block">Détail complet en version PRO</span>
          </div>
        )}

        {isPro && (
          <div className="animate-pulse-slow">
            <p className="font-mono text-red-300">
              <span className="font-black text-red-500">[{level || 'SCAN'}]</span> {">"} {details}
            </p>
            <div className="mt-2 pt-2 border-t border-red-900/50 text-xs text-red-400">
              ACTION : Mise en quarantaine recommandée immédiate.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};