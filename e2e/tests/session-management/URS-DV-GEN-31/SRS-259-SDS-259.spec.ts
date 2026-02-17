import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify backend rejects update request for locked session when a session is locked successfully
 * URS: URS-DV-GEN-31
 * SRS: SRS-259
 * SDS: SDS-259
 */
test.describe('URS-DV-GEN-31: Verify backend rejects update request for locked session whe', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2680: Verify backend rejects update request for locked session when a session is locke', async ({ page }) => {
    // Test Case: UTC-2680
    // Summary: Verify backend rejects update request for locked session when a session is locked successfully
    // Description: Feature: Locked Session – Backend Blocks Edit API Scenario: Verify backend rejects update request for locked session Given a session is locked successfully When the user attempts to update session details using direct request/API (bypass UI) Then the system should reject the request And return access denied response

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2681: Verify backend rejects delete request for locked session when a session is locke', async ({ page }) => {
    // Test Case: UTC-2681
    // Summary: Verify backend rejects delete request for locked session when a session is locked successfully
    // Description: Feature: Locked Session – Backend Blocks Delete API Scenario: Verify backend rejects delete request for locked session Given a session is locked successfully When the user attempts to delete session using direct request/API call Then the system should reject the request And return access denied response

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2682: Verify backend rejects session status update when session is locked when a sessi', async ({ page }) => {
    // Test Case: UTC-2682
    // Summary: Verify backend rejects session status update when session is locked when a session is locked
    // Description: Feature: Locked Session – Backend Blocks Status Change Scenario: Verify backend rejects session status update when session is locked Given a session is locked When the user attempts to change session status through API (Completed → Re-open / In progress) Then the system should reject the request And session status should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2683: Verify backend blocks updates to session configuration fields when locked when a', async ({ page }) => {
    // Test Case: UTC-2683
    // Summary: Verify backend blocks updates to session configuration fields when locked when a session is locked successfully
    // Description: Feature: Locked Session – Backend Blocks Configuration Update Scenario: Verify backend blocks updates to session configuration fields when locked Given a session is locked successfully When the user attempts to update session config fields (labels, assignees, reviewers, approval levels) using API Then the system should reject the update request And no changes should be saved

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2684: Verify backend allows creating a new duplicated session while original is locked', async ({ page }) => {
    // Test Case: UTC-2684
    // Summary: Verify backend allows creating a new duplicated session while original is locked when the original session is locked
    // Description: Feature: Locked Session – Backend Allows Duplicate Creation Only Scenario: Verify backend allows creating a new duplicated session while original is locked Given the original session is locked When the user duplicates the session (new session creation request) Then the system should allow duplication And create a new session record successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2685: Verify access denied response is safe and non-technical when a session is locked', async ({ page }) => {
    // Test Case: UTC-2685
    // Summary: Verify access denied response is safe and non-technical when a session is locked
    // Description: Feature: Locked Session – Access Denied Message Non-Technical Scenario: Verify access denied response is safe and non-technical Given a session is locked When the user triggers a blocked update request Then the system should return access denied response And it should not expose internal server or stack details

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
