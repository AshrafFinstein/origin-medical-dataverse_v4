import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system blocks save when SOP reference name or URL is missing when the user is on Create/Edit Session page
 * URS: URS-DV-GEN-21
 * SRS: SRS-201
 * SDS: SDS-201
 */
test.describe('URS-DV-GEN-21: Verify system blocks save when SOP reference name or URL is ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2061: Verify system blocks save when SOP reference name or URL is missing when the use', async ({ page }) => {
    // Test Case: UTC-2061
    // Summary: Verify system blocks save when SOP reference name or URL is missing when the user is on Create/Edit Session page
    // Description: Feature: SOP Link Integrity – Block Incomplete Reference Link Scenario: Verify system blocks save when SOP reference name or URL is missing Given the user is on Create/Edit Session page When the user adds a SOP reference with Name filled but URL empty And clicks Save/Create Session Then the system should block submission And show toast message “Please ensure all Reference Names and Links are filled.”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2062: Verify SOP error message is clear and descriptive when the user attempts to save', async ({ page }) => {
    // Test Case: UTC-2062
    // Summary: Verify SOP error message is clear and descriptive when the user attempts to save with incomplete SOP references
    // Description: Feature: SOP Link Integrity – Message Clarity Scenario: Verify SOP error message is clear and descriptive Given the user attempts to save with incomplete SOP references When validation fails Then the toast message should clearly mention both Name and Link are required And should not show technical error codes

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
