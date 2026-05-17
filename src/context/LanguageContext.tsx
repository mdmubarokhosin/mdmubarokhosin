"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import translations from "@/data/translations.json";

type Lang = "en" | "bn";

interface LanguageContextType {
  lang: Lang;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isBn: boolean;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start with "en" to match server render, then switch after mount
  const [lang, setLang] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  // After hydration, read from localStorage and update
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-lang") as Lang | null;
    if (saved && (saved === "en" || saved === "bn")) {
      setLang(saved);
      // Apply DOM changes for the saved language
      document.documentElement.lang = saved;
      if (saved === "bn") {
        document.documentElement.classList.add("lang-bn");
      } else {
        document.documentElement.classList.remove("lang-bn");
      }
    }
    setMounted(true);
  }, []);

  // Sync DOM whenever lang changes after mount
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("portfolio-lang", lang);
    document.documentElement.lang = lang;
    if (lang === "bn") {
      document.documentElement.classList.add("lang-bn");
    } else {
      document.documentElement.classList.remove("lang-bn");
    }
  }, [lang, mounted]);

  const toggleLanguage = useCallback(() => {
    setLang((prev) => {
      const newLang = prev === "en" ? "bn" : "en";
      return newLang;
    });
  }, []);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".");
      let result: unknown = translations[lang];
      for (const k of keys) {
        if (result && typeof result === "object" && k in (result as Record<string, unknown>)) {
          result = (result as Record<string, unknown>)[k];
        } else {
          // Fallback to English
          let fallback: unknown = translations.en;
          for (const fk of keys) {
            if (fallback && typeof fallback === "object" && fk in (fallback as Record<string, unknown>)) {
              fallback = (fallback as Record<string, unknown>)[fk];
            } else {
              return key;
            }
          }
          return typeof fallback === "string" ? fallback : key;
        }
      }
      return typeof result === "string" ? result : key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, isBn: lang === "bn", mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
