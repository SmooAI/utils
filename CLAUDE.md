# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Use Context7 MCP server for up-to-date library documentation.**

## Project Overview

`@smooai/utils` is a shared TypeScript utility library for SmooAI services. It provides AWS Lambda error handling, Hono.js integration, human-readable Zod errors, phone validation, case-insensitive collections, file discovery, environment detection, SQS handling, and CLI utilities for git branch naming.

### Language & Toolchain

- **TypeScript** — pnpm, tsup

---

## 1. Build, Test, and Development Commands

```bash
pnpm install              # Install dependencies
pnpm build                # Build package via tsup
pnpm test                 # Run Vitest tests
pnpm typecheck            # TypeScript type checking
pnpm lint                 # ESLint
pnpm format               # Auto-format code
pnpm format:check         # Check formatting without fixing
pnpm check-all            # Full CI parity (typecheck, lint, test, build)
pnpm pre-commit-check     # Quick pre-commit validation
```

### Utility Scripts

```bash
pnpm create-entry-points  # Auto-generates tsup config + package.json exports from src/
pnpm aibranch             # AI-powered git branch naming from Jira ticket
```

---

## 2. Git Workflow — Worktrees

### Working directory structure

All work happens from `~/dev/smooai/`. The main worktree is at `~/dev/smooai/utils/`. Feature worktrees live alongside it:

```
~/dev/smooai/
├── utils/                               # Main worktree (ALWAYS on main)
├── utils-SMOODEV-XX-short-desc/         # Feature worktree
└── ...
```

**IMPORTANT:** `~/dev/smooai/utils/` must ALWAYS stay on the `main` branch. **Never do feature work directly on main.** All feature work goes in worktrees.

### Branch naming

Always prefix with the Jira ticket number:

```
SMOODEV-XX-short-description
```

### Commit messages

Always prefix with the Jira ticket. Explain **why**, not just what:

```
SMOODEV-XX: Extract phone validation into reusable utility
```

### Creating a worktree

```bash
cd ~/dev/smooai/utils
git worktree add ../utils-SMOODEV-XX-short-desc -b SMOODEV-XX-short-desc main

cd ../utils-SMOODEV-XX-short-desc
pnpm install
```

### Merging to main

```bash
cd ~/dev/smooai/utils
git checkout main && git pull --rebase
git merge SMOODEV-XX-short-desc --no-ff
git push
```

### Cleanup after merge

```bash
git worktree remove ~/dev/smooai/utils-SMOODEV-XX-short-desc
git branch -d SMOODEV-XX-short-desc
```

---

## 3. Coding Style

- ESLint + Prettier, 4-space indentation, trailing commas, 160-character line width
- Organized imports
- Run `pnpm format` before committing

---

## 4. Testing Guidelines

- Vitest, colocated as `*.test.ts`
- Every batch of work MUST include unit tests
- All tests must pass before landing code

---

## 5. Entry Points

This package uses auto-generated entry points. When adding new modules under `src/`, run:

```bash
pnpm create-entry-points
```

This regenerates the tsup config and package.json exports map based on the `src/` directory structure.

---

## 6. Changesets & Versioning

Always add changesets when `@smooai/utils` changes:

```bash
pnpm changeset
```

---

## 7. CI / GitHub Actions

CI runs on every PR: typecheck, lint, format check, test, build.

```bash
gh run list                          # List recent workflow runs
gh run view <run-id> --log-failed    # View failed step logs
```

CI must be green before merging.

---

## 8. Pre-Push Checklist

Before merging and pushing, verify:

1. `pnpm check-all` passes
2. Changeset added if needed
3. All changes committed and pushed
