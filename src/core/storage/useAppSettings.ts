import { useState, useEffect } from 'react';

export type Language = 'FR' | 'UK';
export type UnitSystem = 'METRIC' | 'IMPERIAL';

const SETTINGS_KEY = 'locate_app_settings';

export interface AppSettings {
  language: Language;
  unitSystem: UnitSystem;
}

const defaultSettings: AppSettings = {
  language: 'FR',
  unitSystem: 'METRIC',
};

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    // Chargement initial depuis la mémoire locale
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur de lecture des paramètres locaux", e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  };

  return { settings, updateSettings };
};