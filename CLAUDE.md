# CLAUDE.md

이 파일은 **VibeExchange (바이브코딩 거래소)** 저장소에서 작업하는 AI 어시스턴트를 위한 가이드입니다.

---

## 프로젝트 개요

**VibeExchange**는 바이브코딩 프로젝트의 제작 의뢰와 SaaS 거래를 위한 MVP 웹 플랫폼입니다.

> "바이브코딩으로 만들고, 사고, 의뢰하세요"

두 가지 핵심 플로우:
- **Flow A (제작 요청):** 바이어가 웹사이트 제작을 요청하고 크리에이터가 제안서를 보내는 게시판
- **Flow B (SaaS 거래소):** 바이브코딩으로 만든 SaaS/프로젝트를 사고파는 마켓플레이스 (수수료 5%)

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 14.2.18 |
| UI 라이브러리 | React | ^18.3.1 |
| 스타일링 | Tailwind CSS v3 + shadcn/ui | ^3.4.17 |
| 언어 | TypeScript (strict 모드) | ^5 |
| 인증/DB | Supabase (Auth + Postgres) | ^2.47.10 |
| 린터 | ESLint v8 (next/core-web-vitals) | ^8 |
| 결제 | Stripe Connect (선택, 피처플래그) | — |
| 배포 | Vercel | — |

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                    # 홈 (두 가지 플로우 카드 + 최신 항목)
│   ├── layout.tsx                  # 루트 레이아웃 (Header + Footer)
│   ├── globals.css                 # Tailwind + shadcn 테마 CSS 변수
│   ├── (auth)/                     # 인증 (로그인, 회원가입, 콜백)
│   ├── requests/                   # Flow A: 제작 요청 게시판
│   │   ├── page.tsx                # 요청 목록 (검색 + 필터)
│   │   ├── new/page.tsx            # 새 요청 작성 폼
│   │   └── [id]/
│   │       ├── page.tsx            # 요청 상세 + 제안서 목록
│   │       └── propose/page.tsx    # 제안서 작성 폼
│   ├── market/                     # Flow B: SaaS 거래소
│   │   ├── page.tsx                # 리스팅 목록 (검색 + 필터)
│   │   └── [id]/page.tsx           # 리스팅 상세 + 거래 시작
│   ├── sell/new/page.tsx           # 판매 등록 폼
│   ├── inbox/                      # 메시징 (스레드 목록 + 대화)
│   ├── deals/[dealId]/page.tsx     # 거래 상세 (단계별 진행 상황)
│   ├── dashboard/                  # 내 요청 / 내 제안 관리
│   ├── terms/page.tsx              # 이용약관
│   ├── disclaimer/page.tsx         # 면책조항
│   └── safety-checklist/page.tsx   # 안전 거래 체크리스트
├── components/
│   ├── ui/                         # shadcn/ui (Button, Card, Input, Badge 등)
│   ├── layout/                     # Header (반응형 네비), Footer (면책조항)
│   └── shared/                     # DisclaimerCheckbox
├── lib/
│   ├── supabase/                   # client.ts, server.ts, middleware.ts
│   ├── types/database.ts           # 모든 엔티티 TypeScript 인터페이스
│   ├── constants.ts                # 사이트 설정, 상수, 열거형 (카테고리, 상태 등)
│   └── utils.ts                    # cn(), formatPrice(), formatDate()
└── middleware.ts                   # Supabase 세션 갱신

supabase/migrations/
└── 001_initial.sql                 # 10개 테이블 + 22개 RLS + 16개 인덱스

scripts/
└── seed.ts                         # 테스트 데이터 시드 스크립트
```

## 빌드 & 실행 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm start            # 프로덕션 서버 시작
npm run lint         # ESLint 실행
npm run seed         # 시드 데이터 (Supabase 연결 필요)
```

## 핵심 아키텍처 패턴

### 데이터베이스

- Supabase Postgres + Row Level Security (RLS)
- 모든 테이블에 소유자/참여자 기반 접근 제어 적용
- `profiles` 테이블: `auth.users` INSERT 트리거로 자동 생성
- `updated_at` 자동 갱신 트리거 (requests, listings, deals)

### 인증

- Supabase Auth (이메일/비밀번호)
- `@supabase/ssr`로 Next.js 14 App Router 통합
- 미들웨어에서 매 요청마다 세션 갱신
- 서버 컴포넌트: `lib/supabase/server.ts`의 `createClient()`
- 클라이언트 컴포넌트: `lib/supabase/client.ts`의 `createClient()`

### 상수 관리

- `src/lib/constants.ts`에 모든 설정값 집중
  - 카테고리, 상태, 결제 방식 등 열거형
  - 면책조항 텍스트 (`DISCLAIMER_TEXT`)
  - 플랫폼 수수료율 (`PLATFORM_FEE_RATE = 0.05`)

### 경로 별칭

- `@/*` → `./src/*` (tsconfig.json)

## 리스크 최소화 규칙 (필수)

- **에스크로/자금 보관 절대 금지**
- **"보증", "verified", "guaranteed", "safe escrow" 등의 표현 사용 금지**
- 모든 거래 관련 페이지에 면책조항(`DISCLAIMER_TEXT`) 표시
- 거래/등록/요청 시 `DisclaimerCheckbox` 동의 필수
- 플랫폼 역할은 "정보 제공 및 연결"에 한정

## Git 워크플로

- **기본 브랜치:** `master`
- AI 어시스턴트 피처 브랜치: `claude/<설명>` 패턴
- 커밋 메시지: **왜** 변경했는지 한글로 설명

## 개발 환경

**WSL2 (Ubuntu)** 위에서 개발:

- **Node.js:** nvm으로 관리 (LTS 버전)
- **Claude Code:** `npm install -g @anthropic-ai/claude-code`
- **에디터:** VS Code + Remote - WSL (선택)

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
- **이 파일 업데이트:** 프로젝트에 중요한 결정이 있으면 CLAUDE.md 갱신
