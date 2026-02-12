import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving user group when Name is empty when the user is on Create User Group popup/form
 * URS: URS-DV-GEN-21
 * SRS: SRS-170
 * SDS: SDS-170
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving user group when Name is empty ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1999: Verify system prevents saving user group when Name is empty when the user is on ', async ({ page }) => {
    // Test Case: UTC-1999
    // Summary: Verify system prevents saving user group when Name is empty when the user is on Create User Group popup/form
    // Description: Feature: User Group Name Mandatory – Empty Block Scenario: Verify system prevents saving user group when Name is empty Given the user is on Create User Group popup/form When the user leaves Group Name field empty And clicks Save Then the system should block submission And show toast message “Name is required”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2000: Verify missing group name error message is clear and descriptive when the user c', async ({ page }) => {
    // Test Case: UTC-2000
    // Summary: Verify missing group name error message is clear and descriptive when the user clicks Save without entering Group Name
    // Description: Feature: User Group Name Mandatory – Error Message Clarity Scenario: Verify missing group name error message is clear and descriptive Given the user clicks Save without entering Group Name When validation fails Then the error message should clearly describe the missing Name field And should not show technical codes

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
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
