"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getMarketingMessages,
  type MarketingCopy,
  type MarketingLocale,
} from "@/lib/marketing-copy";

const STORAGE_KEY = "climatifai-marketing-locale";

type Ctx = {
  locale: MarketingLocale;
  setLocale: (l: MarketingLocale) => void;
  m: MarketingCopy;
};

const MarketingLocaleContext = createContext<Ctx | null>(null);

function readStoredLocale(): MarketingLocale {
  if (typeof window === "undefined") return "es";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}

export function MarketingLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<MarketingLocale>("es");

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const next = readStoredLocale();
      setLocaleState(next);
      document.documentElement.lang = next === "en" ? "en" : "es-419";
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const setLocale = useCallback((l: MarketingLocale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {}
    document.documentElement.lang = l === "en" ? "en" : "es-419";
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      locale,
      setLocale,
      m: getMarketingMessages(locale),
    }),
    [locale, setLocale],
  );

  return (
    <MarketingLocaleContext.Provider value={value}>
      {children}
    </MarketingLocaleContext.Provider>
  );
}

export function useMarketingCopy() {
  const ctx = useContext(MarketingLocaleContext);
  if (!ctx) {
    throw new Error("useMarketingCopy requires MarketingLocaleProvider");
  }
  return ctx;
}
