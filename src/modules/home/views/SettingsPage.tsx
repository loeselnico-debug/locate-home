// ==========================================
// 📂 FICHIER : \src\modules\home\views\SettingsPage.tsx
// ==========================================
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

  if (showPrivacy) {
    return <PrivacyPolicy onBack={() => setShowPrivacy(false)} />;
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#121212] text-white p-[3vh_5vw] overflow-y-auto pb-[15vh] font-sans">
      
      {/* EN-TÊTE AVEC BOUTON RETOUR 3D (Marges réduites de -30%) */}
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
          <button 
            onClick={onBack}
            className="w-[clamp(40px,10vw,60px)] h-[clamp(40px,10vw,60px)] bg-[#1A1A1A] rounded-xl flex items-center justify-center border border-[#333] shadow-[0_4px_0_#000] active:shadow-[0_0px_0_#000] active:translate-y-[4px] transition-all shrink-0"
          >
            <img src="/icon-return.png" alt="Retour" className="w-[50%] h-[50%] object-contain" />
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
                onClick={() => updateSettings({ language: 'UK', unitSystem: 'IMPERIAL' })}
                className={`px-[3vw] py-[1vh] rounded-md font-black text-[clamp(0.8rem,3vw,1rem)] transition-all ${lang === 'UK' ? 'bg-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                UK (IN)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 : ACCÈS TOTAL & ABONNEMENTS (Design Badge Néon) */}
      <div className="mb-[5vh]">
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          {t('tier_title')}
        </h2>
        <div className="bg-[#1A1A1A] rounded-2xl p-[2vh_4vw] border border-[#222]">
          <div className="flex items-center justify-between mb-[3vh]">
            <p className="text-[clamp(0.75rem,2.8vw,0.9rem)] text-gray-400">
              {t('tier_desc')}
            </p>
            <span className="text-[clamp(0.6rem,2vw,0.8rem)] bg-[#333] text-white px-[2vw] py-[0.5vh] rounded-full uppercase tracking-wider">
              Admin Mode
            </span>
          </div>
          
          <div className="flex gap-[2vw] justify-between">
            {(Object.keys(TIERS_CONFIG) as UserTier[]).map((tier) => (
              <button
                key={tier}
                onClick={() => setTier(tier)}
                className={`flex-1 py-[1.5vh] rounded-2xl font-black text-[clamp(0.7rem,2.5vw,0.9rem)] uppercase tracking-widest transition-all border ${
                  currentTier === tier 
                    ? 'bg-[#121212] text-white border-[#FF6600]/80 shadow-[0_0_15px_rgba(255,102,0,0.3),inset_0_0_10px_rgba(255,102,0,0.1)]' 
                    : 'bg-[#0A0A0A] text-gray-600 border-white/5 hover:text-gray-400'
                }`}
              >
                {tier}
              </button>
            ))}
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

      {/* SECTION 4 : SUPPORT & ASSISTANCE (NOUVEAU) */}
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
        <div className="flex items-start gap-[3vw] bg-[#1A1A1A] p-[2vh_4vw] rounded-xl border border-[#333]">
          <input
            type="checkbox"
            checked={settings.acceptedTerms || false}
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