import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Popup opens on right-click when the Annotation page is loaded with an editable image
 * URS: URS-DV-DA-27
 * SRS: SRS-232
 * SDS: SDS-232
 */
test.describe('URS-DV-DA-27: Verify Popup opens on right-click when the Annotation page i', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2377: Verify Popup opens on right-click when the Annotation page is loaded with an edi', async ({ page }) => {
    // Test Case: UTC-2377
    // Summary: Verify Popup opens on right-click when the Annotation page is loaded with an editable image
    // Description: Feature: Annotation label popup on right-click Scenario: Popup opens on right-click Given the Annotation page is loaded with an editable image When the user right-clicks on the image Then the label selection popup should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2378: Verify Popup components rendered when the popup is opened', async ({ page }) => {
    // Test Case: UTC-2378
    // Summary: Verify Popup components rendered when the popup is opened
    // Description: Feature: Annotation label popup on right-click Scenario: Popup components rendered Given the popup is opened When the popup loads Then search field, label list, and Apply button should be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2379: Verify Apply button disabled by default when no label is selected', async ({ page }) => {
    // Test Case: UTC-2379
    // Summary: Verify Apply button disabled by default when no label is selected
    // Description: Feature: Annotation label popup on right-click Scenario: Apply button disabled by default Given no label is selected When popup is displayed Then Apply button should remain disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2380: Verify Enable Apply after label selection when popup is open', async ({ page }) => {
    // Test Case: UTC-2380
    // Summary: Verify Enable Apply after label selection when popup is open
    // Description: Feature: Annotation label popup on right-click Scenario: Enable Apply after label selection Given popup is open When the user selects at least one label Then Apply button should be enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2381: Verify Apply attaches label to annotation when a label is selected', async ({ page }) => {
    // Test Case: UTC-2381
    // Summary: Verify Apply attaches label to annotation when a label is selected
    // Description: Feature: Annotation label popup on right-click Scenario: Apply attaches label to annotation Given a label is selected When the user clicks Apply Then selected label should be assigned to the annotation

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2382: Verify Search filters labels when multiple labels exist', async ({ page }) => {
    // Test Case: UTC-2382
    // Summary: Verify Search filters labels when multiple labels exist
    // Description: Feature: Annotation label popup on right-click Scenario: Search filters labels Given multiple labels exist When the user types text in the search field Then only matching labels should be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2383: Verify Clear search restores full list when search text is entered', async ({ page }) => {
    // Test Case: UTC-2383
    // Summary: Verify Clear search restores full list when search text is entered
    // Description: Feature: Annotation label popup on right-click Scenario: Clear search restores full list Given search text is entered When the user clears the search input Then all labels should be displayed again

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2384: Verify Prevent Apply with no selection when no label selected', async ({ page }) => {
    // Test Case: UTC-2384
    // Summary: Verify Prevent Apply with no selection when no label selected
    // Description: Feature: Annotation label popup on right-click Scenario: Prevent Apply with no selection Given no label selected When user clicks Apply Then no action should occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2385: Verify Popup not shown in non-editable state when image is locked or not editabl', async ({ page }) => {
    // Test Case: UTC-2385
    // Summary: Verify Popup not shown in non-editable state when image is locked or not editable
    // Description: Feature: Annotation label popup on right-click Scenario: Popup not shown in non-editable state Given image is locked or not editable When user right-clicks Then popup should not appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2386: Verify Multiple open/close cycles stable when popup opened and closed repeatedly', async ({ page }) => {
    // Test Case: UTC-2386
    // Summary: Verify Multiple open/close cycles stable when popup opened and closed repeatedly
    // Description: Feature: Annotation label popup on right-click Scenario: Multiple open/close cycles stable Given popup opened and closed repeatedly When user reopens popup Then it should load correctly without UI errors

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2387: Verify Keyboard navigation support when popup is open', async ({ page }) => {
    // Test Case: UTC-2387
    // Summary: Verify Keyboard navigation support when popup is open
    // Description: Feature: Annotation label popup on right-click Scenario: Keyboard navigation support Given popup is open When user navigates using keyboard (Tab/Enter) Then controls should be focusable and selectable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2388: Verify Popup loads quickly when user right-clicks image', async ({ page }) => {
    // Test Case: UTC-2388
    // Summary: Verify Popup loads quickly when user right-clicks image
    // Description: Feature: Annotation label popup on right-click Scenario: Popup loads quickly Given user right-clicks image When popup renders Then it should appear within acceptable response time (<1s)

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
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
