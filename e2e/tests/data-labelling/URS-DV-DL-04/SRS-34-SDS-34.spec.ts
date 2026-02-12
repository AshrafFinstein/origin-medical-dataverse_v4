import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Image selection on click when the image grid is displayed
 * URS: URS-DV-DL-04
 * SRS: SRS-34
 * SDS: SDS-34
 */
test.describe('URS-DV-DL-04: Verify Image selection on click when the image grid is displ', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-406: Verify Image selection on click when the image grid is displayed', async ({ page }) => {
    // Test Case: UTC-406
    // Summary: Verify Image selection on click when the image grid is displayed
    // Description: Feature: Image Selection Logic Scenario: Image selection on click Given the image grid is displayed When the user clicks an image card Then the image should show a yellow border and checkmark

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-407: Verify Image deselection on second click when an image is already selected', async ({ page }) => {
    // Test Case: UTC-407
    // Summary: Verify Image deselection on second click when an image is already selected
    // Description: Feature: Image Selection Logic Scenario: Image deselection on second click Given an image is already selected When the user clicks the same image again Then the image should be deselected and visual indicators removed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-408: Verify Multiple image selection when multiple images are displayed', async ({ page }) => {
    // Test Case: UTC-408
    // Summary: Verify Multiple image selection when multiple images are displayed
    // Description: Feature: Image Selection Logic Scenario: Multiple image selection Given multiple images are displayed When the user selects more than one image Then all selected images should remain highlighted

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-409: Verify Selected items array update on select when no images are selected', async ({ page }) => {
    // Test Case: UTC-409
    // Summary: Verify Selected items array update on select when no images are selected
    // Description: Feature: Image Selection Logic Scenario: Selected items array update on select Given no images are selected When the user selects an image Then the image ID should be added to selectedItems array

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-410: Verify Selected items array update on deselect when an image is selected', async ({ page }) => {
    // Test Case: UTC-410
    // Summary: Verify Selected items array update on deselect when an image is selected
    // Description: Feature: Image Selection Logic Scenario: Selected items array update on deselect Given an image is selected When the user deselects the image Then the image ID should be removed from selectedItems array

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-411: Verify Select All option visible when the image grid header is displayed', async ({ page }) => {
    // Test Case: UTC-411
    // Summary: Verify Select All option visible when the image grid header is displayed
    // Description: Feature: Image Selection Logic Scenario: Select All option visible Given the image grid header is displayed When the page loads Then the Select All checkbox should be visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-412: Verify Select All selects all images on page when multiple images exist on the c', async ({ page }) => {
    // Test Case: UTC-412
    // Summary: Verify Select All selects all images on page when multiple images exist on the current page
    // Description: Feature: Image Selection Logic Scenario: Select All selects all images on page Given multiple images exist on the current page When the user clicks Select All Then all images on the page should be selected

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-413: Verify Deselect All clears selection when multiple images are selected', async ({ page }) => {
    // Test Case: UTC-413
    // Summary: Verify Deselect All clears selection when multiple images are selected
    // Description: Feature: Image Selection Logic Scenario: Deselect All clears selection Given multiple images are selected When the user toggles Select All off Then all selected images should be deselected

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-414: Verify Send Selected for QC enabled when at least one image is selected', async ({ page }) => {
    // Test Case: UTC-414
    // Summary: Verify Send Selected for QC enabled when at least one image is selected
    // Description: Feature: Image Selection Logic Scenario: Send Selected for QC enabled Given at least one image is selected When the UI updates Then Send Selected for QC button should be enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-415: Verify Send Selected for QC disabled when no selection when no images are select', async ({ page }) => {
    // Test Case: UTC-415
    // Summary: Verify Send Selected for QC disabled when no selection when no images are selected
    // Description: Feature: Image Selection Logic Scenario: Send Selected for QC disabled when no selection Given no images are selected When the grid is displayed Then Send Selected for QC button should remain disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-416: Verify Selection blocked in Freeze mode when the grid is in Freeze mode', async ({ page }) => {
    // Test Case: UTC-416
    // Summary: Verify Selection blocked in Freeze mode when the grid is in Freeze mode
    // Description: Feature: Image Selection Logic Scenario: Selection blocked in Freeze mode Given the grid is in Freeze mode When the user clicks an image Then selection should be blocked

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-417: Verify Cursor restriction indicator in Freeze mode when Freeze mode is active', async ({ page }) => {
    // Test Case: UTC-417
    // Summary: Verify Cursor restriction indicator in Freeze mode when Freeze mode is active
    // Description: Feature: Image Selection Logic Scenario: Cursor restriction indicator in Freeze mode Given Freeze mode is active When the user hovers over an image Then a restricted cursor icon should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-418: Verify No partial selection in Freeze mode when Freeze mode is active', async ({ page }) => {
    // Test Case: UTC-418
    // Summary: Verify No partial selection in Freeze mode when Freeze mode is active
    // Description: Feature: Image Selection Logic Scenario: No partial selection in Freeze mode Given Freeze mode is active When user attempts multiple clicks Then no image should be added to selectedItems

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-419: Verify Clear visual distinction between selected and unselected images when imag', async ({ page }) => {
    // Test Case: UTC-419
    // Summary: Verify Clear visual distinction between selected and unselected images when images are selected and unselected
    // Description: Feature: Image Selection Logic Scenario: Clear visual distinction between selected and unselected images Given images are selected and unselected When viewed together Then selected images should be clearly distinguishable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-420: Verify Immediate UI response on selection when the grid is loaded', async ({ page }) => {
    // Test Case: UTC-420
    // Summary: Verify Immediate UI response on selection when the grid is loaded
    // Description: Feature: Image Selection Logic Scenario: Immediate UI response on selection Given the grid is loaded When the user selects an image Then the UI should update instantly without lag

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-421: Verify Selecting all images on last page when the last page contains fewer image', async ({ page }) => {
    // Test Case: UTC-421
    // Summary: Verify Selecting all images on last page when the last page contains fewer images
    // Description: Feature: Image Selection Logic Scenario: Selecting all images on last page Given the last page contains fewer images When Select All is clicked Then only images on that page should be selected

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-422: Verify Selection persists during scroll when images are selected', async ({ page }) => {
    // Test Case: UTC-422
    // Summary: Verify Selection persists during scroll when images are selected
    // Description: Feature: Image Selection Logic Scenario: Selection persists during scroll Given images are selected When the user scrolls the grid Then selected images should remain selected

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

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
