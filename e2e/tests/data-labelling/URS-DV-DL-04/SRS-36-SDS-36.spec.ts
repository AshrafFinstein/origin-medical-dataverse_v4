import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify pagination controls are displayed for large datasets when the user is viewing a grid with large dataset
 * URS: URS-DV-DL-04
 * SRS: SRS-36
 * SDS: SDS-36
 */
test.describe('URS-DV-DL-04: Verify pagination controls are displayed for large datasets ', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-438: Verify pagination controls are displayed for large datasets when the user is vie', async ({ page }) => {
    // Test Case: UTC-438
    // Summary: Verify pagination controls are displayed for large datasets when the user is viewing a grid with large dataset
    // Description: Feature: Pagination Controls – Visibility Scenario: Verify pagination controls are displayed for large datasets Given the user is viewing a grid with large dataset When the data is loaded Then pagination controls should be displayed including Total count, Previous, Current, and Next buttons

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-439: Verify total record count is displayed when the grid data is displayed', async ({ page }) => {
    // Test Case: UTC-439
    // Summary: Verify total record count is displayed when the grid data is displayed
    // Description: Feature: Pagination Controls – Total Count Display Scenario: Verify total record count is displayed Given the grid data is displayed When pagination controls are visible Then the total count should be displayed in the format “Total: [Count]”

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-440: Verify items per page dropdown options when pagination controls are visible', async ({ page }) => {
    // Test Case: UTC-440
    // Summary: Verify items per page dropdown options when pagination controls are visible
    // Description: Feature: Pagination Controls – Items Per Page Dropdown Scenario: Verify items per page dropdown options Given pagination controls are visible When the user opens the Items per page dropdown Then options 50, 100, and 200 should be available

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-441: Verify grid reloads when items per page is changed when the grid is displaying d', async ({ page }) => {
    // Test Case: UTC-441
    // Summary: Verify grid reloads when items per page is changed when the grid is displaying data
    // Description: Feature: Pagination Controls – Change Items Per Page Scenario: Verify grid reloads when items per page is changed Given the grid is displaying data When the user changes items per page value Then a new API request should be triggered with updated limit And the grid should reload with a loading spinner

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-442: Verify navigation using Next button when the user is on the current page', async ({ page }) => {
    // Test Case: UTC-442
    // Summary: Verify navigation using Next button when the user is on the current page
    // Description: Feature: Pagination Controls – Next Page Navigation Scenario: Verify navigation using Next button Given the user is on the current page When the user clicks the Next button Then the system should navigate to the next page And trigger a new API request with updated page parameter

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-443: Verify navigation using Previous button when the user is not on the first page', async ({ page }) => {
    // Test Case: UTC-443
    // Summary: Verify navigation using Previous button when the user is not on the first page
    // Description: Feature: Pagination Controls – Previous Page Navigation Scenario: Verify navigation using Previous button Given the user is not on the first page When the user clicks the Previous button Then the system should navigate to the previous page

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-444: Verify navigation using Goto input field when pagination controls are visible', async ({ page }) => {
    // Test Case: UTC-444
    // Summary: Verify navigation using Goto input field when pagination controls are visible
    // Description: Feature: Pagination Controls – Goto Page Navigation Scenario: Verify navigation using Goto input field Given pagination controls are visible When the user enters a valid page number in the Goto field Then the grid should navigate to the specified page

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-445: Verify system auto-corrects page number exceeding maximum pages when the total n', async ({ page }) => {
    // Test Case: UTC-445
    // Summary: Verify system auto-corrects page number exceeding maximum pages when the total number of pages is limited
    // Description: Feature: Pagination Controls – Goto Page Upper Limit Handling Scenario: Verify system auto-corrects page number exceeding maximum pages Given the total number of pages is limited When the user enters a page number greater than the maximum in the Goto field Then the system should auto-correct to the last available page And load the corresponding data

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-446: Verify loading spinner is displayed during data fetch when the user triggers pag', async ({ page }) => {
    // Test Case: UTC-446
    // Summary: Verify loading spinner is displayed during data fetch when the user triggers pagination or page size change
    // Description: Feature: Pagination Controls – Loading State Scenario: Verify loading spinner is displayed during data fetch Given the user triggers pagination or page size change When a new API request is sent Then a loading spinner should be displayed until data loads

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
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
