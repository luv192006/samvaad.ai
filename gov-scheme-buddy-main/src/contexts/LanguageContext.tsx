import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { getTranslation, UITranslations, SupportedLanguage } from "@/lib/localization";

interface UserFilters {
  ageGroup: string | null;
  schemeCategory: string | null;
  employmentStatus: string | null;
}

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: UITranslations;
  isLanguageLocked: boolean;
  lockLanguage: () => void;
  unlockLanguage: () => void;
  filters: UserFilters;
  setFilter: (key: keyof UserFilters, value: string | null) => void;
  resetFilters: () => void;
  resetAll: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const INITIAL_FILTERS: UserFilters = {
  ageGroup: null,
  schemeCategory: null,
  employmentStatus: null,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem("samvaad-language");
    return (saved as SupportedLanguage) || "en";
  });
  const [isLanguageLocked, setIsLanguageLocked] = useState(() => {
    return localStorage.getItem("samvaad-language-locked") === "true";
  });
  const [filters, setFilters] = useState<UserFilters>(() => {
    const saved = localStorage.getItem("samvaad-filters");
    return saved ? JSON.parse(saved) : INITIAL_FILTERS;
  });

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("samvaad-language", lang);
  }, []);

  const lockLanguage = useCallback(() => {
    setIsLanguageLocked(true);
    localStorage.setItem("samvaad-language-locked", "true");
  }, []);

  const unlockLanguage = useCallback(() => {
    setIsLanguageLocked(false);
    localStorage.setItem("samvaad-language-locked", "false");
  }, []);

  const setFilter = useCallback((key: keyof UserFilters, value: string | null) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem("samvaad-filters", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    localStorage.removeItem("samvaad-filters");
  }, []);

  const resetAll = useCallback(() => {
    setLanguageState("en");
    setIsLanguageLocked(false);
    setFilters(INITIAL_FILTERS);
    localStorage.removeItem("samvaad-language");
    localStorage.removeItem("samvaad-language-locked");
    localStorage.removeItem("samvaad-filters");
  }, []);

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isLanguageLocked,
        lockLanguage,
        unlockLanguage,
        filters,
        setFilter,
        resetFilters,
        resetAll,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
