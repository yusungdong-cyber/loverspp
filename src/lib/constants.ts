export const APP_NAME = "WP AutoProfit AI";
export const APP_DESCRIPTION =
  "Automatically monetize WordPress blogs with AI-powered trending topics, SEO articles, and one-click publishing.";

export const ARTICLE_WORD_RANGE = { min: 1200, max: 1800 } as const;

export const TREND_CATEGORIES = [
  "Technology",
  "Business",
  "Finance",
  "Health",
  "Lifestyle",
  "Marketing",
  "Automotive",
  "Education",
  "Entertainment",
  "Food",
] as const;

export const ARTICLE_STATUSES = {
  DRAFT: { label: "Draft", color: "bg-gray-500/10 text-gray-500" },
  GENERATING: { label: "Generating", color: "bg-blue-500/10 text-blue-500" },
  READY: { label: "Ready", color: "bg-green-500/10 text-green-500" },
  PUBLISHING: { label: "Publishing", color: "bg-yellow-500/10 text-yellow-500" },
  PUBLISHED: { label: "Published", color: "bg-emerald-500/10 text-emerald-500" },
  FAILED: { label: "Failed", color: "bg-red-500/10 text-red-500" },
} as const;

export const SEO_THRESHOLDS = {
  keywordDensity: { min: 1.0, max: 1.5 },
  minWordCount: 1200,
  maxWordCount: 1800,
  minHeadings: 5,
  minFaqQuestions: 3,
} as const;

export const RATE_LIMIT = {
  maxRequests: Number(process.env.RATE_LIMIT_MAX) || 100,
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
} as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Trends", href: "/dashboard/trends" },
  { label: "Articles", href: "/dashboard/articles" },
  { label: "Sites", href: "/dashboard/sites" },
] as const;
