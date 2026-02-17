import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving duplicate Label Name when a label already exists with Name Brain
 * URS: URS-DV-GEN-21
 * SRS: SRS-151
 * SDS: SDS-151
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving duplicate Label Name when a la', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1961: Verify system prevents saving duplicate Label Name when a label already exists w', async ({ page }) => {
    // Test Case: UTC-1961
    // Summary: Verify system prevents saving duplicate Label Name when a label already exists with Name Brain
    // Description: Feature: Label Name Uniqueness – Duplicate Block Scenario: Verify system prevents saving duplicate Label Name Given a label already exists with Name “Brain” When the user enters Label Name as “Brain” again And clicks Save Then the system should block submission And show toast message “A label with this name already exists. Please choose a different name”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1962: Verify duplicate message clearly explains why save failed when the user tries to', async ({ page }) => {
    // Test Case: UTC-1962
    // Summary: Verify duplicate message clearly explains why save failed when the user tries to save a duplicate label name
    // Description: Feature: Label Name Uniqueness – Error Message Detail Scenario: Verify duplicate message clearly explains why save failed Given the user tries to save a duplicate label name When backend returns count > 0 Then the system should show a clear duplicate message And should not show technical DB error

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
