"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ARTICLE_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { SeoScoreBadge } from "@/components/shared/seo-score-badge";
import { ArticlePreview } from "@/components/shared/article-preview";
import {
  ArrowLeft,
  Send,
  Clock,
  Loader2,
  Tag,
  FolderOpen,
  FileText,
} from "lucide-react";

interface ArticleDetail {
  id: string;
  title: string;
  slug: string | null;
  metaDescription: string | null;
  content: string;
  htmlContent: string | null;
  featuredImageAlt: string | null;
  inArticleImages: { prompt: string; alt: string; placement: string }[] | null;
  schemaMarkup: object | null;
  seoScore: {
    overallScore: number;
    keywordDensityScore: number;
    keywordDensity: number;
    readabilityScore: number;
    headingStructureScore: number;
    metaDescriptionScore: number;
    contentLengthScore: number;
    suggestions: string[];
  } | null;
  primaryKeyword: string | null;
  tags: string[];
  categories: string[];
  status: keyof typeof ARTICLE_STATUSES;
  wordCount: number | null;
  wpPostId: number | null;
  publishedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
  wpSite: { id: string; siteUrl: string } | null;
  trendTopic: {
    title: string;
    keyword: string;
    trendScore: number;
    searchVolume: number;
  } | null;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetch(`/api/articles/${params.id}`)
      .then((r) => r.json())
      .then((d) => setArticle(d.article))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handlePublish(status: "draft" | "publish") {
    if (!article) return;
    setPublishing(true);
    try {
      const res = await fetch(`/api/articles/${article.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        setArticle(data.article);
      }
    } catch {
      // ignore
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading article...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <p className="mb-4 text-muted-foreground">Article not found</p>
        <Button onClick={() => router.push("/dashboard/articles")}>
          Back to Articles
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/articles")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{article.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{formatDate(article.createdAt)}</span>
            {article.wordCount && <span>&middot; {article.wordCount} words</span>}
            <Badge className={ARTICLE_STATUSES[article.status]?.color}>
              {ARTICLE_STATUSES[article.status]?.label}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {article.htmlContent && (
            <ArticlePreview
              title={article.title}
              htmlContent={article.htmlContent}
              metaDescription={article.metaDescription || undefined}
              seoScore={article.seoScore || undefined}
              tags={article.tags}
              wordCount={article.wordCount || undefined}
            />
          )}
          {article.wpSite && (article.status === "READY" || article.status === "DRAFT") && (
            <>
              <Button
                variant="outline"
                onClick={() => handlePublish("draft")}
                disabled={publishing}
              >
                {publishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
                Save as Draft
              </Button>
              <Button onClick={() => handlePublish("publish")} disabled={publishing}>
                {publishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Publish Now
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Meta */}
          {article.metaDescription && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Meta Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{article.metaDescription}</p>
                <span className="mt-1 text-xs text-muted-foreground">
                  {article.metaDescription.length} characters
                </span>
              </CardContent>
            </Card>
          )}

          {/* Content Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                Article Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm dark:prose-invert max-w-none line-clamp-[20]"
                dangerouslySetInnerHTML={{ __html: article.htmlContent || article.content }}
              />
            </CardContent>
          </Card>

          {/* Schema Markup */}
          {article.schemaMarkup && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">JSON-LD Schema</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                  {JSON.stringify(article.schemaMarkup, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SEO Score */}
          {article.seoScore && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">SEO Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <SeoScoreBadge score={article.seoScore.overallScore} size="lg" label="Overall" />
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <SeoScoreBadge score={article.seoScore.keywordDensityScore} size="sm" label="Keyword" />
                  <SeoScoreBadge score={article.seoScore.readabilityScore} size="sm" label="Readability" />
                  <SeoScoreBadge score={article.seoScore.headingStructureScore} size="sm" label="Headings" />
                  <SeoScoreBadge score={article.seoScore.metaDescriptionScore} size="sm" label="Meta" />
                </div>
                <Separator />
                <div className="text-xs text-muted-foreground">
                  <p>Keyword Density: {article.seoScore.keywordDensity}%</p>
                </div>
                {article.seoScore.suggestions.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="mb-2 text-xs font-medium">Suggestions:</p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {article.seoScore.suggestions.map((s, i) => (
                          <li key={i} className="flex gap-1">
                            <span className="text-yellow-500">&bull;</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tags & Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Taxonomy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {article.categories.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <FolderOpen className="h-3 w-3" /> Categories
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {article.categories.map((c) => (
                      <Badge key={c} variant="secondary">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {article.tags.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Tag className="h-3 w-3" /> Tags
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((t) => (
                      <Badge key={t} variant="outline">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Image Prompts */}
          {article.inArticleImages && (article.inArticleImages as unknown[]).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Image Prompts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {article.featuredImageAlt && (
                  <div className="rounded-md border p-3">
                    <p className="mb-1 text-xs font-medium text-primary">Featured Image</p>
                    <p className="text-xs text-muted-foreground">ALT: {article.featuredImageAlt}</p>
                  </div>
                )}
                {(article.inArticleImages as { prompt: string; alt: string; placement: string }[]).map((img, i) => (
                  <div key={i} className="rounded-md border p-3">
                    <p className="mb-1 text-xs font-medium">Image {i + 1}: {img.placement}</p>
                    <p className="text-xs text-muted-foreground">{img.prompt}</p>
                    <p className="mt-1 text-xs text-muted-foreground">ALT: {img.alt}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Trend Info */}
          {article.trendTopic && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Source Trend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{article.trendTopic.title}</p>
                <p className="text-muted-foreground">
                  Keyword: {article.trendTopic.keyword}
                </p>
                <p className="text-muted-foreground">
                  Trend Score: {article.trendTopic.trendScore}/100
                </p>
                <p className="text-muted-foreground">
                  Search Volume: {article.trendTopic.searchVolume.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
