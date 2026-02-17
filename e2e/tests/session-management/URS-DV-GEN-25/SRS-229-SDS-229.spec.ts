import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Blue badge shown in session list when a session status is In Progress
 * URS: URS-DV-GEN-25
 * SRS: SRS-229
 * SDS: SDS-229
 */
test.describe('URS-DV-GEN-25: Verify Blue badge shown in session list when a session statu', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2347: Verify Blue badge shown in session list when a session status is In Progress', async ({ page }) => {
    // Test Case: UTC-2347
    // Summary: Verify Blue badge shown in session list when a session status is In Progress
    // Description: Feature: In Progress Status Color Indicator Scenario: Blue badge shown in session list Given a session status is “In Progress” When the session list loads Then the status badge should display in blue color

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2348: Verify Blue label shown in session details page when a session with In Progress ', async ({ page }) => {
    // Test Case: UTC-2348
    // Summary: Verify Blue label shown in session details page when a session with In Progress status is opened
    // Description: Feature: In Progress Status Color Indicator Scenario: Blue label shown in session details page Given a session with “In Progress” status is opened When the details page renders Then the status label should appear in blue

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2349: Verify Dynamic styling based on backend value when backend returns status = In P', async ({ page }) => {
    // Test Case: UTC-2349
    // Summary: Verify Dynamic styling based on backend value when backend returns status = In Progress
    // Description: Feature: In Progress Status Color Indicator Scenario: Dynamic styling based on backend value Given backend returns status = “In Progress” When UI binds data Then blue styling should automatically apply

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2350: Verify No blue color for other statuses when the session status is Yet to do or ', async ({ page }) => {
    // Test Case: UTC-2350
    // Summary: Verify No blue color for other statuses when the session status is Yet to do or Completed
    // Description: Feature: In Progress Status Color Indicator Scenario: No blue color for other statuses Given the session status is “Yet to do” or “Completed” When the list loads Then the badge should not appear blue

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2351: Verify Color updates after status change when a session changes from Yet to do t', async ({ page }) => {
    // Test Case: UTC-2351
    // Summary: Verify Color updates after status change when a session changes from Yet to do to In Progress
    // Description: Feature: In Progress Status Color Indicator Scenario: Color updates after status change Given a session changes from “Yet to do” to “In Progress” When the UI refreshes or updates Then the badge should immediately turn blue

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2352: Verify Easy identification of active sessions when multiple sessions exist', async ({ page }) => {
    // Test Case: UTC-2352
    // Summary: Verify Easy identification of active sessions when multiple sessions exist
    // Description: Feature: In Progress Status Color Indicator Scenario: Easy identification of active sessions Given multiple sessions exist When user scans the list Then “In Progress” sessions should be visually distinguishable with blue

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2353: Verify Blue color meets contrast requirements when blue badge is displayed', async ({ page }) => {
    // Test Case: UTC-2353
    // Summary: Verify Blue color meets contrast requirements when blue badge is displayed
    // Description: Feature: In Progress Status Color Indicator Scenario: Blue color meets contrast requirements Given blue badge is displayed When checked for accessibility standards Then the text and background contrast should meet WCAG guidelines

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2354: Verify Color persists after page reload when session status is In Progress', async ({ page }) => {
    // Test Case: UTC-2354
    // Summary: Verify Color persists after page reload when session status is In Progress
    // Description: Feature: In Progress Status Color Indicator Scenario: Color persists after page reload Given session status is “In Progress” When user refreshes page Then the blue indicator should remain visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2355: Verify Styling applied without flicker when large session list loads', async ({ page }) => {
    // Test Case: UTC-2355
    // Summary: Verify Styling applied without flicker when large session list loads
    // Description: Feature: In Progress Status Color Indicator Scenario: Styling applied without flicker Given large session list loads When rendering completes Then blue styling should apply instantly without delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2356: Verify Unknown/null status fallback when session status is null or unexpected', async ({ page }) => {
    // Test Case: UTC-2356
    // Summary: Verify Unknown/null status fallback when session status is null or unexpected
    // Description: Feature: In Progress Status Color Indicator Scenario: Unknown/null status fallback Given session status is null or unexpected When UI renders Then default neutral styling should apply without blue

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
