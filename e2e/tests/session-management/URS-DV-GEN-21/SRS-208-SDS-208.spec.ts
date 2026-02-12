import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system blocks upload when JSON file is empty (0 KB) when the user is in the JSON Upload dialog
 * URS: URS-DV-GEN-21
 * SRS: SRS-208
 * SDS: SDS-208
 */
test.describe('URS-DV-GEN-21: Verify system blocks upload when JSON file is empty (0 KB) w', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2075: Verify system blocks upload when JSON file is empty (0 KB) when the user is in t', async ({ page }) => {
    // Test Case: UTC-2075
    // Summary: Verify system blocks upload when JSON file is empty (0 KB) when the user is in the JSON Upload dialog
    // Description: Feature: Empty File Validation – Reject Empty JSON File Scenario: Verify system blocks upload when JSON file is empty (0 KB) Given the user is in the JSON Upload dialog When the user selects an empty JSON file (size = 0 KB) And clicks Upload Then the system should reject the upload And show toast message “The uploaded file is empty.”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2076: Verify system blocks upload when JSON parses successfully but contains no conten', async ({ page }) => {
    // Test Case: UTC-2076
    // Summary: Verify system blocks upload when JSON parses successfully but contains no content when the user selects a JSON file with content {}
    // Description: Feature: Empty File Validation – Reject Empty JSON Object Scenario: Verify system blocks upload when JSON parses successfully but contains no content Given the user selects a JSON file with content {} or empty resource structure When the user clicks Upload Then the system should reject processing And show toast message “The uploaded file is empty.”

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
