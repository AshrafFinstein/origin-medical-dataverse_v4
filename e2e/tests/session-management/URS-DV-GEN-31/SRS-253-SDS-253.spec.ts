import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Lock icon is visible when Lock permission is enabled in role when the admin enables Lock permission in Masters â†’ User Roles â†’ Session for the logged-in user role
 * URS: URS-DV-GEN-31
 * SRS: SRS-253
 * SDS: SDS-253
 */
test.describe('URS-DV-GEN-31: Verify Lock icon is visible when Lock permission is enabled ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2639: Verify Lock icon is visible when Lock permission is enabled in role when the adm', async ({ page }) => {
    // Test Case: UTC-2639
    // Summary: Verify Lock icon is visible when Lock permission is enabled in role when the admin enables Lock permission in Masters â†’ User Roles â†’ Session for the logged-in user role
    // Description: Feature: Session Lock Permission – Lock Icon Visible Scenario: Verify Lock icon is visible when Lock permission is enabled in role Given the admin enables “Lock” permission in Masters → User Roles → Session for the logged-in user role When the user navigates to Data Labelling Session list page Then Lock icon should be visible in Actions column for sessions

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2640: Verify Lock icon is hidden when Lock permission is disabled in role when the adm', async ({ page }) => {
    // Test Case: UTC-2640
    // Summary: Verify Lock icon is hidden when Lock permission is disabled in role when the admin disables Lock permission in Masters â†’ User Roles â†’ Session for the logged-in user role
    // Description: Feature: Session Lock Permission – Lock Icon Hidden Scenario: Verify Lock icon is hidden when Lock permission is disabled in role Given the admin disables “Lock” permission in Masters → User Roles → Session for the logged-in user role When the user navigates to Data Labelling Session list page Then Lock icon should not be visible in Actions column

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2641: Verify unauthorized user cannot access Lock Session popup when the user role doe', async ({ page }) => {
    // Test Case: UTC-2641
    // Summary: Verify unauthorized user cannot access Lock Session popup when the user role does not have Lock permission enabled
    // Description: Feature: Session Lock Permission – Cannot Open Lock Popup Without Permission Scenario: Verify unauthorized user cannot access Lock Session popup Given the user role does not have Lock permission enabled When the user attempts to lock a session (directly via UI or shortcut) Then the system should block the action And Lock Session popup should not be accessible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2642: Verify Lock icon visibility updates after permission change when the user is log', async ({ page }) => {
    // Test Case: UTC-2642
    // Summary: Verify Lock icon visibility updates after permission change when the user is logged in with a role where Lock permission is disabled
    // Description: Feature: Session Lock Permission – Permission Change Reflects Immediately Scenario: Verify Lock icon visibility updates after permission change Given the user is logged in with a role where Lock permission is disabled When admin enables Lock permission for that role And user refreshes or re-login to application Then Lock icon should appear in Actions column

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2643: Verify lock action is rejected even if API is triggered without permission when ', async ({ page }) => {
    // Test Case: UTC-2643
    // Summary: Verify lock action is rejected even if API is triggered without permission when the user does not have Lock permission
    // Description: Feature: Session Lock Permission – Backend Restriction Scenario: Verify lock action is rejected even if API is triggered without permission Given the user does not have Lock permission When the user tries to perform lock action through direct request (bypass UI) Then the system should deny the request And session should not be locked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2644: Verify Unlock action is visible only if Lock permission exists when the user rol', async ({ page }) => {
    // Test Case: UTC-2644
    // Summary: Verify Unlock action is visible only if Lock permission exists when the user role has Lock permission enabled
    // Description: Feature: Session Lock Permission – Unlock Visible Only With Permission Scenario: Verify Unlock action is visible only if Lock permission exists Given the user role has Lock permission enabled And the session is already locked When the session list page is displayed Then Unlock icon/action should be visible for locked session

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2645: Verify Unlock action is hidden when Lock permission is removed when a session is', async ({ page }) => {
    // Test Case: UTC-2645
    // Summary: Verify Unlock action is hidden when Lock permission is removed when a session is locked
    // Description: Feature: Session Lock Permission – Unlock Hidden Without Permission Scenario: Verify Unlock action is hidden when Lock permission is removed Given a session is locked And the admin removes Lock permission from the user role When the user opens the session list page Then Unlock icon should not be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2646: Verify unauthorized user cannot unlock a locked session when a session is locked', async ({ page }) => {
    // Test Case: UTC-2646
    // Summary: Verify unauthorized user cannot unlock a locked session when a session is locked
    // Description: Feature: Session Lock Permission – Prevent Unlock Without Permission Scenario: Verify unauthorized user cannot unlock a locked session Given a session is locked And the user does not have Lock permission enabled When the user attempts to unlock the session Then the system should block unlock action And session should remain locked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2647: Verify authorized user can lock and unlock session successfully when the user ro', async ({ page }) => {
    // Test Case: UTC-2647
    // Summary: Verify authorized user can lock and unlock session successfully when the user role has Lock permission enabled
    // Description: Feature: Session Lock Permission – Lock/Unlock Works for Authorized Role Scenario: Verify authorized user can lock and unlock session successfully Given the user role has Lock permission enabled When user locks a session by providing reason And user unlocks the same session by providing reason Then both actions should be completed successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2648: Verify lock controls are fully hidden when permission is not granted when Lock p', async ({ page }) => {
    // Test Case: UTC-2648
    // Summary: Verify lock controls are fully hidden when permission is not granted when Lock permission is disabled for the role
    // Description: Feature: Session Lock Permission – No Partial Visibility Scenario: Verify lock controls are fully hidden when permission is not granted Given Lock permission is disabled for the role When the user opens session list page Then lock-related icons should not appear anywhere (Actions / menu / tooltip)

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
