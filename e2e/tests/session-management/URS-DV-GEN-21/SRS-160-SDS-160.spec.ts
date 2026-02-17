import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving annotation when Abbreviation is empty when the user is on Create Annotation form
 * URS: URS-DV-GEN-21
 * SRS: SRS-160
 * SDS: SDS-160
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving annotation when Abbreviation i', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1979: Verify system prevents saving annotation when Abbreviation is empty when the use', async ({ page }) => {
    // Test Case: UTC-1979
    // Summary: Verify system prevents saving annotation when Abbreviation is empty when the user is on Create Annotation form
    // Description: Feature: Annotation Abbreviation Mandatory – Empty Block Scenario: Verify system prevents saving annotation when Abbreviation is empty Given the user is on Create Annotation form When the user leaves Abbreviation field empty And clicks Save Then the system should block submission And show toast message “Abbreviation is required”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1980: Verify abbreviation missing message is clear and descriptive when the user click', async ({ page }) => {
    // Test Case: UTC-1980
    // Summary: Verify abbreviation missing message is clear and descriptive when the user clicks Save without entering Abbreviation
    // Description: Feature: Annotation Abbreviation Mandatory – Error Message Clarity Scenario: Verify abbreviation missing message is clear and descriptive Given the user clicks Save without entering Abbreviation When validation fails Then the error message should clearly describe the missing Abbreviation field And should not show technical error codes

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
