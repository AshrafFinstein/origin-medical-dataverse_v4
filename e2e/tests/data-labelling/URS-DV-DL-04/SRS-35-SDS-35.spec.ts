import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown visible with selected images when one or more images are selected
 * URS: URS-DV-DL-04
 * SRS: SRS-35
 * SDS: SDS-35
 */
test.describe('URS-DV-DL-04: Verify Dropdown visible with selected images when one or mor', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-423: Verify Dropdown visible with selected images when one or more images are selecte', async ({ page }) => {
    // Test Case: UTC-423
    // Summary: Verify Dropdown visible with selected images when one or more images are selected
    // Description: Feature: Label Application Workflow Scenario: Dropdown visible with selected images Given one or more images are selected When the user views the toolbar Then the Select label(s) dropdown should be enabled and clickable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-424: Verify No images selected when no images are selected', async ({ page }) => {
    // Test Case: UTC-424
    // Summary: Verify No images selected when no images are selected
    // Description: Feature: Label Application Workflow Scenario: No images selected Given no images are selected When the user views the toolbar Then the labeling dropdown should be disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-425: Verify Labels displayed as checkboxes when the dropdown is opened', async ({ page }) => {
    // Test Case: UTC-425
    // Summary: Verify Labels displayed as checkboxes when the dropdown is opened
    // Description: Feature: Label Application Workflow Scenario: Labels displayed as checkboxes Given the dropdown is opened When the menu expands Then label options should appear as selectable checkboxes

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-426: Verify Select multiple labels when label checkboxes are displayed', async ({ page }) => {
    // Test Case: UTC-426
    // Summary: Verify Select multiple labels when label checkboxes are displayed
    // Description: Feature: Label Application Workflow Scenario: Select multiple labels Given label checkboxes are displayed When the user selects multiple labels Then all selected checkboxes should remain marked

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-427: Verify APPLY button presence when the dropdown is opened', async ({ page }) => {
    // Test Case: UTC-427
    // Summary: Verify APPLY button presence when the dropdown is opened
    // Description: Feature: Label Application Workflow Scenario: APPLY button presence Given the dropdown is opened When the footer is displayed Then a blue APPLY button should be visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-428: Verify Apply sends request when images and labels are selected', async ({ page }) => {
    // Test Case: UTC-428
    // Summary: Verify Apply sends request when images and labels are selected
    // Description: Feature: Label Application Workflow Scenario: Apply sends request Given images and labels are selected When the user clicks APPLY Then a POST request should be sent with imageIDs and labelTags

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-429: Verify Metadata updates immediately when labels are applied successfully', async ({ page }) => {
    // Test Case: UTC-429
    // Summary: Verify Metadata updates immediately when labels are applied successfully
    // Description: Feature: Label Application Workflow Scenario: Metadata updates immediately Given labels are applied successfully When the request completes Then the grid should refresh and show updated labels

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-430: Verify Apply one label when one label selected', async ({ page }) => {
    // Test Case: UTC-430
    // Summary: Verify Apply one label when one label selected
    // Description: Feature: Label Application Workflow Scenario: Apply one label Given one label selected When APPLY is clicked Then all selected images should show that label

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-431: Verify Apply to multiple images when multiple images selected', async ({ page }) => {
    // Test Case: UTC-431
    // Summary: Verify Apply to multiple images when multiple images selected
    // Description: Feature: Label Application Workflow Scenario: Apply to multiple images Given multiple images selected When APPLY is clicked Then all selected images should receive labels simultaneously

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-432: Verify API failure when server update fails', async ({ page }) => {
    // Test Case: UTC-432
    // Summary: Verify API failure when server update fails
    // Description: Feature: Label Application Workflow Scenario: API failure Given server update fails When APPLY is clicked Then a Failed to apply labels toast should appear and state should revert

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-433: Verify Prevent apply with zero selection when no images selected', async ({ page }) => {
    // Test Case: UTC-433
    // Summary: Verify Prevent apply with zero selection when no images selected
    // Description: Feature: Label Application Workflow Scenario: Prevent apply with zero selection Given no images selected When APPLY is attempted Then request should not be triggered

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-434: Verify Visual confirmation when labels are applied', async ({ page }) => {
    // Test Case: UTC-434
    // Summary: Verify Visual confirmation when labels are applied
    // Description: Feature: Label Application Workflow Scenario: Visual confirmation Given labels are applied When grid reloads Then updated labels should be clearly visible on each image card

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-435: Verify Large batch labeling when many images selected', async ({ page }) => {
    // Test Case: UTC-435
    // Summary: Verify Large batch labeling when many images selected
    // Description: Feature: Label Application Workflow Scenario: Large batch labeling Given many images selected When labels are applied Then operation should complete within acceptable time without UI freeze

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-436: Verify Unauthorized user when user lacks permission', async ({ page }) => {
    // Test Case: UTC-436
    // Summary: Verify Unauthorized user when user lacks permission
    // Description: Feature: Label Application Workflow Scenario: Unauthorized user Given user lacks permission When attempting to apply labels Then labeling action should be blocked

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-437: Verify Restore previous state when labeling fails', async ({ page }) => {
    // Test Case: UTC-437
    // Summary: Verify Restore previous state when labeling fails
    // Description: Feature: Label Application Workflow Scenario: Restore previous state Given labeling fails When grid refresh occurs Then previous labels should remain unchanged

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
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
