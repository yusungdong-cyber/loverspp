import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — LoversPick",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>

      <div className="space-y-6 text-sm leading-relaxed text-text-muted">
        <p>
          <strong>Last updated:</strong> February 2026
        </p>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text">1. Data We Collect</h2>
          <p>
            We collect only the minimum data needed to provide our service: your email address,
            chat platform handle (Telegram or WhatsApp), and the messages exchanged during
            your concierge session.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text">2. How We Use Your Data</h2>
          <p>
            Your data is used exclusively to deliver the LoversPick concierge service,
            communicate service updates, and improve our offerings. We never sell your
            personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text">3. Data Retention</h2>
          <p>
            Chat logs are automatically deleted 30 days after your pass expires.
            Account information (email, chat handle) is retained until you request deletion.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text">4. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data
            at any time by emailing{" "}
            <a href="mailto:privacy@loverspick.com" className="text-primary underline">
              privacy@loverspick.com
            </a>.
            We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text">5. Cookies & Analytics</h2>
          <p>
            We use minimal analytics to understand site usage. No third-party tracking cookies
            are set without your explicit consent.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text">6. Contact</h2>
          <p>
            For privacy inquiries, email{" "}
            <a href="mailto:privacy@loverspick.com" className="text-primary underline">
              privacy@loverspick.com
            </a>.
          </p>
        </section>
      </div>

      <div className="mt-12">
        <a href="/" className="text-sm text-primary hover:underline">&larr; Back to home</a>
      </div>
    </main>
  );
}
