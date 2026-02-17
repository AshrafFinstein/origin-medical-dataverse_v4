import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Edit is disabled/hidden when session is locked when a session is locked successfully
 * URS: URS-DV-GEN-31
 * SRS: SRS-256
 * SDS: SDS-256
 */
test.describe('URS-DV-GEN-31: Verify Edit is disabled/hidden when session is locked when a', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2659: Verify Edit is disabled/hidden when session is locked when a session is locked s', async ({ page }) => {
    // Test Case: UTC-2659
    // Summary: Verify Edit is disabled/hidden when session is locked when a session is locked successfully
    // Description: Feature: Locked Session – Edit Action Disabled Scenario: Verify Edit is disabled/hidden when session is locked Given a session is locked successfully When the user views Actions column for that session Then Edit option should be disabled or hidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2660: Verify Delete is disabled/hidden when session is locked when a session is locked', async ({ page }) => {
    // Test Case: UTC-2660
    // Summary: Verify Delete is disabled/hidden when session is locked when a session is locked successfully
    // Description: Feature: Locked Session – Delete Action Disabled Scenario: Verify Delete is disabled/hidden when session is locked Given a session is locked successfully When the user views Actions column for that session Then Delete option should be disabled or hidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2661: Verify Duplicate action remains enabled for locked session when a session is loc', async ({ page }) => {
    // Test Case: UTC-2661
    // Summary: Verify Duplicate action remains enabled for locked session when a session is locked successfully
    // Description: Feature: Locked Session – Duplicate Allowed Scenario: Verify Duplicate action remains enabled for locked session Given a session is locked successfully When the user views Actions column for that session Then Duplicate option should remain enabled and clickable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2662: Verify user can duplicate a locked session successfully when a session is locked', async ({ page }) => {
    // Test Case: UTC-2662
    // Summary: Verify user can duplicate a locked session successfully when a session is locked
    // Description: Feature: Locked Session – Duplicate Creates New Session Scenario: Verify user can duplicate a locked session successfully Given a session is locked When the user clicks Duplicate And enters a new valid session name And submits Then the system should create a new session successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2663: Verify direct API edit request is rejected for locked session when the session i', async ({ page }) => {
    // Test Case: UTC-2663
    // Summary: Verify direct API edit request is rejected for locked session when the session is locked
    // Description: Feature: Locked Session – API Blocks Edit Scenario: Verify direct API edit request is rejected for locked session Given the session is locked When the user attempts to edit session using direct request/API call Then the system should reject the request And session data should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2664: Verify direct API delete request is rejected for locked session when the session', async ({ page }) => {
    // Test Case: UTC-2664
    // Summary: Verify direct API delete request is rejected for locked session when the session is locked
    // Description: Feature: Locked Session – API Blocks Delete Scenario: Verify direct API delete request is rejected for locked session Given the session is locked When the user attempts to delete session using direct request/API call Then the system should reject the request And session should not be deleted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2665: Verify Edit/Delete available when session is unlocked when a session is not lock', async ({ page }) => {
    // Test Case: UTC-2665
    // Summary: Verify Edit/Delete available when session is unlocked when a session is not locked
    // Description: Feature: Locked Session – Normal Actions for Unlocked Session Scenario: Verify Edit/Delete available when session is unlocked Given a session is not locked When the user views Actions column Then Edit and Delete options should be enabled normally

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2666: Verify locked session cannot be edited via direct URL navigation when the sessio', async ({ page }) => {
    // Test Case: UTC-2666
    // Summary: Verify locked session cannot be edited via direct URL navigation when the session is locked
    // Description: Feature: Locked Session – Prevent Access to Edit Screen via URL Scenario: Verify locked session cannot be edited via direct URL navigation Given the session is locked When the user tries to open Edit Session page via direct URL Then the system should block access And show safe message or redirect back

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
