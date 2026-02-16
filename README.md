# VibeExchange — 바이브코딩 거래소

> 바이브코딩으로 만들고, 사고, 의뢰하세요.

바이브코딩 프로젝트의 제작 의뢰와 SaaS 거래를 위한 MVP 웹 플랫폼입니다.

## 두 가지 핵심 플로우

### Flow A: 홈페이지 제작 요청
- 바이어가 웹사이트/랜딩 페이지 제작을 요청
- 크리에이터들이 제안서를 보내고 바이어가 선택
- 현재 수수료 없음

### Flow B: SaaS 거래소
- 바이브코딩으로 만든 SaaS/프로젝트를 등록 및 거래
- 구매자와 판매자 간 직접 거래
- 플랫폼 수수료: 5%

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript (strict) |
| 스타일링 | Tailwind CSS + shadcn/ui |
| 인증/DB | Supabase (Auth + Postgres + Storage) |
| 결제 | Stripe Connect (선택, 피처플래그) |
| 배포 | Vercel |

## 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local`을 수정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase 설정

1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/001_initial.sql` 실행
3. Authentication > Settings에서 이메일 인증 설정

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

### 5. (선택) 시드 데이터

```bash
# .env.local에 SUPABASE_SERVICE_ROLE_KEY 추가 필요
npm run seed
```

테스트 계정:
- `buyer@test.com` / `test1234`
- `seller@test.com` / `test1234`
- `creator@test.com` / `test1234`

## 명령어

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm start        # 프로덕션 서버
npm run lint     # ESLint
npm run seed     # 시드 데이터
```

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                    # 홈 (두 가지 플로우)
│   ├── (auth)/login/page.tsx       # 로그인
│   ├── (auth)/signup/page.tsx      # 회원가입
│   ├── requests/                   # Flow A: 제작 요청
│   │   ├── page.tsx                # 요청 게시판
│   │   ├── new/page.tsx            # 새 요청 작성
│   │   └── [id]/
│   │       ├── page.tsx            # 요청 상세
│   │       └── propose/page.tsx    # 제안서 작성
│   ├── market/                     # Flow B: SaaS 거래소
│   │   ├── page.tsx                # 리스팅 목록
│   │   └── [id]/page.tsx           # 리스팅 상세
│   ├── sell/new/page.tsx           # 판매 등록
│   ├── inbox/                      # 메시징
│   ├── deals/[dealId]/page.tsx     # 거래 상세
│   ├── dashboard/                  # 대시보드
│   ├── terms/page.tsx              # 이용약관
│   ├── disclaimer/page.tsx         # 면책조항
│   └── safety-checklist/page.tsx   # 안전 거래 체크리스트
├── components/
│   ├── ui/                         # shadcn/ui 컴포넌트
│   ├── layout/                     # Header, Footer
│   └── shared/                     # DisclaimerCheckbox
├── lib/
│   ├── supabase/                   # Supabase 클라이언트
│   ├── types/database.ts           # TypeScript 타입
│   ├── constants.ts                # 상수 및 설정
│   └── utils.ts                    # 유틸리티 함수
└── middleware.ts                   # Supabase 세션 갱신

supabase/
└── migrations/
    └── 001_initial.sql             # DB 스키마 + RLS
```

## 데이터베이스 스키마

- **profiles** — 사용자 프로필 (회원가입 시 자동 생성)
- **requests** — 제작 요청 (Flow A)
- **proposals** — 요청에 대한 제안서
- **listings** — SaaS 리스팅 (Flow B)
- **listing_images** — 리스팅 이미지
- **threads** — 메시지 스레드
- **messages** — 메시지
- **deals** — 거래 기록
- **reports** — 신고

모든 테이블에 Row Level Security(RLS)가 적용되어 있습니다.

## 리스크 최소화 원칙

- 에스크로, 자금 보관 없음
- "보증", "안전 거래" 등의 표현 사용하지 않음
- 모든 거래 관련 페이지에 면책조항 표시
- 거래 시작 전 면책조항 동의 체크박스 필수
- 안전 거래 체크리스트 제공 (법적 조언 아님)
- 플랫폼 수수료는 정보 중개 서비스의 대가
