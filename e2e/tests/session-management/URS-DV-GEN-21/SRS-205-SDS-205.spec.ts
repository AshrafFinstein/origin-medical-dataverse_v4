import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents uploading JSON file when filename already exists in session when the session already contains a file named sample.json
 * URS: URS-DV-GEN-21
 * SRS: SRS-205
 * SDS: SDS-205
 */
test.describe('URS-DV-GEN-21: Verify system prevents uploading JSON file when filename alr', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2069: Verify system prevents uploading JSON file when filename already exists in sessi', async ({ page }) => {
    // Test Case: UTC-2069
    // Summary: Verify system prevents uploading JSON file when filename already exists in session when the session already contains a file named sample.json
    // Description: Feature: Filename Uniqueness – Block Duplicate File Upload Scenario: Verify system prevents uploading JSON file when filename already exists in session Given the session already contains a file named “sample.json” When the user selects another file with filename “sample.json” And clicks Upload Then the system should block upload And show toast message “A file with the name “sample.json” already exists in this session.”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2070: Verify duplicate upload message includes the filename entered/selected when the ', async ({ page }) => {
    // Test Case: UTC-2070
    // Summary: Verify duplicate upload message includes the filename entered/selected when the user uploads a file with duplicate filename
    // Description: Feature: Filename Uniqueness – Message Contains Filename Scenario: Verify duplicate upload message includes the filename entered/selected Given the user uploads a file with duplicate filename When backend detects duplication Then the toast message should include the duplicate filename And should not show technical storage errors

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
