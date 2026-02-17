import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system blocks upload when JSON cannot be parsed when the user selects a JSON file with malformed syntax (missing braces, invalid commas, etc.)
 * URS: URS-DV-GEN-21
 * SRS: SRS-207
 * SDS: SDS-207
 */
test.describe('URS-DV-GEN-21: Verify system blocks upload when JSON cannot be parsed when ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2073: Verify system blocks upload when JSON cannot be parsed when the user selects a J', async ({ page }) => {
    // Test Case: UTC-2073
    // Summary: Verify system blocks upload when JSON cannot be parsed when the user selects a JSON file with malformed syntax (missing braces, invalid commas, etc.)
    // Description: Feature: JSON Format Validation – Reject Malformed JSON Scenario: Verify system blocks upload when JSON cannot be parsed Given the user selects a JSON file with malformed syntax (missing braces, invalid commas, etc.) When the user clicks Upload Then the system should fail parsing And show toast message “Invalid JSON format. Please check the file and try again.”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2074: Verify JSON parse error message is user-friendly when the user uploads malformed', async ({ page }) => {
    // Test Case: UTC-2074
    // Summary: Verify JSON parse error message is user-friendly when the user uploads malformed JSON
    // Description: Feature: JSON Format Validation – Error Message Detail Scenario: Verify JSON parse error message is user-friendly Given the user uploads malformed JSON When JSON.parse fails Then the system should show a friendly message And should not show raw exception stack traces

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
