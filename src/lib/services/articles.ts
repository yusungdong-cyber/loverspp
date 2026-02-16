import { db } from "@/lib/db";
import { generateArticle } from "./openai";
import { calculateSeoScore } from "./seo-scorer";
import { publishToWordPress } from "./wordpress";
import { slugify } from "@/lib/utils";
type ArticleStatus = "DRAFT" | "GENERATING" | "READY" | "PUBLISHING" | "PUBLISHED" | "FAILED";

function parseJsonFields<T extends Record<string, unknown>>(article: T | null): T | null {
  if (!article) return article;
  return {
    ...article,
    tags: typeof article.tags === "string" ? JSON.parse(article.tags) : article.tags ?? [],
    categories: typeof article.categories === "string" ? JSON.parse(article.categories) : article.categories ?? [],
    seoScore: typeof article.seoScore === "string" ? JSON.parse(article.seoScore) : article.seoScore,
    schemaMarkup: typeof article.schemaMarkup === "string" ? JSON.parse(article.schemaMarkup) : article.schemaMarkup,
    inArticleImages: typeof article.inArticleImages === "string" ? JSON.parse(article.inArticleImages) : article.inArticleImages,
  };
}

export async function createArticleFromTopic(
  userId: string,
  topicId: string,
  wpSiteId?: string
) {
  const topic = await db.trendTopic.findUnique({ where: { id: topicId } });
  if (!topic) throw new Error("Topic not found");

  // Create placeholder article
  const article = await db.article.create({
    data: {
      userId,
      wpSiteId,
      trendTopicId: topicId,
      title: topic.title,
      slug: slugify(topic.title),
      primaryKeyword: topic.keyword,
      content: "",
      status: "GENERATING",
    },
  });

  try {
    // Generate article via user's AI provider
    const generated = await generateArticle(topic.keyword, topic.title, userId);

    // Calculate SEO score
    const seoScore = calculateSeoScore(
      generated.plainContent,
      generated.htmlContent,
      topic.keyword,
      generated.metaDescription
    );

    // Update article with generated content
    const updated = await db.article.update({
      where: { id: article.id },
      data: {
        title: generated.title,
        slug: slugify(generated.title),
        metaDescription: generated.metaDescription,
        content: generated.plainContent,
        htmlContent: generated.htmlContent,
        featuredImageUrl: null,
        featuredImageAlt: generated.featuredImageAlt,
        inArticleImages: JSON.stringify(generated.inArticleImages),
        schemaMarkup: JSON.stringify(generated.schemaMarkup),
        seoScore: JSON.stringify(seoScore),
        tags: JSON.stringify(generated.tags),
        categories: JSON.stringify(generated.categories),
        wordCount: generated.wordCount,
        status: "READY",
      },
    });

    return parseJsonFields(updated);
  } catch (error) {
    await db.article.update({
      where: { id: article.id },
      data: { status: "FAILED" },
    });
    throw error;
  }
}

export async function publishArticle(
  articleId: string,
  userId: string,
  options: {
    status?: "draft" | "publish" | "future";
    scheduledAt?: Date;
  } = {}
) {
  const article = await db.article.findFirst({
    where: { id: articleId, userId },
  });

  if (!article) throw new Error("Article not found");
  if (!article.wpSiteId) throw new Error("No WordPress site linked");
  if (article.status !== "READY" && article.status !== "DRAFT") {
    throw new Error("Article is not ready for publishing");
  }

  await db.article.update({
    where: { id: articleId },
    data: { status: "PUBLISHING" },
  });

  try {
    // Add schema markup to HTML
    const schemaMarkup = article.schemaMarkup ? JSON.parse(article.schemaMarkup) : null;
    const schemaScript = schemaMarkup
      ? `\n<script type="application/ld+json">${JSON.stringify(schemaMarkup)}</script>`
      : "";

    const tags: string[] = article.tags ? JSON.parse(article.tags) : [];
    const categories: string[] = article.categories ? JSON.parse(article.categories) : [];

    const result = await publishToWordPress(article.wpSiteId, userId, {
      title: article.title,
      htmlContent: (article.htmlContent || article.content) + schemaScript,
      metaDescription: article.metaDescription || undefined,
      tags,
      categories,
      status: options.status || "draft",
      scheduledAt: options.scheduledAt,
      featuredImageUrl: article.featuredImageUrl || undefined,
    });

    return db.article.update({
      where: { id: articleId },
      data: {
        wpPostId: result.wpPostId,
        status: "PUBLISHED",
        publishedAt: new Date(),
        scheduledAt: options.scheduledAt || null,
      },
    });
  } catch (error) {
    await db.article.update({
      where: { id: articleId },
      data: { status: "FAILED" },
    });
    throw error;
  }
}

export async function getUserArticles(
  userId: string,
  filters?: {
    status?: ArticleStatus;
    limit?: number;
    offset?: number;
  }
) {
  const where: Record<string, unknown> = { userId };
  if (filters?.status) where.status = filters.status;

  const [articles, total] = await Promise.all([
    db.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: filters?.limit || 20,
      skip: filters?.offset || 0,
      include: {
        wpSite: { select: { siteUrl: true } },
        trendTopic: { select: { keyword: true, trendScore: true } },
      },
    }),
    db.article.count({ where }),
  ]);

  return { articles: articles.map(parseJsonFields), total };
}

export async function getArticleById(articleId: string, userId: string) {
  const article = await db.article.findFirst({
    where: { id: articleId, userId },
    include: {
      wpSite: { select: { id: true, siteUrl: true } },
      trendTopic: true,
    },
  });
  return parseJsonFields(article);
}

export async function deleteArticle(articleId: string, userId: string) {
  return db.article.deleteMany({ where: { id: articleId, userId } });
}

export async function getDashboardStats(userId: string) {
  const [totalArticles, publishedCount, draftCount, readyCount] =
    await Promise.all([
      db.article.count({ where: { userId } }),
      db.article.count({ where: { userId, status: "PUBLISHED" } }),
      db.article.count({ where: { userId, status: "DRAFT" } }),
      db.article.count({ where: { userId, status: "READY" } }),
    ]);

  const recentArticlesRaw = await db.article.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      status: true,
      seoScore: true,
      createdAt: true,
      wordCount: true,
    },
  });
  const recentArticles = recentArticlesRaw.map(parseJsonFields);

  const wpSiteCount = await db.wpSite.count({ where: { userId } });

  return {
    totalArticles,
    publishedCount,
    draftCount,
    readyCount,
    recentArticles,
    wpSiteCount,
  };
}
