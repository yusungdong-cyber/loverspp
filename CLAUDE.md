# CLAUDE.md

This file provides guidance for AI assistants working on the **loverspp** repository.

## Repository Status

This is a newly initialized repository. No application code, build system, or framework has been established yet. The project is at the very beginning of its lifecycle.

## Project Structure

```
loverspp/
├── CLAUDE.md       # AI assistant guidance (this file)
└── .gitkeep        # Placeholder for the initial empty repo
```

## Git Workflow

- **Default branch:** `master`
- Feature branches should follow the pattern `claude/<description>` when created by AI assistants
- Write clear, descriptive commit messages that explain *why* a change was made
- Keep commits focused — one logical change per commit

## Development Environment

This project is developed inside **WSL2 (Ubuntu)** on Windows.

- **Project path:** `~/projects/loverspp` (WSL2 native filesystem)
- **Node.js:** Managed via nvm (LTS version)
- **Claude Code:** Installed globally via `npm install -g @anthropic-ai/claude-code`
- **Editor:** VS Code with Remote - WSL extension (optional)

### Why WSL2?

- Native Linux filesystem provides significantly better I/O performance than `/mnt/c/`
- Full Linux toolchain (git, node, build-essential) available natively
- Claude Code runs as a first-class Linux CLI tool

### Quick Start

```bash
wsl                            # Open Ubuntu from Windows
cd ~/projects/loverspp         # Navigate to project
claude                         # Launch Claude Code
```

## Development Guidelines

As the project grows, update this file with:

- Language and framework choices
- Build and run commands
- Test commands and testing conventions
- Linting and formatting configuration
- Dependency management approach
- Directory structure conventions
- Code style and naming conventions
- CI/CD pipeline details

## Research-First Rule (MANDATORY)

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

## Conventions for AI Assistants

- **Research first:** 위의 Research-First Rule을 반드시 준수한다
- **Read before writing:** Always read existing files before modifying them
- **Minimal changes:** Only make changes that are directly requested or clearly necessary
- **No over-engineering:** Avoid adding abstractions, utilities, or features beyond what is asked
- **Security:** Do not introduce vulnerabilities (injection, XSS, etc.) and never commit secrets or credentials
- **Update this file:** When significant project decisions are made (framework chosen, build system configured, etc.), update this CLAUDE.md to reflect the current state
