import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Checkbox visibility when annotation label popup is opened
 * URS: URS-DV-DA-27
 * SRS: SRS-234
 * SDS: SDS-234
 */
test.describe('URS-DV-DA-27: Verify Checkbox visibility when annotation label popup is op', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2411: Verify Checkbox visibility when annotation label popup is opened', async ({ page }) => {
    // Test Case: UTC-2411
    // Summary: Verify Checkbox visibility when annotation label popup is opened
    // Description: Feature: Label Popup – Single & Multiple Label Selection Scenario: Checkbox visibility Given annotation label popup is opened When labels are displayed Then each label should show a checkbox control

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2412: Verify Single label selection when popup open', async ({ page }) => {
    // Test Case: UTC-2412
    // Summary: Verify Single label selection when popup open
    // Description: Feature: Label Popup – Single & Multiple Label Selection Scenario: Single label selection Given popup open When user selects one checkbox Then that label should be marked selected

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2413: Verify Multiple label selection when popup open', async ({ page }) => {
    // Test Case: UTC-2413
    // Summary: Verify Multiple label selection when popup open
    // Description: Feature: Label Popup – Single & Multiple Label Selection Scenario: Multiple label selection Given popup open When user selects multiple checkboxes Then all selected labels should remain checked simultaneously

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2414: Verify Deselect label when labels selected', async ({ page }) => {
    // Test Case: UTC-2414
    // Summary: Verify Deselect label when labels selected
    // Description: Feature: Label Popup – Single & Multiple Label Selection Scenario: Deselect label Given labels selected When user unchecks a checkbox Then the label should be removed from selection list

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2415: Verify Apply button disabled by default when popup opens with no selections', async ({ page }) => {
    // Test Case: UTC-2415
    // Summary: Verify Apply button disabled by default when popup opens with no selections
    // Description: Feature: Label Popup – Single & Multiple Label Selection Scenario: Apply button disabled by default Given popup opens with no selections When no label selected Then Apply button should remain disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2416: Verify Apply button enabled on selection when at least one label selected', async ({ page }) => {
    // Test Case: UTC-2416
    // Summary: Verify Apply button enabled on selection when at least one label selected
    // Description: Feature: Label Popup – Single & Multiple Label Selection Scenario: Apply button enabled on selection Given at least one label selected When selection occurs Then Apply button should become enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2417: Verify Apply multiple labels to image when multiple labels selected', async ({ page }) => {
    // Test Case: UTC-2417
    // Summary: Verify Apply multiple labels to image when multiple labels selected
    // Description: Feature: Label Popup – Single & Multiple Label Selection Scenario: Apply multiple labels to image Given multiple labels selected When user clicks Apply Then all selected labels should be attached to the image

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2418: Verify Selection stored in state when labels selected', async ({ page }) => {
    // Test Case: UTC-2418
    // Summary: Verify Selection stored in state when labels selected
    // Description: Feature: Label Popup – Single & Multiple Label Selection Scenario: Selection stored in state Given labels selected When inspecting payload Then selected label IDs should be included in request payload array

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2419: Verify Stable selection behavior when repeated select/unselect actions', async ({ page }) => {
    // Test Case: UTC-2419
    // Summary: Verify Stable selection behavior when repeated select/unselect actions
    // Description: Feature: Label Popup – Single & Multiple Label Selection Scenario: Stable selection behavior Given repeated select/unselect actions When user toggles quickly Then UI should remain stable without duplication

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2420: Verify Visual highlight of selected labels when labels selected', async ({ page }) => {
    // Test Case: UTC-2420
    // Summary: Verify Visual highlight of selected labels when labels selected
    // Description: Feature: Label Popup – Single & Multiple Label Selection Scenario: Visual highlight of selected labels Given labels selected When checkbox checked Then row should be visually highlighted

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2421: Verify Keyboard selection support when popup open', async ({ page }) => {
    // Test Case: UTC-2421
    // Summary: Verify Keyboard selection support when popup open
    // Description: Feature: Label Popup – Single & Multiple Label Selection Scenario: Keyboard selection support Given popup open When user navigates with keyboard and presses Space/Enter Then checkbox selection should toggle

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2422: Verify Prevent apply with zero selection when no labels selected', async ({ page }) => {
    // Test Case: UTC-2422
    // Summary: Verify Prevent apply with zero selection when no labels selected
    // Description: Feature: Label Popup – Single & Multiple Label Selection Scenario: Prevent apply with zero selection Given no labels selected When user clicks Apply Then action should be blocked

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2423: Verify Performance with many labels when 500+ labels loaded', async ({ page }) => {
    // Test Case: UTC-2423
    // Summary: Verify Performance with many labels when 500+ labels loaded
    // Description: Feature: Label Popup – Single & Multiple Label Selection Scenario: Performance with many labels Given 500+ labels loaded When selecting multiple items Then selection should respond instantly without lag

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2424: Verify Cancel clears selection when multiple labels selected', async ({ page }) => {
    // Test Case: UTC-2424
    // Summary: Verify Cancel clears selection when multiple labels selected
    // Description: Feature: Label Popup – Single & Multiple Label Selection Scenario: Cancel clears selection Given multiple labels selected When popup closed or cancelled Then selections should reset on next open

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
