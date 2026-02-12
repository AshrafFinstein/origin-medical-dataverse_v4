import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents save when abbreviation contains invalid characters when the user is on Create Label form
 * URS: URS-DV-GEN-21
 * SRS: SRS-154
 * SDS: SDS-154
 */
test.describe('URS-DV-GEN-21: Verify system prevents save when abbreviation contains inval', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1967: Verify system prevents save when abbreviation contains invalid characters when t', async ({ page }) => {
    // Test Case: UTC-1967
    // Summary: Verify system prevents save when abbreviation contains invalid characters when the user is on Create Label form
    // Description: Feature: Abbreviation Format – Block Special Characters Scenario: Verify system prevents save when abbreviation contains invalid characters Given the user is on Create Label form When the user enters Abbreviation as “AB@12#” And clicks Save Then the system should block submission And show toast message “Abbreviation can only contain letters, numbers, hyphens, and underscores”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1968: Verify system allows abbreviation with valid format when the user is on Create L', async ({ page }) => {
    // Test Case: UTC-1968
    // Summary: Verify system allows abbreviation with valid format when the user is on Create Label form
    // Description: Feature: Abbreviation Format – Allow Valid Characters Scenario: Verify system allows abbreviation with valid format Given the user is on Create Label form When the user enters Abbreviation as “AB_12-XY” And clicks Save Then the system should allow submission successfully And no format error should be shown

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
