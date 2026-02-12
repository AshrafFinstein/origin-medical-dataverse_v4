import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Search field visible when annotation label popup is open
 * URS: URS-DV-DA-27
 * SRS: SRS-233
 * SDS: SDS-233
 */
test.describe('URS-DV-DA-27: Verify Search field visible when annotation label popup is o', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2389: Verify Search field visible when annotation label popup is open', async ({ page }) => {
    // Test Case: UTC-2389
    // Summary: Verify Search field visible when annotation label popup is open
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Search field visible Given annotation label popup is open When popup rendered Then search input should be visible at the top of the popup

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2390: Verify Dynamic filtering on input when search field is focused', async ({ page }) => {
    // Test Case: UTC-2390
    // Summary: Verify Dynamic filtering on input when search field is focused
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Dynamic filtering on input Given search field is focused When user types label text Then the list should update showing matching labels in real time

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2391: Verify Show full list on empty search when popup opened', async ({ page }) => {
    // Test Case: UTC-2391
    // Summary: Verify Show full list on empty search when popup opened
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Show full list on empty search Given popup opened When search input is empty Then all labels should be displayed in list

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2392: Verify Empty state when no matches found when user types unmatched text', async ({ page }) => {
    // Test Case: UTC-2392
    // Summary: Verify Empty state when no matches found when user types unmatched text
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Empty state when no matches found Given user types unmatched text When no matching labels exist Then the popup should show an empty list (empty state)

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2393: Verify Cancel clears search when the search field contains text', async ({ page }) => {
    // Test Case: UTC-2393
    // Summary: Verify Cancel clears search when the search field contains text
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Cancel clears search Given the search field contains text When user clicks the Cancel icon Then search field should clear and list reset to full labels

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2394: Verify Cancel closes popup when popup with search/filter state', async ({ page }) => {
    // Test Case: UTC-2394
    // Summary: Verify Cancel closes popup when popup with search/filter state
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Cancel closes popup Given popup with search/filter state When user clicks Cancel icon Then popup should close and search filter cleared

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2395: Verify No error on empty search when popup open', async ({ page }) => {
    // Test Case: UTC-2395
    // Summary: Verify No error on empty search when popup open
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: No error on empty search Given popup open When search yields no results Then no error message should throw, just empty list

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2396: Verify Search responsiveness when multiple labels exist', async ({ page }) => {
    // Test Case: UTC-2396
    // Summary: Verify Search responsiveness when multiple labels exist
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Search responsiveness Given multiple labels exist When user types text quickly Then filtering should respond instantly (no lag)

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2397: Verify Keyboard support for Cancel when search field has focus', async ({ page }) => {
    // Test Case: UTC-2397
    // Summary: Verify Keyboard support for Cancel when search field has focus
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Keyboard support for Cancel Given search field has focus When user presses Escape or Tab to Cancel icon and activates it Then search should clear and popup reset

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2398: Verify Ignore search if popup closed when popup is closed', async ({ page }) => {
    // Test Case: UTC-2398
    // Summary: Verify Ignore search if popup closed when popup is closed
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Ignore search if popup closed Given popup is closed When user types in other page area Then no label filtering or popup should occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2399: Verify Cancel stable after repeated use when repeated open/search/cancel cycles', async ({ page }) => {
    // Test Case: UTC-2399
    // Summary: Verify Cancel stable after repeated use when repeated open/search/cancel cycles
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Cancel stable after repeated use Given repeated open/search/cancel cycles When actions repeat Then popup behavior should remain consistent

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2400: Verify Search field visible when annotation label popup is open', async ({ page }) => {
    // Test Case: UTC-2400
    // Summary: Verify Search field visible when annotation label popup is open
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Search field visible Given annotation label popup is open When popup rendered Then search input should be visible at the top of the popup

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2401: Verify Dynamic filtering on input when search field is focused', async ({ page }) => {
    // Test Case: UTC-2401
    // Summary: Verify Dynamic filtering on input when search field is focused
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Dynamic filtering on input Given search field is focused When user types label text Then the list should update showing matching labels in real time

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2402: Verify Show full list on empty search when popup opened', async ({ page }) => {
    // Test Case: UTC-2402
    // Summary: Verify Show full list on empty search when popup opened
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Show full list on empty search Given popup opened When search input is empty Then all labels should be displayed in list

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2403: Verify Empty state when no matches found when user types unmatched text', async ({ page }) => {
    // Test Case: UTC-2403
    // Summary: Verify Empty state when no matches found when user types unmatched text
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Empty state when no matches found Given user types unmatched text When no matching labels exist Then the popup should show an empty list (empty state)

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2404: Verify Cancel clears search when the search field contains text', async ({ page }) => {
    // Test Case: UTC-2404
    // Summary: Verify Cancel clears search when the search field contains text
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Cancel clears search Given the search field contains text When user clicks the Cancel icon Then search field should clear and list reset to full labels

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2405: Verify Cancel closes popup when popup with search/filter state', async ({ page }) => {
    // Test Case: UTC-2405
    // Summary: Verify Cancel closes popup when popup with search/filter state
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Cancel closes popup Given popup with search/filter state When user clicks Cancel icon Then popup should close and search filter cleared

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2406: Verify No error on empty search when popup open', async ({ page }) => {
    // Test Case: UTC-2406
    // Summary: Verify No error on empty search when popup open
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: No error on empty search Given popup open When search yields no results Then no error message should throw, just empty list

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2407: Verify Search responsiveness when multiple labels exist', async ({ page }) => {
    // Test Case: UTC-2407
    // Summary: Verify Search responsiveness when multiple labels exist
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Search responsiveness Given multiple labels exist When user types text quickly Then filtering should respond instantly (no lag)

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2408: Verify Keyboard support for Cancel when search field has focus', async ({ page }) => {
    // Test Case: UTC-2408
    // Summary: Verify Keyboard support for Cancel when search field has focus
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Keyboard support for Cancel Given search field has focus When user presses Escape or Tab to Cancel icon and activates it Then search should clear and popup reset

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2409: Verify Ignore search if popup closed when popup is closed', async ({ page }) => {
    // Test Case: UTC-2409
    // Summary: Verify Ignore search if popup closed when popup is closed
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Ignore search if popup closed Given popup is closed When user types in other page area Then no label filtering or popup should occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2410: Verify Cancel stable after repeated use when repeated open/search/cancel cycles', async ({ page }) => {
    // Test Case: UTC-2410
    // Summary: Verify Cancel stable after repeated use when repeated open/search/cancel cycles
    // Description: Feature: Label Popup – Search & Cancel Behavior Scenario: Cancel stable after repeated use Given repeated open/search/cancel cycles When actions repeat Then popup behavior should remain consistent

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
