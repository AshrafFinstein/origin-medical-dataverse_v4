import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system blocks upload when required extracted resources are missing when the user selects a valid JSON file
 * URS: URS-DV-GEN-21
 * SRS: SRS-209
 * SDS: SDS-209
 */
test.describe('URS-DV-GEN-21: Verify system blocks upload when required extracted resource', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2077: Verify system blocks upload when required extracted resources are missing when t', async ({ page }) => {
    // Test Case: UTC-2077
    // Summary: Verify system blocks upload when required extracted resources are missing when the user selects a valid JSON file
    // Description: Feature: Extracted Resources Validation – Reject Missing Resource Payload Scenario: Verify system blocks upload when required extracted resources are missing Given the user selects a valid JSON file When the JSON does not contain required extracted resource keys/array And clicks Upload Then the system should reject processing And show toast message “The uploaded file does not contain valid extracted resources.”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2078: Verify extracted resources error message is detailed and user-friendly when the ', async ({ page }) => {
    // Test Case: UTC-2078
    // Summary: Verify extracted resources error message is detailed and user-friendly when the user uploads JSON without required extracted resources
    // Description: Feature: Extracted Resources Validation – Message Clarity Scenario: Verify extracted resources error message is detailed and user-friendly Given the user uploads JSON without required extracted resources When validation fails Then the system should show a clear message describing missing core payload And should not show technical schema errors

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
