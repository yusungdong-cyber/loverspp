"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, DollarSign, Send, Globe, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { REQUEST_TYPES, REQUEST_STATUSES, DISCLAIMER_TEXT } from "@/lib/constants";

const SAMPLE = {
  id: "1",
  title: "스타트업 랜딩 페이지 제작",
  type: "landing",
  budget_min: 500000,
  budget_max: 1000000,
  currency: "KRW",
  deadline: "2026-03-15",
  description: "AI 기반 스타트업의 서비스 소개 랜딩 페이지를 제작해주실 분을 찾습니다.\n\n주요 요구사항:\n- 히어로 섹션 (서비스 소개 + CTA)\n- 기능 소개 섹션 (3~4개 핵심 기능)\n- 요금제 비교 테이블\n- FAQ 아코디언\n- 모바일 반응형 필수\n- SEO 최적화 (메타태그, OG 이미지 등)\n\n디자인 스타일은 모던하고 깔끔한 느낌을 원합니다.",
  reference_urls: ["https://stripe.com", "https://linear.app"],
  preferred_stack: "Next.js, Tailwind CSS",
  status: "open",
  created_at: "2026-02-15",
  owner_name: "김바이브",
  proposal_count: 3,
};

const SAMPLE_PROPOSALS = [
  { id: "p1", creator_name: "이크리에이터", price_amount: 700000, currency: "KRW", timeline_days: 7, message: "안녕하세요! 비슷한 랜딩 페이지를 여러 번 제작한 경험이 있습니다. Next.js + Tailwind로 깔끔하게 제작해드리겠습니다.", status: "submitted" },
  { id: "p2", creator_name: "박개발", price_amount: 850000, currency: "KRW", timeline_days: 5, message: "풀스택 개발자입니다. 5일 내 완성 가능합니다. SEO 최적화와 애니메이션까지 포함해드리겠습니다.", status: "submitted" },
  { id: "p3", creator_name: "정디자인", price_amount: 600000, currency: "KRW", timeline_days: 10, message: "디자인부터 개발까지 원스톱으로 진행합니다. 피그마 시안 먼저 보여드리고 진행할게요.", status: "submitted" },
];

export default function RequestDetailPage() {
  const params = useParams();
  const req = SAMPLE;
  const statusInfo = REQUEST_STATUSES.find((s) => s.value === req.status);
  const typeInfo = REQUEST_TYPES.find((t) => t.value === req.type);

  const fmt = new Intl.NumberFormat("ko-KR");
  const symbol = req.currency === "USD" ? "$" : "₩";

  return (
    <div className="container max-w-4xl py-8">
      <Link href="/requests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> 목록으로 돌아가기
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{typeInfo?.label}</Badge>
                <Badge className={statusInfo?.color}>{statusInfo?.label}</Badge>
              </div>
              <CardTitle className="text-2xl">{req.title}</CardTitle>
              <CardDescription>작성자: {req.owner_name} &middot; {req.created_at}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{req.description}</div>

              {req.reference_urls && req.reference_urls.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1"><Globe className="h-4 w-4" /> 참고 URL</h4>
                  <ul className="space-y-1">
                    {req.reference_urls.map((url, i) => (
                      <li key={i}><a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{url}</a></li>
                    ))}
                  </ul>
                </div>
              )}

              {req.preferred_stack && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-1 flex items-center gap-1"><Code2 className="h-4 w-4" /> 선호 스택</h4>
                  <p className="text-sm text-muted-foreground">{req.preferred_stack}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Proposals section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">제안서 ({SAMPLE_PROPOSALS.length}개)</h3>
            <div className="space-y-4">
              {SAMPLE_PROPOSALS.map((p) => (
                <Card key={p.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{p.creator_name}</CardTitle>
                      <Badge variant="outline">{p.status === "submitted" ? "검토 중" : p.status === "selected" ? "선정됨" : "미선정"}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{p.message}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {symbol}{fmt.format(p.price_amount)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.timeline_days}일</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">예산 범위</p>
                <p className="text-xl font-bold text-primary">{symbol}{fmt.format(req.budget_min)} ~ {symbol}{fmt.format(req.budget_max)}</p>
              </div>
              {req.deadline && (
                <div>
                  <p className="text-sm text-muted-foreground">마감일</p>
                  <p className="font-medium">{req.deadline}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">받은 제안</p>
                <p className="font-medium">{req.proposal_count}개</p>
              </div>
              <Separator />
              <Link href={`/requests/${params.id}/propose`}>
                <Button className="w-full"><Send className="h-4 w-4 mr-2" /> 제안서 보내기</Button>
              </Link>
            </CardContent>
          </Card>

          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-xs text-yellow-800">
            {DISCLAIMER_TEXT}
          </div>
        </div>
      </div>
    </div>
  );
}
