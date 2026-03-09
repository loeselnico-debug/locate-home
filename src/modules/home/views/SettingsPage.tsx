import React, { useState, useEffect } from 'react';
import { useAppSettings } from '../../../core/storage/useAppSettings';
import { useUserTier } from '../../../core/security/useUserTier';
import { TIERS_CONFIG, type UserTier } from '../../../core/security/tiers';
import { useTranslation } from '../../../core/i18n/useTranslation';
import PrivacyPolicy from './PrivacyPolicy';

interface SettingsPageProps {
  onBack?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const { settings, updateSettings } = useAppSettings();
  const { currentTier, setTier } = useUserTier();
  const { t, lang } = useTranslation();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [storageUsed, setStorageUsed] = useState<string>("0.00");

  useEffect(() => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(({ usage }) => {
        if (usage) {
          setStorageUsed((usage / (1024 * 1024)).toFixed(2));
        }
      });
    }
  }, []);

  const hasAcceptedTerms = settings.acceptedTerms === true;

  // ==========================================
  // NOUVEAU : GESTIONNAIRE D'ABONNEMENT STRIPE
  // ==========================================
  const handleTierSelection = (tier: UserTier) => {
    if (!hasAcceptedTerms) return;

    if (tier === 'FREE') {
      setTier('FREE');
    } else if (tier === 'PRO') {
      alert("L'offre PRO est destinée aux entreprises avec facturation centralisée. Veuillez nous contacter pour un devis.");
    } else if (tier === 'PREMIUM') {
      // Choix de la formule
      const isAnnual = window.confirm(
        "LOCATE PREMIUM - Choix de la formule\n\n" +
        "▶ Cliquez sur [OK] pour l'abonnement ANNUEL (30,00 € TTC)\n" +
        "▶ Cliquez sur [Annuler] pour l'abonnement MENSUEL (2,99 € TTC)"
      );

      // Tes liens de paiement officiels
      const stripeMensuelUrl = "https://buy.stripe.com/7sY6oG9eEa4X8sF2gU77O00";
      const stripeAnnuelUrl = "https://buy.stripe.com/dRm14m4Yob91eR34p277O01";
      
      // On cible le bon lien selon le choix
      const targetUrl = isAnnual ? stripeAnnuelUrl : stripeMensuelUrl;

      // Ouverture de Stripe dans un nouvel onglet
      window.open(targetUrl, '_blank');
      
      // Déblocage local immédiat pour te permettre de tester le mode Premium
      setTier('PREMIUM');
    }
  };

  if (showPrivacy) {
    return <PrivacyPolicy onBack={() => setShowPrivacy(false)} />;
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#121212] text-white p-[3vh_5vw] overflow-y-auto pb-[15vh] font-sans">
      
      {/* EN-TÊTE AVEC BOUTON RETOUR STANDARD */}
      <div className="flex items-center justify-between mb-[2vh] mt-[2vh]">
        <div>
          <h1 className="text-[clamp(1.5rem,6vw,2.5rem)] font-black text-[#FF6600] uppercase tracking-wide font-['Rebel']">
            {t('settings_title')}
          </h1>
          <p className="text-[clamp(0.8rem,3vw,1rem)] text-gray-400">
            {t('settings_subtitle')}
          </p>
        </div>
        
        {onBack && (
          <button onClick={onBack} className="w-14 h-14 active:scale-90 transition-transform shrink-0 flex items-center justify-center">
            <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain drop-shadow-lg" />
          </button>
        )}
      </div>

      <div className="w-full h-[1px] bg-[#333] mb-[4vh]"></div>

      {/* SECTION 1 : INTERNATIONALISATION */}
      <div className="mb-[5vh]">
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          {t('intl_title')}
        </h2>

        <div className="bg-[#1A1A1A] rounded-2xl p-[2vh_4vw] border border-[#222]">
          <div className="flex justify-between items-center">
            <div className="flex-1 pr-[2vw]">
              <div className="font-bold text-[clamp(0.9rem,3.5vw,1.1rem)]">{t('intl_lang')}</div>
              <div className="text-[clamp(0.7rem,2.5vw,0.8rem)] text-gray-500 uppercase">{t('intl_lang_desc')}</div>
            </div>
            <div className="flex bg-[#0A0A0A] rounded-lg p-[4px] gap-[1vw] shrink-0">
              <button 
                onClick={() => updateSettings({ language: 'FR', unitSystem: 'METRIC' })}
                className={`px-[3vw] py-[1vh] rounded-md font-black text-[clamp(0.8rem,3vw,1rem)] transition-all ${lang === 'FR' ? 'bg-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                FR (CM)
              </button>
              <button 
                onClick={() => updateSettings({ language: 'EN', unitSystem: 'IMPERIAL' })}
                className={`px-[3vw] py-[1vh] rounded-md font-black text-[clamp(0.8rem,3vw,1rem)] transition-all ${lang === 'EN' ? 'bg-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                EN (IN)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 : ACCÈS TOTAL & ABONNEMENTS */}
      <div className="mb-[5vh]">
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          {t('tier_title')}
        </h2>
        
        {!hasAcceptedTerms && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-2 animate-pulse flex items-center gap-2">
            <span className="text-sm">⚠️</span> Veuillez accepter les CGU/CGV ci-dessous pour débloquer les accès.
          </p>
        )}

        <div className={`bg-[#1A1A1A] rounded-2xl p-[2vh_4vw] border transition-all duration-300 ${!hasAcceptedTerms ? 'border-red-500/30' : 'border-[#222]'}`}>
          <div className="flex items-center justify-between mb-[3vh]">
            <p className="text-[clamp(0.75rem,2.8vw,0.9rem)] text-gray-400">
              {t('tier_desc')}
            </p>
            <span className="text-[clamp(0.6rem,2vw,0.8rem)] bg-[#333] text-white px-[2vw] py-[0.5vh] rounded-full uppercase tracking-wider">
              Admin Mode
            </span>
          </div>
          
          <div className="flex gap-[2vw] justify-between">
            {(Object.keys(TIERS_CONFIG) as UserTier[]).map((tier) => {
              const displayLabel = tier === 'PRO' ? 'PRO (Devis)' : tier;
              
              return (
                <button
                  key={tier}
                  onClick={() => handleTierSelection(tier)}
                  disabled={!hasAcceptedTerms}
                  className={`flex-1 py-[1.5vh] rounded-2xl font-black text-[clamp(0.7rem,2vw,0.9rem)] uppercase tracking-widest transition-all border ${
                    !hasAcceptedTerms 
                      ? 'bg-[#121212] text-gray-700 border-white/5 cursor-not-allowed opacity-50'
                      : currentTier === tier 
                        ? 'bg-[#121212] text-white border-[#FF6600]/80 shadow-[0_0_15px_rgba(255,102,0,0.3),inset_0_0_10px_rgba(255,102,0,0.1)]' 
                        : 'bg-[#0A0A0A] text-gray-600 border-white/5 hover:text-gray-400'
                  }`}
                >
                  {!hasAcceptedTerms ? (
                    <span className="flex justify-center items-center gap-2">🔒 {displayLabel}</span>
                  ) : (
                    displayLabel
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

{/* SECTION 2.5 : PROFIL ASSURANCE & RAPPORTS */}
      <div className="mb-[5vh]">
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          {t('profile_title')}
        </h2>

        <div className="bg-[#1A1A1A] rounded-2xl p-[3vh_4vw] border border-[#222] flex flex-col gap-[2.5vh]">
          {/* Champ Nom */}
          <div>
            <label className="block text-gray-400 text-[clamp(0.7rem,2.5vw,0.8rem)] uppercase tracking-wider mb-[1vh]">{t('profile_fullname')}</label>
            <input 
              type="text" 
              value={settings.userProfile?.fullName || ''} 
              onChange={(e) => updateSettings({ userProfile: { ...(settings.userProfile || { fullName: '', company: '', address: '' }), fullName: e.target.value } })}
              placeholder="Ex: Jean Dupont"
              className="w-full bg-[#0A0A0A] border border-[#333] text-white rounded-lg p-[1.5vh_3vw] focus:border-[#FF6600] outline-none transition-colors text-[clamp(0.8rem,3vw,1rem)]"
            />
          </div>

          {/* Champ Entreprise */}
          <div>
            <label className="block text-gray-400 text-[clamp(0.7rem,2.5vw,0.8rem)] uppercase tracking-wider mb-[1vh]">{t('profile_company')}</label>
            <input 
              type="text" 
              value={settings.userProfile?.company || ''} 
              onChange={(e) => updateSettings({ userProfile: { ...(settings.userProfile || { fullName: '', company: '', address: '' }), company: e.target.value } })}
              placeholder="Ex: Locate Services"
              className="w-full bg-[#0A0A0A] border border-[#333] text-white rounded-lg p-[1.5vh_3vw] focus:border-[#FF6600] outline-none transition-colors text-[clamp(0.8rem,3vw,1rem)]"
            />
          </div>

          {/* Champ Adresse */}
          <div>
            <label className="block text-gray-400 text-[clamp(0.7rem,2.5vw,0.8rem)] uppercase tracking-wider mb-[1vh]">{t('profile_address')}</label>
            <input 
              type="text" 
              value={settings.userProfile?.address || ''} 
              onChange={(e) => updateSettings({ userProfile: { ...(settings.userProfile || { fullName: '', company: '', address: '' }), address: e.target.value } })}
              placeholder="Ex: 123 avenue de l'Industrie, 75000 Paris"
              className="w-full bg-[#0A0A0A] border border-[#333] text-white rounded-lg p-[1.5vh_3vw] focus:border-[#FF6600] outline-none transition-colors text-[clamp(0.8rem,3vw,1rem)]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3 : SÉCURITÉ & DONNÉES */}
      <div className="mb-[5vh]">
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          {t('sec_title')}
        </h2>

        <div className="bg-[#121812] rounded-2xl p-[3vh_4vw] border border-[#2EA043]">
          <div className="flex items-center text-[#2EA043] font-black tracking-wide text-[clamp(0.8rem,3vw,1rem)] mb-[1.5vh]">
            <span className="w-[8px] h-[8px] rounded-full bg-[#2EA043] mr-[2vw] animate-pulse"></span>
            {t('sec_zero')}
          </div>
          <p className="text-gray-300 text-[clamp(0.8rem,3.5vw,1rem)] mb-[3vh] leading-relaxed">
            {t('sec_desc_1')} <strong className="text-white">{t('sec_desc_2')}</strong> {t('sec_desc_3')}
          </p>
          
          <div className="bg-[#0A0A0A] inline-block px-[4vw] py-[1.5vh] rounded-lg border border-[#222]">
            <span className="text-gray-400 text-[clamp(0.7rem,3vw,0.9rem)] tracking-wider">{t('sec_vol')}</span>
            <span className="text-[#2EA043] font-bold text-[clamp(0.8rem,3vw,1rem)]">{storageUsed} Mo</span>
          </div>
        </div>
      </div>

      {/* SECTION 4 : SUPPORT & ASSISTANCE */}
      <div className="mb-[5vh]">
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          SUPPORT & ASSISTANCE
        </h2>
        <div className="bg-[#1A1A1A] rounded-2xl p-[3vh_4vw] border border-[#222] flex flex-col items-center text-center">
          <p className="text-gray-400 text-[clamp(0.8rem,3vw,0.95rem)] mb-[2.5vh] leading-relaxed">
            Une question, un bug ou une suggestion ? Notre équipe est à votre écoute pour améliorer l'expérience Locate.
          </p>
          <a 
            href="mailto:contact@locate-systems.com"
            className="w-full bg-[#121212] text-white border border-white/10 py-[1.8vh] rounded-xl font-black uppercase tracking-widest text-[clamp(0.8rem,3vw,1rem)] shadow-inner hover:border-[#FF6600]/50 hover:text-[#FF6600] transition-colors flex justify-center items-center gap-3 active:scale-95"
          >
            <span className="text-xl">✉️</span> Contacter le support
          </a>
        </div>
      </div>

      {/* SECTION 5 : LÉGAL (CGU / CGV / Confidentialité) */}
      <div className="mt-auto">
        <div className={`flex items-start gap-[3vw] bg-[#1A1A1A] p-[2vh_4vw] rounded-xl border transition-colors ${hasAcceptedTerms ? 'border-[#333]' : 'border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]'}`}>
          <input
            type="checkbox"
            checked={hasAcceptedTerms}
            onChange={(e) => updateSettings({ acceptedTerms: e.target.checked })}
            className="mt-[0.5vh] shrink-0 w-[clamp(20px,5vw,24px)] h-[clamp(20px,5vw,24px)] accent-[#FF6600] cursor-pointer"
          />
          <div className="text-[clamp(0.8rem,3vw,1rem)] text-gray-400 leading-snug">
            {t('legal_agree')} <button onClick={() => setShowPrivacy(true)} className="text-[#FF6600] underline decoration-[#FF6600] underline-offset-2 hover:text-white transition-colors text-left">{t('legal_link')}</button>.
          </div>
        </div>
      </div>

    </div>
  );
};

export default SettingsPage;