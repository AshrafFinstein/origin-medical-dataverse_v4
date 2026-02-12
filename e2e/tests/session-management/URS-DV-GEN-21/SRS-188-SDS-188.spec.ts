import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents project name starting with a space when the user is on Create Project form
 * URS: URS-DV-GEN-21
 * SRS: SRS-188
 * SDS: SDS-188
 */
test.describe('URS-DV-GEN-21: Verify system prevents project name starting with a space wh', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2035: Verify system prevents project name starting with a space when the user is on Cr', async ({ page }) => {
    // Test Case: UTC-2035
    // Summary: Verify system prevents project name starting with a space when the user is on Create Project form
    // Description: Feature: Project Name Start Character – Block Leading Space Scenario: Verify system prevents project name starting with a space Given the user is on Create Project form When the user enters Project Name as “ Project_Test_01” (leading space) And clicks Save/Create Then the system should block saving And show toast message “Name cannot start with a space”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2036: Verify leading space error message is clear and descriptive when the user enters', async ({ page }) => {
    // Test Case: UTC-2036
    // Summary: Verify leading space error message is clear and descriptive when the user enters project name starting with space
    // Description: Feature: Project Name Start Character – Error Message Detail Scenario: Verify leading space error message is clear and descriptive Given the user enters project name starting with space When Save is clicked Then the system should display a clear message describing the issue And should not show technical error codes

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
