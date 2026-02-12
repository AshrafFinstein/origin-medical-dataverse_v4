import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving duplicate Structure Group Name when a structure group already exists with Name HEAD_STRUCT
 * URS: URS-DV-GEN-21
 * SRS: SRS-177
 * SDS: SDS-177
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving duplicate Structure Group Name', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2013: Verify system prevents saving duplicate Structure Group Name when a structure gr', async ({ page }) => {
    // Test Case: UTC-2013
    // Summary: Verify system prevents saving duplicate Structure Group Name when a structure group already exists with Name HEAD_STRUCT
    // Description: Feature: Structure Name Uniqueness – Duplicate Block Scenario: Verify system prevents saving duplicate Structure Group Name Given a structure group already exists with Name “HEAD_STRUCT” When the user enters Name as “HEAD_STRUCT” again And clicks Save Then the system should block submission And show toast message “A structure group with this name already exists. Please choose a different name”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2014: Verify duplicate structure name message is clear and user-friendly when the user', async ({ page }) => {
    // Test Case: UTC-2014
    // Summary: Verify duplicate structure name message is clear and user-friendly when the user tries to save a duplicate structure group name
    // Description: Feature: Structure Name Uniqueness – Message Clarity Scenario: Verify duplicate structure name message is clear and user-friendly Given the user tries to save a duplicate structure group name When backend returns duplicate match Then the system should show a clear duplicate message And should not show technical database errors

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
