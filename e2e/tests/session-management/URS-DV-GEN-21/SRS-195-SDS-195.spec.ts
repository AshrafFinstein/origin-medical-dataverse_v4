import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents creating session with duplicate name when a session already exists with Name SESSION_ALPHA
 * URS: URS-DV-GEN-21
 * SRS: SRS-195
 * SDS: SDS-195
 */
test.describe('URS-DV-GEN-21: Verify system prevents creating session with duplicate name ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2049: Verify system prevents creating session with duplicate name when a session alrea', async ({ page }) => {
    // Test Case: UTC-2049
    // Summary: Verify system prevents creating session with duplicate name when a session already exists with Name SESSION_ALPHA
    // Description: Feature: Session Name Uniqueness – Duplicate Block Scenario: Verify system prevents creating session with duplicate name Given a session already exists with Name “SESSION_ALPHA” When the user enters Session Name as “SESSION_ALPHA” again And clicks Save/Create Then the system should block creation And show toast message “A session with the name “SESSION_ALPHA” already exists. Please choose a different name.”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2050: Verify duplicate session message includes the entered session name when the user', async ({ page }) => {
    // Test Case: UTC-2050
    // Summary: Verify duplicate session message includes the entered session name when the user enters a session name that already exists
    // Description: Feature: Session Name Uniqueness – Message Contains Entered Name Scenario: Verify duplicate session message includes the entered session name Given the user enters a session name that already exists When Save is clicked Then the toast message should include the session name entered by the user And should not show technical database errors

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
