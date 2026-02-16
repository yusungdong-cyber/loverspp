"use client";

import { useState, type FormEvent } from "react";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/i18n";
import { trackLeadSubmit } from "@/lib/analytics";

export default function LeadCapture() {
  const { lang } = useLang();
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState<"telegram" | "whatsapp">("telegram");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!consent) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, handle, platform }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      trackLeadSubmit(platform);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section id="waitlist" className="section-padding bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="mb-4 text-5xl">&#x2705;</div>
          <h2 className="mb-2 text-2xl font-bold">{t("lead.success", lang)}</h2>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="section-padding bg-gradient-to-br from-rose-50 to-amber-50">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {t("lead.title", lang)}
        </h2>
        <p className="mb-8 text-center text-text-muted">
          {t("lead.sub", lang)}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          {/* Email */}
          <div>
            <label htmlFor="lead-email" className="mb-1 block text-sm font-medium">
              {t("lead.email", lang)} *
            </label>
            <input
              id="lead-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="you@example.com"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              {t("lead.platform.label", lang)}
            </label>
            <div className="flex gap-4">
              {(["telegram", "whatsapp"] as const).map((p) => (
                <label key={p} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="platform"
                    value={p}
                    checked={platform === p}
                    onChange={() => setPlatform(p)}
                    className="accent-primary"
                  />
                  {p === "telegram" ? "Telegram" : "WhatsApp"}
                </label>
              ))}
            </div>
          </div>

          {/* Handle */}
          <div>
            <label htmlFor="lead-handle" className="mb-1 block text-sm font-medium">
              {t("lead.handle", lang)}
            </label>
            <input
              id="lead-handle"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={platform === "telegram" ? "@username" : "+1 234 567 8901"}
            />
          </div>

          {/* Consent checkbox */}
          <label className="flex items-start gap-2 text-xs text-text-muted">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 accent-primary"
              required
            />
            <span>{t("lead.consent", lang)}</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading" || !consent}
            className="w-full rounded-full bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading"
              ? "..."
              : t("lead.submit", lang)}
          </button>

          {status === "error" && (
            <p className="text-center text-sm text-red-600">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
