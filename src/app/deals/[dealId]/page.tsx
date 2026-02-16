"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DEAL_STATUSES, DISCLAIMER_TEXT, PLATFORM_FEE_RATE } from "@/lib/constants";

const SAMPLE_DEAL = {
  id: "d1",
  listing_title: "AI 이미지 생성 SaaS",
  buyer_name: "김구매",
  seller_name: "바이브마스터",
  price_amount: 5000000,
  price_currency: "KRW",
  status: "negotiating",
  platform_fee_amount: 250000,
  created_at: "2026-02-15",
};

const DEAL_STEPS = [
  { status: "initiated", label: "거래 시작", desc: "구매자가 거래를 시작했습니다" },
  { status: "negotiating", label: "협상 중", desc: "구매자와 판매자가 조건을 조율합니다" },
  { status: "paid", label: "결제 완료", desc: "구매자가 결제를 완료했습니다" },
  { status: "delivered", label: "전달 완료", desc: "판매자가 프로젝트를 전달했습니다" },
  { status: "completed", label: "거래 완료", desc: "양측이 거래 완료를 확인했습니다" },
];

export default function DealDetailPage() {
  const params = useParams();
  const deal = SAMPLE_DEAL;
  const fmt = new Intl.NumberFormat("ko-KR");
  const symbol = deal.price_currency === "USD" ? "$" : "₩";

  const currentStepIndex = DEAL_STEPS.findIndex((s) => s.status === deal.status);

  return (
    <div className="container max-w-3xl py-8">
      <Link href="/market" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> 돌아가기
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{deal.listing_title}</CardTitle>
              <CardDescription>거래 ID: {deal.id}</CardDescription>
            </div>
            <Badge className={DEAL_STATUSES.find((s) => s.value === deal.status) ? "bg-yellow-100 text-yellow-800" : ""}>
              {DEAL_STATUSES.find((s) => s.value === deal.status)?.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">구매자</p>
              <p className="font-medium">{deal.buyer_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">판매자</p>
              <p className="font-medium">{deal.seller_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">거래 금액</p>
              <p className="text-xl font-bold text-primary">{symbol}{fmt.format(deal.price_amount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">플랫폼 수수료 (5%)</p>
              <p className="font-medium">{symbol}{fmt.format(deal.platform_fee_amount)}</p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Step progress */}
          <h3 className="font-semibold mb-4">거래 진행 상황</h3>
          <div className="space-y-4">
            {DEAL_STEPS.map((step, i) => {
              const isCompleted = i < currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={step.status} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : isCurrent ? (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/30" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isCompleted ? "text-green-700" : isCurrent ? "text-yellow-700" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator className="my-6" />

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">상태 업데이트</Button>
            <Button variant="destructive" className="flex-1">거래 취소</Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
        <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
        <p className="text-xs text-yellow-800">{DISCLAIMER_TEXT}</p>
      </div>
    </div>
  );
}
