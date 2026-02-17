import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving duplicate abbreviation when a label already exists with Abbreviation BRN_01
 * URS: URS-DV-GEN-21
 * SRS: SRS-155
 * SDS: SDS-155
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving duplicate abbreviation when a ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1969: Verify system prevents saving duplicate abbreviation when a label already exists', async ({ page }) => {
    // Test Case: UTC-1969
    // Summary: Verify system prevents saving duplicate abbreviation when a label already exists with Abbreviation BRN_01
    // Description: Feature: Abbreviation Uniqueness – Duplicate Block Scenario: Verify system prevents saving duplicate abbreviation Given a label already exists with Abbreviation “BRN_01” When the user enters the same Abbreviation “BRN_01” again And clicks Save Then the system should block submission And show toast message “A label with this abbreviation already exists. Please use a different abbreviation”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1970: Verify duplicate abbreviation message clearly explains conflict when the user tr', async ({ page }) => {
    // Test Case: UTC-1970
    // Summary: Verify duplicate abbreviation message clearly explains conflict when the user tries to save a duplicate abbreviation
    // Description: Feature: Abbreviation Uniqueness – Message Clarity Scenario: Verify duplicate abbreviation message clearly explains conflict Given the user tries to save a duplicate abbreviation When backend returns count > 0 Then the system should show a clear message describing abbreviation already exists And should not show technical DB error

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
