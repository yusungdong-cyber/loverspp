# CLAUDE.md

이 파일은 **VibeExchange (바이브코딩 거래소)** 저장소에서 작업하는 AI 어시스턴트를 위한 가이드입니다.

---

## 프로젝트 개요

**VibeExchange**는 바이브코딩 프로젝트의 제작 의뢰와 SaaS 거래를 위한 MVP 웹 플랫폼입니다.

> "바이브코딩으로 만들고, 사고, 의뢰하세요"

두 가지 핵심 플로우:
- **Flow A (제작 요청):** 바이어가 웹사이트 제작을 요청하고 크리에이터가 제안서를 보내는 게시판
- **Flow B (SaaS 거래소):** 바이브코딩으로 만든 SaaS/프로젝트를 사고파는 마켓플레이스 (수수료 5%)

**현재 상태:** MVP 단계. 홈 페이지는 샘플 데이터를 하드코딩하여 표시. Supabase 환경변수 없이도 크래시 없이 동작하도록 처리됨 (클라이언트가 `null` 반환).

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 14.2.18 |
| UI 라이브러리 | React | ^18.3.1 |
| 스타일링 | Tailwind CSS v3 + shadcn/ui + tailwindcss-animate | ^3.4.17 |
| 언어 | TypeScript (strict 모드) | ^5 |
| 인증/DB | Supabase (Auth + Postgres) | ^2.47.10 (@supabase/ssr ^0.5.2) |
| 유효성 검증 | Zod | ^3.24.1 |
| 아이콘 | Lucide React | ^0.460.0 |
| UI 기본 | Radix UI (checkbox, dialog, dropdown-menu, label, select, separator, slot, tabs) | 각 ^1~2 |
| 린터 | ESLint v8 (next/core-web-vitals) | ^8 |
| 결제 | Stripe Connect (선택, 피처플래그 — 미구현) | — |
| 배포 | Vercel | — |
| Node.js | v22 (nvm 관리) | 22.22.2 |

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                       # 홈 (두 가지 플로우 카드 + 최신 항목, 샘플 데이터)
│   ├── layout.tsx                     # 루트 레이아웃 (Header + Footer, lang="ko")
│   ├── globals.css                    # Tailwind + shadcn 테마 CSS 변수 (보라색 primary)
│   ├── (auth)/                        # 인증
│   │   ├── login/page.tsx             # 로그인
│   │   ├── signup/page.tsx            # 회원가입
│   │   └── callback/page.tsx          # OAuth 콜백
│   ├── requests/                      # Flow A: 제작 요청 게시판
│   │   ├── page.tsx                   # 요청 목록 (검색 + 필터)
│   │   ├── new/page.tsx               # 새 요청 작성 폼
│   │   └── [id]/
│   │       ├── page.tsx               # 요청 상세 + 제안서 목록
│   │       └── propose/page.tsx       # 제안서 작성 폼
│   ├── market/                        # Flow B: SaaS 거래소
│   │   ├── page.tsx                   # 리스팅 목록 (검색 + 필터)
│   │   └── [id]/page.tsx              # 리스팅 상세 + 거래 시작
│   ├── sell/
│   │   ├── new/page.tsx               # 판매 등록 폼
│   │   └── [id]/edit/page.tsx         # 리스팅 수정 폼 (Supabase 연결 대기)
│   ├── inbox/                         # 메시징
│   │   ├── page.tsx                   # 스레드 목록
│   │   └── [threadId]/page.tsx        # 개별 대화
│   ├── deals/[dealId]/page.tsx        # 거래 상세 (단계별 진행 상황)
│   ├── dashboard/                     # 대시보드
│   │   ├── requests/page.tsx          # 내 요청 관리
│   │   └── proposals/page.tsx         # 내 제안 관리
│   ├── terms/page.tsx                 # 이용약관
│   ├── disclaimer/page.tsx            # 면책조항
│   └── safety-checklist/page.tsx      # 안전 거래 체크리스트
├── components/
│   ├── ui/                            # shadcn/ui 컴포넌트
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   ├── tabs.tsx
│   │   └── textarea.tsx
│   ├── layout/
│   │   ├── Header.tsx                 # 반응형 네비 (모바일 햄버거 메뉴, 인증 상태 반영)
│   │   └── Footer.tsx                 # 면책조항 배너 + 사이트맵 링크
│   └── shared/
│       └── DisclaimerCheckbox.tsx      # 면책조항 동의 체크박스 (노란색 배너)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # 브라우저용 (env 없으면 null 반환)
│   │   ├── server.ts                  # 서버 컴포넌트용 (env 없으면 null 반환)
│   │   └── middleware.ts              # 세션 갱신 (env 없으면 패스스루)
│   ├── types/database.ts              # 모든 엔티티 TypeScript 인터페이스
│   ├── constants.ts                   # 사이트 설정, 상수, 열거형
│   └── utils.ts                       # cn(), formatPrice(), formatDate(), truncate()
└── middleware.ts                      # Supabase 세션 갱신 미들웨어

supabase/migrations/
└── 001_initial.sql                    # 10개 테이블 + 27개 RLS + 16개 인덱스

scripts/
└── seed.ts                            # 테스트 데이터 시드 스크립트

.claude/
├── settings.json                      # PreToolUse 훅 설정
└── hooks/
    └── add-date.sh                    # 현재 날짜/시간 자동 주입 훅
```

## 환경 변수

`.env.local`에 설정 (`.gitignore`에 포함됨):

```
NEXT_PUBLIC_SUPABASE_URL=         # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase 익명 키
NEXT_PUBLIC_APP_URL=              # 앱 URL (기본: http://localhost:3000)
```

Supabase 환경변수가 없어도 앱이 크래시하지 않음 — 모든 Supabase 클라이언트(`client.ts`, `server.ts`, `middleware.ts`)가 `null`을 반환하거나 패스스루 처리.

## 빌드 & 실행 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm start            # 프로덕션 서버 시작
npm run lint         # ESLint 실행 (next/core-web-vitals 규칙)
npm run seed         # 시드 데이터 (npx tsx scripts/seed.ts, Supabase 연결 필요)
```

## 핵심 아키텍처 패턴

### 데이터베이스

- Supabase Postgres + Row Level Security (RLS)
- 10개 테이블: `profiles`, `requests`, `proposals`, `request_attachments`, `listings`, `listing_images`, `threads`, `messages`, `deals`, `reports`
- 27개 RLS 정책으로 소유자/참여자 기반 접근 제어
- 16개 인덱스 (status, owner/seller, created_at 등)
- `profiles` 테이블: `auth.users` INSERT 트리거(`handle_new_user`)로 자동 생성
- `updated_at` 자동 갱신 트리거: `requests`, `listings`, `deals`
- `threads` 테이블: `(listing_id, buyer_id)` 유니크 제약

### 인증

- Supabase Auth (이메일/비밀번호)
- `@supabase/ssr`로 Next.js 14 App Router 통합
- 미들웨어에서 매 요청마다 세션 갱신 (`src/middleware.ts` → `lib/supabase/middleware.ts`)
- 서버 컴포넌트: `lib/supabase/server.ts`의 `createClient()` (null 가능)
- 클라이언트 컴포넌트: `lib/supabase/client.ts`의 `createClient()` (null 가능)
- Header에서 `onAuthStateChange`로 인증 상태 실시간 반영

### 상수 관리

- `src/lib/constants.ts`에 모든 설정값 집중:
  - `SITE` — 사이트 이름, URL
  - `DISCLAIMER_TEXT` — 면책조항 텍스트
  - `PLATFORM_FEE_RATE = 0.05` (5%)
  - `REQUEST_TYPES` — landing, website, shopify, other
  - `REQUEST_STATUSES` — open, in_discussion, closed (색상 포함)
  - `LISTING_CATEGORIES` — saas, automation, template, micro_app
  - `LISTING_STATUSES` — draft, published, sold (색상 포함)
  - `DEAL_STATUSES` — initiated, negotiating, paid, delivered, completed, cancelled
  - `PAYMENT_METHODS` — stripe, external, contact
  - `CURRENCIES` — KRW, USD

### 경로 별칭

- `@/*` → `./src/*` (tsconfig.json)

### 유틸리티 (`src/lib/utils.ts`)

- `cn()` — Tailwind 클래스 병합 (clsx + tailwind-merge)
- `formatPrice(amount, currency)` — 통화 포맷 (ko-KR Intl)
- `formatDate(date)` — 날짜 포맷 (ko-KR, 년/월/일)
- `truncate(str, length)` — 문자열 자르기 + "..."

### UI 테마

- shadcn/ui 기반 CSS 변수 (`globals.css`)
- Primary 색상: 보라색 (HSL `262.1 83.3% 57.8%`)
- 다크 모드: `class` 전략 (tailwind.config.ts)으로 설정되어 있으나 현재 다크 모드 CSS 변수 미정의
- 컨테이너: `center: true`, `padding: 2rem`, max `1400px`

### next.config.js

- Supabase Storage 이미지 허용: `**.supabase.co` 리모트 패턴

## Claude Code 훅 설정

`.claude/settings.json`에 PreToolUse 훅이 설정됨:
- `add-date.sh`: 모든 도구 호출에 현재 날짜/시간을 자동 주입
- AI 어시스턴트가 항상 오늘 날짜를 인지할 수 있도록 함

## 리스크 최소화 규칙 (필수)

- **에스크로/자금 보관 절대 금지**
- **"보증", "verified", "guaranteed", "safe escrow" 등의 표현 사용 금지**
- 모든 거래 관련 페이지에 면책조항(`DISCLAIMER_TEXT`) 표시
- 거래/등록/요청 시 `DisclaimerCheckbox` 동의 필수
- 플랫폼 역할은 "정보 제공 및 연결"에 한정

## Git 워크플로

- **기본 브랜치:** `main`
- AI 어시스턴트 피처 브랜치: `claude/<설명>` 패턴
- 커밋 메시지: **왜** 변경했는지 한글로 설명

## 개발 환경

- **Node.js:** v22 (nvm 관리)
- **npm:** v10
- **Claude Code:** `npm install -g @anthropic-ai/claude-code`

## 테스트 / CI/CD

현재 미설정. 향후 추가 필요.

## 리서치 우선 규칙 (필수)

**코드를 한 줄이라도 작성하기 전에 반드시 아래 리서치 파이프라인을 완료할 것.**

| 순서 | 소스 | 용도 | 도구 |
|------|------|------|------|
| 1 | **Context7** | 공식 문서·API 레퍼런스 조회 | Context7 MCP |
| 2 | **Web Search** | 최신 릴리스·변경사항·커뮤니티 솔루션 확인 | WebSearch |
| 3 | **Jina Reader** | 특정 URL 원문 정독이 필요할 때 | Jina MCP |

- 최소 **3개 소스** 교차 검증 후 코드 작성
- 충돌 시 **공식 문서 > 최신 웹 결과 > 기타** 순으로 우선

## AI 어시스턴트 규칙

- **리서치 우선:** 위 규칙 반드시 준수
- **읽기 먼저:** 기존 파일 수정 전 반드시 읽기
- **최소한의 변경:** 요청된 것만 수행
- **보안:** 취약점/비밀정보 절대 커밋 금지
- **면책조항:** 거래 관련 기능 추가 시 반드시 면책조항 포함
- **상수 수정:** 카테고리/상태/설정 변경은 `src/lib/constants.ts`에서
- **Supabase null 처리:** Supabase 클라이언트 사용 시 `null` 반환 가능성 항상 고려
- **이 파일 업데이트:** 프로젝트에 중요한 결정이 있으면 CLAUDE.md 갱신
