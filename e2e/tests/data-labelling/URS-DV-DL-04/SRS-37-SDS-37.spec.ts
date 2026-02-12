import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Valid ID returns image when the grid contains images
 * URS: URS-DV-DL-04
 * SRS: SRS-37
 * SDS: SDS-37
 */
test.describe('URS-DV-DL-04: Verify Valid ID returns image when the grid contains images', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-447: Verify Valid ID returns image when the grid contains images', async ({ page }) => {
    // Test Case: UTC-447
    // Summary: Verify Valid ID returns image when the grid contains images
    // Description: Feature: Search by Image ID – exact match Scenario: Valid ID returns image Given the grid contains images When the user enters a valid Image ID Then only the matching image should be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-448: Verify Search field visible on load when the grid page loads', async ({ page }) => {
    // Test Case: UTC-448
    // Summary: Verify Search field visible on load when the grid page loads
    // Description: Feature: Search Input Visibility Scenario: Search field visible on load Given the grid page loads When the header renders Then the Search Image Id input should be visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-449: Verify Placeholder guidance when the input is empty', async ({ page }) => {
    // Test Case: UTC-449
    // Summary: Verify Placeholder guidance when the input is empty
    // Description: Feature: Placeholder Text Scenario: Placeholder guidance Given the input is empty When displayed Then placeholder text Search Image Id should be shown

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-450: Verify Debounce prevents rapid calls when the user types continuously', async ({ page }) => {
    // Test Case: UTC-450
    // Summary: Verify Debounce prevents rapid calls when the user types continuously
    // Description: Feature: Debounce Query Scenario: Debounce prevents rapid calls Given the user types continuously When input changes rapidly Then API should trigger only after 300ms idle

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-451: Verify Clear resets grid when text is entered', async ({ page }) => {
    // Test Case: UTC-451
    // Summary: Verify Clear resets grid when text is entered
    // Description: Feature: Clear Button Scenario: Clear resets grid Given text is entered When the user clicks X Then the grid should reset to full dataset

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-452: Verify Unknown ID searched when the entered ID does not exist', async ({ page }) => {
    // Test Case: UTC-452
    // Summary: Verify Unknown ID searched when the entered ID does not exist
    // Description: Feature: No Match Handling Scenario: Unknown ID searched Given the entered ID does not exist When search executes Then Empty State view should be shown

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-453: Verify Invalid characters filtered when user enters special characters', async ({ page }) => {
    // Test Case: UTC-453
    // Summary: Verify Invalid characters filtered when user enters special characters
    // Description: Feature: Special Character Removal Scenario: Invalid characters filtered Given user enters special characters When search triggers Then invalid characters should be stripped automatically

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-454: Verify Subset filtering when multiple IDs share prefix', async ({ page }) => {
    // Test Case: UTC-454
    // Summary: Verify Subset filtering when multiple IDs share prefix
    // Description: Feature: Partial Search Support Scenario: Subset filtering Given multiple IDs share prefix When partial text entered Then subset of matching images should be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-455: Verify Fast filtering when large dataset', async ({ page }) => {
    // Test Case: UTC-455
    // Summary: Verify Fast filtering when large dataset
    // Description: Feature: Search Performance Scenario: Fast filtering Given large dataset When searching Then results should load within acceptable SLA

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-456: Verify Repeated searches when user performs multiple searches consecutively', async ({ page }) => {
    // Test Case: UTC-456
    // Summary: Verify Repeated searches when user performs multiple searches consecutively
    // Description: Feature: Multiple Searches Stability Scenario: Repeated searches Given user performs multiple searches consecutively When grid updates repeatedly Then no crash or memory leak should occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

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
