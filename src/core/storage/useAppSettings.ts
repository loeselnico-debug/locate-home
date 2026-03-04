import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'FR' | 'UK';
export type UnitSystem = 'METRIC' | 'IMPERIAL';

const SETTINGS_KEY = 'locate_app_settings';

// NOUVEAU : On définit la structure de l'identité pour le PDF
export interface UserProfile {
  fullName: string;
  company: string;
  address: string;
}

export interface AppSettings {
  language: Language;
  unitSystem: UnitSystem;
  acceptedTerms?: boolean;
  userProfile?: UserProfile; // NOUVEAU : Intégration au cerveau
}

const defaultSettings: AppSettings = {
  language: 'FR',
  unitSystem: 'METRIC',
  acceptedTerms: false,
  userProfile: { fullName: '', company: '', address: '' }
};

interface AppSettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

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

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings doit être utilisé à l\'intérieur de AppSettingsProvider');
  }
  return context;
};