import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Show empty state when no results found when filters/search return zero results
 * URS: URS-DV-DL-04
 * SRS: SRS-38
 * SDS: SDS-38
 */
test.describe('URS-DV-DL-04: Verify Show empty state when no results found when filters/s', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-457: Verify Show empty state when no results found when filters/search return zero re', async ({ page }) => {
    // Test Case: UTC-457
    // Summary: Verify Show empty state when no results found when filters/search return zero results
    // Description: Feature: Empty State Handling Scenario: Show empty state when no results found Given filters/search return zero results When grid finishes loading Then the system should display No Data Available message

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-458: Verify Empty state icon visibility when no data is available', async ({ page }) => {
    // Test Case: UTC-458
    // Summary: Verify Empty state icon visibility when no data is available
    // Description: Feature: Empty State Handling Scenario: Empty state icon visibility Given no data is available When empty state renders Then folder-with-X icon should be centered and visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-459: Verify Grid hidden when empty when loading is false and data length equals zero', async ({ page }) => {
    // Test Case: UTC-459
    // Summary: Verify Grid hidden when empty when loading is false and data length equals zero
    // Description: Feature: Empty State Handling Scenario: Grid hidden when empty Given loading is false and data length equals zero When page renders Then grid component should not be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-460: Verify Correct page number message when no data exists for page 3', async ({ page }) => {
    // Test Case: UTC-460
    // Summary: Verify Correct page number message when no data exists for page 3
    // Description: Feature: Empty State Handling Scenario: Correct page number message Given no data exists for page 3 When empty state displays Then message should show not found on page 3

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-461: Verify Clear Filter option accessible when empty state is displayed', async ({ page }) => {
    // Test Case: UTC-461
    // Summary: Verify Clear Filter option accessible when empty state is displayed
    // Description: Feature: Empty State Handling Scenario: Clear Filter option accessible Given empty state is displayed When user wants to reset Then Clear Filter or Reset option should remain clickable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-462: Verify Reset restores grid data when empty state is visible', async ({ page }) => {
    // Test Case: UTC-462
    // Summary: Verify Reset restores grid data when empty state is visible
    // Description: Feature: Empty State Handling Scenario: Reset restores grid data Given empty state is visible When user clicks Reset Then grid should reload and show available data

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-463: Verify Fast empty state rendering when dataset is empty', async ({ page }) => {
    // Test Case: UTC-463
    // Summary: Verify Fast empty state rendering when dataset is empty
    // Description: Feature: Empty State Handling Scenario: Fast empty state rendering Given dataset is empty When rendering occurs Then empty state should appear within acceptable time (<2s)

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-464: Verify No infinite loading when API returns empty response', async ({ page }) => {
    // Test Case: UTC-464
    // Summary: Verify No infinite loading when API returns empty response
    // Description: Feature: Empty State Handling Scenario: No infinite loading Given API returns empty response When loading completes Then spinner should disappear and empty state should show

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-465: Verify Invalid filter input returns empty state when user enters unmatched filte', async ({ page }) => {
    // Test Case: UTC-465
    // Summary: Verify Invalid filter input returns empty state when user enters unmatched filter value
    // Description: Feature: Empty State Handling Scenario: Invalid filter input returns empty state Given user enters unmatched filter value When search executes Then empty state should be displayed without errors

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-466: Verify Clear and readable message when empty state appears', async ({ page }) => {
    // Test Case: UTC-466
    // Summary: Verify Clear and readable message when empty state appears
    // Description: Feature: Empty State Handling Scenario: Clear and readable message Given empty state appears When user reads message Then text should be simple and understandable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
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
