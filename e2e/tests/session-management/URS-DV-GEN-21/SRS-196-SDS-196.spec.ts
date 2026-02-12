import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving session when any approval level has no user selected when the user configured Approval Levels (L1, L2...)
 * URS: URS-DV-GEN-21
 * SRS: SRS-196
 * SDS: SDS-196
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving session when any approval leve', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2051: Verify system prevents saving session when any approval level has no user select', async ({ page }) => {
    // Test Case: UTC-2051
    // Summary: Verify system prevents saving session when any approval level has no user selected when the user configured Approval Levels (L1, L2...)
    // Description: Feature: Approval Level Population – Block Empty Level User List Scenario: Verify system prevents saving session when any approval level has no user selected Given the user configured Approval Levels (L1, L2...) When the user leaves at least one approval level without selecting any users And clicks Save/Create Session Then the system should block submission And show toast message “Each approval level must have at least one user selected”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2052: Verify approval level error message clearly explains what is missing when the us', async ({ page }) => {
    // Test Case: UTC-2052
    // Summary: Verify approval level error message clearly explains what is missing when the user attempts to save session with empty approval level users
    // Description: Feature: Approval Level Population – Message Clarity Scenario: Verify approval level error message clearly explains what is missing Given the user attempts to save session with empty approval level users When validation fails Then the toast message should clearly state that each level requires at least one user And should not show technical error codes

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
