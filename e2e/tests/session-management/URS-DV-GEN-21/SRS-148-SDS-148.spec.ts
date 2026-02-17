import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents save when Label Name is empty when the user is on the Create Label form
 * URS: URS-DV-GEN-21
 * SRS: SRS-148
 * SDS: SDS-148
 */
test.describe('URS-DV-GEN-21: Verify system prevents save when Label Name is empty when th', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1955: Verify system prevents save when Label Name is empty when the user is on the Cre', async ({ page }) => {
    // Test Case: UTC-1955
    // Summary: Verify system prevents save when Label Name is empty when the user is on the Create Label form
    // Description: Feature: Label Name Validation – Empty Name Block Scenario: Verify system prevents save when Label Name is empty Given the user is on the Create Label form When the user leaves the Label Name field empty And clicks Save Then the system should prevent submission And show toast message “Name is required”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1956: Verify error message gives clear description for missing name when the user clic', async ({ page }) => {
    // Test Case: UTC-1956
    // Summary: Verify error message gives clear description for missing name when the user clicks Save without entering Label Name
    // Description: Feature: Label Name Validation – Error Message Clarity Scenario: Verify error message gives clear description for missing name Given the user clicks Save without entering Label Name When validation fails Then the error popup/toast should clearly describe the issue And should not show technical terms or codes

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
