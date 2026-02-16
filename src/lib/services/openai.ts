import OpenAI from "openai";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/crypto";

export interface GeneratedArticle {
  title: string;
  metaDescription: string;
  htmlContent: string;
  plainContent: string;
  faqSection: string;
  schemaMarkup: object;
  featuredImagePrompt: string;
  featuredImageAlt: string;
  inArticleImages: { prompt: string; alt: string; placement: string }[];
  tags: string[];
  categories: string[];
  wordCount: number;
}

// Resolve which AI provider + key to use for a given user
async function resolveAIConfig(userId: string): Promise<{
  provider: "openai" | "claude";
  apiKey: string;
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { openaiApiKey: true, claudeApiKey: true, aiProvider: true },
  });

  if (!user) throw new Error("User not found");

  const provider = (user.aiProvider || "openai") as "openai" | "claude";

  if (provider === "claude" && user.claudeApiKey) {
    return { provider: "claude", apiKey: decrypt(user.claudeApiKey) };
  }

  if (provider === "openai" && user.openaiApiKey) {
    return { provider: "openai", apiKey: decrypt(user.openaiApiKey) };
  }

  // Fallback: try whichever key exists
  if (user.openaiApiKey) {
    return { provider: "openai", apiKey: decrypt(user.openaiApiKey) };
  }
  if (user.claudeApiKey) {
    return { provider: "claude", apiKey: decrypt(user.claudeApiKey) };
  }

  // Last resort: env variable
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-placeholder-set-your-real-key") {
    return { provider: "openai", apiKey: process.env.OPENAI_API_KEY };
  }

  throw new Error("No AI API key configured. Go to Settings to add your OpenAI or Claude API key.");
}

const ARTICLE_SYSTEM_PROMPT = `You are an expert SEO content writer and strategist. You write high-quality, engaging, SEO-optimized blog articles. Always output valid JSON.`;

function buildArticlePrompt(keyword: string, topic: string): string {
  return `Write a comprehensive SEO-optimized blog article.

Topic: ${topic}
Primary Keyword: ${keyword}

Requirements:
1. SEO Title containing the primary keyword (60-70 chars)
2. Meta description (150-160 chars) with keyword
3. Article structure:
   - H1 tag with keyword
   - 5+ H2 subheadings with semantic keywords
   - 2-3 H3 subheadings under relevant H2s
   - Short paragraphs (2-3 sentences each)
   - 1,200-1,800 words total
4. Include FAQ section with 3 questions and answers
5. Keyword density: 1.0-1.5%
6. Persuasive, engaging tone
7. Include these placeholders in the HTML:
   - <!-- [AFFILIATE_BLOCK] --> (2 placements)
   - <!-- [AD_PLACEHOLDER] --> (2 placements)
   - <!-- [CTA_SECTION] --> (1 at end)
   - <!-- [INTERNAL_LINK: description] --> (3 suggestions)
8. End with a strong call-to-action

Return a JSON object with these fields:
{
  "title": "SEO title",
  "metaDescription": "meta description",
  "htmlContent": "full HTML article with h1, h2, h3, p tags, placeholders",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "categories": ["Category1"],
  "featuredImagePrompt": "detailed prompt for AI image generation - professional blog header",
  "featuredImageAlt": "SEO-optimized alt text for featured image",
  "inArticleImages": [
    {"prompt": "image prompt 1", "alt": "alt text 1", "placement": "after section 2"},
    {"prompt": "image prompt 2", "alt": "alt text 2", "placement": "after section 4"}
  ]
}`;
}

// ─── OpenAI-based generation ───────────────────────
async function generateViaOpenAI(apiKey: string, keyword: string, topic: string): Promise<string> {
  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: ARTICLE_SYSTEM_PROMPT },
      { role: "user", content: buildArticlePrompt(keyword, topic) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 4000,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from OpenAI");
  return raw;
}

// ─── Claude-based generation ───────────────────────
async function generateViaClaude(apiKey: string, keyword: string, topic: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      system: ARTICLE_SYSTEM_PROMPT + "\nYou MUST respond with ONLY valid JSON, no markdown fences.",
      messages: [
        { role: "user", content: buildArticlePrompt(keyword, topic) },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const raw = data.content?.[0]?.text;
  if (!raw) throw new Error("No response from Claude");

  // Strip potential markdown fences
  return raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
}

// ─── Main article generator (routes through user's chosen provider) ───
export async function generateArticle(
  keyword: string,
  topic: string,
  userId?: string
): Promise<GeneratedArticle> {
  let raw: string;

  if (userId) {
    const config = await resolveAIConfig(userId);

    if (config.provider === "claude") {
      raw = await generateViaClaude(config.apiKey, keyword, topic);
    } else {
      raw = await generateViaOpenAI(config.apiKey, keyword, topic);
    }
  } else {
    // Fallback for cases without userId
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("No API key configured");
    raw = await generateViaOpenAI(apiKey, keyword, topic);
  }

  const parsed = JSON.parse(raw);

  // Strip HTML for plain text
  const plainContent = parsed.htmlContent
    .replace(/<[^>]+>/g, " ")
    .replace(/<!--[^>]+-->/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = plainContent.split(/\s+/).filter(Boolean).length;

  // Extract FAQ
  const faqMatch = parsed.htmlContent.match(
    /<h2[^>]*>.*?FAQ.*?<\/h2>([\s\S]*?)(?=<h2|<!-- \[CTA_SECTION\] -->|$)/i
  );
  const faqSection = faqMatch ? faqMatch[0] : "";

  // Generate schema markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: parsed.title,
    description: parsed.metaDescription,
    keywords: parsed.tags?.join(", ") || keyword,
    articleBody: plainContent.substring(0, 500),
    author: { "@type": "Person", name: "WP AutoProfit AI" },
    datePublished: new Date().toISOString(),
    mainEntityOfPage: { "@type": "WebPage" },
  };

  return {
    title: parsed.title,
    metaDescription: parsed.metaDescription,
    htmlContent: parsed.htmlContent,
    plainContent,
    faqSection,
    schemaMarkup,
    featuredImagePrompt: parsed.featuredImagePrompt || `Professional blog header image for: ${topic}`,
    featuredImageAlt: parsed.featuredImageAlt || `${topic} - featured image`,
    inArticleImages: parsed.inArticleImages || [],
    tags: parsed.tags || [keyword],
    categories: parsed.categories || ["General"],
    wordCount,
  };
}

export async function generateImageDescription(
  topic: string,
  userId?: string
): Promise<{ prompt: string; altText: string }> {
  const prompt = `Generate a realistic blog featured image description.
Topic: ${topic}
Style: Professional, High CTR, Blog thumbnail friendly, No text overlay.
Also generate SEO-optimized ALT text.
Return JSON: {"prompt": "detailed image prompt", "altText": "SEO alt text"}`;

  let raw: string;

  if (userId) {
    const config = await resolveAIConfig(userId);
    if (config.provider === "claude") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": config.apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 500,
          system: "Generate blog image descriptions. Return ONLY valid JSON, no markdown.",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      raw = data.content?.[0]?.text || "{}";
      raw = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    } else {
      const client = new OpenAI({ apiKey: config.apiKey });
      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Generate blog image descriptions. Return valid JSON." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 500,
      });
      raw = response.choices[0]?.message?.content || "{}";
    }
  } else {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Generate blog image descriptions. Return valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500,
    });
    raw = response.choices[0]?.message?.content || "{}";
  }

  return JSON.parse(raw);
}
