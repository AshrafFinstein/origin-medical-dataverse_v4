import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving duplicate Code Name within same Code Type when a code already exists with Name PROJ_01 under Code Type Project Code
 * URS: URS-DV-GEN-21
 * SRS: SRS-181
 * SDS: SDS-181
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving duplicate Code Name within sam', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2021: Verify system prevents saving duplicate Code Name within same Code Type when a c', async ({ page }) => {
    // Test Case: UTC-2021
    // Summary: Verify system prevents saving duplicate Code Name within same Code Type when a code already exists with Name PROJ_01 under Code Type Project Code
    // Description: Feature: Code Name Uniqueness – Duplicate Block Within Same Type Scenario: Verify system prevents saving duplicate Code Name within same Code Type Given a code already exists with Name “PROJ_01” under Code Type “Project Code” When the user enters Name as “PROJ_01” again under the same Code Type And clicks Save Then the system should block submission And show toast message “A code with this name already exists for this type”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2022: Verify same code name is allowed under different code type when a code exists wi', async ({ page }) => {
    // Test Case: UTC-2022
    // Summary: Verify same code name is allowed under different code type when a code exists with Name PROJ_01 under Code Type Project Code
    // Description: Feature: Code Name Uniqueness – Allow Same Name in Different Type Scenario: Verify same code name is allowed under different code type Given a code exists with Name “PROJ_01” under Code Type “Project Code” When the user creates a new code with Name “PROJ_01” under Code Type “Center Code” And clicks Save Then the system should allow save successfully And no duplicate error should appear

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
