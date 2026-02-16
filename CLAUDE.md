# CLAUDE.md

이 파일은 **loverspp (LoversPick)** 저장소에서 작업하는 AI 어시스턴트를 위한 가이드입니다.

---

## 프로젝트 개요

**LoversPick**은 서울 여행 컨시어지 서비스의 MVP 랜딩 웹사이트입니다. 서울에 거주하는 현지인이 Telegram/WhatsApp 채팅을 통해 여행자에게 실시간 1:1 도움을 제공하는 서비스입니다.

> "No tourist traps. No rip-offs. Just Seoul, done right."

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router, Turbopack) | 16.1.6 |
| UI 라이브러리 | React | 19.2.3 |
| 스타일링 | Tailwind CSS v4 (`@tailwindcss/postcss`) | ^4 |
| 언어 | TypeScript (strict 모드) | ^5 |
| 린터 | ESLint v9 (flat config) | ^9 |
| 배포 | Vercel (zero-config) | — |

**외부 UI 라이브러리, 테스트 프레임워크, ORM, 상태관리 라이브러리 없음** — 의도적으로 최소한의 의존성을 유지하고 있음.

## 프로젝트 구조

```
loverspp/
├── .claude/
│   ├── hooks/
│   │   └── add-date.sh          # PreToolUse 훅: Claude Code 컨텍스트에 현재 날짜 주입
│   └── settings.json            # Claude Code 로컬 설정 (훅 설정)
├── .gitignore                   # Next.js 표준 .gitignore
├── CLAUDE.md                    # AI 어시스턴트 가이드 (이 파일)
├── README.md                    # 프로젝트 전체 문서
├── eslint.config.mjs            # ESLint v9 flat config (Next.js + TypeScript)
├── next.config.ts               # Next.js 설정 (기본값)
├── package.json                 # 프로젝트 매니페스트
├── postcss.config.mjs           # PostCSS 설정 (Tailwind CSS v4 플러그인)
├── tsconfig.json                # TypeScript 설정 (strict, 경로 별칭)
├── vercel.json                  # Vercel 배포 설정
└── src/
    ├── app/
    │   ├── api/lead/route.ts    # POST /api/lead — 리드 캡처 API
    │   ├── privacy/page.tsx     # /privacy — 개인정보처리방침
    │   ├── terms/page.tsx       # /terms — 이용약관
    │   ├── favicon.ico          # 파비콘
    │   ├── globals.css          # Tailwind v4 테마 토큰 + 글로벌 스타일
    │   ├── layout.tsx           # 루트 레이아웃 (SEO 메타데이터 + LangProvider)
    │   └── page.tsx             # 홈페이지 (모든 랜딩 섹션 조합)
    ├── components/
    │   ├── Benefits.tsx         # "독점 혜택" 섹션 (파트너 6개 특전)
    │   ├── FAQ.tsx              # 아코디언 FAQ
    │   ├── Footer.tsx           # 푸터 (네비게이션 + WhatsApp CTA)
    │   ├── Header.tsx           # 고정 헤더, 모바일 메뉴, 언어 토글
    │   ├── Hero.tsx             # 히어로 섹션 (헤드라인 + CTA)
    │   ├── HowItWorks.tsx       # 3단계 프로세스 섹션
    │   ├── LeadCapture.tsx      # 이메일/핸들 리드 폼 (GDPR 동의)
    │   ├── Pricing.tsx          # 요금제 카드 3개 + 프리미엄 애드온
    │   ├── Testimonials.tsx     # 후기 카드 6개 + "As Seen On" 미디어 로고
    │   ├── WhatWeHelp.tsx       # 서비스 그리드 (6개 카테고리)
    │   └── WhyNotAI.tsx         # AI vs 현지인 비교 테이블
    └── lib/
        ├── LangContext.tsx      # React Context 기반 EN/JA 언어 토글
        ├── analytics.ts         # GTM 호환 이벤트 추적 헬퍼 (플레이스홀더)
        ├── config.ts            # 단일 진실 공급원: 모든 콘텐츠, 가격, CTA
        └── i18n.ts              # EN/JA 문자열 맵 + t() 조회 헬퍼
```

## 빌드 & 실행 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm start            # 프로덕션 서버 시작
npm run lint         # ESLint 실행
```

## 핵심 아키텍처 패턴

### 콘텐츠 관리

- **모든 편집 가능한 콘텐츠**는 `src/lib/config.ts` 한 파일에 집중되어 있음
  - 가격 (`PLANS`, `PREMIUM_ADDON`)
  - CTA 링크 (`CTA` 객체)
  - 혜택 (`BENEFITS`)
  - 후기 (`TESTIMONIALS`)
  - FAQ (`FAQ_ITEMS`)
- 컴포넌트를 수정하지 않고도 콘텐츠 변경 가능

### 다국어 (i18n)

- `src/lib/i18n.ts`에서 EN/JA 문자열 맵 관리
- `t(key, lang)` 함수로 문자열 조회
- `src/lib/LangContext.tsx`의 React Context로 언어 상태 전역 관리
- 현재 **영어(EN)**, **일본어(JA)** 2개 언어 지원

### 리드 캡처

- `src/app/api/lead/route.ts`에서 POST 요청 처리
- 현재 로컬 JSON 파일(`data/leads.json`, gitignore됨)에 저장
- 프로덕션 전에 CRM으로 교체 필요

### 스타일링

- Tailwind CSS v4 사용 (`@tailwindcss/postcss` 플러그인)
- 테마 토큰은 `src/app/globals.css`에 정의
- 시스템 폰트 스택 사용 (외부 폰트 요청 없음)
- 모바일 퍼스트 설계

### 경로 별칭

- `@/*` → `./src/*` (tsconfig.json에서 설정)

## Git 워크플로

- **기본 브랜치:** `master`
- AI 어시스턴트가 만드는 피처 브랜치: `claude/<설명>` 패턴
- 커밋 메시지는 **왜** 변경했는지를 설명할 것
- 커밋 하나에 하나의 논리적 변경만 포함

## 개발 환경

**WSL2 (Ubuntu)** 위에서 개발:

- **프로젝트 경로:** `~/projects/loverspp` (WSL2 네이티브 파일시스템)
- **Node.js:** nvm으로 관리 (LTS 버전)
- **Claude Code:** `npm install -g @anthropic-ai/claude-code`로 전역 설치
- **에디터:** VS Code + Remote - WSL 확장 (선택)

```bash
wsl                            # Windows에서 Ubuntu 열기
cd ~/projects/loverspp         # 프로젝트로 이동
claude                         # Claude Code 실행
```

## 테스트

**현재 테스트 프레임워크 미설정.** Jest, Vitest, Playwright, Cypress 등 테스트 도구가 아직 없음. 향후 추가 필요.

## CI/CD

**현재 CI/CD 파이프라인 미설정.** GitHub Actions 등 없음. Vercel CLI 또는 GitHub 연동으로 배포.

```bash
vercel              # 프리뷰 배포
vercel --prod       # 프로덕션 배포
```

## 출시 전 체크리스트

아직 완료되지 않은 항목들:

- [ ] Telegram 봇 링크 — `CTA.telegram` in `src/lib/config.ts`
- [ ] 패스 구매 링크 — `CTA.buyPass` in `src/lib/config.ts`
- [ ] WhatsApp 번호 — `CTA.whatsapp` in `src/lib/config.ts`
- [ ] OG 이미지 — `/public/og-image.png` (1200x630)
- [ ] 파비콘 교체 — `/public/favicon.ico`
- [ ] 도메인 설정 — `SITE.url` in `src/lib/config.ts`
- [ ] 이메일 주소 업데이트
- [ ] 애널리틱스 (GTM 또는 실제 SDK로 `analytics.ts` 교체)
- [ ] 리드 저장소 (로컬 JSON → CRM)
- [ ] 법적 페이지 실제 법률 검토
- [ ] 일본어 번역 완성
- [ ] 후기를 실제 리뷰로 교체
- [ ] "As seen on" 로고를 실제 미디어 로고로 교체

## 리서치 우선 규칙 (필수)

**코드를 한 줄이라도 작성하기 전에 반드시 아래 리서치 파이프라인을 완료할 것.**

### 리서치 파이프라인

| 순서 | 소스 | 용도 | 도구 |
|------|------|------|------|
| 1 | **Context7** | 공식 문서·API 레퍼런스 조회 | Context7 MCP |
| 2 | **Web Search** | 최신 릴리스·변경사항·커뮤니티 솔루션 확인 | WebSearch |
| 3 | **Jina Reader** | 특정 URL 원문 정독이 필요할 때 | Jina MCP |

### 교차 검증 규칙

- 최소 **3개 소스**에서 정보를 수집하고 교차 검증한 후에만 코드 작성에 착수한다
- 소스 간 정보가 충돌하면 **공식 문서(Context7) > 최신 웹 결과 > 기타** 순으로 우선한다
- 검증 결과를 코드 작성 전에 사용자에게 간략히 요약 보고한다

### Context7 MCP 설치 (필수)

Context7이 아직 설치되지 않았다면 `.claude/settings.json`(또는 `~/.claude/settings.json`)에 추가:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

설치 확인: Claude Code 실행 후 `/mcp` 명령으로 context7 서버가 연결되었는지 확인한다.

### 위반 시

- 리서치 없이 작성한 코드는 신뢰할 수 없으므로, 사용자가 리서치 증거를 요구할 수 있다
- 확실하지 않은 API나 라이브러리 사용법은 **추측하지 말고 반드시 조회**한다

## AI 어시스턴트 규칙

- **리서치 우선:** 위의 리서치 우선 규칙을 반드시 준수한다
- **읽기 먼저:** 기존 파일을 수정하기 전에 반드시 먼저 읽는다
- **최소한의 변경:** 직접 요청받았거나 명백히 필요한 변경만 수행한다
- **과도한 설계 금지:** 요청 범위를 넘는 추상화, 유틸리티, 기능을 추가하지 않는다
- **보안:** 취약점(인젝션, XSS 등)을 도입하지 않으며, 비밀 정보나 인증 정보를 절대 커밋하지 않는다
- **이 파일 업데이트:** 프로젝트에 중요한 결정(프레임워크 변경, 빌드 시스템 설정 등)이 있으면 이 CLAUDE.md를 갱신한다
- **콘텐츠 수정 시:** 컴포넌트 파일이 아닌 `src/lib/config.ts`와 `src/lib/i18n.ts`를 수정한다
- **"할인" 용어 금지:** 브랜드 규칙에 따라 "Exclusive Benefits / Free Extras / Upgrades"로 표현한다
