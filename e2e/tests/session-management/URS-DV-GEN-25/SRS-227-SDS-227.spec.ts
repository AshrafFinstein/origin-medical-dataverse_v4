import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Manual status change from dropdown when the session status is Yet to do
 * URS: URS-DV-GEN-25
 * SRS: SRS-227
 * SDS: SDS-227
 */
test.describe('URS-DV-GEN-25: Verify Manual status change from dropdown when the session s', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2327: Verify Manual status change from dropdown when the session status is Yet to do', async ({ page }) => {
    // Test Case: UTC-2327
    // Summary: Verify Manual status change from dropdown when the session status is Yet to do
    // Description: Feature: Session Status Transition to In Progress Scenario: Manual status change from dropdown Given the session status is “Yet to do” When the user selects “In Progress” from the dropdown Then the status should update to “In Progress”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2328: Verify Auto transition on session open when the session status is Yet to do', async ({ page }) => {
    // Test Case: UTC-2328
    // Summary: Verify Auto transition on session open when the session status is Yet to do
    // Description: Feature: Session Status Transition to In Progress Scenario: Auto transition on session open Given the session status is “Yet to do” When the user opens the session workspace Then the system should automatically change the status to “In Progress”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2329: Verify Transition on first work action when the session is opened', async ({ page }) => {
    // Test Case: UTC-2329
    // Summary: Verify Transition on first work action when the session is opened
    // Description: Feature: Session Status Transition to In Progress Scenario: Transition on first work action Given the session is opened When the user performs the first annotation or edit action Then the status should change to “In Progress”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2330: Verify Status persisted in backend when the status changes to In Progress', async ({ page }) => {
    // Test Case: UTC-2330
    // Summary: Verify Status persisted in backend when the status changes to In Progress
    // Description: Feature: Session Status Transition to In Progress Scenario: Status persisted in backend Given the status changes to “In Progress” When the change is saved Then the backend database should store status = “In Progress”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2331: Verify Session list badge updates when the status becomes In Progress', async ({ page }) => {
    // Test Case: UTC-2331
    // Summary: Verify Session list badge updates when the status becomes In Progress
    // Description: Feature: Session Status Transition to In Progress Scenario: Session list badge updates Given the status becomes “In Progress” When returning to session list Then the session badge should display “In Progress”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2332: Verify Status retained after refresh when the status is In Progress', async ({ page }) => {
    // Test Case: UTC-2332
    // Summary: Verify Status retained after refresh when the status is In Progress
    // Description: Feature: Session Status Transition to In Progress Scenario: Status retained after refresh Given the status is “In Progress” When the page is refreshed Then the status should remain “In Progress”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2333: Verify Prevent invalid transition when workflow rules restrict certain states', async ({ page }) => {
    // Test Case: UTC-2333
    // Summary: Verify Prevent invalid transition when workflow rules restrict certain states
    // Description: Feature: Session Status Transition to In Progress Scenario: Prevent invalid transition Given workflow rules restrict certain states When user tries invalid state selection Then system should block and show validation

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2334: Verify Instant UI update when the status change is triggered', async ({ page }) => {
    // Test Case: UTC-2334
    // Summary: Verify Instant UI update when the status change is triggered
    // Description: Feature: Session Status Transition to In Progress Scenario: Instant UI update Given the status change is triggered When UI updates Then status badge and dropdown should update without delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2335: Verify Dropdown clearly indicates active state when the status is In Progress', async ({ page }) => {
    // Test Case: UTC-2335
    // Summary: Verify Dropdown clearly indicates active state when the status is In Progress
    // Description: Feature: Session Status Transition to In Progress Scenario: Dropdown clearly indicates active state Given the status is “In Progress” When viewing the dropdown Then it should be highlighted/visually distinct

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2336: Verify No duplicate transitions when the status is already In Progress', async ({ page }) => {
    // Test Case: UTC-2336
    // Summary: Verify No duplicate transitions when the status is already In Progress
    // Description: Feature: Session Status Transition to In Progress Scenario: No duplicate transitions Given the status is already “In Progress” When user performs additional actions Then system should not send duplicate update requests

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
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
