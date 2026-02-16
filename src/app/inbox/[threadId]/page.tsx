"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

const SAMPLE_MESSAGES = [
  { id: "m1", sender_name: "구매자", body: "안녕하세요! AI 이미지 생성 SaaS에 관심이 있습니다. 현재 월 매출이 얼마나 되나요?", is_mine: true, created_at: "2026-02-15 10:30" },
  { id: "m2", sender_name: "바이브마스터", body: "안녕하세요! 현재 월 매출 약 80만원 정도입니다. 운영비용 제외하면 순이익 약 60만원입니다.", is_mine: false, created_at: "2026-02-15 10:45" },
  { id: "m3", sender_name: "구매자", body: "기술 스택 이전은 어떻게 진행되나요?", is_mine: true, created_at: "2026-02-15 11:00" },
  { id: "m4", sender_name: "바이브마스터", body: "GitHub 리포 이전 + Vercel 프로젝트 양도 + 환경변수 문서 제공해드립니다. 인수 후 2주간 무료 기술 지원도 포함입니다.", is_mine: false, created_at: "2026-02-15 11:15" },
];

export default function ThreadDetailPage() {
  const params = useParams();
  const [newMessage, setNewMessage] = useState("");

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    // TODO: Supabase로 메시지 전송
    alert("메시지 전송: " + newMessage);
    setNewMessage("");
  };

  return (
    <div className="container max-w-3xl py-8">
      <Link href="/inbox" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> 메시지 목록
      </Link>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-lg">AI 이미지 생성 SaaS — 대화</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Messages */}
          <div className="p-4 space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto">
            {SAMPLE_MESSAGES.map((msg) => (
              <div key={msg.id} className={`flex ${msg.is_mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-lg px-4 py-2 ${msg.is_mine ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <p className="text-sm">{msg.body}</p>
                  <p className={`text-xs mt-1 ${msg.is_mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {msg.created_at}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-4 flex gap-2">
            <Input
              placeholder="메시지를 입력하세요..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
