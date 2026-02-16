"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InboxPage() {
  // TODO: Supabase 연결 후 실제 스레드 목록 조회
  const threads: { id: string; listing_title: string; other_user: string; last_message: string; updated_at: string }[] = [];

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">메시지</h1>

      {threads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">아직 메시지가 없습니다</p>
            <p className="text-sm text-muted-foreground">거래소에서 판매자에게 문의하면 여기에 대화가 표시됩니다</p>
            <Link href="/market" className="block mt-4">
              <Button variant="outline">거래소 둘러보기</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {threads.map((thread) => (
            <Link key={thread.id} href={`/inbox/${thread.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{thread.listing_title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{thread.other_user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{thread.updated_at}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{thread.last_message}</p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
