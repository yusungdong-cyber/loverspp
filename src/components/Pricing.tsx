"use client";

import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/i18n";
import { PLANS, PREMIUM_ADDON, CTA } from "@/lib/config";
import { trackCTA } from "@/lib/analytics";

export default function Pricing() {
  const { lang } = useLang();

  return (
    <section id="pricing" className="section-padding bg-surface-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {t("pricing.title", lang)}
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-text-muted">
          {t("pricing.sub", lang)}
        </p>

        {/* Plan cards */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 transition-shadow hover:shadow-lg ${
                plan.popular ? "border-primary shadow-md ring-2 ring-primary/20" : "border-border"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white">
                  {t("pricing.popular", lang)}
                </span>
              )}

              <h3 className="mb-1 text-xl font-bold">
                {lang === "en" ? plan.name : plan.nameJa}
              </h3>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-text">
                  {t("pricing.currency", lang)}{plan.price}
                </span>
                <span className="text-text-muted">/ {t("pricing.perPass", lang)}</span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {(lang === "en" ? plan.features : plan.featuresJa).map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`${CTA.buyPass}&plan=${plan.id}`}
                onClick={() => trackCTA(`pricing_${plan.id}`, CTA.buyPass)}
                className={`block rounded-full py-3 text-center font-semibold transition-colors ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "border-2 border-text bg-white text-text hover:bg-text hover:text-white"
                }`}
              >
                {t("pricing.cta", lang)}
              </a>
            </div>
          ))}
        </div>

        {/* Premium add-on */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-accent/30 bg-amber-50 p-8">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/20 text-2xl">
              &#9733;
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">
                {lang === "en" ? PREMIUM_ADDON.name : PREMIUM_ADDON.nameJa}{" "}
                <span className="text-accent">+${PREMIUM_ADDON.price}</span>
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-text-muted">
                {(lang === "en" ? PREMIUM_ADDON.features : PREMIUM_ADDON.featuresJa).map((f) => (
                  <li key={f}>&#x2022; {f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
