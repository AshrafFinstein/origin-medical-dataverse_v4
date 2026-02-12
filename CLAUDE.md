# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

The main application is located in `datavaerese_frontend_&_backend/`. All commands should be run from within that directory unless otherwise specified.

## Project Overview

Dataverse Platform is a Nuxt 3 application for validation, grading, and clinical studies. It provides data labeling (DL) and clinical evaluation (CE) session management with role-based access control.

**Tech Stack:** Nuxt 3, tRPC, Prisma, TypeScript, Auth0, AWS S3, Tailwind CSS, Naive UI

## Development Commands

All commands below should be run from the `datavaerese_frontend_&_backend/` directory.

### Setup
```bash
npm install                           # Install dependencies
docker compose -f docker-compose-db.yml up  # Start Postgres database (runs on port 5432)
npx prisma generate                   # Generate Prisma client types
npx prisma migrate dev                # Run database migrations
npx prisma db seed                    # Seed database with sample data
```

### Development
```bash
npm run dev                           # Start dev server
npm run build                         # Build for production
npm run start                         # Start production server
npm run lint                          # Run ESLint
npm run lint:fix                      # Fix ESLint errors
npm run typecheck                     # Run TypeScript type checking
```

### Testing
```bash
npm run test:unit                     # Run all Vitest unit tests
npx vitest run path/to/file.test.ts   # Run specific test file
npx vitest watch                      # Run tests in watch mode
```

### Prisma
```bash
npx prisma migrate dev                # Create and apply migration
npx prisma generate                   # Generate Prisma client
npx prisma db seed                    # Seed database
npx prisma studio                     # Open Prisma Studio GUI
npm run prisma:migrate:dev            # Migrate + inline for Nuxt
npm run prisma:generate               # Generate + inline for Nuxt
```

### Data Migration
The `data_migration_script/` directory contains scripts for migrating data from legacy systems.
```bash
npm run data:populate                 # Run data migration script
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
│   ├── middleware/                   # Server middleware
│   ├── utils/                        # Server utilities
│   ├── di.ts                         # Dependency injection container
│   └── logger.ts                     # Winston logger configuration
├── pages/                            # Nuxt pages (routes)
├── components/                       # Vue components
├── composables/                      # Vue composables
├── prisma/                           # Prisma schema and migrations
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # Migration files
│   └── seed.ts                       # Seed data
├── data_migration_script/            # Legacy data migration scripts
└── docker-compose-db.yml             # Docker config for Postgres database
```

### Dependency Injection

The application uses `@owja/ioc` for dependency injection. All repositories are registered in `server/di.ts` with their interfaces and implementations. Services receive dependencies through the DI container.

```typescript
// Example: Resolving a repository
import { resolve, TOKEN } from '~/server/di'
const projectRepo = resolve(TOKEN.projectRepository)
```

### tRPC API Layer

tRPC provides type-safe APIs between client and server:

- **Routers** in `server/trpc/routers/` define API endpoints
- **Protected procedures** enforce authentication and role-based permissions
- **Public procedures** are accessible without authentication
- **Context** (`server/trpc/context.ts`) provides user session info to all procedures

#### Role-Based Access Control (RBAC)

Permissions are enforced via `pathAbilityMap` in `server/trpc/trpc.ts`. Each tRPC route maps to a module and action (e.g., `epic.create` → Module.EPIC + Action.CREATE). The `isAuthed` middleware checks if the user has the required permission by querying the `roleModuleActionMapping` table.

To add RBAC to a new route:
1. Add the route path to `pathAbilityMap` with its module and action
2. Use `protectedProcedure` instead of `publicProcedure`

### Repository Pattern

All data access goes through repository interfaces:
- **Database repositories** use Prisma Client (`server/infrastructures/database/repositories/`)
- **Auth0 repository** manages users (`server/infrastructures/auth0/repositories/`)
- **S3 repository** handles file storage (`server/infrastructures/cloud/repositories/`)

Repositories are injected into services via DI, making them easily testable and swappable.

### Key Domain Concepts

- **Epic**: Top-level organizational unit for projects
- **Project**: Contains sessions, belongs to an epic
- **Session**: Two types - Data Labeling (DL) and Clinical Evaluation (CE)
- **Label**: Classification tags for data labeling sessions
- **Taxonomy**: Hierarchical classification system for annotations
- **Structure**: Anatomical/organizational structure definitions for CE sessions
- **ExtractedResource**: Files/resources linked to sessions (stored in S3)
- **Annotation**: User annotations on taxonomies within sessions

### Database Transactions

Use `withTransaction` from `server/infrastructures/database/transaction.ts` to wrap multiple database operations in a Prisma transaction. This ensures atomicity when operations must succeed or fail together.

### Environment Variables

Required variables are documented in `.env.example`:
- **Auth0**: domain, client ID/secret, audience, management API credentials
- **AWS S3**: buckets and regions for file storage
- **Database**: connection string (automatically configured when using Docker)

Download the `.env` file from the Software Team shared drive folder.

### Logging

Winston logger configured in `server/logger.ts` with daily rotating files. Logs are written to the `logs/` directory. Use `logger.info()`, `logger.error()`, `logger.warn()`, etc. throughout server code.

### Client-Side

- **Composables** in `composables/` provide reusable Vue logic
- **tRPC client** auto-configured via `trpc-nuxt` plugin for type-safe API calls
- **Naive UI** component library for UI components
- **Tailwind CSS** for styling
- **Konva** for canvas-based annotation tools
- **VueUse** for Vue composition utilities

## Testing

- Unit tests use Vitest with jsdom environment
- Test files are co-located with source files (e.g., `auth0.service.test.ts`)
- Tests use verbose and JSON reporters with output in `test/test-report.json`
- Mock Service Worker (MSW) available for API mocking

## Docker

The project uses Docker for the PostgreSQL database:
- `docker-compose-db.yml` - Development database only
- `docker-compose.yml` - Full stack (app + database) for production

Database runs on `localhost:5432` with credentials from `.env` (defaults: user=postgres, password=12345).

## E2E Testing Framework (Playwright)

The project includes a comprehensive Playwright-based E2E testing framework designed to handle 2,000-3,000 test cases from Excel with Auth0 CAPTCHA bypass and parallel execution.

### Commands

All E2E test commands should be run from the **root directory** (not `datavaerese_frontend_&_backend/`):

```bash
# Selector Management
npm run extract-selectors              # Extract data-testid from Vue components

# Test Generation
npm run generate-tests                 # Generate tests from Excel
npm run generate-tests:stats           # View test case statistics
npm run generate-tests:dry-run         # Preview test structure
npm run generate-tests:high-priority   # Generate high-priority tests only

# Running Tests
npm run test                           # Run all tests
npm run test:parallel                  # Run with 6 parallel workers
npm run test:verify-framework          # Verify framework setup
npm run test:headed                    # Run in headed mode
npm run test:ui                        # Open Playwright UI
npm run test:debug                     # Debug specific test

# Reports
npm run test:report                    # Open HTML report
```

### E2E Architecture

```
e2e/
├── helpers/
│   └── auth-token.helper.ts          # Auth0 API authentication (CAPTCHA bypass)
├── fixtures/
│   └── auth.fixture.ts               # Auto token refresh fixture
├── pages/                            # Page Object Model
│   ├── base.page.ts                  # Base class with 40+ common methods
│   ├── epic.page.ts                  # Epic management
│   ├── project.page.ts               # Project management
│   ├── session.page.ts               # Session management
│   ├── data-labelling.page.ts        # DL annotation tools
│   ├── clinical-evaluation.page.ts   # CE evaluation tools
│   └── masters/                      # Master data pages
│       ├── label.page.ts
│       ├── annotation.page.ts
│       └── taxonomy.page.ts
├── selectors/                        # 266+ extracted selectors
│   ├── common.json
│   ├── epic.json
│   ├── project.json
│   ├── session.json
│   └── index.ts                      # TypeScript exports
├── tests/
│   ├── verify-framework.spec.ts      # Framework verification
│   └── generated/                    # Auto-generated from Excel
├── scripts/
│   ├── extract-selectors.ts          # Selector extraction tool
│   └── generate-tests.ts             # Test generator CLI
├── utils/
│   ├── excel-parser.ts               # Parse 2K-3K test cases
│   └── test-generator.ts             # Generate spec files
└── global-setup.ts                   # One-time Auth0 authentication
```

### Authentication Strategy

The framework uses **Auth0 Resource Owner Password Grant** to bypass CAPTCHA:

1. **Global Setup** (`e2e/global-setup.ts`): Authenticates once via Auth0 API before all tests
2. **Token Manager** (`e2e/helpers/auth-token.helper.ts`): Manages token lifecycle and auto-refresh
3. **Shared State**: All 6 parallel workers share authenticated state from `playwright/.auth/state.json`
4. **Auto Refresh**: `auth.fixture.ts` automatically refreshes tokens before each test if needed

**No browser-based login required** - tests run unattended across parallel workers.

### Page Object Model

All page interactions go through page objects that extend `BasePage`:

```typescript
import { EpicPage, ProjectPage, SessionPage } from '../pages';

// Epic operations
const epicPage = new EpicPage(authenticatedPage);
await epicPage.createEpic({ name: 'Test Epic' });

// Project operations
const projectPage = new ProjectPage(authenticatedPage);
await projectPage.createProject({
  name: 'Test Project',
  assignees: ['all']
});

// Session operations
const sessionPage = new SessionPage(authenticatedPage);
await sessionPage.createSession({
  name: 'DL Session',
  labels: ['Tumor', 'Normal']
});
```

**Key Page Objects:**
- `BasePage` - 40+ common methods (navigation, waits, interactions, table helpers)
- `EpicPage` - Epic CRUD, search, navigation (20+ methods)
- `ProjectPage` - Project CRUD, user management (25+ methods)
- `SessionPage` - Session CRUD, codes, labels (35+ methods)
- `DataLabellingPage` - Annotations, visualization (30+ methods)
- `ClinicalEvaluationPage` - Measurements, assessments (25+ methods)
- Masters pages - Label, Annotation, Taxonomy management

### Selector System

266+ selectors extracted from Vue components, organized by module:

```typescript
import { Selectors } from '../selectors';

// Static selectors
await page.click(Selectors.epic['epic-create'].button);

// Dynamic selectors
import { getDynamicSelector } from '../selectors';
const selector = getDynamicSelector(
  '[data-testid="epic-table-row-${index}"]',
  { index: 0 }
);
```

**Selector modules**: common, epic, project, session, dataLabelling, clinicalEvaluation, label, annotation, taxonomy, structure, sessionCodes, users, userGroup

**Update selectors** when Vue components change: `npm run extract-selectors`

### Excel Test Generation

The framework generates tests from `requirements-excel-file/dataverse-Testcases-V4.xlsx` (2,698 test cases):

```bash
# View test distribution
npm run generate-tests:stats

# Preview structure (no files created)
npm run generate-tests:dry-run

# Generate all active tests
npm run generate-tests

# Generate high-priority only
npm run generate-tests:high-priority

# Custom generation
npx ts-node e2e/scripts/generate-tests.ts \
  -e requirements-excel-file/dataverse-Testcases-V4.xlsx \
  -p high \
  -m "Epic Management"
```

**Excel Structure:**
- Column 1: URS ID
- Column 2: SRS ID
- Column 3: SDS ID
- Column 4: Test ID
- Column 5: Summary
- Column 6: Description
- Column 7: Acceptance Criteria
- Column 8: Test Status
- Column 9: Test Type
- Column 10: Assignee

Generated tests are organized as: `tests/generated/URS-*/SRS-*/SDS-*.spec.ts`

### Parallel Execution

Tests run across **6 Chromium workers** (configurable in `playwright.config.ts`):

```typescript
// playwright.config.ts
workers: process.env.CI ? 2 : 6  // 6 workers locally
fullyParallel: true              // All tests run in parallel
```

All workers share authenticated state - no per-worker login needed.

### Writing Tests

Use the `authenticatedPage` fixture for automatic token management:

```typescript
import { test, expect } from '../fixtures/auth.fixture';
import { EpicPage } from '../pages';

test('Epic workflow', async ({ authenticatedPage }) => {
  const epicPage = new EpicPage(authenticatedPage);
  await epicPage.goto();

  await epicPage.createEpic({
    name: 'Test Epic',
    description: 'Description'
  });

  expect(await epicPage.epicExists('Test Epic')).toBe(true);
});
```

**Best Practices:**
1. Always use page objects - never raw selectors
2. Use type-safe data interfaces (EpicData, ProjectData, etc.)
3. Wait for operations to complete before assertions
4. Use `authenticatedPage` fixture for automatic auth
5. Let page objects handle waits and error handling

### Test Data Organization

Tests are organized by requirement hierarchy (URS → SRS → SDS):

```
tests/generated/
├── URS-DV-QC-01/          # User Requirement 1
│   ├── SRS-1/             # System Requirement 1
│   │   └── SDS-1.spec.ts  # System Design 1
│   └── SRS-2/
│       └── SDS-2.spec.ts
└── URS-DV-QC-02/
    └── SRS-1/
        └── SDS-1.spec.ts
```

### Environment Setup

E2E tests require Auth0 credentials in `datavaerese_frontend_&_backend/.env`:

```bash
# Auth0 Configuration (Required)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=your-api-audience
AUTH0_DATABASE_CONNECTION=Username-Password-Authentication

# Test User (Optional - defaults provided)
ADMIN_USERNAME=ashraf.a@finstein.ai
ADMIN_PASSWORD=yxD21p)E1)SL

# Application URL
API_URL=http://localhost:3000
```

**Critical**: Auth0 tenant must have **Password Grant** enabled for API-based authentication.

### Common E2E Workflows

**Full Epic → Project → Session flow:**
```typescript
test('Complete workflow', async ({ authenticatedPage }) => {
  // 1. Create Epic
  const epicPage = new EpicPage(authenticatedPage);
  await epicPage.goto();
  await epicPage.createEpic({ name: 'Epic' });
  await epicPage.navigateToEpic(1);

  // 2. Create Project
  const projectPage = new ProjectPage(authenticatedPage);
  await projectPage.createProject({
    name: 'Project',
    assignees: ['all']
  });
  await projectPage.navigateToProject(1);

  // 3. Create Session
  const sessionPage = new SessionPage(authenticatedPage);
  await sessionPage.createSession({
    name: 'Session',
    labels: ['Label1']
  });
});
```

**Data Labeling workflow:**
```typescript
test('Annotation workflow', async ({ authenticatedPage }) => {
  const dlPage = new DataLabellingPage(authenticatedPage);
  await dlPage.goto('session-id');
  await dlPage.waitForImageLoad();

  await dlPage.createAnnotation({
    label: 'Tumor',
    coordinates: { x: 100, y: 100, width: 200, height: 200 }
  });

  await dlPage.navigateToNextImage();
  await dlPage.copyAnnotation(false);
});
```

### Troubleshooting E2E Tests

**Authentication fails:**
- Verify `.env` has correct Auth0 credentials
- Ensure Password Grant enabled in Auth0 tenant
- Check `playwright/.auth/tokens.json` for token status

**Selector not found:**
- Re-run `npm run extract-selectors`
- Verify `data-testid` exists in Vue component
- Check selector path in `e2e/selectors/*.json`

**Tests timeout:**
- Check if element actually appears in UI
- Increase timeout in test config
- Use `waitForLoadingComplete()` for async operations

**Parallel execution issues:**
- Ensure tests are independent (no shared state)
- Use unique test data (timestamps, UUIDs)
- All workers share same auth - no conflicts

### Documentation

- **E2E README**: `e2e/README.md` - Complete framework guide
- **Page Objects**: `e2e/pages/README.md` - Page object documentation
- **Selectors**: `e2e/selectors/index.ts` - TypeScript selector exports
- **Test Examples**: `e2e/tests/generated/README.md` - Generated test structure
