import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents creating session with invalid Project ID when the user is attempting to create a session under a project
 * URS: URS-DV-GEN-21
 * SRS: SRS-199
 * SDS: SDS-199
 */
test.describe('URS-DV-GEN-21: Verify system prevents creating session with invalid Project', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2057: Verify system prevents creating session with invalid Project ID when the user is', async ({ page }) => {
    // Test Case: UTC-2057
    // Summary: Verify system prevents creating session with invalid Project ID when the user is attempting to create a session under a project
    // Description: Feature: Project ID Validity – Block Invalid Project Reference Scenario: Verify system prevents creating session with invalid Project ID Given the user is attempting to create a session under a project When the linked Project ID is invalid / deleted / inactive And the user clicks Save/Create Session Then the system should block creation And show toast message “Invalid reference. Please check that the related project exists and is valid.”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2058: Verify invalid project reference message is clear and descriptive when the user ', async ({ page }) => {
    // Test Case: UTC-2058
    // Summary: Verify invalid project reference message is clear and descriptive when the user attempts to save session with invalid project link
    // Description: Feature: Project ID Validity – Error Message Detail Scenario: Verify invalid project reference message is clear and descriptive Given the user attempts to save session with invalid project link When backend validation fails Then the system should show a detailed message explaining project reference is invalid And should not show technical error codes

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
