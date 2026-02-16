"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MyProposalsPage() {
  // TODO: Supabase 연결 후 실제 데이터 조회
  const proposals: { id: string; request_title: string; price_amount: number; currency: string; status: string; created_at: string }[] = [];

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">내 제안서 관리</h1>

      {proposals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">아직 보낸 제안서가 없습니다</p>
            <Link href="/requests">
              <Button variant="outline">요청 게시판 둘러보기</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {proposals.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{p.request_title}</CardTitle>
                  <Badge variant={p.status === "selected" ? "default" : "outline"}>
                    {p.status === "submitted" ? "검토 중" : p.status === "selected" ? "선정됨" : "미선정"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>제안가: {p.currency === "USD" ? "$" : "₩"}{new Intl.NumberFormat("ko-KR").format(p.price_amount)}</span>
                  <span>{p.created_at}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
