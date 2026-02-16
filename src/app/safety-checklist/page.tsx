import { Shield, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DISCLAIMER_TEXT } from "@/lib/constants";

const BUYER_CHECKLIST = [
  "판매자 프로필과 등록 이력을 확인했습니다",
  "데모 URL을 직접 확인하고 기능을 테스트했습니다",
  "기술 스택과 코드 품질에 대해 질문했습니다",
  "매출/사용자 수치에 대한 근거(스크린샷 등)를 요청했습니다",
  "인도 방법과 범위를 명확히 합의했습니다",
  "유지보수/기술 지원 조건을 확인했습니다",
  "결제 조건과 환불 정책을 합의했습니다",
  "모든 합의 내용을 채팅/이메일로 기록했습니다",
  "제3자 에스크로 서비스 이용을 고려했습니다",
  "이 플랫폼이 거래를 보증하지 않음을 이해했습니다",
];

const SELLER_CHECKLIST = [
  "프로젝트 설명을 정확하고 솔직하게 작성했습니다",
  "데모 URL이 정상적으로 작동하는지 확인했습니다",
  "가격 산정 근거를 설명할 준비가 되었습니다",
  "인도 범위(코드, 도메인, 계정 등)를 명확히 했습니다",
  "인수 후 기술 지원 범위를 명시했습니다",
  "결제 방식을 설정하고 테스트했습니다",
  "프로젝트에 사용된 라이선스를 확인했습니다",
  "타인의 지적재산권을 침해하지 않음을 확인했습니다",
  "구매자의 합리적인 질문에 답변할 준비가 되었습니다",
  "이 플랫폼이 거래를 보증하지 않음을 이해했습니다",
];

const REQUESTER_CHECKLIST = [
  "요구사항을 최대한 구체적으로 작성했습니다",
  "예산 범위를 현실적으로 설정했습니다",
  "참고 URL로 원하는 스타일을 명확히 했습니다",
  "제안서를 꼼꼼히 비교하고 포트폴리오를 확인했습니다",
  "작업 범위와 일정을 명확히 합의했습니다",
  "수정 횟수와 추가 비용 조건을 확인했습니다",
  "결제 방식과 일정을 합의했습니다",
  "모든 합의 내용을 기록으로 남겼습니다",
];

function ChecklistSection({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function SafetyChecklistPage() {
  return (
    <div className="container max-w-3xl py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">안전 거래 체크리스트</h1>
        <p className="text-muted-foreground">거래 전 아래 항목을 반드시 확인하세요</p>
      </div>

      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 font-medium mb-8">
        {DISCLAIMER_TEXT}
      </div>

      <div className="space-y-6">
        <ChecklistSection title="구매자 체크리스트" items={BUYER_CHECKLIST} icon={<Shield className="h-5 w-5 text-blue-600" />} />
        <ChecklistSection title="판매자 체크리스트" items={SELLER_CHECKLIST} icon={<Shield className="h-5 w-5 text-green-600" />} />
        <ChecklistSection title="제작 요청자 체크리스트" items={REQUESTER_CHECKLIST} icon={<Shield className="h-5 w-5 text-purple-600" />} />
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>이 체크리스트는 참고용이며 법적 조언을 대체하지 않습니다.</p>
        <p>중요한 거래 시 법률 전문가의 조언을 받으시기 바랍니다.</p>
      </div>
    </div>
  );
}
