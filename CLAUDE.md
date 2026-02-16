# CLAUDE.md

Guide for AI assistants working on the **WP AutoProfit AI** repository.

---

## Project Overview

**WP AutoProfit AI** is a SaaS platform that helps users automatically monetize WordPress blogs by:
1. Detecting trending topics (mock Google Trends)
2. Generating SEO-optimized articles via OpenAI
3. Automatically handling image prompts and ALT text
4. Publishing to WordPress via REST API
5. Scoring content for Google SEO best practices

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js (App Router) | 14.2.18 |
| UI | React + Tailwind CSS v3 + shadcn/ui | ^18.3.1 |
| Language | TypeScript (strict mode) | ^5 |
| Database | PostgreSQL via Prisma ORM | ^5.22.0 |
| Auth | JWT (jose) + bcryptjs | — |
| AI | OpenAI API (gpt-4o) | ^4.73.0 |
| Charts | Recharts | ^2.13.3 |
| Linter | ESLint v8 (next/core-web-vitals) | ^8 |
| Deploy | Vercel (frontend) + Railway (PostgreSQL) | — |

---

## Project Structure

```
prisma/
├── schema.prisma          # Database schema (User, WpSite, TrendSession, TrendTopic, Article)
└── seed.ts                # Demo user + sample trend data

src/
├── app/
│   ├── page.tsx           # Landing page (hero + features + CTA)
│   ├── layout.tsx         # Root layout (dark mode, Inter font)
│   ├── globals.css        # Tailwind + CSS variables (light/dark)
│   ├── login/page.tsx     # Login form
│   ├── register/page.tsx  # Registration form
│   ├── dashboard/
│   │   ├── layout.tsx     # Dashboard shell (nav + container)
│   │   ├── page.tsx       # Overview: stats cards, quick actions, recent articles
│   │   ├── trends/page.tsx      # Trend discovery: category filter, chart, generate article
│   │   ├── articles/page.tsx    # Article list: filter by status, SEO badges
│   │   ├── articles/[id]/page.tsx  # Article detail: content, SEO scores, publish actions
│   │   └── sites/page.tsx       # WordPress site management: add/verify/delete
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts  # POST: create user + set JWT cookie
│       │   ├── login/route.ts     # POST: verify password + set JWT cookie
│       │   ├── logout/route.ts    # POST: clear cookie
│       │   └── me/route.ts        # GET: current user
│       ├── trends/
│       │   ├── route.ts           # GET: latest trends | POST: generate new
│       │   └── history/route.ts   # GET: trend session history
│       ├── articles/
│       │   ├── route.ts           # GET: list | POST: generate from topic
│       │   └── [id]/
│       │       ├── route.ts       # GET: detail | DELETE: remove
│       │       └── publish/route.ts  # POST: publish to WordPress
│       ├── sites/
│       │   ├── route.ts           # GET: list | POST: add + validate
│       │   └── [id]/route.ts      # DELETE: remove site
│       └── dashboard/route.ts     # GET: stats overview
├── components/
│   ├── ui/                # shadcn/ui: Button, Card, Input, Label, Badge, Progress,
│   │                      #   Separator, Tabs, Select, Dialog
│   ├── layout/
│   │   └── dashboard-nav.tsx  # Responsive nav with mobile menu
│   └── shared/
│       ├── seo-score-badge.tsx   # Color-coded score circle
│       ├── article-preview.tsx   # Dialog with full article + SEO scores
│       └── trend-chart.tsx       # Recharts bar chart for trend scores
├── lib/
│   ├── db.ts              # Prisma client singleton
│   ├── auth.ts            # JWT sign/verify, cookie management, requireAuth()
│   ├── crypto.ts          # AES-256-GCM encrypt/decrypt for WP credentials
│   ├── rate-limit.ts      # In-memory rate limiter
│   ├── utils.ts           # cn(), formatDate(), formatNumber(), slugify(), getScoreColor()
│   ├── constants.ts       # APP_NAME, categories, statuses, SEO thresholds, nav items
│   └── services/
│       ├── trends.ts      # Mock trend generation, scoring algorithm, DB persistence
│       ├── openai.ts      # Article generation via GPT-4o, image prompt generation
│       ├── seo-scorer.ts  # Keyword density, readability, heading structure, overall score
│       ├── wordpress.ts   # WP REST API: validate, publish, media upload, categories/tags
│       └── articles.ts    # Article CRUD, generate-from-topic, publish orchestration
└── middleware.ts          # Auth redirect for /dashboard/*, API protection
```

---

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Dev server (http://localhost:3000)
npm run build            # Production build (includes prisma generate)
npm start                # Start production server
npm run lint             # ESLint
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration
npm run db:seed          # Seed demo data
npm run db:studio        # Open Prisma Studio
```

---

## Architecture Patterns

### Database
- **Prisma ORM** with PostgreSQL
- 5 models: `User`, `WpSite`, `TrendSession`, `TrendTopic`, `Article`
- `ArticleStatus` enum: DRAFT → GENERATING → READY → PUBLISHING → PUBLISHED | FAILED
- Cascading deletes from User to owned records
- Composite unique constraint on `WpSite(userId, siteUrl)`

### Authentication
- JWT-based via `jose` library (HS256, 7-day expiry)
- HttpOnly cookie (`wp-autoprofit-token`)
- Middleware-level protection for `/dashboard/*` routes
- `requireAuth()` helper for API routes
- Rate limiting on auth endpoints

### Credential Security
- WordPress Application Passwords encrypted with **AES-256-GCM**
- Key derived via `scrypt` from `ENCRYPTION_KEY` env var
- IV + AuthTag stored alongside ciphertext

### SEO Scoring
Calculated via `src/lib/services/seo-scorer.ts`:
- Keyword density (target 1.0-1.5%)
- Readability (sentence length analysis)
- Heading structure (H1/H2/H3 count)
- Meta description quality
- Content length (target 1200-1800 words)
- Weighted overall score (0-100)

### Trend Scoring
Composite score formula:
```
score = searchVolume_normalized * 0.35 + competition_inverse * 0.25 + monetization * 0.40
```

### API Rate Limiting
- In-memory token bucket per key
- Configurable via `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_MS`

### Path Aliases
- `@/*` → `./src/*` (tsconfig.json)

---

## Environment Variables

See `.env.example` for all required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Minimum 32-char secret for JWT signing
- `OPENAI_API_KEY` — OpenAI API key for article generation
- `ENCRYPTION_KEY` — Secret for AES-256-GCM credential encryption
- `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS` — API rate limit config

---

## Deployment

### Vercel (Frontend)
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Build command: `npx prisma generate && next build`
4. Framework preset: Next.js

### Railway (Database)
1. Create PostgreSQL instance on Railway
2. Copy `DATABASE_URL` to Vercel env vars
3. Run `npx prisma db push` to create tables

---

## Git Workflow

- **Default branch:** `master`
- **Feature branches:** `claude/<description>` pattern
- Commit messages: explain **why** the change was made

---

## AI Assistant Rules

- **Read first:** Always read existing files before modifying
- **Minimal changes:** Only do what was requested
- **Security:** Never commit secrets or credentials
- **Constants:** Modify enums/settings in `src/lib/constants.ts`
- **Update this file:** Keep CLAUDE.md current with major decisions
