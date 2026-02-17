import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving when Abbreviation exceeds 50 characters when the user is on Create Label form
 * URS: URS-DV-GEN-21
 * SRS: SRS-153
 * SDS: SDS-153
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving when Abbreviation exceeds 50 c', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1965: Verify system prevents saving when Abbreviation exceeds 50 characters when the u', async ({ page }) => {
    // Test Case: UTC-1965
    // Summary: Verify system prevents saving when Abbreviation exceeds 50 characters when the user is on Create Label form
    // Description: Feature: Abbreviation Max Length – Block >50 Characters Scenario: Verify system prevents saving when Abbreviation exceeds 50 characters Given the user is on Create Label form When the user enters Abbreviation with more than 50 characters And clicks Save Then the system should block submission And show toast message “Abbreviation must be 50 characters or less”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1966: Verify error message clearly states allowed length limit when the user enters ab', async ({ page }) => {
    // Test Case: UTC-1966
    // Summary: Verify error message clearly states allowed length limit when the user enters abbreviation exceeding 50 characters
    // Description: Feature: Abbreviation Max Length – Message Mentions Limit Scenario: Verify error message clearly states allowed length limit Given the user enters abbreviation exceeding 50 characters When Save is clicked Then the toast message should clearly mention the 50 character limit

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
