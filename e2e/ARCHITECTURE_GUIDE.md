# Playwright Test Architecture Guide

## 🏗️ Proper Architecture Flow

```
Selectors (JSON) → Page Objects (Methods) → Spec Files (Tests)
```

### ❌ WRONG - Hardcoded Locators in Specs

```typescript
// BAD - DO NOT DO THIS
test('My test', async ({ page }) => {
  const input = page.locator('input[type="text"]').first();  // ❌ Hardcoded
  await input.fill('value');

  const button = page.locator('button').first();  // ❌ Hardcoded
  await button.click();
});
```

### ✅ CORRECT - Using Page Object Methods

```typescript
// GOOD - Proper architecture
test('My test', async ({ page }) => {
  const sessionPage = new SessionPage(page);

  await sessionPage.fillSessionName('Test Session');  // ✅ Page object method
  await sessionPage.clickCreateButton();  // ✅ Page object method
  await sessionPage.verifySessionCreated();  // ✅ Page object method
});
```

---

## 📁 Step 1: Selectors (JSON Files)

**Location:** `e2e/selectors/*.json`

Store all `data-testid` selectors in JSON files:

### Example: `e2e/selectors/session.json`

```json
{
  "session-list": "[data-testid='session-list']",
  "session-create": {
    "button": "[data-testid='session-create-button']",
    "modal": "[data-testid='session-create-modal']",
    "name-input": "[data-testid='session-name-input']",
    "description-input": "[data-testid='session-description-input']",
    "submit-button": "[data-testid='session-submit-button']",
    "cancel-button": "[data-testid='session-cancel-button']"
  },
  "session-table": {
    "row": "[data-testid='session-table-row']",
    "edit-button": "[data-testid='session-edit-button-{index}']",
    "delete-button": "[data-testid='session-delete-button-{index}']"
  }
}
```

### Key Points:
- ✅ Use `data-testid` attributes
- ✅ Group related selectors (e.g., `session-create`)
- ✅ Use placeholders for dynamic values (e.g., `{index}`)
- ❌ No hardcoded CSS/XPath selectors

---

## 📄 Step 2: Page Objects (TypeScript Classes)

**Location:** `e2e/pages/*.page.ts`

Create methods that use selectors from JSON files:

### Example: `e2e/pages/session.page.ts`

```typescript
import { Page, Locator } from '@playwright/test';
import { SessionSelectors, CommonSelectors } from '../selectors';
import { getDynamicSelector } from '../selectors';

export class SessionPage {
  readonly page: Page;

  // Define locators using selectors from JSON
  readonly sessionList: Locator;
  readonly createButton: Locator;
  readonly createModal: Locator;
  readonly nameInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators from selectors
    this.sessionList = page.locator(SessionSelectors['session-list']);
    this.createButton = page.locator(SessionSelectors['session-create'].button);
    this.createModal = page.locator(SessionSelectors['session-create'].modal);
    this.nameInput = page.locator(SessionSelectors['session-create']['name-input']);
    this.submitButton = page.locator(SessionSelectors['session-create']['submit-button']);
  }

  // Page object methods (business logic)
  async navigateToSessionList() {
    await this.sessionList.waitFor({ state: 'visible', timeout: 10000 });
    await this.sessionList.first().click();
  }

  async clickCreateButton() {
    await this.createButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.createButton.click();
  }

  async fillSessionName(name: string) {
    await this.nameInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.nameInput.fill(name);
  }

  async submitSession() {
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifySessionCreated(name: string) {
    const sessionRow = this.page.locator(`text=${name}`);
    await sessionRow.waitFor({ state: 'visible', timeout: 5000 });
    return await sessionRow.isVisible();
  }

  async getTableRowCount(): Promise<number> {
    const rows = this.page.locator(SessionSelectors['session-table'].row);
    return await rows.count();
  }

  async editSession(index: number) {
    const editButtonSelector = getDynamicSelector(
      SessionSelectors['session-table']['edit-button'],
      { index }
    );
    await this.page.locator(editButtonSelector).click();
  }
}
```

### Key Points:
- ✅ Use selectors from JSON files
- ✅ Create meaningful method names
- ✅ Encapsulate business logic
- ✅ Handle waits and error handling
- ❌ No `page.locator()` with hardcoded strings

---

## 📝 Step 3: Spec Files (Tests)

**Location:** `e2e/tests/**/*.spec.ts`

Call page object methods, never use direct locators:

### Example: `e2e/tests/session-management/session.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { SessionPage } from '../../pages/session.page';
import { TestData } from '../../test-data/test-data';

test.describe('URS-DV-GEN-002: Session Management', () => {
  let loginPage: LoginPage;
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Login
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin(TestData.urls.loginPage);
    await loginPage.loginWithDynamicCaptcha(
      TestData.validCredentials.email,
      TestData.validCredentials.password
    );
    await page.waitForURL(/dataverse/, { timeout: 15000 });

    // Initialize page object
    sessionPage = new SessionPage(page);
    await sessionPage.navigateToSessionList();  // ✅ Page object method
  });

  test('UTC-001: Create new session with valid data', async ({ page }) => {
    // Test Case: UTC-001
    // Summary: User can create a new session

    // ✅ CORRECT - Using page object methods
    await sessionPage.clickCreateButton();
    await sessionPage.fillSessionName('Test Session');
    await sessionPage.submitSession();

    const isCreated = await sessionPage.verifySessionCreated('Test Session');
    expect(isCreated).toBe(true);

    // ❌ WRONG - Would be hardcoded locators:
    // await page.locator('button').click();
    // await page.locator('input').fill('Test');
  });

  test('UTC-002: Verify session table displays correctly', async ({ page }) => {
    // ✅ CORRECT - Using page object method
    const count = await sessionPage.getTableRowCount();
    expect(count).toBeGreaterThanOrEqual(0);

    // ❌ WRONG:
    // const rows = page.locator('table tr');
  });

  test('UTC-003: Edit existing session', async ({ page }) => {
    // ✅ CORRECT - Using page object method
    await sessionPage.editSession(0);

    // ❌ WRONG:
    // await page.locator('[data-testid="edit-button-0"]').click();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `screenshots/failed-${testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`,
        fullPage: true
      });
    }
  });
});
```

### Key Points:
- ✅ Import and use page objects
- ✅ Call page object methods only
- ✅ Use TestData for test data
- ❌ **NEVER** use `page.locator()` directly in tests
- ❌ **NEVER** hardcode selectors in spec files

---

## 🔄 Complete Flow Example

### 1. Add Selector to JSON
```json
// e2e/selectors/session.json
{
  "approval-level": {
    "add-button": "[data-testid='add-level-button']",
    "field": "[data-testid='approval-level-{index}']"
  }
}
```

### 2. Add Method to Page Object
```typescript
// e2e/pages/session.page.ts
async clickAddLevelButton() {
  await this.page.locator(SessionSelectors['approval-level']['add-button']).click();
}

async getApprovalLevelCount(): Promise<number> {
  const levels = this.page.locator('[data-testid^="approval-level-"]');
  return await levels.count();
}
```

### 3. Use in Spec File
```typescript
// e2e/tests/qc-workflow/approval.spec.ts
test('UTC-001: Add approval level', async ({ page }) => {
  const sessionPage = new SessionPage(page);

  await sessionPage.clickAddLevelButton();  // ✅ Page object method
  const count = await sessionPage.getApprovalLevelCount();  // ✅ Page object method

  expect(count).toBe(1);
});
```

---

## 📋 Current State & Next Steps

### Current Generated Tests (Need Updates)

The generated tests currently have placeholder comments:

```typescript
// Fill input using page object method
// Note: Replace with actual page object method
// Example: await sessionPage.fillInputField('value');

await page.waitForLoadState('domcontentloaded');
expect(page.url()).toContain('dataverse');
```

### What Needs to Be Done

1. **Add Missing Selectors to JSON Files**
   - Review each test requirement
   - Add corresponding `data-testid` selectors to JSON files

2. **Implement Page Object Methods**
   - Create methods in page objects for each action
   - Use selectors from JSON files
   - Add proper error handling and waits

3. **Update Spec Files**
   - Replace placeholder comments with actual page object method calls
   - Remove any remaining hardcoded locators

### Example: Updating a Test

**Before (Generated with placeholders):**
```typescript
test('UTC-001: Verify button visible', async ({ page }) => {
  // Verify element visibility using selectors
  // Note: Replace with actual page object method

  await page.waitForLoadState('domcontentloaded');
  expect(page.url()).toContain('dataverse');
});
```

**After (Properly implemented):**
```typescript
test('UTC-001: Verify button visible', async ({ page }) => {
  const sessionPage = new SessionPage(page);

  const isVisible = await sessionPage.isCreateButtonVisible();
  expect(isVisible).toBe(true);
});
```

---

## ✅ Architecture Checklist

Before committing any test:

- [ ] All selectors defined in `e2e/selectors/*.json`
- [ ] Page objects use selectors from JSON files
- [ ] Page objects have methods for all actions
- [ ] Spec files ONLY call page object methods
- [ ] NO `page.locator()` with hardcoded strings in spec files
- [ ] NO CSS/XPath selectors in spec files
- [ ] All locators use `data-testid` attributes

---

## 🚀 Benefits of This Architecture

1. **Maintainability** - Change selector once in JSON, not in 100 tests
2. **Readability** - `sessionPage.createSession()` vs `page.locator('button').click()`
3. **Reusability** - Page object methods used across multiple tests
4. **Type Safety** - TypeScript catches errors at compile time
5. **Testability** - Easy to mock page objects for unit testing
6. **Consistency** - All tests follow same pattern

---

**Remember:** Tests should read like business scenarios, not technical instructions!

✅ Good: `await sessionPage.createSessionWithName('Test')`
❌ Bad: `await page.locator('[data-testid="input"]').fill('Test')`
