"use client";

import { useState } from "react";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/i18n";
import { FAQ_ITEMS } from "@/lib/config";

export default function FAQ() {
  const { lang } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {t("faq.title", lang)}
        </h2>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            const question = lang === "en" ? item.question : item.questionJa;
            const answer = lang === "en" ? item.answer : item.answerJa;

            return (
              <div key={i} className="rounded-xl border border-border bg-surface">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 font-semibold">{question}</span>
                  <svg
                    className={`h-5 w-5 shrink-0 text-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="border-t border-border px-6 py-4">
                    <p className="text-sm leading-relaxed text-text-muted">{answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
