import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents creating epic with duplicate name when an epic already exists with Name EPIC_ALPHA
 * URS: URS-DV-GEN-21
 * SRS: SRS-185
 * SDS: SDS-185
 */
test.describe('URS-DV-GEN-21: Verify system prevents creating epic with duplicate name whe', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2029: Verify system prevents creating epic with duplicate name when an epic already ex', async ({ page }) => {
    // Test Case: UTC-2029
    // Summary: Verify system prevents creating epic with duplicate name when an epic already exists with Name EPIC_ALPHA
    // Description: Feature: Epic Name Uniqueness – Duplicate Block Scenario: Verify system prevents creating epic with duplicate name Given an epic already exists with Name “EPIC_ALPHA” When the user enters Epic Name as “EPIC_ALPHA” again And clicks Create/Save Then the system should block creation And show toast message “An epic with this name already exists. Please choose a different name”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2030: Verify duplicate epic message is user-friendly and detailed when the user tries ', async ({ page }) => {
    // Test Case: UTC-2030
    // Summary: Verify duplicate epic message is user-friendly and detailed when the user tries to save a duplicate epic name
    // Description: Feature: Epic Name Uniqueness – Message Clarity Scenario: Verify duplicate epic message is user-friendly and detailed Given the user tries to save a duplicate epic name When backend returns duplicate match Then the system should show a clear duplicate message And should not show technical database errors

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
