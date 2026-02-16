"use client";

import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/i18n";

const ROWS = [
  { aiKey: "why.row1.ai" as const, localKey: "why.row1.local" as const },
  { aiKey: "why.row2.ai" as const, localKey: "why.row2.local" as const },
  { aiKey: "why.row3.ai" as const, localKey: "why.row3.local" as const },
];

export default function WhyNotAI() {
  const { lang } = useLang();

  return (
    <section id="why" className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {t("why.title", lang)}
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-text-muted">
          {t("why.sub", lang)}
        </p>

        {/* Comparison table */}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border">
          {/* Header row */}
          <div className="grid grid-cols-2 bg-surface-alt">
            <div className="border-r border-border px-6 py-4 text-center font-semibold text-text-muted">
              {t("why.ai.title", lang)}
            </div>
            <div className="px-6 py-4 text-center font-semibold text-primary">
              {t("why.local.title", lang)}
            </div>
          </div>

          {/* Data rows */}
          {ROWS.map(({ aiKey, localKey }, i) => (
            <div
              key={aiKey}
              className={`grid grid-cols-2 ${i < ROWS.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="border-r border-border px-6 py-5 text-sm text-text-muted">
                <span className="mr-2 inline-block text-text-muted/40">&#x2717;</span>
                {t(aiKey, lang)}
              </div>
              <div className="px-6 py-5 text-sm font-medium text-text">
                <span className="mr-2 inline-block text-green-600">&#x2713;</span>
                {t(localKey, lang)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
