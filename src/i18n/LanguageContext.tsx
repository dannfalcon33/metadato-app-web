import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AppLanguage = 'es' | 'en' | 'pt';

interface LanguageContextValue {
  lang: AppLanguage;
  setLang: (newLang: AppLanguage) => void;
  tr: <T = string>(es: T, en: T, pt: T) => T;
}

const STORAGE_KEY = 'metapulse_lang';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'es' || saved === 'en' || saved === 'pt') {
        return saved;
      }
    } catch {
      // Ignore storage access errors
    }
    return 'es';
  });

  const setLang = useCallback((newLang: AppLanguage) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const tr = useCallback(
    <T = string,>(es: T, en: T, pt: T): T => {
      if (lang === 'en') return en;
      if (lang === 'pt') return pt;
      return es;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
