import Link from "next/link";
import { Zap } from "lucide-react";
import { DISCLAIMER_TEXT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8">
        {/* Disclaimer banner */}
        <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
          {DISCLAIMER_TEXT}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-2">
              <Zap className="h-5 w-5 text-primary" />
              VibeExchange
            </div>
            <p className="text-sm text-muted-foreground">
              바이브코딩으로 만들고, 사고, 의뢰하세요.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">서비스</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/requests" className="hover:text-foreground transition-colors">제작 요청</Link></li>
              <li><Link href="/market" className="hover:text-foreground transition-colors">SaaS 거래소</Link></li>
              <li><Link href="/safety-checklist" className="hover:text-foreground transition-colors">안전 거래 체크리스트</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">법적 고지</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-foreground transition-colors">이용약관</Link></li>
              <li><Link href="/disclaimer" className="hover:text-foreground transition-colors">면책조항</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} VibeExchange. 본 플랫폼은 거래를 보증하지 않습니다.
        </div>
      </div>
    </footer>
  );
}
