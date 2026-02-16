import Link from "next/link";
import { FileText, Store, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DISCLAIMER_TEXT, REQUEST_TYPES, LISTING_CATEGORIES } from "@/lib/constants";

/* ── 샘플 데이터 (Supabase 연결 전 표시용) ────────── */
const SAMPLE_REQUESTS = [
  { id: "1", title: "스타트업 랜딩 페이지 제작", type: "landing", budget_min: 500000, budget_max: 1000000, currency: "KRW", status: "open" },
  { id: "2", title: "포트폴리오 웹사이트 리뉴얼", type: "website", budget_min: 300000, budget_max: 800000, currency: "KRW", status: "open" },
  { id: "3", title: "쇼핑몰 Shopify 커스터마이징", type: "shopify", budget_min: 1000000, budget_max: 2000000, currency: "KRW", status: "in_discussion" },
  { id: "4", title: "SaaS 대시보드 UI 개발", type: "website", budget_min: 200, budget_max: 500, currency: "USD", status: "open" },
  { id: "5", title: "개인 브랜드 원페이지", type: "landing", budget_min: 200000, budget_max: 500000, currency: "KRW", status: "open" },
  { id: "6", title: "부동산 정보 사이트", type: "other", budget_min: 800000, budget_max: 1500000, currency: "KRW", status: "open" },
];

const SAMPLE_LISTINGS = [
  { id: "1", title: "AI 이미지 생성 SaaS", category: "saas", price_amount: 5000000, price_currency: "KRW", short_desc: "Stable Diffusion 기반 이미지 생성 서비스. 월 500명 활성 사용자." },
  { id: "2", title: "자동 이메일 마케팅 봇", category: "automation", price_amount: 1500000, price_currency: "KRW", short_desc: "GPT 기반 이메일 캠페인 자동 생성 및 발송 시스템." },
  { id: "3", title: "Next.js SaaS 보일러플레이트", category: "template", price_amount: 300000, price_currency: "KRW", short_desc: "인증, 결제, 대시보드 포함 풀스택 템플릿." },
  { id: "4", title: "URL 단축기 마이크로앱", category: "micro_app", price_amount: 800000, price_currency: "KRW", short_desc: "커스텀 도메인 지원 URL 단축 서비스." },
  { id: "5", title: "고객 피드백 수집 SaaS", category: "saas", price_amount: 3000000, price_currency: "KRW", short_desc: "위젯 기반 사용자 피드백 수집 및 분석 도구." },
  { id: "6", title: "소셜 미디어 예약 발행 도구", category: "automation", price_amount: 2000000, price_currency: "KRW", short_desc: "인스타, 트위터, 페이스북 게시물 예약 관리." },
];

function formatBudget(min: number, max: number, currency: string) {
  const fmt = new Intl.NumberFormat("ko-KR");
  const symbol = currency === "USD" ? "$" : "₩";
  return `${symbol}${fmt.format(min)} ~ ${symbol}${fmt.format(max)}`;
}

function formatListingPrice(amount: number, currency: string) {
  const fmt = new Intl.NumberFormat("ko-KR");
  const symbol = currency === "USD" ? "$" : "₩";
  return `${symbol}${fmt.format(amount)}`;
}

function getTypeLabel(value: string) {
  return REQUEST_TYPES.find((t) => t.value === value)?.label ?? value;
}

function getCategoryLabel(value: string) {
  return LISTING_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

function getStatusBadge(status: string) {
  if (status === "open") return <Badge className="bg-green-100 text-green-800 border-green-200">모집 중</Badge>;
  if (status === "in_discussion") return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">협의 중</Badge>;
  return <Badge variant="secondary">마감</Badge>;
}

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Zap className="h-4 w-4" />
            바이브코딩 거래소
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            바이브코딩으로<br />
            <span className="text-primary">만들고, 사고, 의뢰하세요</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            홈페이지 제작을 의뢰하거나, 바이브코딩으로 만든 SaaS를 사고파세요.
            크리에이터와 바이어를 연결하는 플랫폼입니다.
          </p>

          {/* ── Two Flow Cards ───────────────────── */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors group">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3 mx-auto">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">홈페이지 제작 요청</CardTitle>
                <CardDescription>
                  원하는 웹사이트를 설명하면 크리에이터들이 제안서를 보내드립니다.
                  예산, 일정, 요구사항을 자유롭게 적어주세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/requests">
                  <Button className="w-full group-hover:bg-primary/90">
                    요청 게시판 보기 <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors group">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3 mx-auto">
                  <Store className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">SaaS 거래소</CardTitle>
                <CardDescription>
                  바이브코딩으로 만든 SaaS, 자동화 도구, 템플릿을 사고파세요.
                  데모 확인 후 판매자와 직접 거래합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/market">
                  <Button className="w-full group-hover:bg-primary/90">
                    거래소 둘러보기 <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Latest Requests ──────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">최신 제작 요청</h2>
            <Link href="/requests" className="text-sm text-primary hover:underline flex items-center gap-1">
              전체 보기 <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_REQUESTS.map((req) => (
              <Link key={req.id} href={`/requests/${req.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">{getTypeLabel(req.type)}</Badge>
                      {getStatusBadge(req.status)}
                    </div>
                    <CardTitle className="text-base line-clamp-1">{req.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-primary">
                      {formatBudget(req.budget_min, req.budget_max, req.currency)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Listings ──────────────────────── */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">최신 SaaS 리스팅</h2>
            <Link href="/market" className="text-sm text-primary hover:underline flex items-center gap-1">
              전체 보기 <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_LISTINGS.map((listing) => (
              <Link key={listing.id} href={`/market/${listing.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <Badge variant="outline" className="text-xs w-fit">{getCategoryLabel(listing.category)}</Badge>
                    <CardTitle className="text-base line-clamp-1">{listing.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{listing.short_desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold text-primary">
                      {formatListingPrice(listing.price_amount, listing.price_currency)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom Disclaimer ────────────────────── */}
      <section className="py-8 bg-muted/50">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground">
            {DISCLAIMER_TEXT}
          </p>
        </div>
      </section>
    </div>
  );
}
