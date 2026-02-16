import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

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

export async function generateArticle(
  keyword: string,
  topic: string
): Promise<GeneratedArticle> {
  const client = getClient();

  const systemPrompt = `You are an expert SEO content writer and strategist. You write high-quality, engaging, SEO-optimized blog articles. Always output valid JSON.`;

  const userPrompt = `Write a comprehensive SEO-optimized blog article.

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

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 4000,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from OpenAI");

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

export async function generateImageDescription(topic: string): Promise<{
  prompt: string;
  altText: string;
}> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Generate blog image descriptions. Return valid JSON.",
      },
      {
        role: "user",
        content: `Generate a realistic blog featured image description.
Topic: ${topic}
Style: Professional, High CTR, Blog thumbnail friendly, No text overlay.
Also generate SEO-optimized ALT text.
Return JSON: {"prompt": "detailed image prompt", "altText": "SEO alt text"}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 500,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from OpenAI");
  return JSON.parse(raw);
}
