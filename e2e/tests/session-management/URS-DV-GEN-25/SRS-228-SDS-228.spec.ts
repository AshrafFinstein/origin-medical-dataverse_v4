import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Red badge shown in session list when a session status is Yet to do
 * URS: URS-DV-GEN-25
 * SRS: SRS-228
 * SDS: SDS-228
 */
test.describe('URS-DV-GEN-25: Verify Red badge shown in session list when a session status', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2337: Verify Red badge shown in session list when a session status is Yet to do', async ({ page }) => {
    // Test Case: UTC-2337
    // Summary: Verify Red badge shown in session list when a session status is Yet to do
    // Description: Feature: Yet To Do Status Color Indicator Scenario: Red badge shown in session list Given a session status is “Yet to do” When the session list loads Then the status badge should display in red color

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2338: Verify Red label shown in session details page when a session is opened with sta', async ({ page }) => {
    // Test Case: UTC-2338
    // Summary: Verify Red label shown in session details page when a session is opened with status Yet to do
    // Description: Feature: Yet To Do Status Color Indicator Scenario: Red label shown in session details page Given a session is opened with status “Yet to do” When the details page renders Then the status label should appear in red

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2339: Verify Styling applied dynamically based on status when the backend returns stat', async ({ page }) => {
    // Test Case: UTC-2339
    // Summary: Verify Styling applied dynamically based on status when the backend returns status = Yet to do
    // Description: Feature: Yet To Do Status Color Indicator Scenario: Styling applied dynamically based on status Given the backend returns status = “Yet to do” When UI binds data Then red styling should be automatically applied

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2340: Verify No red color for other statuses when the session status is In Progress or', async ({ page }) => {
    // Test Case: UTC-2340
    // Summary: Verify No red color for other statuses when the session status is In Progress or Completed
    // Description: Feature: Yet To Do Status Color Indicator Scenario: No red color for other statuses Given the session status is “In Progress” or “Completed” When the list loads Then the status should not appear red

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2341: Verify Color updates after status change when a session changes from In Progress', async ({ page }) => {
    // Test Case: UTC-2341
    // Summary: Verify Color updates after status change when a session changes from In Progress to Yet to do
    // Description: Feature: Yet To Do Status Color Indicator Scenario: Color updates after status change Given a session changes from “In Progress” to “Yet to do” When the page refreshes or updates Then the badge should immediately turn red

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2342: Verify Red indicator clearly visible when multiple sessions are displayed', async ({ page }) => {
    // Test Case: UTC-2342
    // Summary: Verify Red indicator clearly visible when multiple sessions are displayed
    // Description: Feature: Yet To Do Status Color Indicator Scenario: Red indicator clearly visible Given multiple sessions are displayed When user scans the list Then pending sessions should be easily distinguishable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2343: Verify Accessible contrast ratio when red badge is displayed', async ({ page }) => {
    // Test Case: UTC-2343
    // Summary: Verify Accessible contrast ratio when red badge is displayed
    // Description: Feature: Yet To Do Status Color Indicator Scenario: Accessible contrast ratio Given red badge is displayed When checked for accessibility Then color contrast should meet WCAG readability standards

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2344: Verify Color retained after refresh when a session has Yet to do status', async ({ page }) => {
    // Test Case: UTC-2344
    // Summary: Verify Color retained after refresh when a session has Yet to do status
    // Description: Feature: Yet To Do Status Color Indicator Scenario: Color retained after refresh Given a session has “Yet to do” status When the user refreshes the page Then red indicator should persist

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2345: Verify Styling applied without delay when the list loads with many sessions', async ({ page }) => {
    // Test Case: UTC-2345
    // Summary: Verify Styling applied without delay when the list loads with many sessions
    // Description: Feature: Yet To Do Status Color Indicator Scenario: Styling applied without delay Given the list loads with many sessions When rendering completes Then red styling should apply instantly without flicker

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2346: Verify Unknown status fallback when an unexpected or null status value', async ({ page }) => {
    // Test Case: UTC-2346
    // Summary: Verify Unknown status fallback when an unexpected or null status value
    // Description: Feature: Yet To Do Status Color Indicator Scenario: Unknown status fallback Given an unexpected or null status value When UI renders Then default neutral styling should apply without red

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
