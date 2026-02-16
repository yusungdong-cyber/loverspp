"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DisclaimerCheckbox } from "@/components/shared/DisclaimerCheckbox";
import { CURRENCIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function ProposePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    price_amount: "",
    currency: "KRW",
    timeline_days: "",
    message: "",
    portfolio_urls: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return alert("면책조항에 동의해주세요.");
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("proposals").insert({
      request_id: params.id,
      creator_id: user.id,
      price_amount: parseInt(form.price_amount) || 0,
      currency: form.currency,
      timeline_days: parseInt(form.timeline_days) || 7,
      message: form.message,
      portfolio_urls: form.portfolio_urls ? form.portfolio_urls.split("\n").filter(Boolean) : null,
    });

    if (error) {
      alert("오류가 발생했습니다: " + error.message);
      setLoading(false);
      return;
    }

    router.push(`/requests/${params.id}`);
  };

  return (
    <div className="container max-w-2xl py-8">
      <Link href={`/requests/${params.id}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> 요청 상세로 돌아가기
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">제안서 작성</CardTitle>
          <CardDescription>이 요청에 대한 제안서를 보내주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">제안 가격 *</Label>
                <Input id="price" type="number" placeholder="0" value={form.price_amount} onChange={(e) => update("price_amount", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>통화</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.currency} onChange={(e) => update("currency", e.target.value)}>
                  {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">예상 작업 기간 (일) *</Label>
              <Input id="timeline" type="number" placeholder="7" value={form.timeline_days} onChange={(e) => update("timeline_days", e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">제안 메시지 *</Label>
              <Textarea id="message" placeholder="경험, 접근 방식, 작업 계획 등을 자유롭게 설명해주세요..." rows={6} value={form.message} onChange={(e) => update("message", e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio">포트폴리오 URL (줄바꿈으로 구분)</Label>
              <Textarea id="portfolio" placeholder="https://portfolio.example.com&#10;https://github.com/username" rows={3} value={form.portfolio_urls} onChange={(e) => update("portfolio_urls", e.target.value)} />
            </div>

            <DisclaimerCheckbox checked={agreed} onCheckedChange={setAgreed} />

            <Button type="submit" className="w-full" disabled={loading || !agreed}>
              {loading ? "전송 중..." : "제안서 보내기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
