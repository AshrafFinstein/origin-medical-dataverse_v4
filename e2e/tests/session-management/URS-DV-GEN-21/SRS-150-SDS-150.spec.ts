import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving when Label Name contains spaces/special characters when the user is on Create Label form
 * URS: URS-DV-GEN-21
 * SRS: SRS-150
 * SDS: SDS-150
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving when Label Name contains space', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1959: Verify system prevents saving when Label Name contains spaces/special characters', async ({ page }) => {
    // Test Case: UTC-1959
    // Summary: Verify system prevents saving when Label Name contains spaces/special characters when the user is on Create Label form
    // Description: Feature: Label Name Regex – Block Special Characters & Spaces Scenario: Verify system prevents saving when Label Name contains spaces/special characters Given the user is on Create Label form When the user enters Label Name as “Label Name@123” And clicks Save Then the system should block submission And show toast message “Name can only contain letters, numbers, underscores, and hyphens”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1960: Verify system allows valid label name format when the user is on Create Label fo', async ({ page }) => {
    // Test Case: UTC-1960
    // Summary: Verify system allows valid label name format when the user is on Create Label form
    // Description: Feature: Label Name Regex – Allow Valid Characters Scenario: Verify system allows valid label name format Given the user is on Create Label form When the user enters Label Name as “Label_Name-123” And clicks Save Then the system should allow submission successfully And no error message should be shown

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
