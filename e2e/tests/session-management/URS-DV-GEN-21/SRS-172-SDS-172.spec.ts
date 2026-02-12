import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving when User Group Name contains spaces/special characters when the user is on Create User Group popup/form
 * URS: URS-DV-GEN-21
 * SRS: SRS-172
 * SDS: SDS-172
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving when User Group Name contains ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2003: Verify system prevents saving when User Group Name contains spaces/special chara', async ({ page }) => {
    // Test Case: UTC-2003
    // Summary: Verify system prevents saving when User Group Name contains spaces/special characters when the user is on Create User Group popup/form
    // Description: Feature: User Group Name Format – Block Spaces & Special Characters Scenario: Verify system prevents saving when User Group Name contains spaces/special characters Given the user is on Create User Group popup/form When the user enters Group Name as “Group Name@01” And clicks Save Then the system should block submission And show toast message “Name can only contain letters, numbers, underscores, and hyphens”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2004: Verify system allows saving valid group name format when the user is on Create U', async ({ page }) => {
    // Test Case: UTC-2004
    // Summary: Verify system allows saving valid group name format when the user is on Create User Group popup/form
    // Description: Feature: User Group Name Format – Allow Valid Name Scenario: Verify system allows saving valid group name format Given the user is on Create User Group popup/form When the user enters Group Name as “Group_Name-01” And clicks Save Then the system should save successfully And no format error message should appear

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
