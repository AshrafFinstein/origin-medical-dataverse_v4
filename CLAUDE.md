# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This repo has **two package roots** with separate `node_modules`:

| Path | Purpose | Commands from |
|------|---------|---------------|
| `datavaerese_frontend_&_backend/` | Main Nuxt 3 application | That directory |
| Root (`./`) | E2E Playwright test framework | Root directory |

## Project Overview

Dataverse Platform is a Nuxt 3 application for validation, grading, and clinical studies. It provides data labeling (DL) and clinical evaluation (CE) session management with role-based access control.

**Tech Stack:** Nuxt 3, tRPC, Prisma, TypeScript, Auth0, AWS S3, Tailwind CSS, Naive UI

## Development Commands

### App Setup & Dev (run from `datavaerese_frontend_&_backend/`)

```bash
npm install
docker compose -f docker-compose-db.yml up   # Start Postgres on port 5432
npx prisma generate                           # Generate Prisma client types
npx prisma migrate dev                        # Run database migrations
npx prisma db seed                            # Seed database
npm run dev                                   # Start dev server (localhost:3000)
npm run build                                 # Build for production
npm run lint                                  # Run ESLint
npm run lint:fix                              # Fix ESLint errors
npm run typecheck                             # TypeScript type checking
```

### Unit Tests (run from `datavaerese_frontend_&_backend/`)

```bash
npm run test:unit                             # Run all Vitest unit tests
npx vitest run path/to/file.test.ts           # Run specific test file
npx vitest watch                              # Run tests in watch mode
```

### E2E Tests (run from root directory)

```bash
npm run test                                  # Run all Playwright tests
npm run test:headed                           # Run in headed mode (visible browser)
npm run test:ui                               # Open Playwright UI
npm run test:debug                            # Debug specific test
npm run test:report                           # Open HTML report
npm run test:parallel                         # Run with 6 parallel workers
npm run extract-selectors                     # Extract data-testid from Vue components
npm run generate-tests                        # Generate tests from Excel
npm run generate-tests:stats                  # View test case statistics
npm run generate-tests:dry-run                # Preview test structure (no files)
```

### Prisma (run from `datavaerese_frontend_&_backend/`)

```bash
npx prisma migrate dev                        # Create and apply migration
npx prisma studio                             # Open Prisma Studio GUI
npm run prisma:migrate:dev                    # Migrate + inline for Nuxt
npm run prisma:generate                       # Generate + inline for Nuxt
```

## Architecture

### High-Level Structure

```
datavaerese_frontend_&_backend/
├── server/
│   ├── api/                          # Nuxt server routes (REST endpoints)
│   ├── trpc/                         # tRPC API layer
│   │   ├── routers/                  # tRPC routers (API endpoints)
│   │   ├── context.ts                # Request context (user session)
│   │   └── trpc.ts                   # tRPC setup, middleware, RBAC
│   ├── services/                     # Business logic layer
│   ├── infrastructures/              # Data access layer
│   │   ├── database/repositories/    # Prisma repositories
│   │   ├── auth0/repositories/       # Auth0 user management
│   │   └── cloud/repositories/       # S3 file storage
│   ├── di.ts                         # Dependency injection container (25+ repos)
│   └── logger.ts                     # Winston logger (daily rotating files → logs/)
├── pages/                            # Nuxt pages (routes)
├── components/                       # Vue components
├── composables/                      # Vue composables
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # Migration files
│   └── seed.ts                       # Seed data
└── data_migration_script/            # Legacy data migration scripts
```

### Dependency Injection

Uses `@owja/ioc`. All 25+ repositories registered in `server/di.ts`:

```typescript
import { resolve, TOKEN } from '~/server/di'
const projectRepo = resolve(TOKEN.projectRepository)
```

### tRPC API Layer

- **Routers** in `server/trpc/routers/` define API endpoints
- **`protectedProcedure`** enforces authentication + RBAC
- **`publicProcedure`** is accessible without authentication
- **Context** (`server/trpc/context.ts`) provides user session info

### Role-Based Access Control (RBAC)

Permissions enforced via `pathAbilityMap` in `server/trpc/trpc.ts`. Each tRPC route maps to a `Module` + `Action` pair. The `isAuthed` middleware checks the `roleModuleActionMapping` database table.

To add RBAC to a new route:
1. Add the route path to `pathAbilityMap` with its module and action
2. Use `protectedProcedure` instead of `publicProcedure`

### Repository Pattern

All data access goes through repository interfaces:
- **Database repositories** → Prisma Client (`server/infrastructures/database/repositories/`)
- **Auth0 repository** → user management (`server/infrastructures/auth0/repositories/`)
- **S3 repository** → file storage (`server/infrastructures/cloud/repositories/`)

### Database Transactions

Use `withTransaction` from `server/infrastructures/database/transaction.ts` to wrap multiple database operations in a Prisma transaction.

### Key Domain Concepts

- **Epic** → top-level organizational unit for projects
- **Project** → contains sessions, belongs to an epic
- **Session** → two types: Data Labeling (DL) and Clinical Evaluation (CE)
- **Label** → classification tags for DL sessions
- **Taxonomy** → hierarchical classification system for annotations
- **Structure** → anatomical/organizational definitions for CE sessions
- **ExtractedResource** → files stored in S3, linked to sessions
- **Annotation** → user annotations on taxonomies within sessions

### Client-Side

- **tRPC client** via `trpc-nuxt` plugin for type-safe API calls
- **Naive UI** component library
- **Konva** for canvas-based annotation tools
- **Tailwind CSS** for styling
- **VueUse** for Vue composition utilities

### Environment Variables

Download `.env` from the Software Team shared drive folder. Required variables are documented in `datavaerese_frontend_&_backend/.env.example` (Auth0, AWS S3, Database).

## E2E Testing Framework (Playwright)

### Architecture

```
e2e/
├── helpers/
│   ├── auth-token.helper.ts          # Token management and auto-refresh
│   ├── auth0-api-login.helper.ts     # Auth0 API authentication
│   └── captcha-solver.helper.ts      # CAPTCHA solver helper
├── fixtures/
│   ├── auth.fixture.ts               # authenticatedPage fixture
│   ├── auth-with-retry.fixture.ts    # Auth with retry logic
│   └── test-data.fixture.ts          # Auto-creates Epic+Project if missing
├── pages/                            # Page Object Model
│   ├── base.page.ts                  # Base class with 40+ common methods
│   ├── epic.page.ts                  # Epic CRUD, search, navigation
│   ├── project.page.ts              # Project CRUD, user management
│   ├── session.page.ts              # Session CRUD, codes, labels
│   ├── data-labelling.page.ts       # Annotations, visualization
│   ├── clinical-evaluation.page.ts  # Measurements, assessments
│   ├── login.page.ts                # Login page with Auth0
│   ├── dashboard.page.ts            # Dashboard page
│   └── masters/                     # Label, Annotation, Taxonomy pages
├── selectors/                       # 266+ extracted data-testid selectors
├── test-data/
│   └── test-data.ts                 # Centralized URLs, credentials, sample data, timeouts
├── scripts/
│   ├── extract-selectors.ts         # Selector extraction from Vue components
│   └── generate-tests.ts            # Test generator from Excel
├── utils/
│   ├── excel-parser.ts              # Parse test cases from Excel
│   └── test-generator.ts            # Generate spec files
├── flows/                           # Reusable test flows
├── config/                          # Configuration files
└── global-setup.ts                  # One-time browser-based Auth0 login
```

### Authentication Strategy

The framework uses **browser-based login** with CAPTCHA support:

1. **Global Setup** (`e2e/global-setup.ts`): Launches a headed browser, navigates to the app, fills Auth0 login form
2. **CAPTCHA Handling**: If CAPTCHA detected, waits 120s for manual solving
3. **State Caching**: Saves to `playwright/.auth/state.json`, reuses if < 12 hours old
4. **Shared State**: All parallel workers share the authenticated storage state

Credentials come from `datavaerese_frontend_&_backend/.env` (env vars `ADMIN_USERNAME`, `ADMIN_PASSWORD`). Auth0 tenant must have **Password Grant** enabled.

### Test Organization

Tests are organized by domain and requirement hierarchy (`URS → SRS-SDS`):

```
e2e/tests/
├── qc-workflow/URS-DV-QC-01/SRS-1-SDS-1.spec.ts
├── session-management/URS-DV-GEN-07/SRS-63-SDS-63.spec.ts
├── data-labelling/URS-DV-DL-04/SRS-33-SDS-33.spec.ts
├── annotation/URS-DV-DA-10/SRS-102-SDS-102.spec.ts
├── data-management/URS-DV-DM-11/SRS-108-SDS-108.spec.ts
├── analytics/URS-DV-AN-13/SRS-114-SDS-114.spec.ts
├── security/URS-DV-SEC-18/SRS-141-SDS-141.spec.ts
├── general/URS-DV-GEN-15/SRS-118-SDS-118.spec.ts
├── global.setup.ts                    # Test data setup project
└── examples/                          # Example tests
```

Tests are generated from `requirements-excel-file/dataverse-Testcases-V4.xlsx` (2,698 test cases).

### Writing Tests

Tests use `page` directly (auth handled by `storageState` from global setup):

```typescript
import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';

test.describe('URS-DV-QC-01: Feature description', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    sessionPage = new SessionPage(page);
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1: Test case description', async ({ page }) => {
    await sessionPage.navigateToModule();
    await sessionPage.selectFromDropdown('session-status', 'active');
    expect(page.url()).toContain('dataverse');
  });
});
```

For tests needing guaranteed test data (Epic + Project), use the `test-data.fixture.ts`:

```typescript
import { test, expect } from '../../../fixtures/test-data.fixture';
```

### Key Patterns

- Always use **page objects** from `e2e/pages/` — never raw selectors
- Use `TestData` from `e2e/test-data/test-data.ts` for URLs, timeouts, sample data
- Use `Selectors` from `e2e/selectors/` for `data-testid` lookups
- Run `npm run extract-selectors` after changing `data-testid` attributes in Vue components
- Current config: **1 worker** locally, `setup` project runs before `chromium` project

### Troubleshooting E2E

- **Auth fails**: Check `.env` credentials, ensure Password Grant enabled in Auth0
- **Selector not found**: Run `npm run extract-selectors`, verify `data-testid` exists in Vue component
- **Tests timeout**: Use `waitForLoadState()`, check element visibility, increase timeout
- **CAPTCHA blocks**: Global setup opens headed browser — solve CAPTCHA manually within 120s

## Docker

- `docker-compose-db.yml` — Development database only (Postgres on port 5432)
- `docker-compose.yml` — Full stack (app + database) for production

## Testing (Unit)

- Vitest with jsdom environment
- Test files co-located with source (e.g., `auth0.service.test.ts`)
- Mock Service Worker (MSW) available for API mocking
- Reports: verbose + JSON to `test/test-report.json`
