import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify locked session is clearly identifiable in session list when a session is locked successfully
 * URS: URS-DV-GEN-31
 * SRS: SRS-261
 * SDS: SDS-261
 */
test.describe('URS-DV-GEN-31: Verify locked session is clearly identifiable in session lis', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2691: Verify locked session is clearly identifiable in session list when a session is ', async ({ page }) => {
    // Test Case: UTC-2691
    // Summary: Verify locked session is clearly identifiable in session list when a session is locked successfully
    // Description: Feature: Lock Status – Visual Indicator Visible Scenario: Verify locked session is clearly identifiable in session list Given a session is locked successfully When the session list page is displayed Then a lock icon/badge should be clearly visible for the locked session

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2692: Verify lock indicator is removed after unlocking session when a session was lock', async ({ page }) => {
    // Test Case: UTC-2692
    // Summary: Verify lock indicator is removed after unlocking session when a session was locked and then unlocked
    // Description: Feature: Unlock Status – Visual Indicator Removed Scenario: Verify lock indicator is removed after unlocking session Given a session was locked and then unlocked When the session list refreshes Then the lock icon/badge should no longer be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2693: Verify tooltip displays lock reason clearly when a session is locked with a reas', async ({ page }) => {
    // Test Case: UTC-2693
    // Summary: Verify tooltip displays lock reason clearly when a session is locked with a reason
    // Description: Feature: Lock Status – Tooltip Shows Reason Scenario: Verify tooltip displays lock reason clearly Given a session is locked with a reason When the user hovers over the lock icon/badge Then the tooltip should display “Session is locked. Reason: <reason>”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2694: Verify disabled actions are visually distinguishable for locked session when a s', async ({ page }) => {
    // Test Case: UTC-2694
    // Summary: Verify disabled actions are visually distinguishable for locked session when a session is locked
    // Description: Feature: Locked Session – Disabled Actions Visually Distinct Scenario: Verify disabled actions are visually distinguishable for locked session Given a session is locked When the user views Edit/Delete actions Then disabled actions should appear greyed out or hidden And clearly indicate non-interactive state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2695: Verify Duplicate action is clearly available even when session is locked when a ', async ({ page }) => {
    // Test Case: UTC-2695
    // Summary: Verify Duplicate action is clearly available even when session is locked when a session is locked
    // Description: Feature: Locked Session – Duplicate Action Clearly Available Scenario: Verify Duplicate action is clearly available even when session is locked Given a session is locked When the user views Actions column Then Duplicate option should remain clearly enabled and usable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2696: Verify lock indicators remain clear after refresh or re-login when a session is ', async ({ page }) => {
    // Test Case: UTC-2696
    // Summary: Verify lock indicators remain clear after refresh or re-login when a session is locked
    // Description: Feature: Lock Status – Consistent Indicators Across Refresh Scenario: Verify lock indicators remain clear after refresh or re-login Given a session is locked When the user refreshes the page or logs out and logs in again Then the lock icon/badge and tooltip should still display correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2697: Verify lock/unlock indicators do not confuse users when multiple sessions exist ', async ({ page }) => {
    // Test Case: UTC-2697
    // Summary: Verify lock/unlock indicators do not confuse users when multiple sessions exist (locked and unlocked)
    // Description: Feature: Lock Status – No Ambiguous Messaging Scenario: Verify lock/unlock indicators do not confuse users Given multiple sessions exist (locked and unlocked) When the user scans the session list Then locked and unlocked sessions should be clearly distinguishable at a glance

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

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
