# 🔧 Test Data Setup & Fixtures Guide

## Overview

The test framework now includes **two complementary approaches** to ensure Epic and Project data exists before tests run:

1. **Global Setup Script** - Runs once before all tests (automatic)
2. **Test Data Fixture** - Ensures data exists per test suite (opt-in)

---

## 🎯 **Approach 1: Global Setup (Automatic)**

### How It Works

The global setup runs **once** before all test suites execute:

1. **Authentication** (`e2e/global-setup.ts`) - Logs in via Auth0
2. **Test Data Setup** (`e2e/tests/global.setup.ts`) - Creates Epic + Project
3. **All Tests Run** - Tests use the pre-created data

### Configuration

Already configured in `playwright.config.ts`:

```typescript
projects: [
  {
    name: 'setup',
    testMatch: /.*\.setup\.ts/,  // Runs global.setup.ts
  },
  {
    name: 'chromium',
    dependencies: ['setup'],  // Waits for setup to complete
  },
]
```

### What It Does

The setup script (`e2e/tests/global.setup.ts`):

1. Checks if Epic exists (looks for `epic-go-button-0`)
2. If not found, creates Epic named **"E2E Test Epic - Automation"**
3. Navigates to Epic page
4. Checks if Project exists (looks for `project-go-button-0`)
5. If not found, creates Project named **"E2E Test Project - Automation"**
6. Verifies navigation works (Home → Epic → Project)

### When to Use

✅ **Use when:**
- Running full test suite
- First time running tests
- Database was reset/cleared

✅ **Benefits:**
- Fully automatic
- Runs once (fast for large test suites)
- All tests share same Epic/Project
- No code changes needed in test files

### Run Tests with Setup

```bash
# Normal test run - setup runs automatically
npx playwright test

# Run only setup
npx playwright test --project=setup

# Skip setup (if data already exists)
npx playwright test --project=chromium
```

---

## 🔧 **Approach 2: Test Data Fixture (Opt-in)**

### How It Works

The test data fixture runs **per test suite** (or per test) to ensure fresh data:

```typescript
import { test, expect } from '../fixtures/test-data.fixture';

test.describe('My Test Suite', () => {
  test('my test', async ({ testDataPage }) => {
    // testDataPage has Epic + Project guaranteed to exist
    // Tests start at home page, ready to navigate
  });
});
```

### What It Provides

The fixture (`e2e/fixtures/test-data.fixture.ts`) exports:

#### 1. `testDataPage`
- Page object with Epic and Project guaranteed to exist
- Creates them if missing
- Navigates back to home page for clean start

```typescript
test('example', async ({ testDataPage }) => {
  // Epic and Project exist, page is at home
  await testDataPage.goto('/some-route');
});
```

#### 2. `epicId`
- Returns the ID of the first Epic
- Useful for direct navigation or API calls

```typescript
test('example', async ({ epicId }) => {
  console.log('Epic ID:', epicId);
  await page.goto(`/epic/${epicId}`);
});
```

#### 3. `projectId`
- Returns the ID of the first Project
- Useful for direct navigation or API calls

```typescript
test('example', async ({ projectId }) => {
  console.log('Project ID:', projectId);
  await page.goto(`/project/${projectId}`);
});
```

### When to Use

✅ **Use when:**
- Need isolated test data per suite
- Want to create fresh Epic/Project for specific tests
- Testing Epic/Project CRUD operations (don't want to affect others)

✅ **Benefits:**
- Isolation between test suites
- Can create custom test data per suite
- More control over test data lifecycle

### Example Usage

```typescript
import { test, expect } from '../../fixtures/test-data.fixture';
import { SessionPage } from '../../pages/session.page';

test.describe('Session Tests', () => {
  test('should create session', async ({ testDataPage, projectId }) => {
    const sessionPage = new SessionPage(testDataPage);

    // Navigate to project page (Epic + Project exist)
    await sessionPage.navigateToModule();

    // Create session
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    // Assert
    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });
});
```

---

## 📊 **Comparison**

| Feature | Global Setup | Test Data Fixture |
|---------|--------------|-------------------|
| **Runs** | Once before all tests | Per test suite or test |
| **Speed** | Fast (shared data) | Slower (creates per suite) |
| **Isolation** | Low (all tests share) | High (per suite) |
| **Setup** | Automatic | Manual import |
| **Use Case** | General E2E tests | CRUD tests, isolation needed |

---

## 🎯 **Recommended Approach**

### For Most Tests (Current 2,701 Generated Tests)
✅ **Use Global Setup** - Already configured, fully automatic

```typescript
// No changes needed - tests work as-is
import { test, expect } from '@playwright/test';

test.describe('My Tests', () => {
  test('example', async ({ page }) => {
    // Epic and Project exist from global setup
  });
});
```

### For Specialized Tests (CRUD, Isolation)
✅ **Use Test Data Fixture**

```typescript
// Import from fixture instead of @playwright/test
import { test, expect } from '../../fixtures/test-data.fixture';

test.describe('Epic CRUD Tests', () => {
  test('should create epic', async ({ testDataPage }) => {
    // Fresh test data for this suite
  });
});
```

---

## 🚀 **Quick Start**

### 1. Run Tests (Setup Automatic)

```bash
cd e2e
npx playwright test
```

**What happens:**
1. Global setup authenticates via Auth0
2. Setup script creates Epic + Project (if missing)
3. All 2,701 tests run with shared data

### 2. Check Setup Logs

Look for these messages:
```
🔧 Setting up test data (Epic + Project)...
   ✅ Epic already exists
   ✅ Project already exists
✅ Test data setup complete!
```

### 3. Verify Data Manually

Open http://localhost:3000:
- Should see "E2E Test Epic - Automation"
- Click it → Should see "E2E Test Project - Automation"

---

## 🧹 **Cleanup**

The setup creates data labeled as **"E2E Test Epic/Project - Automation"** with descriptions saying "Safe to delete after tests."

### Manual Cleanup
1. Open http://localhost:3000
2. Delete Epic → This cascades and deletes Project + Sessions

### Automated Cleanup (Future)
TODO: Add `global.teardown.ts` to delete test data after all tests complete.

---

## 🐛 **Troubleshooting**

### Setup Fails with "epic-create-button not found"
**Cause:** Not authenticated or app not running

**Fix:**
```bash
# Ensure app is running
cd datavaerese_frontend_&_backend
npm run dev

# Re-run tests (will re-authenticate and setup)
cd ../e2e
npx playwright test
```

### Tests Fail with "Navigation to session module failed"
**Cause:** Setup didn't complete or data was deleted

**Fix:**
```bash
# Force re-run setup
npx playwright test --project=setup
```

### Want to Use Different Test Data
**Option 1:** Delete existing Epic manually, setup will create new one

**Option 2:** Use Test Data Fixture to create isolated data:
```typescript
import { test } from '../../fixtures/test-data.fixture';
```

---

## 📝 **Summary**

✅ **Global Setup**: Automatic, runs once, all tests use shared Epic/Project
✅ **Test Data Fixture**: Opt-in, per-suite isolation, custom test data
✅ **Both approaches work together** - choose based on your test needs
✅ **No manual data creation needed** - framework handles everything

**For your 2,701 auto-generated tests:** They already work with Global Setup! No changes needed.
