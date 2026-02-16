"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditListingPage() {
  const params = useParams();

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">리스팅 수정</CardTitle>
          <CardDescription>리스팅 ID: {params.id}</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Supabase 연결 후 기존 리스팅 데이터를 불러와 수정할 수 있습니다.
          </p>
          <Link href="/market">
            <Button variant="outline">거래소로 돌아가기</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
