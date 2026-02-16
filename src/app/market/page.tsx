"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LISTING_CATEGORIES } from "@/lib/constants";

const SAMPLE_LISTINGS = [
  { id: "1", title: "AI 이미지 생성 SaaS", category: "saas", price_amount: 5000000, price_currency: "KRW", short_desc: "Stable Diffusion 기반 이미지 생성 서비스. 월 500명 활성 사용자.", tags: ["AI", "이미지", "SaaS"], demo_url: "https://demo.example.com" },
  { id: "2", title: "자동 이메일 마케팅 봇", category: "automation", price_amount: 1500000, price_currency: "KRW", short_desc: "GPT 기반 이메일 캠페인 자동 생성 및 발송 시스템.", tags: ["GPT", "이메일", "마케팅"], demo_url: null },
  { id: "3", title: "Next.js SaaS 보일러플레이트", category: "template", price_amount: 300000, price_currency: "KRW", short_desc: "인증, 결제, 대시보드 포함 풀스택 템플릿.", tags: ["Next.js", "템플릿", "Stripe"], demo_url: "https://demo2.example.com" },
  { id: "4", title: "URL 단축기 마이크로앱", category: "micro_app", price_amount: 800000, price_currency: "KRW", short_desc: "커스텀 도메인 지원 URL 단축 서비스.", tags: ["URL", "마이크로앱"], demo_url: null },
  { id: "5", title: "고객 피드백 수집 SaaS", category: "saas", price_amount: 3000000, price_currency: "KRW", short_desc: "위젯 기반 사용자 피드백 수집 및 분석 도구.", tags: ["피드백", "분석", "위젯"], demo_url: "https://demo3.example.com" },
  { id: "6", title: "소셜 미디어 예약 발행 도구", category: "automation", price_amount: 2000000, price_currency: "KRW", short_desc: "인스타, 트위터, 페이스북 게시물 예약 관리.", tags: ["소셜미디어", "자동화"], demo_url: null },
  { id: "7", title: "리액트 관리자 대시보드 템플릿", category: "template", price_amount: 500000, price_currency: "KRW", short_desc: "차트, 테이블, 폼 등 20+ 컴포넌트 포함 관리자 패널.", tags: ["React", "관리자", "대시보드"], demo_url: "https://demo4.example.com" },
  { id: "8", title: "QR코드 주문 시스템", category: "micro_app", price_amount: 1200000, price_currency: "KRW", short_desc: "식당용 QR코드 기반 모바일 주문 및 결제 시스템.", tags: ["QR", "주문", "모바일"], demo_url: null },
];

function formatPrice(amount: number, currency: string) {
  const fmt = new Intl.NumberFormat("ko-KR");
  const s = currency === "USD" ? "$" : "₩";
  return `${s}${fmt.format(amount)}`;
}

export default function MarketPage() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDemo, setFilterDemo] = useState(false);

  const filtered = SAMPLE_LISTINGS.filter((l) => {
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterCategory !== "all" && l.category !== filterCategory) return false;
    if (filterDemo && !l.demo_url) return false;
    return true;
  });

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">SaaS 거래소</h1>
          <p className="text-muted-foreground mt-1">바이브코딩으로 만든 SaaS와 프로젝트를 사고파세요</p>
        </div>
        <Link href="/sell/new">
          <Button>판매 등록</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="제목, 태그로 검색..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">모든 카테고리</option>
          {LISTING_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <label className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background text-sm cursor-pointer">
          <input type="checkbox" checked={filterDemo} onChange={(e) => setFilterDemo(e.target.checked)} />
          데모 있는 것만
        </label>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">검색 결과가 없습니다</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((listing) => (
            <Link key={listing.id} href={`/market/${listing.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-xs">
                      {LISTING_CATEGORIES.find((c) => c.value === listing.category)?.label}
                    </Badge>
                    {listing.demo_url && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" />데모
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base line-clamp-1">{listing.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">{listing.short_desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {listing.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                  <p className="text-lg font-bold text-primary">{formatPrice(listing.price_amount, listing.price_currency)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
