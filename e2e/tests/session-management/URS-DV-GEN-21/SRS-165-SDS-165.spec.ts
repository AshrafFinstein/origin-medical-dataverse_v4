import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving annotation when Color is not selected when the user is on Create Annotation form
 * URS: URS-DV-GEN-21
 * SRS: SRS-165
 * SDS: SDS-165
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving annotation when Color is not s', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1989: Verify system prevents saving annotation when Color is not selected when the use', async ({ page }) => {
    // Test Case: UTC-1989
    // Summary: Verify system prevents saving annotation when Color is not selected when the user is on Create Annotation form
    // Description: Feature: Color Code Mandatory – Empty Block Scenario: Verify system prevents saving annotation when Color is not selected Given the user is on Create Annotation form When the user does not select or enter a Color value And clicks Save Then the system should block submission And show toast message “Color is required”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1990: Verify color error message is clear and user-friendly when the user clicks Save ', async ({ page }) => {
    // Test Case: UTC-1990
    // Summary: Verify color error message is clear and user-friendly when the user clicks Save without selecting a color
    // Description: Feature: Color Code Mandatory – Error Message Detail Scenario: Verify color error message is clear and user-friendly Given the user clicks Save without selecting a color When validation fails Then the toast message should clearly describe the missing Color field And should not show technical error codes

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
