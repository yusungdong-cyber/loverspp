"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { REQUEST_TYPES, REQUEST_STATUSES } from "@/lib/constants";

const SAMPLE_REQUESTS = [
  { id: "1", title: "스타트업 랜딩 페이지 제작", type: "landing", budget_min: 500000, budget_max: 1000000, currency: "KRW", status: "open", description: "AI 스타트업 소개 랜딩 페이지를 제작해주실 분을 찾습니다.", created_at: "2026-02-15" },
  { id: "2", title: "포트폴리오 웹사이트 리뉴얼", type: "website", budget_min: 300000, budget_max: 800000, currency: "KRW", status: "open", description: "디자이너 포트폴리오 사이트를 모던하게 리뉴얼하고 싶습니다.", created_at: "2026-02-14" },
  { id: "3", title: "쇼핑몰 Shopify 커스터마이징", type: "shopify", budget_min: 1000000, budget_max: 2000000, currency: "KRW", status: "in_discussion", description: "패션 쇼핑몰 Shopify 테마 커스터마이징이 필요합니다.", created_at: "2026-02-13" },
  { id: "4", title: "SaaS 대시보드 UI 개발", type: "website", budget_min: 200, budget_max: 500, currency: "USD", status: "open", description: "데이터 분석 SaaS의 대시보드 프론트엔드 개발.", created_at: "2026-02-12" },
  { id: "5", title: "개인 브랜드 원페이지", type: "landing", budget_min: 200000, budget_max: 500000, currency: "KRW", status: "open", description: "유튜버 개인 브랜드 소개 페이지를 제작해주세요.", created_at: "2026-02-11" },
  { id: "6", title: "부동산 정보 사이트", type: "other", budget_min: 800000, budget_max: 1500000, currency: "KRW", status: "open", description: "부동산 매물 정보를 보여주는 반응형 웹사이트.", created_at: "2026-02-10" },
];

function formatBudget(min: number, max: number, currency: string) {
  const fmt = new Intl.NumberFormat("ko-KR");
  const s = currency === "USD" ? "$" : "₩";
  return `${s}${fmt.format(min)} ~ ${s}${fmt.format(max)}`;
}

export default function RequestsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = SAMPLE_REQUESTS.filter((r) => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== "all" && r.type !== filterType) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">제작 요청 게시판</h1>
          <p className="text-muted-foreground mt-1">원하는 웹사이트를 의뢰하고 크리에이터의 제안을 받으세요</p>
        </div>
        <Link href="/requests/new">
          <Button><Plus className="h-4 w-4 mr-2" /> 새 요청 작성</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="검색..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">모든 유형</option>
          {REQUEST_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">모든 상태</option>
          {REQUEST_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">검색 결과가 없습니다</div>
        ) : (
          filtered.map((req) => (
            <Link key={req.id} href={`/requests/${req.id}`}>
              <Card className="hover:shadow-md transition-shadow mb-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {REQUEST_TYPES.find((t) => t.value === req.type)?.label}
                    </Badge>
                    <Badge className={REQUEST_STATUSES.find((s) => s.value === req.status)?.color ?? ""}>
                      {REQUEST_STATUSES.find((s) => s.value === req.status)?.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{req.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{req.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">{formatBudget(req.budget_min, req.budget_max, req.currency)}</span>
                    <span className="text-xs text-muted-foreground">{req.created_at}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
