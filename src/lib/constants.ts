export const SITE = {
  name: "VibeExchange",
  nameKo: "바이브코딩 거래소",
  description: "바이브코딩으로 만들고, 사고, 의뢰하세요",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

export const DISCLAIMER_TEXT =
  "우리는 정보 제공 플랫폼이며 거래 책임은 당사자에게 있습니다. 본 플랫폼은 거래를 보증하거나 자금을 보관하지 않습니다.";

export const PLATFORM_FEE_RATE = 0.05; // 5%

export const REQUEST_TYPES = [
  { value: "landing", label: "랜딩 페이지" },
  { value: "website", label: "웹사이트" },
  { value: "shopify", label: "Shopify / WordPress / Custom" },
  { value: "other", label: "기타" },
] as const;

export const REQUEST_STATUSES = [
  { value: "open", label: "모집 중", color: "bg-green-100 text-green-800" },
  { value: "in_discussion", label: "협의 중", color: "bg-yellow-100 text-yellow-800" },
  { value: "closed", label: "마감", color: "bg-gray-100 text-gray-800" },
] as const;

export const LISTING_CATEGORIES = [
  { value: "saas", label: "SaaS" },
  { value: "automation", label: "자동화" },
  { value: "template", label: "템플릿" },
  { value: "micro_app", label: "마이크로앱" },
] as const;

export const LISTING_STATUSES = [
  { value: "draft", label: "임시저장", color: "bg-gray-100 text-gray-800" },
  { value: "published", label: "판매 중", color: "bg-green-100 text-green-800" },
  { value: "sold", label: "판매 완료", color: "bg-blue-100 text-blue-800" },
] as const;

export const DEAL_STATUSES = [
  { value: "initiated", label: "거래 시작" },
  { value: "negotiating", label: "협상 중" },
  { value: "paid", label: "결제 완료" },
  { value: "delivered", label: "전달 완료" },
  { value: "completed", label: "거래 완료" },
  { value: "cancelled", label: "거래 취소" },
] as const;

export const PAYMENT_METHODS = [
  { value: "stripe", label: "Stripe Connect" },
  { value: "external", label: "외부 결제 링크" },
  { value: "contact", label: "연락 후 결정" },
] as const;

export const CURRENCIES = [
  { value: "KRW", label: "₩ KRW" },
  { value: "USD", label: "$ USD" },
] as const;
