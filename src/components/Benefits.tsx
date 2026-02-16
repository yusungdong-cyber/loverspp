"use client";

import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/i18n";
import { BENEFITS } from "@/lib/config";

export default function Benefits() {
  const { lang } = useLang();

  return (
    <section id="benefits" className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {t("benefits.title", lang)}
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-text-muted">
          {t("benefits.sub", lang)}
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border bg-gradient-to-br from-white to-surface-alt p-6 transition-shadow hover:shadow-md"
            >
              <span className="mb-3 block text-4xl" role="img" aria-label={b.title}>
                {b.icon}
              </span>
              <h3 className="mb-2 text-lg font-semibold">
                {lang === "en" ? b.title : b.titleJa}
              </h3>
              <p className="text-sm leading-relaxed text-text-muted">
                {lang === "en" ? b.description : b.descriptionJa}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
