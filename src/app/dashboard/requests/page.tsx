"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { REQUEST_STATUSES } from "@/lib/constants";

export default function MyRequestsPage() {
  // TODO: Supabase 연결 후 실제 데이터 조회
  const requests: { id: string; title: string; status: string; created_at: string; proposal_count: number }[] = [];

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">내 요청 관리</h1>
        <Link href="/requests/new">
          <Button><Plus className="h-4 w-4 mr-2" /> 새 요청</Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">아직 작성한 요청이 없습니다</p>
            <Link href="/requests/new">
              <Button>첫 요청 작성하기</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const statusInfo = REQUEST_STATUSES.find((s) => s.value === req.status);
            return (
              <Link key={req.id} href={`/requests/${req.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{req.title}</CardTitle>
                      <Badge className={statusInfo?.color}>{statusInfo?.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>제안 {req.proposal_count}개</span>
                      <span>{req.created_at}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
