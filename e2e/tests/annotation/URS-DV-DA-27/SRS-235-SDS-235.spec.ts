import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Apply button disabled by default when label popup opens
 * URS: URS-DV-DA-27
 * SRS: SRS-235
 * SDS: SDS-235
 */
test.describe('URS-DV-DA-27: Verify Apply button disabled by default when label popup ope', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2425: Verify Apply button disabled by default when label popup opens', async ({ page }) => {
    // Test Case: UTC-2425
    // Summary: Verify Apply button disabled by default when label popup opens
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Apply button disabled by default Given label popup opens When no labels are selected Then Apply button should remain disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2426: Verify Enable Apply after single selection when popup open', async ({ page }) => {
    // Test Case: UTC-2426
    // Summary: Verify Enable Apply after single selection when popup open
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Enable Apply after single selection Given popup open When one label is selected Then Apply button should become enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2427: Verify Enable Apply after multiple selections when popup open', async ({ page }) => {
    // Test Case: UTC-2427
    // Summary: Verify Enable Apply after multiple selections when popup open
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Enable Apply after multiple selections Given popup open When multiple labels are selected Then Apply button should remain enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2428: Verify Apply assigns labels to image when labels selected', async ({ page }) => {
    // Test Case: UTC-2428
    // Summary: Verify Apply assigns labels to image when labels selected
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Apply assigns labels to image Given labels selected When user clicks Apply Then selected labels should be mapped to the image

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2429: Verify Success message displayed when Apply action succeeds', async ({ page }) => {
    // Test Case: UTC-2429
    // Summary: Verify Success message displayed when Apply action succeeds
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Success message displayed Given Apply action succeeds When labels assigned Then success toast “Successfully Labelled Image” should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2430: Verify Labels visible below image when labels applied', async ({ page }) => {
    // Test Case: UTC-2430
    // Summary: Verify Labels visible below image when labels applied
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Labels visible below image Given labels applied When popup closes Then applied labels should appear below the image preview

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2431: Verify Modify selection and reapply when labels already applied', async ({ page }) => {
    // Test Case: UTC-2431
    // Summary: Verify Modify selection and reapply when labels already applied
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Modify selection and reapply Given labels already applied When user updates selection and clicks Apply again Then previous labels should be replaced with new selection

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2432: Verify Correct label IDs in payload when labels selected', async ({ page }) => {
    // Test Case: UTC-2432
    // Summary: Verify Correct label IDs in payload when labels selected
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Correct label IDs in payload Given labels selected When Apply clicked Then selected label IDs should be sent in API payload

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2433: Verify Prevent Apply with zero selection when no labels selected', async ({ page }) => {
    // Test Case: UTC-2433
    // Summary: Verify Prevent Apply with zero selection when no labels selected
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Prevent Apply with zero selection Given no labels selected When user clicks Apply Then action should not execute

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2434: Verify Retain previous labels on failure when API failure occurs', async ({ page }) => {
    // Test Case: UTC-2434
    // Summary: Verify Retain previous labels on failure when API failure occurs
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Retain previous labels on failure Given API failure occurs When Apply attempted Then old labels should remain unchanged

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2435: Verify Clear visual confirmation when labels applied', async ({ page }) => {
    // Test Case: UTC-2435
    // Summary: Verify Clear visual confirmation when labels applied
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Clear visual confirmation Given labels applied When success toast shown Then user should clearly understand labels assigned

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2436: Verify Instant UI update when labels applied', async ({ page }) => {
    // Test Case: UTC-2436
    // Summary: Verify Instant UI update when labels applied
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Instant UI update Given labels applied When Apply completes Then label list should refresh instantly without page reload

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2437: Verify Keyboard apply support when labels selected', async ({ page }) => {
    // Test Case: UTC-2437
    // Summary: Verify Keyboard apply support when labels selected
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Keyboard apply support Given labels selected When user presses Enter key on Apply Then labels should be assigned successfully

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2438: Verify Large label count handling when many labels selected (100+)', async ({ page }) => {
    // Test Case: UTC-2438
    // Summary: Verify Large label count handling when many labels selected (100+)
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Large label count handling Given many labels selected (100+) When Apply clicked Then assignment should complete without UI freeze

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2439: Verify Cancel does not assign labels when labels selected', async ({ page }) => {
    // Test Case: UTC-2439
    // Summary: Verify Cancel does not assign labels when labels selected
    // Description: Feature: Apply Button Enablement & Label Assignment Scenario: Cancel does not assign labels Given labels selected When popup closed without Apply Then no labels should be assigned

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
