"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, MessageCircle, ShoppingCart, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DisclaimerCheckbox } from "@/components/shared/DisclaimerCheckbox";
import { LISTING_CATEGORIES, PLATFORM_FEE_RATE, DISCLAIMER_TEXT } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const SAMPLE = {
  id: "1",
  title: "AI 이미지 생성 SaaS",
  category: "saas",
  price_amount: 5000000,
  price_currency: "KRW",
  short_desc: "Stable Diffusion 기반 이미지 생성 서비스. 월 500명 활성 사용자.",
  long_desc: "## 프로젝트 소개\n\nStable Diffusion API를 활용한 웹 기반 이미지 생성 서비스입니다.\n\n### 주요 기능\n- 텍스트→이미지 생성 (txt2img)\n- 이미지→이미지 변환 (img2img)\n- 스타일 프리셋 (10종)\n- 사용자 갤러리\n- 크레딧 기반 과금 시스템\n\n### 기술 스택\n- Next.js 14 + TypeScript\n- Supabase Auth & Storage\n- Replicate API (Stable Diffusion)\n- Stripe Subscriptions\n- Vercel 배포\n\n### 수익 현황\n- 월 활성 사용자: ~500명\n- 월 매출: ~₩800,000\n- 운영 비용: ~₩200,000/월 (API + 인프라)",
  tags: ["AI", "이미지", "SaaS", "Stable Diffusion", "Next.js"],
  demo_url: "https://demo.example.com",
  delivery_notes: "GitHub 리포지토리 전체 이전 + Vercel 프로젝트 양도 + 환경변수 문서 제공",
  maintenance_notes: "인수 후 2주간 무료 기술 지원. 이후 월 ₩100,000에 유지보수 계약 가능.",
  payment_method: "external",
  external_payment_url: null,
  seller_name: "바이브마스터",
  created_at: "2026-02-10",
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);

  const listing = SAMPLE;
  const catInfo = LISTING_CATEGORIES.find((c) => c.value === listing.category);
  const fmt = new Intl.NumberFormat("ko-KR");
  const symbol = listing.price_currency === "USD" ? "$" : "₩";
  const feeAmount = Math.round(listing.price_amount * PLATFORM_FEE_RATE);

  const handleStartDeal = async () => {
    if (!agreed) return alert("면책조항에 동의해주세요.");

    const supabase = createClient();
    if (!supabase) return alert("서비스 준비 중입니다.");
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    // In production, create deal + thread in Supabase
    alert("거래가 시작되었습니다! (MVP: Supabase 연결 후 실제 거래 생성)");
  };

  const handleMessage = async () => {
    const supabase = createClient();
    if (!supabase) return alert("서비스 준비 중입니다.");
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    // In production, create or find thread and redirect
    router.push("/inbox");
  };

  return (
    <div className="container max-w-5xl py-8">
      <Link href="/market" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> 거래소로 돌아가기
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{catInfo?.label}</Badge>
                <Badge className="bg-green-100 text-green-800 border-green-200">판매 중</Badge>
              </div>
              <CardTitle className="text-2xl">{listing.title}</CardTitle>
              <CardDescription>판매자: {listing.seller_name} &middot; {listing.created_at}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{listing.short_desc}</p>

              {listing.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {listing.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{tag}</span>
                  ))}
                </div>
              )}

              <Separator className="my-6" />

              {/* Long description rendered as text */}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {listing.long_desc}
              </div>
            </CardContent>
          </Card>

          {/* Delivery & Maintenance */}
          <div className="grid sm:grid-cols-2 gap-4">
            {listing.delivery_notes && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">인도 방법</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{listing.delivery_notes}</p>
                </CardContent>
              </Card>
            )}
            {listing.maintenance_notes && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">유지보수</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{listing.maintenance_notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">가격</p>
                <p className="text-3xl font-bold text-primary">{symbol}{fmt.format(listing.price_amount)}</p>
                <p className="text-xs text-muted-foreground mt-1">플랫폼 수수료 5%: {symbol}{fmt.format(feeAmount)}</p>
              </div>

              {listing.demo_url && (
                <a href={listing.demo_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" /> 데모 보기
                  </Button>
                </a>
              )}

              <Separator />

              <DisclaimerCheckbox checked={agreed} onCheckedChange={setAgreed} />

              <Button className="w-full" onClick={handleStartDeal} disabled={!agreed}>
                <ShoppingCart className="h-4 w-4 mr-2" /> 거래 시작하기
              </Button>

              <Button variant="outline" className="w-full" onClick={handleMessage}>
                <MessageCircle className="h-4 w-4 mr-2" /> 판매자에게 문의
              </Button>
            </CardContent>
          </Card>

          {/* Safety reminder */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-800 space-y-1">
                  <p className="font-semibold">안전 거래 안내</p>
                  <p>{DISCLAIMER_TEXT}</p>
                  <Link href="/safety-checklist" className="text-yellow-700 underline block mt-2">
                    안전 거래 체크리스트 보기
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
