"use client";

import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/i18n";
import { CTA } from "@/lib/config";
import { trackCTA } from "@/lib/analytics";

export default function Hero() {
  const { lang } = useLang();

  return (
    <section
      id="hero"
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50 pt-16"
    >
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <span className="mb-6 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            {t("hero.badge", lang)}
          </span>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl">
            {t("hero.headline", lang).split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-muted sm:text-xl">
            {t("hero.sub", lang)}
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={CTA.telegram}
              onClick={() => trackCTA("hero_telegram", CTA.telegram)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              {t("hero.cta.telegram", lang)}
            </a>
            <a
              href={CTA.buyPass}
              onClick={() => trackCTA("hero_buy_pass", CTA.buyPass)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-text bg-white px-8 py-4 text-lg font-semibold text-text transition-all hover:bg-text hover:text-white"
            >
              {t("hero.cta.buy", lang)}
            </a>
          </div>

          {/* Trust line */}
          <p className="mt-8 text-sm text-text-muted">
            {lang === "en"
              ? "Trusted by 2,000+ travelers from 40+ countries"
              : "40カ国以上、2,000人以上の旅行者が利用"}
          </p>
        </div>
      </div>
    </section>
  );
}
