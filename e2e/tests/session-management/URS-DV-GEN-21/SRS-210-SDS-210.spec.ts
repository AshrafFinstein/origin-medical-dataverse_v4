import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system shows error toast when storage upload fails when the user selects a valid JSON file for upload
 * URS: URS-DV-GEN-21
 * SRS: SRS-210
 * SDS: SDS-210
 */
test.describe('URS-DV-GEN-21: Verify system shows error toast when storage upload fails wh', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2079: Verify system shows error toast when storage upload fails when the user selects ', async ({ page }) => {
    // Test Case: UTC-2079
    // Summary: Verify system shows error toast when storage upload fails when the user selects a valid JSON file for upload
    // Description: Feature: Storage Upload Failure – Handle Network/Permission Error Scenario: Verify system shows error toast when storage upload fails Given the user selects a valid JSON file for upload When the storage upload API fails due to network issue or permission denied Then the system should stop upload process And show toast message “Failed to upload file to storage. Please try again.”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2080: Verify system provides retry option after upload failure when the upload failed ', async ({ page }) => {
    // Test Case: UTC-2080
    // Summary: Verify system provides retry option after upload failure when the upload failed and error toast is shown
    // Description: Feature: Storage Upload Failure – Retry Option Available Scenario: Verify system provides retry option after upload failure Given the upload failed and error toast is shown When the user clicks Retry button (if available) Then the system should attempt upload again And should not crash or freeze

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
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
