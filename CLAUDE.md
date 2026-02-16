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

## Conventions for AI Assistants

- **Read before writing:** Always read existing files before modifying them
- **Minimal changes:** Only make changes that are directly requested or clearly necessary
- **No over-engineering:** Avoid adding abstractions, utilities, or features beyond what is asked
- **Security:** Do not introduce vulnerabilities (injection, XSS, etc.) and never commit secrets or credentials
- **Update this file:** When significant project decisions are made (framework chosen, build system configured, etc.), update this CLAUDE.md to reflect the current state
