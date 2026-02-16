import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — LoversPick",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold">Terms of Service</h1>

      <div className="space-y-6 text-sm leading-relaxed text-text-muted">
        <p>
          <strong>Last updated:</strong> February 2026
        </p>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text">1. Service Description</h2>
          <p>
            LoversPick provides a real-time chat concierge service connecting travelers in Seoul
            with local guides via Telegram and WhatsApp. Our locals offer recommendations,
            price checks, translation help, and emergency assistance during your trip.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text">2. Passes & Payment</h2>
          <p>
            All passes are prepaid and grant unlimited messaging during the specified period.
            Prices are listed in USD and charged at the time of purchase. Pass duration begins
            when you send your first message to a local.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text">3. Refund Policy</h2>
          <p>
            Unused passes (no messages sent) may be refunded within 7 days of purchase.
            Once a chat session begins, a prorated refund for unused full days may be issued
            at our discretion. Contact hello@loverspick.com for refund requests.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text">4. Limitation of Liability</h2>
          <p>
            LoversPick provides information and recommendations in good faith. We are not liable
            for decisions you make based on our locals&apos; advice. We do not guarantee availability
            of partner benefits (upgrades, free items) as these depend on partner businesses.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text">5. Contact</h2>
          <p>
            For questions about these terms, email us at{" "}
            <a href="mailto:hello@loverspick.com" className="text-primary underline">
              hello@loverspick.com
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
