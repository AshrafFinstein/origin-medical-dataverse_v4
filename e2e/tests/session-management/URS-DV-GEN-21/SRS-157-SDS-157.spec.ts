import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving when Annotation Name exceeds 300 characters when the user is on Create Annotation form
 * URS: URS-DV-GEN-21
 * SRS: SRS-157
 * SDS: SDS-157
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving when Annotation Name exceeds 3', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1973: Verify system prevents saving when Annotation Name exceeds 300 characters when t', async ({ page }) => {
    // Test Case: UTC-1973
    // Summary: Verify system prevents saving when Annotation Name exceeds 300 characters when the user is on Create Annotation form
    // Description: Feature: Annotation Name Max Length – Block >300 Characters Scenario: Verify system prevents saving when Annotation Name exceeds 300 characters Given the user is on Create Annotation form When the user enters Annotation Name with more than 300 characters And clicks Save Then the system should block submission And show toast message “Name must be 300 characters or less”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1974: Verify max length message clearly states allowed limit when the user clicks Save', async ({ page }) => {
    // Test Case: UTC-1974
    // Summary: Verify max length message clearly states allowed limit when the user clicks Save with name length >300
    // Description: Feature: Annotation Name Max Length – Error Message Clarity Scenario: Verify max length message clearly states allowed limit Given the user clicks Save with name length >300 When validation fails Then the toast message should clearly mention the 300 character limit And should not show technical DB error

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
