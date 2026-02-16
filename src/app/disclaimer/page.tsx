import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DISCLAIMER_TEXT } from "@/lib/constants";

export default function DisclaimerPage() {
  return (
    <div className="container max-w-3xl py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <CardTitle className="text-2xl">면책조항</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">최종 수정일: 2026년 2월 16일</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 font-medium">
            {DISCLAIMER_TEXT}
          </div>

          <section>
            <h3 className="text-lg font-semibold mb-2">플랫폼의 역할</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              VibeExchange는 바이브코딩 프로젝트의 거래 및 제작 요청을 위한 <strong>정보 제공 플랫폼</strong>입니다.
              우리는 판매자와 구매자를 연결하는 역할만 수행하며, 거래 자체에 직접 개입하지 않습니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">보증하지 않는 사항</h3>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
              <li><strong>거래 안전성:</strong> 플랫폼은 에스크로 서비스를 제공하지 않으며, 자금을 보관하지 않습니다</li>
              <li><strong>프로젝트 품질:</strong> 등록된 프로젝트의 기능, 성능, 보안을 검증하지 않습니다</li>
              <li><strong>수익 보장:</strong> 리스팅에 기재된 매출, 사용자 수 등의 수치를 검증하지 않습니다</li>
              <li><strong>사용자 신원:</strong> 판매자 또는 구매자의 신원, 자격, 능력을 확인하지 않습니다</li>
              <li><strong>법적 준수:</strong> 등록된 프로젝트의 법적 적합성을 검토하지 않습니다</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">이용자의 책임</h3>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
              <li>거래 전 상대방과 충분히 소통하고 조건을 명확히 합의하세요</li>
              <li>프로젝트 인수 전 데모를 확인하고, 가능하면 코드 리뷰를 진행하세요</li>
              <li>대금 지급 전 안전 거래 체크리스트를 확인하세요</li>
              <li>모든 합의 내용을 문서(채팅, 이메일 등)로 기록하세요</li>
              <li>분쟁 발생 시 당사자 간 해결이 원칙입니다</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">수수료 안내</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SaaS 거래소를 통한 거래 시 거래 금액의 5%가 플랫폼 수수료로 부과됩니다.
              이 수수료는 플랫폼 운영 및 유지를 위한 것이며, 거래 보증이나 보호 서비스의 대가가 아닙니다.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
