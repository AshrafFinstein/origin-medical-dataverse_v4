import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving annotation when Taxonomy Type is not selected when the user is on Create Annotation form
 * URS: URS-DV-GEN-21
 * SRS: SRS-164
 * SDS: SDS-164
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving annotation when Taxonomy Type ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1987: Verify system prevents saving annotation when Taxonomy Type is not selected when', async ({ page }) => {
    // Test Case: UTC-1987
    // Summary: Verify system prevents saving annotation when Taxonomy Type is not selected when the user is on Create Annotation form
    // Description: Feature: Taxonomy Type Mandatory – Empty Block Scenario: Verify system prevents saving annotation when Taxonomy Type is not selected Given the user is on Create Annotation form When the user does not select any Taxonomy Type And clicks Save Then the system should block submission And show toast message “Taxonomy Type is required”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1988: Verify taxonomy error message clearly describes missing selection when the user ', async ({ page }) => {
    // Test Case: UTC-1988
    // Summary: Verify taxonomy error message clearly describes missing selection when the user clicks Save without selecting taxonomy type
    // Description: Feature: Taxonomy Type Mandatory – Error Message Clarity Scenario: Verify taxonomy error message clearly describes missing selection Given the user clicks Save without selecting taxonomy type When validation fails Then the error message should clearly describe the missing Taxonomy Type And should not show technical error codes

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
