"use client";

import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/i18n";
import { CTA } from "@/lib/config";

export default function Footer() {
  const { lang } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <span className="text-xl font-bold text-primary">LoversPick</span>
            <p className="mt-2 text-sm text-text-muted">
              {t("footer.tagline", lang)}
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
              {t("footer.company", lang)}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-text-muted hover:text-text">{t("footer.about", lang)}</a></li>
              <li><a href="#" className="text-text-muted hover:text-text">{t("footer.careers", lang)}</a></li>
              <li><a href="mailto:hello@loverspick.com" className="text-text-muted hover:text-text">{t("footer.contact", lang)}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
              {t("footer.legal", lang)}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/terms" className="text-text-muted hover:text-text">{t("footer.terms", lang)}</a></li>
              <li><a href="/privacy" className="text-text-muted hover:text-text">{t("footer.privacy", lang)}</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
              {t("footer.connect", lang)}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={CTA.telegram} className="text-text-muted hover:text-text">
                  Telegram
                </a>
              </li>
              <li>
                <a href={CTA.whatsapp} className="text-text-muted hover:text-text">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="https://instagram.com/loverspick" className="text-text-muted hover:text-text">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-text-muted">
          &copy; {year} LoversPick. {t("footer.rights", lang)}
        </div>
      </div>
    </footer>
  );
}
