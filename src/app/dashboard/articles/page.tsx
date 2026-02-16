"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ARTICLE_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { SeoScoreBadge } from "@/components/shared/seo-score-badge";
import { FileText, Trash2, ExternalLink } from "lucide-react";
type ArticleStatus = "DRAFT" | "GENERATING" | "READY" | "PUBLISHING" | "PUBLISHED" | "FAILED";

interface Article {
  id: string;
  title: string;
  status: ArticleStatus;
  seoScore: { overallScore: number } | null;
  createdAt: string;
  wordCount: number | null;
  primaryKeyword: string | null;
  wpSite: { siteUrl: string } | null;
  trendTopic: { keyword: string; trendScore: number } | null;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  async function fetchArticles() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);

    try {
      const res = await fetch(`/api/articles?${params}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setTotal(data.total || 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    fetchArticles();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="text-muted-foreground">{total} articles total</p>
        </div>
        <Link href="/dashboard/trends">
          <Button>Generate New Article</Button>
        </Link>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="READY">Ready</TabsTrigger>
          <TabsTrigger value="PUBLISHED">Published</TabsTrigger>
          <TabsTrigger value="DRAFT">Draft</TabsTrigger>
          <TabsTrigger value="GENERATING">Generating</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          Loading articles...
        </div>
      ) : articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No articles yet</h3>
            <p className="mb-4 text-muted-foreground">
              Generate your first article from a trending topic
            </p>
            <Link href="/dashboard/trends">
              <Button>Find Trending Topics</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <Card key={article.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/dashboard/articles/${article.id}`}
                      className="text-lg font-semibold hover:text-primary"
                    >
                      {article.title}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(article.createdAt)}</span>
                      {article.wordCount && (
                        <>
                          <span>&middot;</span>
                          <span>{article.wordCount} words</span>
                        </>
                      )}
                      {article.primaryKeyword && (
                        <>
                          <span>&middot;</span>
                          <Badge variant="outline" className="text-xs">
                            {article.primaryKeyword}
                          </Badge>
                        </>
                      )}
                      {article.wpSite && (
                        <>
                          <span>&middot;</span>
                          <span className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            {article.wpSite.siteUrl}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {article.seoScore && (
                      <SeoScoreBadge score={article.seoScore.overallScore} size="sm" />
                    )}
                    <Badge className={ARTICLE_STATUSES[article.status]?.color}>
                      {ARTICLE_STATUSES[article.status]?.label}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(article.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
