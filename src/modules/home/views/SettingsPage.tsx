import React, { useState, useEffect } from 'react';
import { useAppSettings } from '../../../core/storage/useAppSettings';

interface SettingsPageProps {
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  // Récupération globale via la structure exacte de ton store
  const { settings, updateSettings } = useAppSettings();
  const [storageUsed, setStorageUsed] = useState<string>("0.00");

  // Calcul du stockage local Zéro-Serveur
  useEffect(() => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(({ usage }) => {
        if (usage) {
          setStorageUsed((usage / (1024 * 1024)).toFixed(2));
        }
      });
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-[#121212] text-white p-[3vh_5vw] overflow-y-auto">
      
      {/* EN-TÊTE AVEC BOUTON RETOUR */}
      <div className="flex items-center justify-between mb-[4vh]">
        <div>
          <h1 className="text-[clamp(1.5rem,6vw,2.5rem)] font-black text-[#FF6600] uppercase tracking-wide font-['Rebel']">
            Paramètres
          </h1>
          <p className="text-[clamp(0.8rem,3vw,1rem)] text-gray-400">
            Configuration du système Locate Home
          </p>
        </div>
        
        {/* BOUTON RETOUR 3D (Thumb Zone) */}
        <button 
          onClick={onBack}
          className="w-[clamp(40px,10vw,60px)] h-[clamp(40px,10vw,60px)] bg-[#1A1A1A] rounded-xl flex items-center justify-center border border-[#333] shadow-[0_4px_0_#000] active:shadow-[0_0px_0_#000] active:translate-y-[4px] transition-all"
        >
          <img src="/icons/icon-return.png" alt="Retour" className="w-1/2 h-1/2 object-contain" />
        </button>
      </div>

      <div className="w-full h-[1px] bg-[#333] mb-[4vh]"></div>

      {/* SECTION : INTERNATIONALISATION */}
      <div className="mb-[5vh]">
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          INTERNATIONALISATION
        </h2>

        <div className="bg-[#1A1A1A] rounded-2xl p-[2vh_4vw] border border-[#222]">
          
          {/* Ligne : Langue */}
          <div className="flex justify-between items-center mb-[2vh] pb-[2vh] border-b border-[#333]">
            <div>
              <div className="font-bold text-[clamp(0.9rem,3.5vw,1.1rem)]">LANGUE INTERFACE</div>
              <div className="text-[clamp(0.7rem,2.5vw,0.8rem)] text-gray-500 uppercase">Français ou Anglais</div>
            </div>
            <div className="flex bg-[#0A0A0A] rounded-lg p-[4px]">
              <button 
                onClick={() => updateSettings({ language: 'FR' })}
                className={`px-[3vw] py-[1vh] rounded-md font-black text-[clamp(0.8rem,3vw,1rem)] transition-all ${settings.language === 'FR' ? 'bg-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'text-gray-500'}`}
              >
                FR
              </button>
              <button 
                onClick={() => updateSettings({ language: 'UK' })}
                className={`px-[3vw] py-[1vh] rounded-md font-black text-[clamp(0.8rem,3vw,1rem)] transition-all ${settings.language === 'UK' ? 'bg-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'text-gray-500'}`}
              >
                UK
              </button>
            </div>
          </div>

          {/* Ligne : Système de mesure */}
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold text-[clamp(0.9rem,3.5vw,1.1rem)]">SYSTÈME DE MESURE</div>
              <div className="text-[clamp(0.7rem,2.5vw,0.8rem)] text-gray-500 uppercase">Métrique (cm) / Impérial (inch)</div>
            </div>
            <div className="flex bg-[#0A0A0A] rounded-lg p-[4px]">
              <button 
                onClick={() => updateSettings({ unitSystem: 'METRIC' })}
                className={`px-[3vw] py-[1vh] rounded-md font-black text-[clamp(0.8rem,3vw,1rem)] transition-all ${settings.unitSystem === 'METRIC' ? 'bg-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'text-gray-500'}`}
              >
                MM
              </button>
              <button 
                onClick={() => updateSettings({ unitSystem: 'IMPERIAL' })}
                className={`px-[3vw] py-[1vh] rounded-md font-black text-[clamp(0.8rem,3vw,1rem)] transition-all ${settings.unitSystem === 'IMPERIAL' ? 'bg-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'text-gray-500'}`}
              >
                INCH
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION : SÉCURITÉ & DONNÉES */}
      <div>
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          SÉCURITÉ & DONNÉES
        </h2>

        <div className="bg-[#121812] rounded-2xl p-[3vh_4vw] border border-[#2EA043]">
          <div className="flex items-center text-[#2EA043] font-black tracking-wide text-[clamp(0.8rem,3vw,1rem)] mb-[1.5vh]">
            <span className="w-[8px] h-[8px] rounded-full bg-[#2EA043] mr-[2vw] animate-pulse"></span>
            ARCHITECTURE ZÉRO-SERVEUR
          </div>
          <p className="text-gray-300 text-[clamp(0.8rem,3.5vw,1rem)] mb-[3vh] leading-relaxed">
            Vos données sont stockées <strong className="text-white">exclusivement et localement</strong> sur cet appareil.
          </p>
          
          <div className="bg-[#0A0A0A] inline-block px-[4vw] py-[1.5vh] rounded-lg border border-[#222]">
            <span className="text-gray-400 text-[clamp(0.7rem,3vw,0.9rem)] tracking-wider">VOLUME OCCUPÉ : </span>
            <span className="text-[#2EA043] font-bold text-[clamp(0.8rem,3vw,1rem)]">{storageUsed} Mo</span>
          </div>
        </div>
      </div>

    </div>
  );
};