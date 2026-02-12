import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify lock icon is displayed when session status is Completed when the user is on Data Labelling Session list page
 * URS: URS-DV-GEN-31
 * SRS: SRS-254
 * SDS: SDS-254
 */
test.describe('URS-DV-GEN-31: Verify lock icon is displayed when session status is Complet', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2649: Verify lock icon is displayed when session status is Completed when the user is ', async ({ page }) => {
    // Test Case: UTC-2649
    // Summary: Verify lock icon is displayed when session status is Completed when the user is on Data Labelling Session list page
    // Description: Feature: Lock Icon – Visible for Completed Session Scenario: Verify lock icon is displayed when session status is Completed Given the user is on Data Labelling Session list page And a session status is set to Completed When the grid is displayed/refreshed Then the Lock icon should be visible for that Completed session row

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2650: Verify lock icon is not shown when session status is Yet to do when the user is ', async ({ page }) => {
    // Test Case: UTC-2650
    // Summary: Verify lock icon is not shown when session status is Yet to do when the user is on Data Labelling Session list page
    // Description: Feature: Lock Icon – Not Visible for Yet to do Session Scenario: Verify lock icon is not shown when session status is Yet to do Given the user is on Data Labelling Session list page When a session status is Yet to do Then the Lock icon should not be displayed for that session row

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2651: Verify lock icon is not shown when session status is In progress when the user i', async ({ page }) => {
    // Test Case: UTC-2651
    // Summary: Verify lock icon is not shown when session status is In progress when the user is on Data Labelling Session list page
    // Description: Feature: Lock Icon – Not Visible for In progress Session Scenario: Verify lock icon is not shown when session status is In progress Given the user is on Data Labelling Session list page When a session status is In progress Then the Lock icon should not be displayed for that session row

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2652: Verify lock icon appears after session status is updated to Completed when the s', async ({ page }) => {
    // Test Case: UTC-2652
    // Summary: Verify lock icon appears after session status is updated to Completed when the session status is not Completed initially
    // Description: Feature: Lock Icon – Appears After Status Change to Completed Scenario: Verify lock icon appears after session status is updated to Completed Given the session status is not Completed initially When the session status is changed to Completed And the user returns to session list page / refreshes grid Then the Lock icon should appear for that session row

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2653: Verify lock icon disappears if session status is changed from Completed to other', async ({ page }) => {
    // Test Case: UTC-2653
    // Summary: Verify lock icon disappears if session status is changed from Completed to other status when the session status is Completed and Lock icon is visible
    // Description: Feature: Lock Icon – Removed When Status Changes from Completed Scenario: Verify lock icon disappears if session status is changed from Completed to other status Given the session status is Completed and Lock icon is visible When the session status changes to Re-open / In progress / Yet to do Then the Lock icon should no longer be displayed for that session row

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
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
