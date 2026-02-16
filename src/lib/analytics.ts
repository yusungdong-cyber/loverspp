// ============================================================
// Analytics — lightweight event helpers (placeholder for MVP)
// TODO: Replace with real analytics (GA4, Mixpanel, Amplitude)
// ============================================================

interface EventPayload {
  event: string;
  [key: string]: string | number | boolean;
}

/** Push event to dataLayer (GTM-compatible) and log to console in dev */
export function trackEvent(payload: EventPayload): void {
  // Google Tag Manager dataLayer
  if (typeof window !== "undefined") {
    const w = window as unknown as { dataLayer?: EventPayload[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(payload);
  }

  // Console logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", payload);
  }
}

/** Convenience: track CTA click */
export function trackCTA(ctaName: string, destination: string): void {
  trackEvent({
    event: "cta_click",
    cta_name: ctaName,
    destination,
  });
}

/** Convenience: track section view */
export function trackSectionView(sectionId: string): void {
  trackEvent({
    event: "section_view",
    section: sectionId,
  });
}

/** Convenience: track lead form submission */
export function trackLeadSubmit(platform: string): void {
  trackEvent({
    event: "lead_submit",
    platform,
  });
}
