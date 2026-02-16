"use client";

import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/i18n";
import { TESTIMONIALS } from "@/lib/config";

const MEDIA_PLACEHOLDERS = [
  "TravelWeekly",
  "NomadList",
  "TimeOut Seoul",
  "JapanTimes",
  "Lonely Planet",
];

export default function Testimonials() {
  const { lang } = useLang();

  return (
    <section id="reviews" className="section-padding bg-surface-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {t("testimonials.title", lang)}
        </h2>

        {/* Testimonial grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.name}
              className="flex flex-col rounded-2xl border border-border bg-white p-6"
            >
              {/* Stars */}
              <div className="mb-3 flex gap-0.5 text-accent" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="mb-4 flex-1 text-sm leading-relaxed text-text-muted">
                &ldquo;{item.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-text-muted">{item.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* As seen on */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-text-muted">
            {t("testimonials.badge", lang)}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {MEDIA_PLACEHOLDERS.map((name) => (
              <span
                key={name}
                className="text-lg font-bold text-text-muted/30"
                aria-label={`${name} logo placeholder`}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
