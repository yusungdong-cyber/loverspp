@echo off
chcp 65001 >nul 2>&1
title WP AutoProfit AI - 원클릭 실행
color 0A

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║     WP AutoProfit AI - 원클릭 실행       ║
echo  ╚══════════════════════════════════════════╝
echo.

:: ─── Node.js 확인 ───
where node >nul 2>&1
if errorlevel 1 (
    echo [!] Node.js가 설치되어 있지 않습니다.
    echo     https://nodejs.org 에서 LTS 버전을 설치해주세요.
    echo.
    echo     설치 후 이 파일을 다시 실행하세요.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Node.js %NODE_VER% 감지됨

:: ─── 프로젝트 디렉토리로 이동 ───
cd /d "%~dp0"

:: ─── .env 파일 확인/생성 ───
if not exist ".env" (
    echo [..] .env 파일 생성 중...
    (
        echo # --- Database (SQLite - 자동 생성됨) ---
        echo DATABASE_URL="file:./prisma/dev.db"
        echo.
        echo # --- Auth ---
        echo JWT_SECRET="wp-autoprofit-jwt-secret-key-min-32chars!"
        echo.
        echo # --- OpenAI (선택 - Settings 페이지에서 설정 가능) ---
        echo OPENAI_API_KEY="sk-placeholder-set-your-real-key"
        echo.
        echo # --- Encryption ---
        echo ENCRYPTION_KEY="a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"
        echo.
        echo # --- Rate Limiting ---
        echo RATE_LIMIT_MAX=100
        echo RATE_LIMIT_WINDOW_MS=60000
        echo.
        echo # --- App ---
        echo NEXT_PUBLIC_APP_URL="http://localhost:3000"
        echo NEXT_PUBLIC_APP_NAME="WP AutoProfit AI"
    ) > .env
    echo [OK] .env 파일 생성 완료
)

:: ─── 의존성 설치 ───
if not exist "node_modules" (
    echo [..] 패키지 설치 중... (처음 한 번만 실행됩니다)
    call npm install
    if errorlevel 1 (
        echo [!] 패키지 설치 실패
        pause
        exit /b 1
    )
    echo [OK] 패키지 설치 완료
) else (
    echo [OK] 패키지 이미 설치됨
)

:: ─── Prisma Client 생성 ───
echo [..] Prisma Client 생성 중...
call npx prisma generate >nul 2>&1
echo [OK] Prisma Client 준비 완료

:: ─── SQLite DB 생성 ───
if not exist "prisma\dev.db" (
    echo [..] 데이터베이스 생성 중...
    call npx prisma db push --accept-data-loss >nul 2>&1
    echo [OK] 데이터베이스 생성 완료

    echo [..] 데모 데이터 시드 중...
    call npx tsx prisma/seed.ts 2>nul
    echo [OK] 데모 데이터 준비 완료
    echo.
    echo     데모 계정: demo@wpautoprofit.ai / demo1234
) else (
    echo [OK] 데이터베이스 이미 존재함
)

echo.
echo ──────────────────────────────────────────
echo  서버를 시작합니다...
echo  브라우저에서 http://localhost:3000 으로 접속하세요!
echo  종료: 이 창을 닫거나 Ctrl+C
echo ──────────────────────────────────────────
echo.

:: ─── 2초 후 브라우저 자동 열기 ───
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

:: ─── 개발 서버 실행 ───
call npm run dev
