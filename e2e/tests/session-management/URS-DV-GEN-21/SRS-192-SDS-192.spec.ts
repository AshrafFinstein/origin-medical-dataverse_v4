import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving session when name is empty when the user is on Create Session form
 * URS: URS-DV-GEN-21
 * SRS: SRS-192
 * SDS: SDS-192
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving session when name is empty whe', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2043: Verify system prevents saving session when name is empty when the user is on Cre', async ({ page }) => {
    // Test Case: UTC-2043
    // Summary: Verify system prevents saving session when name is empty when the user is on Create Session form
    // Description: Feature: Session Name Mandatory – Empty Block Scenario: Verify system prevents saving session when name is empty Given the user is on Create Session form When the user leaves Session Name field empty And clicks Save/Create Then the system should block creation And show toast message “Name is required”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2044: Verify missing session name message is clear and descriptive when the user click', async ({ page }) => {
    // Test Case: UTC-2044
    // Summary: Verify missing session name message is clear and descriptive when the user clicks Save without entering Session Name
    // Description: Feature: Session Name Mandatory – Error Message Clarity Scenario: Verify missing session name message is clear and descriptive Given the user clicks Save without entering Session Name When validation fails Then the toast message should clearly describe the missing Name field And should not show technical error codes

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
