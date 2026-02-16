"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendChart } from "@/components/shared/trend-chart";
import { TREND_CATEGORIES } from "@/lib/constants";
import { formatNumber, getScoreBg } from "@/lib/utils";
import { TrendingUp, Sparkles, DollarSign, Search, BarChart3, Loader2 } from "lucide-react";

interface TrendTopic {
  id: string;
  title: string;
  keyword: string;
  searchVolume: number;
  competitionScore: number;
  monetizationScore: number;
  trendScore: number;
  category: string | null;
}

interface TrendSession {
  id: string;
  createdAt: string;
  topics: TrendTopic[];
}

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatingArticle, setGeneratingArticle] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    fetchTrends();
  }, []);

  async function fetchTrends() {
    setLoading(true);
    try {
      const res = await fetch("/api/trends");
      const data = await res.json();
      setTrends(data.trends);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function generateNew() {
    setGenerating(true);
    try {
      const body = category !== "all" ? { category } : {};
      const res = await fetch("/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.topics) {
        setTrends({ id: data.sessionId, createdAt: new Date().toISOString(), topics: data.topics });
      }
    } catch {
      // ignore
    } finally {
      setGenerating(false);
    }
  }

  async function generateArticle(topicId: string) {
    setGeneratingArticle(topicId);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId }),
      });
      if (res.ok) {
        window.location.href = "/dashboard/articles";
      }
    } catch {
      // ignore
    } finally {
      setGeneratingArticle(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Loading trends...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trend Discovery</h1>
          <p className="text-muted-foreground">
            Find the highest-potential topics for your next article
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {TREND_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={generateNew} disabled={generating}>
            {generating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <TrendingUp className="mr-2 h-4 w-4" />
            )}
            {generating ? "Scanning..." : "Discover Trends"}
          </Button>
        </div>
      </div>

      {/* Chart */}
      {trends?.topics && trends.topics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Trend Score Comparison
            </CardTitle>
            <CardDescription>
              Higher scores indicate better opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart topics={trends.topics} />
          </CardContent>
        </Card>
      )}

      {/* Topics */}
      <div className="grid gap-4">
        {trends?.topics?.map((topic, i) => (
          <Card key={topic.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <h3 className="text-lg font-semibold">{topic.title}</h3>
                  </div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{topic.keyword}</Badge>
                    {topic.category && (
                      <Badge variant="secondary">{topic.category}</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Search className="h-3.5 w-3.5" />
                      <span>{formatNumber(topic.searchVolume)} searches/mo</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <BarChart3 className="h-3.5 w-3.5" />
                      <span>Competition: {topic.competitionScore}/100</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>Monetization: {topic.monetizationScore}/100</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 flex-col items-center justify-center rounded-full border font-bold ${getScoreBg(
                      topic.trendScore
                    )}`}
                  >
                    <span className="text-lg">{topic.trendScore}</span>
                  </div>
                  <Button
                    onClick={() => generateArticle(topic.id)}
                    disabled={generatingArticle === topic.id}
                  >
                    {generatingArticle === topic.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Article
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!trends?.topics || trends.topics.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No trends yet</h3>
            <p className="mb-4 text-muted-foreground">
              Click &quot;Discover Trends&quot; to find today&apos;s top trending topics
            </p>
            <Button onClick={generateNew} disabled={generating}>
              {generating ? "Scanning..." : "Discover Trends"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
