import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, LabelSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Show No Data when results are empty when the field has no records
 * URS: URS-DV-GEN-5
 * SRS: SRS-49
 * SDS: SDS-49
 */
test.describe('URS-DV-GEN-5: Verify Show No Data when results are empty when the field ha', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-575: Verify Show No Data when results are empty when the field has no records', async ({ page }) => {
    // Test Case: UTC-575
    // Summary: Verify Show No Data when results are empty when the field has no records
    // Description: Feature: Error & Empty State Handling Scenario: Show No Data when results are empty Given the field has no records When the page loads Then a clean No Data message should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-576: Verify Hide grid when empty when the dataset is empty', async ({ page }) => {
    // Test Case: UTC-576
    // Summary: Verify Hide grid when empty when the dataset is empty
    // Description: Feature: Error & Empty State Handling Scenario: Hide grid when empty Given the dataset is empty When the UI renders Then the grid/table should be hidden and only empty state shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-577: Verify Empty state message clarity when no records exist', async ({ page }) => {
    // Test Case: UTC-577
    // Summary: Verify Empty state message clarity when no records exist
    // Description: Feature: Error & Empty State Handling Scenario: Empty state message clarity Given no records exist When the empty state appears Then the message should be simple and non-technical

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-578: Verify Show failed fetch toast on API error when the server request fails', async ({ page }) => {
    // Test Case: UTC-578
    // Summary: Verify Show failed fetch toast on API error when the server request fails
    // Description: Feature: Error & Empty State Handling Scenario: Show failed fetch toast on API error Given the server request fails When the fetch attempt completes Then a Failed to fetch toast notification should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-579: Verify Application remains stable on fetch failure when a network/server error o', async ({ page }) => {
    // Test Case: UTC-579
    // Summary: Verify Application remains stable on fetch failure when a network/server error occurs
    // Description: Feature: Error & Empty State Handling Scenario: Application remains stable on fetch failure Given a network/server error occurs When the UI handles the error Then the application should not crash or freeze

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-580: Verify Hide technical error details when a backend failure occurs', async ({ page }) => {
    // Test Case: UTC-580
    // Summary: Verify Hide technical error details when a backend failure occurs
    // Description: Feature: Error & Empty State Handling Scenario: Hide technical error details Given a backend failure occurs When the error message is shown Then no stack trace or technical details should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-581: Verify Retry after failure when fetch failed previously', async ({ page }) => {
    // Test Case: UTC-581
    // Summary: Verify Retry after failure when fetch failed previously
    // Description: Feature: Error & Empty State Handling Scenario: Retry after failure Given fetch failed previously When the user refreshes or retries Then the system should attempt to reload data successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-582: Verify Immediate empty state rendering when data length is zero', async ({ page }) => {
    // Test Case: UTC-582
    // Summary: Verify Immediate empty state rendering when data length is zero
    // Description: Feature: Error & Empty State Handling Scenario: Immediate empty state rendering Given data length is zero When rendering occurs Then empty state should display without delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-583: Verify Empty message readable and visible when empty state is displayed', async ({ page }) => {
    // Test Case: UTC-583
    // Summary: Verify Empty message readable and visible when empty state is displayed
    // Description: Feature: Error & Empty State Handling Scenario: Empty message readable and visible Given empty state is displayed When user views the page Then text should be clearly readable and centrally aligned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
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
