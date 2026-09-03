import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../lib/defaultSettings';

interface AppSettingsContextType {
  settings: AppSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<boolean>;
  resetToDefaults: () => Promise<void>;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const cached = localStorage.getItem('helpline_app_settings');
    if (cached) {
      try {
        return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(cached) };
      } catch (e) {
        console.error('Failed to parse cached settings:', e);
      }
    }
    return DEFAULT_APP_SETTINGS;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadSettingsFromFirestore() {
      try {
        const docRef = doc(db, 'appSettings', 'global');
        const snap = await getDoc(docRef);
        if (snap.exists() && isMounted) {
          const remoteData = snap.data() as Partial<AppSettings>;
          const merged = { ...DEFAULT_APP_SETTINGS, ...remoteData };
          setSettings(merged);
          localStorage.setItem('helpline_app_settings', JSON.stringify(merged));
        } else if (!snap.exists()) {
          // Initialize default document in firestore
          try {
            await setDoc(docRef, DEFAULT_APP_SETTINGS);
          } catch {
            // Ignore if permissions not yet open
          }
        }
      } catch (err) {
        console.warn('Firestore settings read warning (using default settings):', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSettingsFromFirestore();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateSettings = async (newSettings: Partial<AppSettings>): Promise<boolean> => {
    try {
      const merged = { ...settings, ...newSettings };
      setSettings(merged);
      localStorage.setItem('helpline_app_settings', JSON.stringify(merged));
      const docRef = doc(db, 'appSettings', 'global');
      await setDoc(docRef, merged, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving app settings to Firestore:', error);
      return false;
    }
  };

  const resetToDefaults = async () => {
    await updateSettings(DEFAULT_APP_SETTINGS);
  };

  return (
    <AppSettingsContext.Provider value={{ settings, loading, updateSettings, resetToDefaults }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
