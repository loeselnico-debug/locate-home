import React from 'react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-[#121212] px-[5vw] pt-[2vh] pb-[calc(2vh+env(safe-area-inset-bottom))] overflow-y-auto relative z-[110]">
      
      {/* Bouton Retour */}
      <button 
        onClick={onBack}
        className="self-start text-[#FF6600] border border-[#FF6600] bg-[#1E1E1E] px-[4vw] py-[1vh] rounded-md font-black uppercase tracking-widest text-[clamp(0.7rem,3vw,1rem)] mb-[3vh] active:scale-95 transition-transform"
      >
        ← Retour
      </button>

      {/* Header */}
      <div className="mb-[4vh]">
        <h1 className="text-white font-black uppercase tracking-widest text-[clamp(1.5rem,6vw,2.5rem)] leading-none">
          POLITIQUE DE <br/><span className="text-[#FF6600]">CONFIDENTIALITÉ</span>
        </h1>
        <p className="text-white/60 text-[clamp(0.8rem,2.5vw,1rem)] italic mt-[1vh]">
          Dernière mise à jour : Février 2026. Philosophie "Privacy by Design".
        </p>
      </div>

      {/* Contenu */}
      <div className="space-y-[4vh] pb-[5vh]">
        
        <section>
          <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.3rem)] uppercase tracking-wide mb-[1vh]">
            1. Le Principe de Souveraineté Locale
          </h2>
          <p className="text-white/70 text-[clamp(0.85rem,3vw,1rem)] leading-relaxed text-justify">
            Contrairement aux services cloud classiques, <strong className="text-white">Locate Home ne télécharge pas votre inventaire sur nos serveurs.</strong> Vos photos, descriptions d'outils et localisations sont stockées exclusivement dans la mémoire de votre appareil (IndexedDB). Locate Systems est techniquement incapable de lire, vendre ou perdre vos données d'inventaire, car nous n'y avons jamais accès.
          </p>
        </section>

        <section>
          <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.3rem)] uppercase tracking-wide mb-[1vh]">
            2. Données Collectées & Intelligence Artificielle
          </h2>
          <ul className="text-white/70 text-[clamp(0.85rem,3vw,1rem)] leading-relaxed space-y-[1vh] list-disc pl-[5vw]">
            <li><strong className="text-white">Identité & Paiements :</strong> Email et informations de facturation gérés par notre prestataire sécurisé pour les abonnements Premium/Pro.</li>
            <li><strong className="text-white">Analyse IA (Gemini) :</strong> Lors de la reconnaissance visuelle, l'image est envoyée de manière éphémère à l'API de vision. Aucune image n'est conservée par Locate Systems après le traitement.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.3rem)] uppercase tracking-wide mb-[1vh]">
            3. Vos Droits & Sécurité
          </h2>
          <p className="text-white/70 text-[clamp(0.85rem,3vw,1rem)] leading-relaxed text-justify mb-[1vh]">
            Vous disposez du droit à l'effacement (en vidant le cache ou supprimant l'application) et à la portabilité (export de vos données selon votre niveau).
          </p>
          <div className="bg-[#1E1E1E] border border-[#FF6600]/30 p-[3vw] rounded-lg mt-[2vh]">
            <p className="text-white/80 text-[clamp(0.75rem,2.5vw,0.9rem)] italic">
              💡 La sécurité de votre inventaire repose sur la sécurité de votre appareil. Nous recommandons un verrouillage biométrique ou par code sur votre smartphone.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;