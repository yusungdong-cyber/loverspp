"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Lang } from "./i18n";

interface LangCtx {
  lang: Lang;
  toggleLang: () => void;
}

const LangContext = createContext<LangCtx>({ lang: "en", toggleLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ja" : "en"));
  }, []);
  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangCtx {
  return useContext(LangContext);
}
