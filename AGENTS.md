# Repository Guidelines

## Project Structure & Module Organization
This repository has two main workspaces:
- `e2e/`: Playwright-based end-to-end automation, test data, page modules, selectors, and generation scripts.
- `dv-frontend-backend/`: Nuxt 3 + TypeScript application (UI, server API, Prisma, and unit tests).

Key paths:
- `e2e/tests/`: Functional specs (`*.spec.ts`) grouped by domain (`annotation/`, `qc-workflow/`, `session-management/`, etc.).
- `e2e/pages/`, `e2e/selectors/`, `e2e/fixtures/`: Reusable test abstractions.
- `dv-frontend-backend/server/`: services, tRPC routers, and infrastructure layers.
- `dv-frontend-backend/prisma/`: schema and migrations.

## Build, Test, and Development Commands
Run from repository root (`Dataverse_v4`):
- `npm test`: execute full Playwright suite.
- `npm run test:chrome`: run E2E tests on Chromium.
- `npm run test:headed`: run E2E tests with browser UI.
- `npm run generate-tests`: generate spec scaffolding from Excel requirements.

Run from `dv-frontend-backend/`:
- `npm install`: install app dependencies.
- `npm run dev`: start Nuxt dev server.
- `npm run build`: create production build.
- `npm run lint` / `npm run lint:fix`: validate/fix lint issues.
- `npm run test:unit`: run Vitest unit tests.
- `npx prisma migrate dev`: apply local schema migrations.

## Coding Style & Naming Conventions
- Language: TypeScript for app and test code.
- Linting: ESLint (`@antfu/eslint-config`) with `lint-staged` auto-fixing on commit.
- Keep naming aligned with current patterns:
  - E2E files: `SRS-<id>-SDS-<id>.spec.ts` under `URS-...` folders.
  - Unit tests: `*.test.ts` near routers/services (for example, `server/trpc/routers/project.test.ts`).
- Prefer small, domain-focused modules (`*.service.ts`, `*.repository.ts`, `*.module.ts`).

## Testing Guidelines
- E2E framework: Playwright (`@playwright/test`).
- Unit framework: Vitest (`jsdom` environment, JSON + verbose reporters).
- Add or update tests with every behavior change:
  - API/service changes: add `*.test.ts` in `dv-frontend-backend/server/...`.
  - Workflow/UI behavior: add `*.spec.ts` in the matching `e2e/tests/<domain>/` folder.

## Commit & Pull Request Guidelines
- Current commit history uses short, imperative subjects (for example, `Update gitignore`, `solve the Auth0 captcha bypass`).
- Recommended commit format: `<area>: <imperative summary>` (example: `e2e: add QC workflow rejection coverage`).
- PRs should include:
  - clear scope and impacted modules,
  - linked task/issue ID,
  - test evidence (`npm run test:chrome`, `npm run test:unit`),
  - screenshots/video for UI or Playwright flow changes when relevant.
