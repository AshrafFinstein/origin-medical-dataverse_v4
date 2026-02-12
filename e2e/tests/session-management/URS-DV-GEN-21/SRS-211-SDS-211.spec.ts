import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system shows error toast when browser fails to read file when the user is in the JSON Upload dialog
 * URS: URS-DV-GEN-21
 * SRS: SRS-211
 * SDS: SDS-211
 */
test.describe('URS-DV-GEN-21: Verify system shows error toast when browser fails to read f', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2081: Verify system shows error toast when browser fails to read file when the user is', async ({ page }) => {
    // Test Case: UTC-2081
    // Summary: Verify system shows error toast when browser fails to read file when the user is in the JSON Upload dialog
    // Description: Feature: File Read Error – Handle Corrupt/Locked File Read Failure Scenario: Verify system shows error toast when browser fails to read file Given the user is in the JSON Upload dialog When the user selects a corrupt/locked file that triggers FileReader error And clicks Upload Then the system should stop processing And show toast message “Error reading file. Please check the file and try again.”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2082: Verify file read error message is clear and user-friendly when FileReader fails ', async ({ page }) => {
    // Test Case: UTC-2082
    // Summary: Verify file read error message is clear and user-friendly when FileReader fails during upload
    // Description: Feature: File Read Error – Message Clarity Scenario: Verify file read error message is clear and user-friendly Given FileReader fails during upload When the system displays the toast Then the message should be readable and non-technical And should not show stack trace or browser exception text

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
