# Playwright E2E Automation Framework

A comprehensive end-to-end testing framework for the Dataverse application, designed to handle 2000-3000 test cases with parallel execution and Auth0 authentication bypass.

## 🎯 Features

- ✅ **Auth0 CAPTCHA Bypass** - Uses API-based authentication (Resource Owner Password Grant)
- ✅ **Auto Token Refresh** - Automatic token renewal during long test runs
- ✅ **Parallel Execution** - Run tests across 4-6 Chromium workers simultaneously
- ✅ **Selector Organization** - 266+ selectors extracted and organized by module
- ✅ **Excel Integration** - Generate tests from Excel file (URS → SRS → SDS → UTC)
- ✅ **Page Object Model** - Clean, maintainable page objects and reusable flows
- ✅ **Type-Safe Selectors** - TypeScript exports for all data-testid attributes

## 📁 Directory Structure

```
e2e/
├── helpers/
│   └── auth-token.helper.ts          # Auth0 token management
├── fixtures/
│   └── auth.fixture.ts                # Authenticated page fixture
├── pages/
│   ├── base.page.ts                   # Base page class
│   └── epic/                          # Epic page object modules (example)
├── selectors/
│   ├── *.json                         # Selector JSON files by module
│   └── index.ts                       # TypeScript selector exports
├── scripts/
│   ├── extract-selectors.ts           # Extract data-testid from Vue components
│   └── generate-tests.ts              # Generate tests from Excel
├── utils/
│   ├── excel-parser.ts                # Excel parsing with batch support
│   └── test-generator.ts              # Test file generator
├── tests/
│   ├── verify-framework.spec.ts       # Framework verification tests
│   └── generated/                     # Auto-generated test files
├── global-setup.ts                    # Global authentication setup
└── README.md                          # This file
```

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have the `.env` file in `datavaerese_frontend_&_backend/` with:
- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_AUDIENCE`
- `AUTH0_DATABASE_CONNECTION` (optional, defaults to 'Username-Password-Authentication')
- `API_URL` (your application URL)
- `ADMIN_USERNAME` (optional, defaults to ashraf.a@finstein.ai)
- `ADMIN_PASSWORD` (optional, defaults to yxD21p)E1)SL)

### 2. Extract Selectors

Extract all `data-testid` attributes from Vue components:

```bash
npm run extract-selectors
```

This will scan all Vue files and create JSON files in `e2e/selectors/` organized by module.

### 3. Generate Tests from Excel

View test statistics:
```bash
npm run generate-tests:stats
```

Preview test structure (dry run):
```bash
npm run generate-tests:dry-run
```

Generate all tests:
```bash
npm run generate-tests
```

Generate only high-priority tests:
```bash
npm run generate-tests:high-priority
```

### 4. Verify Framework

Run framework verification tests:

```bash
npm run test:verify-framework
```

This will test:
- Authentication and token refresh
- Selector loading
- Page object functionality
- Parallel execution capabilities

### 5. Run Tests in Parallel

Execute all tests across 6 parallel workers:

```bash
npm run test:parallel
```

## 📖 Usage Guide

### Authentication

The framework uses **API-based authentication** to bypass Auth0 CAPTCHA:

1. **Global Setup** (`e2e/global-setup.ts`):
   - Runs once before all tests
   - Gets Auth0 tokens via Password Grant API
   - Saves storage state to `./playwright/.auth/state.json`

2. **Token Auto-Refresh** (`e2e/fixtures/auth.fixture.ts`):
   - Before each test, checks if tokens are still valid
   - Automatically refreshes expired tokens
   - Updates browser session with fresh tokens

3. **Shared State**:
   - All parallel workers share the same authenticated state
   - No need to login in each test
   - No CAPTCHA challenges

### Selectors

Selectors are organized by module in JSON files:

```typescript
import { Selectors } from './e2e/selectors';

// Access selectors
const createButton = Selectors.epic['epic-create'].button;
// Returns: '[data-testid="epic-create-button"]'

// Dynamic selectors
import { getDynamicSelector } from './e2e/selectors';
const rowSelector = getDynamicSelector(
  '[data-testid="epic-table-row-${index}"]',
  { index: 0 }
);
// Returns: '[data-testid="epic-table-row-0"]'
```

Available modules:
- `common` - Header, navigation, common components
- `epic` - Epic list and CRUD operations
- `project` - Project management
- `session` - Session management
- `dataLabelling` - Data labeling sessions
- `clinicalEvaluation` - Clinical evaluation sessions
- `reportAnalysis` - Report analysis
- `label`, `annotation`, `taxonomy`, `structure` - Master data
- `sessionCodes`, `users`, `userGroup` - Administration

### Page Objects

All page objects extend `BasePage` for common functionality:

```typescript
import { EpicPage } from './e2e/pages/epic';

test('Create epic', async ({ authenticatedPage }) => {
  const epicPage = new EpicPage(authenticatedPage);

  await epicPage.goto();
  await epicPage.createEpic({
    name: 'New Epic',
    description: 'Epic description'
  });

  expect(await epicPage.epicExists('New Epic')).toBe(true);
});
```

### Excel Test Generation

The Excel file should have the following columns:

| Column | Description |
|--------|-------------|
| 1 | URS (User Requirement Specification) |
| 2 | SRS (System Requirement Specification) |
| 3 | SDS (System Design Specification) |
| 4 | Test Case ID |
| 5 | Description |
| 6 | Steps (newline-separated) |
| 7 | Expected Result |
| 8 | Priority (high/medium/low) |
| 9 | Status (active/inactive) |

Generated tests will be organized as:
```
e2e/tests/generated/
  URS-001/
    SRS-001/
      SDS-001.spec.ts
      SDS-002.spec.ts
    SRS-002/
      SDS-003.spec.ts
```

## 🛠️ Available Scripts

### Selector Management
- `npm run extract-selectors` - Extract data-testid from Vue components

### Test Generation
- `npm run generate-tests` - Generate all tests from Excel
- `npm run generate-tests:stats` - Show test statistics
- `npm run generate-tests:dry-run` - Preview test structure
- `npm run generate-tests:high-priority` - Generate only high-priority tests

### Test Execution
- `npm run test` - Run all tests (default workers)
- `npm run test:parallel` - Run tests with 6 parallel workers
- `npm run test:verify-framework` - Verify framework setup
- `npm run test:headed` - Run tests in headed mode
- `npm run test:ui` - Open Playwright UI mode
- `npm run test:debug` - Debug tests

### Reports
- `npm run test:report` - Open HTML test report

## 🔧 Advanced Configuration

### Playwright Config

The `playwright.config.ts` is configured for:
- **6 parallel workers** (locally)
- **Global setup** for authentication
- **Storage state** shared across workers
- **Chromium only** (for consistent parallel execution)

### Custom Test Generation

Use the CLI script with options:

```bash
npx ts-node e2e/scripts/generate-tests.ts \
  -e requirements-excel-file/dataverse-Testcases-V4.xlsx \
  -p high \
  -m "Epic Management" \
  --dry-run
```

Options:
- `-e, --excel <path>` - Excel file path (required)
- `-p, --priority <priority>` - Filter by priority (high/medium/low)
- `-m, --module <module>` - Filter by module (URS prefix)
- `-s, --status <status>` - Filter by status (active/inactive)
- `-d, --dry-run` - Preview without generating files
- `--stats` - Show test statistics
- `--clean` - Clean generated tests before creating new ones

## 📊 Framework Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Global Setup (runs once)                                │
│ - Authenticate via Auth0 API (no browser)               │
│ - Save storage state                                    │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ Parallel Workers (6 Chromium instances)                 │
│ - Load shared storage state                             │
│ - Auto-refresh tokens via fixture                       │
│ - Execute tests independently                           │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ Page Objects + Selectors                                │
│ - Type-safe selectors from JSON                         │
│ - Reusable page interactions                            │
│ - Clean test code                                       │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Best Practices

### Writing Tests

1. **Use the authenticatedPage fixture**:
   ```typescript
   test('My test', async ({ authenticatedPage }) => {
     // Already authenticated, tokens auto-refreshed
   });
   ```

2. **Use page objects for interactions**:
   ```typescript
   const epicPage = new EpicPage(authenticatedPage);
   await epicPage.createEpic({ name: 'Test Epic' });
   ```

3. **Use selectors from the selector system**:
   ```typescript
   await page.click(Selectors.epic['epic-create'].button);
   ```

4. **Wait for loading to complete**:
   ```typescript
   await epicPage.waitForLoadingComplete();
   await epicPage.waitForToast('success');
   ```

### Adding New Page Objects

1. Create a new page object extending `BasePage`
2. Use selectors from the selector system
3. Implement page-specific methods
4. Export interface for data types

Example:
```typescript
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export interface ProjectData {
  name: string;
  description?: string;
}

export class ProjectPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async createProject(data: ProjectData) {
    await this.click(this.selectors.project['project-create'].button);
    await this.fill(this.selectors.project['project-create']['name-input'], data.name);
    await this.click(this.selectors.project['project-create']['submit-button']);
    await this.waitForToast('success');
  }
}
```

## 🐛 Troubleshooting

### Authentication Issues

**Problem**: Global setup fails with Auth0 error

**Solution**:
- Verify `.env` file has correct Auth0 credentials
- Check that Password Grant is enabled in Auth0 tenant
- Ensure user credentials are correct

### Token Expiration

**Problem**: Tests fail with 401 errors during long runs

**Solution**:
- The framework auto-refreshes tokens
- Check `playwright/.auth/tokens.json` for token status
- Verify refresh token is being saved

### Selector Not Found

**Problem**: Selector not found during test execution

**Solution**:
- Re-run `npm run extract-selectors` to update selectors
- Check that component has the expected `data-testid` attribute
- Verify selector path in JSON files

### Parallel Execution Issues

**Problem**: Tests interfere with each other

**Solution**:
- Ensure tests are truly independent
- Use unique data for each test (Faker.js)
- Avoid shared state between tests

## 📝 Next Steps

1. **Create more page objects** for Project, Session, Data Labeling, etc.
2. **Implement test steps** in generated tests (replace TODO comments)
3. **Add helper utilities** for common operations
4. **Setup CI/CD pipeline** for automated testing
5. **Create test data factories** using Faker.js
6. **Add visual regression testing** with Playwright screenshots

## 🤝 Contributing

When adding new features to the framework:

1. Extract new selectors: `npm run extract-selectors`
2. Create page objects in `e2e/pages/`
3. Write verification tests in `e2e/tests/`
4. Update this README with new functionality

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Auth0 Resource Owner Password Grant](https://auth0.com/docs/get-started/authentication-and-authorization-flow/resource-owner-password-flow)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
