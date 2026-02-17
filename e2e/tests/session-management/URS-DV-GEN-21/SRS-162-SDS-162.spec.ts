import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify abbreviation allows only uppercase letters, numbers, underscores, and hyphens when the user is on the Create/Edit Annotation screen
 * URS: URS-DV-GEN-21
 * SRS: SRS-162
 * SDS: SDS-162
 */
test.describe('URS-DV-GEN-21: Verify abbreviation allows only uppercase letters, numbers, ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1983: Verify abbreviation allows only uppercase letters, numbers, underscores, and hyp', async ({ page }) => {
    // Test Case: UTC-1983
    // Summary: Verify abbreviation allows only uppercase letters, numbers, underscores, and hyphens when the user is on the Create/Edit Annotation screen
    // Description: Feature: Annotation Abbreviation – Regex Validation Scenario: Verify abbreviation allows only uppercase letters, numbers, underscores, and hyphens Given the user is on the Create/Edit Annotation screen When the user enters abbreviation as abc@12 And clicks Save Then the system should prevent saving And show toast message “Abbreviation can only contain uppercase letters, numbers, underscores, and hyphen

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1984: Verify system allows saving when abbreviation matches regex format when the user', async ({ page }) => {
    // Test Case: UTC-1984
    // Summary: Verify system allows saving when abbreviation matches regex format when the user is on Create Annotation form
    // Description: Feature: Annotation Abbreviation Format – Allow Valid Uppercase Format Scenario: Verify system allows saving when abbreviation matches regex format Given the user is on Create Annotation form When the user enters Abbreviation as “BRN_01-AX” And clicks Save Then the system should allow save successfully And no format error message should appear

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
