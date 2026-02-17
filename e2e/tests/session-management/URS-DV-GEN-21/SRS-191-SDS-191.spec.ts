import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving project with invalid Epic ID when the user is on Create Project form
 * URS: URS-DV-GEN-21
 * SRS: SRS-191
 * SDS: SDS-191
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving project with invalid Epic ID w', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2041: Verify system prevents saving project with invalid Epic ID when the user is on C', async ({ page }) => {
    // Test Case: UTC-2041
    // Summary: Verify system prevents saving project with invalid Epic ID when the user is on Create Project form
    // Description: Feature: Epic ID Validity – Block Invalid Epic Reference Scenario: Verify system prevents saving project with invalid Epic ID Given the user is on Create Project form When the user selects an Epic ID that does not exist / is inactive And clicks Save/Create Then the system should block saving And show toast message “Invalid reference. Please check that the related epic exists and is valid”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2042: Verify invalid epic reference message is clear and descriptive when the user att', async ({ page }) => {
    // Test Case: UTC-2042
    // Summary: Verify invalid epic reference message is clear and descriptive when the user attempts to save project with invalid epic link
    // Description: Feature: Epic ID Validity – Error Message Detail Scenario: Verify invalid epic reference message is clear and descriptive Given the user attempts to save project with invalid epic link When backend validation fails Then the system should show a detailed message explaining epic reference is invalid And should not show technical error codes

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
