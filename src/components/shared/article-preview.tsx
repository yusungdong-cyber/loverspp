"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { SeoScoreBadge } from "./seo-score-badge";

interface ArticlePreviewProps {
  title: string;
  htmlContent: string;
  metaDescription?: string;
  seoScore?: {
    overallScore: number;
    keywordDensityScore: number;
    readabilityScore: number;
    headingStructureScore: number;
  };
  tags?: string[];
  wordCount?: number;
}

export function ArticlePreview({
  title,
  htmlContent,
  metaDescription,
  seoScore,
  tags,
  wordCount,
}: ArticlePreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          {metaDescription && (
            <p className="text-sm text-muted-foreground">{metaDescription}</p>
          )}
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-4 border-b pb-4">
          {seoScore && (
            <div className="flex items-center gap-4">
              <SeoScoreBadge score={seoScore.overallScore} label="Overall" />
              <SeoScoreBadge score={seoScore.keywordDensityScore} size="sm" label="Keyword" />
              <SeoScoreBadge score={seoScore.readabilityScore} size="sm" label="Readability" />
              <SeoScoreBadge score={seoScore.headingStructureScore} size="sm" label="Structure" />
            </div>
          )}
          {wordCount && (
            <Badge variant="secondary">{wordCount} words</Badge>
          )}
        </div>

        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t pt-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
