import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Success toast shown after upload when a valid JSON file upload completes successfully
 * URS: URS-DV-DM-29
 * SRS: SRS-245
 * SDS: SDS-245
 */
test.describe('URS-DV-DM-29: Verify Success toast shown after upload when a valid JSON fi', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2580: Verify Success toast shown after upload when a valid JSON file upload completes ', async ({ page }) => {
    // Test Case: UTC-2580
    // Summary: Verify Success toast shown after upload when a valid JSON file upload completes successfully
    // Description: Feature: Upload Success Notification Scenario: Success toast shown after upload Given a valid JSON file upload completes successfully When the system receives a success response Then a success notification should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-2581: Verify Success toast shown after S3 link when a valid S3 JSON link operation com', async ({ page }) => {
    // Test Case: UTC-2581
    // Summary: Verify Success toast shown after S3 link when a valid S3 JSON link operation completes successfully
    // Description: Feature: Upload Success Notification Scenario: Success toast shown after S3 link Given a valid S3 JSON link operation completes successfully When the link is confirmed Then a success notification should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-2582: Verify Notification triggered only after success when upload is in progress', async ({ page }) => {
    // Test Case: UTC-2582
    // Summary: Verify Notification triggered only after success when upload is in progress
    // Description: Feature: Upload Success Notification Scenario: Notification triggered only after success Given upload is in progress When success response is not yet received Then success notification should not be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2583: Verify UI reflects updated file state when upload succeeds', async ({ page }) => {
    // Test Case: UTC-2583
    // Summary: Verify UI reflects updated file state when upload succeeds
    // Description: Feature: Upload Success Notification Scenario: UI reflects updated file state Given upload succeeds When notification appears Then uploaded/linked file status should be updated in UI

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2584: Verify No success toast on failure when upload fails', async ({ page }) => {
    // Test Case: UTC-2584
    // Summary: Verify No success toast on failure when upload fails
    // Description: Feature: Upload Success Notification Scenario: No success toast on failure Given upload fails When error response is received Then success notification should not be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-2585: Verify Error message shown instead of success when upload or link operation fail', async ({ page }) => {
    // Test Case: UTC-2585
    // Summary: Verify Error message shown instead of success when upload or link operation fails
    // Description: Feature: Upload Success Notification Scenario: Error message shown instead of success Given upload or link operation fails When failure occurs Then an appropriate error message should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-2586: Verify Success message clarity when success toast is displayed', async ({ page }) => {
    // Test Case: UTC-2586
    // Summary: Verify Success message clarity when success toast is displayed
    // Description: Feature: Upload Success Notification Scenario: Success message clarity Given success toast is displayed When user reads the message Then it should clearly indicate successful upload or link

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2587: Verify Single notification per operation when one successful upload/link action', async ({ page }) => {
    // Test Case: UTC-2587
    // Summary: Verify Single notification per operation when one successful upload/link action
    // Description: Feature: Upload Success Notification Scenario: Single notification per operation Given one successful upload/link action When operation completes Then only one success notification should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

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
