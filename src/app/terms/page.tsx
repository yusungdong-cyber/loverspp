import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DISCLAIMER_TEXT } from "@/lib/constants";

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">이용약관</CardTitle>
          <p className="text-sm text-muted-foreground">최종 수정일: 2026년 2월 16일</p>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none space-y-6">
          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 font-medium">
            {DISCLAIMER_TEXT}
          </div>

          <section>
            <h3 className="text-lg font-semibold mb-2">제1조 (목적)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              본 약관은 VibeExchange(이하 &quot;플랫폼&quot;)가 제공하는 정보 중개 서비스의 이용에 관한 사항을 규정합니다.
              플랫폼은 바이브코딩 관련 제작 요청과 SaaS 거래를 위한 정보 제공 및 연결 서비스를 제공하며,
              거래 자체에 대한 보증, 에스크로, 자금 보관 서비스를 제공하지 않습니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">제2조 (서비스 범위)</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>제작 요청 게시판: 바이어가 웹사이트/랜딩 페이지 제작을 요청하고 크리에이터가 제안서를 보내는 게시판</li>
              <li>SaaS 거래소: 바이브코딩으로 만든 SaaS/프로젝트를 등록하고 거래하는 마켓플레이스</li>
              <li>메시징: 거래 당사자 간 커뮤니케이션 기능</li>
              <li>본 플랫폼은 거래의 성사, 품질, 완료를 보증하지 않습니다</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">제3조 (결제 및 수수료)</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>SaaS 거래소 거래 시 플랫폼 수수료 5%가 부과됩니다</li>
              <li>결제는 Stripe Connect 또는 외부 결제 링크를 통해 이루어지며, 플랫폼은 자금을 직접 보관하지 않습니다</li>
              <li>제작 요청 게시판은 현재 수수료가 없습니다</li>
              <li>환불 정책은 거래 당사자 간 합의에 따릅니다</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">제4조 (면책)</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>플랫폼은 거래 당사자 간 분쟁에 대한 법적 책임을 지지 않습니다</li>
              <li>플랫폼은 리스팅 내용의 정확성, 합법성을 보증하지 않습니다</li>
              <li>플랫폼은 거래 상대방의 신원, 신용, 능력을 보증하지 않습니다</li>
              <li>이용자는 거래 전 충분한 실사(Due Diligence)를 수행할 책임이 있습니다</li>
              <li>플랫폼은 &quot;있는 그대로(AS-IS)&quot; 제공되며, 어떤 종류의 보증도 제공하지 않습니다</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">제5조 (금지 행위)</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>허위 정보 등록 또는 사기 행위</li>
              <li>타인의 지적재산권을 침해하는 콘텐츠 등록</li>
              <li>불법 콘텐츠 또는 서비스 등록</li>
              <li>플랫폼의 정상적인 운영을 방해하는 행위</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">제6조 (연락처)</h3>
            <p className="text-sm text-muted-foreground">
              문의사항은 support@vibeexchange.kr로 연락해주세요.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
