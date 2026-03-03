import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; // CORRECTION TS STRICTE : Import de type isolé

export type Language = 'FR' | 'UK';
export type UnitSystem = 'METRIC' | 'IMPERIAL';

const SETTINGS_KEY = 'locate_app_settings';

export interface AppSettings {
  language: Language;
  unitSystem: UnitSystem;
  acceptedTerms?: boolean;
}

const defaultSettings: AppSettings = {
  language: 'FR',
  unitSystem: 'METRIC',
  acceptedTerms: false,
};

interface AppSettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

// 1. Création du Cerveau (Context)
const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

// 2. Le Composant qui va envelopper l'application (C'est bien lui le Provider !)
export const AppSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur de lecture des paramètres locaux", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  };

  if (!isLoaded) return null; 

  return React.createElement(
    AppSettingsContext.Provider,
    { value: { settings, updateSettings } },
    children
  );
};

// 3. Le Hook pour que les pages puissent lire le cerveau
export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings doit être utilisé à l\'intérieur de AppSettingsProvider');
  }
  return context;
};