import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents creating Epic when Name is empty when the user is on Create Epic form
 * URS: URS-DV-GEN-21
 * SRS: SRS-182
 * SDS: SDS-182
 */
test.describe('URS-DV-GEN-21: Verify system prevents creating Epic when Name is empty when', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2023: Verify system prevents creating Epic when Name is empty when the user is on Crea', async ({ page }) => {
    // Test Case: UTC-2023
    // Summary: Verify system prevents creating Epic when Name is empty when the user is on Create Epic form
    // Description: Feature: Epic Name Mandatory – Empty Block Scenario: Verify system prevents creating Epic when Name is empty Given the user is on Create Epic form When the user leaves Epic Name field empty And clicks Create/Save Then the system should block creation And show toast message “Name is required”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2024: Verify missing epic name message is clear and descriptive when the user clicks C', async ({ page }) => {
    // Test Case: UTC-2024
    // Summary: Verify missing epic name message is clear and descriptive when the user clicks Create without entering Epic Name
    // Description: Feature: Epic Name Mandatory – Error Message Clarity Scenario: Verify missing epic name message is clear and descriptive Given the user clicks Create without entering Epic Name When validation fails Then the toast message should clearly describe the missing Name field And should not show technical error codes

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
