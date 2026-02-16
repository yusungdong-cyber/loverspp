"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DisclaimerCheckbox } from "@/components/shared/DisclaimerCheckbox";
import { LISTING_CATEGORIES, CURRENCIES, PAYMENT_METHODS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "saas",
    price_amount: "",
    price_currency: "KRW",
    short_desc: "",
    long_desc: "",
    tags: "",
    demo_url: "",
    delivery_notes: "",
    maintenance_notes: "",
    payment_method: "contact",
    external_payment_url: "",
    status: "draft",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent, asDraft: boolean) => {
    e.preventDefault();
    if (!asDraft && !agreed) return alert("면책조항에 동의해주세요.");
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("listings").insert({
      seller_id: user.id,
      title: form.title,
      category: form.category,
      price_amount: parseInt(form.price_amount) || 0,
      price_currency: form.price_currency,
      short_desc: form.short_desc,
      long_desc: form.long_desc || null,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
      demo_url: form.demo_url || null,
      delivery_notes: form.delivery_notes || null,
      maintenance_notes: form.maintenance_notes || null,
      payment_method: form.payment_method,
      external_payment_url: form.external_payment_url || null,
      status: asDraft ? "draft" : "published",
    });

    if (error) {
      alert("오류가 발생했습니다: " + error.message);
      setLoading(false);
      return;
    }

    router.push("/market");
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">판매 등록</CardTitle>
          <CardDescription>바이브코딩으로 만든 프로젝트를 등록하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input id="title" placeholder="예: AI 이미지 생성 SaaS" value={form.title} onChange={(e) => update("title", e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>카테고리 *</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.category} onChange={(e) => update("category", e.target.value)}>
                  {LISTING_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>통화</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.price_currency} onChange={(e) => update("price_currency", e.target.value)}>
                  {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">가격 *</Label>
              <Input id="price" type="number" placeholder="0" value={form.price_amount} onChange={(e) => update("price_amount", e.target.value)} required />
              <p className="text-xs text-muted-foreground">플랫폼 수수료 5%가 별도 부과됩니다</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_desc">짧은 소개 *</Label>
              <Input id="short_desc" placeholder="한 줄로 프로젝트를 소개하세요" value={form.short_desc} onChange={(e) => update("short_desc", e.target.value)} required maxLength={200} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long_desc">상세 설명</Label>
              <Textarea id="long_desc" placeholder="기능, 기술 스택, 수익 현황, 이전 방법 등을 자세히 설명하세요..." rows={8} value={form.long_desc} onChange={(e) => update("long_desc", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
              <Input id="tags" placeholder="AI, SaaS, Next.js, 자동화" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo_url">데모 URL</Label>
              <Input id="demo_url" placeholder="https://demo.example.com" value={form.demo_url} onChange={(e) => update("demo_url", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_notes">인도 방법</Label>
              <Textarea id="delivery_notes" placeholder="GitHub 리포지토리 이전, 도메인 양도, 환경변수 문서 제공 등..." rows={3} value={form.delivery_notes} onChange={(e) => update("delivery_notes", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenance_notes">유지보수 안내</Label>
              <Textarea id="maintenance_notes" placeholder="인수 후 기술 지원 기간, 유지보수 계약 조건 등..." rows={3} value={form.maintenance_notes} onChange={(e) => update("maintenance_notes", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>결제 방식</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.payment_method} onChange={(e) => update("payment_method", e.target.value)}>
                  {PAYMENT_METHODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              {form.payment_method === "external" && (
                <div className="space-y-2">
                  <Label htmlFor="external_url">외부 결제 링크</Label>
                  <Input id="external_url" placeholder="https://pay.example.com" value={form.external_payment_url} onChange={(e) => update("external_payment_url", e.target.value)} />
                </div>
              )}
            </div>

            <DisclaimerCheckbox checked={agreed} onCheckedChange={setAgreed} />

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)} disabled={loading}>
                임시저장
              </Button>
              <Button type="submit" className="flex-1" disabled={loading || !agreed}>
                {loading ? "등록 중..." : "판매 등록"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
