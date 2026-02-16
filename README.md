# LoversPick — Seoul Travel Concierge

> **No tourist traps. No rip-offs. Just Seoul, done right.**

A production-ready MVP landing website for LoversPick, a real-time 1:1 chat concierge service (Telegram / WhatsApp) that connects Seoul travelers with real locals.

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript (strict mode) |
| Deployment | Vercel (zero-config) |

## Quick Start

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — SEO, OG, Twitter cards
│   ├── page.tsx            # Landing page (all sections)
│   ├── globals.css         # Tailwind v4 theme + custom utilities
│   ├── api/lead/route.ts   # Lead capture API (logs + local JSON)
│   ├── terms/page.tsx      # Terms of Service
│   └── privacy/page.tsx    # Privacy Policy
├── components/
│   ├── Header.tsx          # Sticky header + mobile menu + lang toggle
│   ├── Hero.tsx            # Hero with CTAs
│   ├── HowItWorks.tsx      # 3-step process
│   ├── WhatWeHelp.tsx      # Services grid
│   ├── WhyNotAI.tsx        # AI vs Local comparison table
│   ├── Pricing.tsx         # 3 plan cards + premium add-on
│   ├── Benefits.tsx        # Exclusive benefits (NOT discounts)
│   ├── Testimonials.tsx    # 6 testimonial cards + "As seen on"
│   ├── FAQ.tsx             # Accordion FAQ
│   ├── LeadCapture.tsx     # Email + chat handle form (GDPR consent)
│   └── Footer.tsx          # Footer with links
└── lib/
    ├── config.ts           # Single source of truth: pricing, benefits, FAQs, testimonials
    ├── i18n.ts             # EN/JA string map + t() helper
    ├── analytics.ts        # Event tracking placeholders (GTM-compatible)
    └── LangContext.tsx      # React context for language toggle
```

## Editing Content

All editable content lives in **one file**: `src/lib/config.ts`

| What to change | Where |
|----------------|-------|
| Pricing ($39 / $59 / $79) | `PLANS` array |
| Premium add-on ($29) | `PREMIUM_ADDON` |
| CTA links (Telegram, Buy) | `CTA` object |
| Benefits (free extras) | `BENEFITS` array |
| Testimonials | `TESTIMONIALS` array |
| FAQ answers | `FAQ_ITEMS` array |

For UI strings (headings, button text) in both languages: `src/lib/i18n.ts`

## Customization Checklist

Before going live, update these:

- [ ] **Telegram bot link** — `CTA.telegram` in `src/lib/config.ts`
- [ ] **Buy pass link** — `CTA.buyPass` in `src/lib/config.ts`
- [ ] **WhatsApp number** — `CTA.whatsapp` in `src/lib/config.ts`
- [ ] **Pricing** — `PLANS` and `PREMIUM_ADDON` in `src/lib/config.ts`
- [ ] **OG image** — Replace `/public/og-image.png` (1200x630)
- [ ] **Favicon** — Replace `/public/favicon.ico`
- [ ] **Domain** — Update `SITE.url` in `src/lib/config.ts`
- [ ] **Email addresses** — Search for `loverspick.com` and update
- [ ] **Analytics** — Add GTM container ID or replace `analytics.ts` with real SDK
- [ ] **Lead storage** — Replace local JSON with CRM (see TODO in `api/lead/route.ts`)
- [ ] **Legal pages** — Review and update `/terms` and `/privacy` with real legal copy
- [ ] **Japanese translations** — Complete all `Ja` strings in `config.ts` and `i18n.ts`
- [ ] **Testimonials** — Replace placeholder names with real reviews
- [ ] **"As seen on" logos** — Replace text placeholders with actual media logos

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

Or push to GitHub and connect the repo at [vercel.com/new](https://vercel.com/new).

## Key Design Decisions

- **No price-discount language** — Uses "Exclusive Benefits / Free Extras / Upgrades" per brand rules
- **Mobile-first** — All layouts designed for phone screens first
- **System font stack** — Zero external font requests for maximum speed
- **Minimal deps** — Only Next.js + React + Tailwind. No UI libraries.
- **EN/JA toggle** — Language context provider makes it easy to add more languages
- **UTM parameters** — All CTA links include UTM tags for attribution
- **GDPR-friendly** — Lead form includes explicit marketing opt-in checkbox
- **Accessible** — Semantic HTML, ARIA labels, sufficient color contrast
