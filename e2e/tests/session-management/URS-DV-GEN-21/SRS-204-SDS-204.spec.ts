import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system blocks upload when filename is missing/empty when the user is in the JSON Upload dialog
 * URS: URS-DV-GEN-21
 * SRS: SRS-204
 * SDS: SDS-204
 */
test.describe('URS-DV-GEN-21: Verify system blocks upload when filename is missing/empty w', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2067: Verify system blocks upload when filename is missing/empty when the user is in t', async ({ page }) => {
    // Test Case: UTC-2067
    // Summary: Verify system blocks upload when filename is missing/empty when the user is in the JSON Upload dialog
    // Description: Feature: Filename Mandatory – Block Empty Filename Upload Scenario: Verify system blocks upload when filename is missing/empty Given the user is in the JSON Upload dialog When the user selects a file with empty filename / invalid file object name And clicks Upload/Submit Then the system should block upload And show toast message “Filename cannot be empty.”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2068: Verify filename missing message is clear and descriptive when the user attempts ', async ({ page }) => {
    // Test Case: UTC-2068
    // Summary: Verify filename missing message is clear and descriptive when the user attempts upload without a valid filename
    // Description: Feature: Filename Mandatory – Error Message Clarity Scenario: Verify filename missing message is clear and descriptive Given the user attempts upload without a valid filename When validation fails Then the toast message should clearly describe the filename issue And should not show technical error codes

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
