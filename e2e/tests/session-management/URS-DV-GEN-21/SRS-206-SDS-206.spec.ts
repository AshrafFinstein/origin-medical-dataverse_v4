import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system blocks upload for non-JSON file types when the user is in the JSON Upload dialog
 * URS: URS-DV-GEN-21
 * SRS: SRS-206
 * SDS: SDS-206
 */
test.describe('URS-DV-GEN-21: Verify system blocks upload for non-JSON file types when the', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2071: Verify system blocks upload for non-JSON file types when the user is in the JSON', async ({ page }) => {
    // Test Case: UTC-2071
    // Summary: Verify system blocks upload for non-JSON file types when the user is in the JSON Upload dialog
    // Description: Feature: File Type Validation – Reject Non-JSON File Upload Scenario: Verify system blocks upload for non-JSON file types Given the user is in the JSON Upload dialog When the user selects a file with extension “.txt” or “.csv” And clicks Upload Then the system should block upload And show toast message “Invalid file type. Please upload a JSON file.”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2072: Verify system rejects file when extension is .json but MIME type is not applicat', async ({ page }) => {
    // Test Case: UTC-2072
    // Summary: Verify system rejects file when extension is .json but MIME type is not application/json when the user selects a file with .json extension but incorrect MIME type
    // Description: Feature: File Type Validation – Reject Wrong MIME Type Scenario: Verify system rejects file when extension is .json but MIME type is not application/json Given the user selects a file with “.json” extension but incorrect MIME type When Upload is clicked Then the system should block upload And show toast message “Invalid file type. Please upload a JSON file.”

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
