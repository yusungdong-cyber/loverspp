# Jeju 3D Treasure Hunt Web Game

제주도를 테마로 한 웹 기반 3D 보물찾기 이벤트 프로젝트입니다.

## 주요 기능

- Three.js 기반 로우폴리 파스텔 3D 맵
- 3개 탐험 존: 해변 / 감귤밭 / 돌담 카페거리
- 데스크톱(WASD/방향키) + 모바일(터치 패드) 이동
- 숨겨진 4자리 경품 코드 탐색
- 힌트 버튼(대략적인 위치만 안내)
- 탐험 타이머
- 성공 모달 + 이벤트 페이지 링크 연동
- 로컬/세션 스토리지 기반 기본 중복 방지

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 구조

- `src/app/page.tsx` — 게임 진입 페이지
- `src/components/jeju-game/App.tsx` — 게임 상태/흐름 관리
- `src/components/jeju-game/GameScene.tsx` — Three.js 씬과 맵 렌더링
- `src/components/jeju-game/PlayerController.ts` — 키보드/모바일 이동 입력
- `src/components/jeju-game/CodeObject.ts` — 코드 숨김 위치 데이터
- `src/components/jeju-game/HintSystem.ts` — 힌트 문구 로직
- `src/components/jeju-game/UIOverlay.tsx` — 타이머/힌트 UI
- `src/components/jeju-game/SuccessModal.tsx` — 코드 발견 성공 모달

## 커스터마이징 포인트

### 1) 경품 코드 변경
`src/components/jeju-game/App.tsx`

- `FIXED_CODE` 값을 4자리 문자열로 설정하면 고정 코드 사용
- `null`이면 세션마다 랜덤 생성

### 2) 이벤트 URL 변경
`src/components/jeju-game/App.tsx`

- `EVENT_URL` 값을 실제 이벤트 페이지 주소로 변경
- 성공 시 `?code=1234` 쿼리 파라미터로 전달

### 3) 힌트 문구 변경
`src/components/jeju-game/HintSystem.ts`

- `HINTS` 배열 텍스트 수정

### 4) 맵 오브젝트/숨김 위치 변경
`src/components/jeju-game/GameScene.tsx`

- zone/rock/tree/cafe/dol 생성 블록에서 오브젝트 수정

`src/components/jeju-game/CodeObject.ts`

- `CODE_SPOTS` 배열에서 코드 위치/라벨 수정
