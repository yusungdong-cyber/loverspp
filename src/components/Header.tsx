"use client";

import { useState } from "react";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/i18n";
import { CTA } from "@/lib/config";
import { trackCTA } from "@/lib/analytics";

const NAV_ITEMS = [
  { key: "nav.how" as const, href: "#how" },
  { key: "nav.services" as const, href: "#services" },
  { key: "nav.pricing" as const, href: "#pricing" },
  { key: "nav.benefits" as const, href: "#benefits" },
  { key: "nav.reviews" as const, href: "#reviews" },
  { key: "nav.faq" as const, href: "#faq" },
] as const;

export default function Header() {
  const { lang, toggleLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="fixed top-0 z-50 w-full border-b border-border bg-white/90 backdrop-blur-md"
      role="banner"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="text-xl font-bold tracking-tight text-primary">
          LoversPick
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_ITEMS.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              className="text-sm font-medium text-text-muted transition-colors hover:text-text"
            >
              {t(key, lang)}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="rounded-full border border-border px-3 py-1 text-xs font-semibold transition-colors hover:bg-surface-alt"
            aria-label={`Switch to ${lang === "en" ? "Japanese" : "English"}`}
          >
            {lang === "en" ? "JP 🇯🇵" : "EN 🇺🇸"}
          </button>

          {/* CTA (desktop) */}
          <a
            href={CTA.telegram}
            onClick={() => trackCTA("header_telegram", CTA.telegram)}
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark md:inline-block"
          >
            {t("hero.cta.telegram", lang)}
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-border bg-white px-4 py-4 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-3">
            {NAV_ITEMS.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-text-muted transition-colors hover:text-text"
              >
                {t(key, lang)}
              </a>
            ))}
            <a
              href={CTA.telegram}
              onClick={() => { trackCTA("mobile_telegram", CTA.telegram); setMobileOpen(false); }}
              className="mt-2 rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white"
            >
              {t("hero.cta.telegram", lang)}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
