"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DisclaimerCheckbox } from "@/components/shared/DisclaimerCheckbox";
import { REQUEST_TYPES, CURRENCIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "landing",
    budget_min: "",
    budget_max: "",
    currency: "KRW",
    deadline: "",
    description: "",
    reference_urls: "",
    preferred_stack: "",
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

    const { error } = await supabase.from("requests").insert({
      owner_id: user.id,
      title: form.title,
      type: form.type,
      budget_min: parseInt(form.budget_min) || 0,
      budget_max: parseInt(form.budget_max) || 0,
      currency: form.currency,
      deadline: form.deadline || null,
      description: form.description,
      reference_urls: form.reference_urls ? form.reference_urls.split("\n").filter(Boolean) : null,
      preferred_stack: form.preferred_stack || null,
      status: "open",
    });

    if (error) {
      alert("오류가 발생했습니다: " + error.message);
      setLoading(false);
      return;
    }

    router.push("/requests");
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">새 제작 요청</CardTitle>
          <CardDescription>원하는 웹사이트를 설명해주세요. 크리에이터들이 제안서를 보내드립니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input id="title" placeholder="예: 스타트업 랜딩 페이지 제작" value={form.title} onChange={(e) => update("title", e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>유형 *</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.type} onChange={(e) => update("type", e.target.value)}>
                  {REQUEST_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>통화</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.currency} onChange={(e) => update("currency", e.target.value)}>
                  {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget_min">최소 예산</Label>
                <Input id="budget_min" type="number" placeholder="0" value={form.budget_min} onChange={(e) => update("budget_min", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget_max">최대 예산</Label>
                <Input id="budget_max" type="number" placeholder="0" value={form.budget_max} onChange={(e) => update("budget_max", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">마감일 (선택)</Label>
              <Input id="deadline" type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">상세 설명 *</Label>
              <Textarea id="description" placeholder="어떤 웹사이트를 만들고 싶은지 자세히 설명해주세요..." rows={6} value={form.description} onChange={(e) => update("description", e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference_urls">참고 URL (줄바꿈으로 구분)</Label>
              <Textarea id="reference_urls" placeholder="https://example.com&#10;https://another-example.com" rows={3} value={form.reference_urls} onChange={(e) => update("reference_urls", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_stack">선호 기술 스택 (선택)</Label>
              <Input id="preferred_stack" placeholder="예: Next.js, React, Tailwind CSS" value={form.preferred_stack} onChange={(e) => update("preferred_stack", e.target.value)} />
            </div>

            <DisclaimerCheckbox checked={agreed} onCheckedChange={setAgreed} />

            <Button type="submit" className="w-full" disabled={loading || !agreed}>
              {loading ? "등록 중..." : "요청 등록하기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
