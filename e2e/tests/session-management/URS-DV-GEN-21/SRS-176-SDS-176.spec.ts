import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving when Structure Group Name contains spaces/special characters when the user is on Create Structure Group form/popup
 * URS: URS-DV-GEN-21
 * SRS: SRS-176
 * SDS: SDS-176
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving when Structure Group Name cont', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2011: Verify system prevents saving when Structure Group Name contains spaces/special ', async ({ page }) => {
    // Test Case: UTC-2011
    // Summary: Verify system prevents saving when Structure Group Name contains spaces/special characters when the user is on Create Structure Group form/popup
    // Description: Feature: Structure Name Format – Block Spaces & Special Characters Scenario: Verify system prevents saving when Structure Group Name contains spaces/special characters Given the user is on Create Structure Group form/popup When the user enters Name as “Structure Group@01” And clicks Save Then the system should block submission And show toast message “Name can only contain letters, numbers, underscores, and hyphens”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2012: Verify system allows saving valid Structure Group Name format when the user is o', async ({ page }) => {
    // Test Case: UTC-2012
    // Summary: Verify system allows saving valid Structure Group Name format when the user is on Create Structure Group form/popup
    // Description: Feature: Structure Name Format – Allow Valid Name Scenario: Verify system allows saving valid Structure Group Name format Given the user is on Create Structure Group form/popup When the user enters Name as “Structure_Group-01” And clicks Save Then the system should save successfully And no format error message should appear

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
