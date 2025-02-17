'use client'

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { LanguageMode, localizationService } from "@/application/services/locale/LocaleService";
import { LocalizationKeys } from "@/application/services/locale/LocalizationKeys";
import { Logcat } from "@/shared/LogCat";

interface LocaleContextProps {
  languageMode: LanguageMode;
  toggleLanguageAsync: () => Promise<void>;
  setLanguageAsync: (languageMode: LanguageMode) => Promise<void>;
  translate: (key: LocalizationKeys) => string;
}

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const [languageMode, setLanguageMode] = useState(localizationService.languageMode);

  const listener = (newLanguageMode: LanguageMode) => {
    Logcat.Debug(`LanguageMode changed to: ${newLanguageMode}`);
    setLanguageMode(newLanguageMode);
  };

  useEffect(() => {
    setMounted(true); // Client mount olduktan sonra mounted true olacak.
    localizationService.addOnChangeListener(listener);
    return () => { };
  }, []);


  const setLanguageAsync = async (languageMode: LanguageMode) => { await localizationService.setLanguageAsync(languageMode); };
  const toggleLanguageAsync = async () => { await localizationService.toggleLanguageAsync(); };
  const translate = (key: LocalizationKeys): string => localizationService.translate(key);


  return (
    <LocaleContext.Provider value={{ languageMode, toggleLanguageAsync, setLanguageAsync, translate }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useMyLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useMyLocale must be used within LocaleProvider");
  return context;
};
