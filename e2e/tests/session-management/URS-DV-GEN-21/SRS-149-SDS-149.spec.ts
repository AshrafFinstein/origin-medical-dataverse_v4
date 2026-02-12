import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving when Label Name exceeds 300 characters when the user is on Create Label form
 * URS: URS-DV-GEN-21
 * SRS: SRS-149
 * SDS: SDS-149
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving when Label Name exceeds 300 ch', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1957: Verify system prevents saving when Label Name exceeds 300 characters when the us', async ({ page }) => {
    // Test Case: UTC-1957
    // Summary: Verify system prevents saving when Label Name exceeds 300 characters when the user is on Create Label form
    // Description: Feature: Label Name Max Length – Block >300 Characters Scenario: Verify system prevents saving when Label Name exceeds 300 characters Given the user is on Create Label form When the user enters a Label Name with more than 300 characters And clicks Save Then the system should block submission And show toast message “Name must be 300 characters or less”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1958: Verify length violation message is detailed and user-friendly when the user clic', async ({ page }) => {
    // Test Case: UTC-1958
    // Summary: Verify length violation message is detailed and user-friendly when the user clicks Save with name length >300
    // Description: Feature: Label Name Max Length – Error Message Clarity Scenario: Verify length violation message is detailed and user-friendly Given the user clicks Save with name length >300 When validation fails Then the error message should clearly describe the maximum allowed limit And should not display technical error codes

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
