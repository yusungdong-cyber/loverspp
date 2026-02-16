"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ARTICLE_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { SeoScoreBadge } from "@/components/shared/seo-score-badge";
import { FileText, Globe, TrendingUp, CheckCircle, Clock, PenTool } from "lucide-react";

interface DashboardStats {
  totalArticles: number;
  publishedCount: number;
  draftCount: number;
  readyCount: number;
  wpSiteCount: number;
  recentArticles: {
    id: string;
    title: string;
    status: keyof typeof ARTICLE_STATUSES;
    seoScore: { overallScore: number } | null;
    createdAt: string;
    wordCount: number | null;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Articles",
      value: stats?.totalArticles || 0,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      label: "Published",
      value: stats?.publishedCount || 0,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Ready",
      value: stats?.readyCount || 0,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "WordPress Sites",
      value: stats?.wpSiteCount || 0,
      icon: Globe,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your content automation
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/trends">
            <Button>
              <TrendingUp className="mr-2 h-4 w-4" />
              Find Trends
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/trends">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Discover Trends</h3>
                <p className="text-sm text-muted-foreground">
                  Find today&apos;s top trending topics
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/articles">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <PenTool className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">My Articles</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage generated articles
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/sites">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <Globe className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">WordPress Sites</h3>
                <p className="text-sm text-muted-foreground">
                  Connect and manage WP sites
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Articles */}
      {stats?.recentArticles && stats.recentArticles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/dashboard/articles/${article.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-medium">{article.title}</h4>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(article.createdAt)}</span>
                      {article.wordCount && <span>&middot; {article.wordCount} words</span>}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    {article.seoScore && (
                      <SeoScoreBadge score={article.seoScore.overallScore} size="sm" />
                    )}
                    <Badge className={ARTICLE_STATUSES[article.status]?.color}>
                      {ARTICLE_STATUSES[article.status]?.label}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
