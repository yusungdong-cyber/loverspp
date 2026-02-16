"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/");
        router.refresh();
      }
    });
  }, [router]);

  return (
    <div className="container flex items-center justify-center min-h-[60vh]">
      <p className="text-muted-foreground">인증 처리 중...</p>
    </div>
  );
}
