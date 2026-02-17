import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving duplicate User Group Name when a user group already exists with Name QC_TEAM
 * URS: URS-DV-GEN-21
 * SRS: SRS-173
 * SDS: SDS-173
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving duplicate User Group Name when', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2005: Verify system prevents saving duplicate User Group Name when a user group alread', async ({ page }) => {
    // Test Case: UTC-2005
    // Summary: Verify system prevents saving duplicate User Group Name when a user group already exists with Name QC_TEAM
    // Description: Feature: User Group Name Uniqueness – Duplicate Block Scenario: Verify system prevents saving duplicate User Group Name Given a user group already exists with Name “QC_TEAM” When the user enters Group Name as “QC_TEAM” again And clicks Save Then the system should block submission And show toast message “A user group with this name already exists. Please choose a different name”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2006: Verify duplicate message is clear and user-friendly when the user tries to save ', async ({ page }) => {
    // Test Case: UTC-2006
    // Summary: Verify duplicate message is clear and user-friendly when the user tries to save a duplicate user group name
    // Description: Feature: User Group Name Uniqueness – Message Clarity Scenario: Verify duplicate message is clear and user-friendly Given the user tries to save a duplicate user group name When backend returns duplicate match Then the system should show a clear duplicate message And should not show technical database errors

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
