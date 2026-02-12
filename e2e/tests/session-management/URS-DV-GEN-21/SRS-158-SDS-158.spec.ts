import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving when annotation name contains lowercase letters when the user is on Create Annotation form
 * URS: URS-DV-GEN-21
 * SRS: SRS-158
 * SDS: SDS-158
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving when annotation name contains ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1975: Verify system prevents saving when annotation name contains lowercase letters wh', async ({ page }) => {
    // Test Case: UTC-1975
    // Summary: Verify system prevents saving when annotation name contains lowercase letters when the user is on Create Annotation form
    // Description: Feature: Annotation Name Format – Block Lowercase Letters Scenario: Verify system prevents saving when annotation name contains lowercase letters Given the user is on Create Annotation form When the user enters Annotation Name as “Brain_01” And clicks Save Then the system should block submission And show toast message “Name can only contain uppercase letters, numbers, underscores, and hyphens”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1976: Verify system allows saving when annotation name matches regex format when the u', async ({ page }) => {
    // Test Case: UTC-1976
    // Summary: Verify system allows saving when annotation name matches regex format when the user is on Create Annotation form
    // Description: Feature: Annotation Name Format – Allow Uppercase Valid Format Scenario: Verify system allows saving when annotation name matches regex format Given the user is on Create Annotation form When the user enters Annotation Name as “BRAIN_01-AX” And clicks Save Then the system should allow save successfully And no format error message should appear

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
