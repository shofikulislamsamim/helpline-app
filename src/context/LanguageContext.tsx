import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Language, TranslationSchema, translations } from '../lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationSchema;
  isBn: boolean;
  isEn: boolean;
  formatNumber: (n: number | string) => string;
  formatCurrency: (amount: number | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Default language is strictly Bengali ('bn') as per specification
    const saved = localStorage.getItem('helpline_language');
    if (saved === 'en' || saved === 'bn') {
      return saved;
    }
    return 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('helpline_language', lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.error('Failed to save language preference:', e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const currentTranslations = useMemo(() => {
    return translations[language] || translations.bn;
  }, [language]);

  const isBn = language === 'bn';
  const isEn = language === 'en';

  const formatNumber = (n: number | string): string => {
    if (n === null || n === undefined) return '';
    const str = String(n);
    if (!isBn) return str;
    return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)] || digit);
  };

  const formatCurrency = (amount: number | string): string => {
    return `৳${formatNumber(amount)}`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: currentTranslations,
        isBn,
        isEn,
        formatNumber,
        formatCurrency,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
