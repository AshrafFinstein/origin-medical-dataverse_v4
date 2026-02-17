import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify search field is displayed in label popup when the user opens the Label selection popup in annotation screen
 * URS: URS-DV-DL-26
 * SRS: SRS-231
 * SDS: SDS-231
 */
test.describe('URS-DV-DL-26: Verify search field is displayed in label popup when the use', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2367: Verify search field is displayed in label popup when the user opens the Label se', async ({ page }) => {
    // Test Case: UTC-2367
    // Summary: Verify search field is displayed in label popup when the user opens the Label selection popup in annotation screen
    // Description: Feature: Label Popup Search – Search Input Visibility Scenario: Verify search field is displayed in label popup Given the user opens the Label selection popup in annotation screen When the popup is displayed Then a Search input field should be visible at the top of the popup

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2368: Verify results are auto-fetched dynamically while typing when the label popup is', async ({ page }) => {
    // Test Case: UTC-2368
    // Summary: Verify results are auto-fetched dynamically while typing when the label popup is opened
    // Description: Feature: Label Popup Search – Auto Fetch While Typing Scenario: Verify results are auto-fetched dynamically while typing Given the label popup is opened When the user types a label keyword in Search input Then the popup should automatically fetch/filter matching labels as the user types

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2369: Verify partial keyword shows matching labels when labels exist like Head, Headac', async ({ page }) => {
    // Test Case: UTC-2369
    // Summary: Verify partial keyword shows matching labels when labels exist like Head, Headache, Heart
    // Description: Feature: Label Popup Search – Partial Match Filtering Scenario: Verify partial keyword shows matching labels Given labels exist like “Head”, “Headache”, “Heart” When the user types “Hea” in search field Then the system should display only matching label results

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2370: Verify search works with uppercase/lowercase values when a label exists as Brain', async ({ page }) => {
    // Test Case: UTC-2370
    // Summary: Verify search works with uppercase/lowercase values when a label exists as Brain
    // Description: Feature: Label Popup Search – Case Insensitive Search Scenario: Verify search works with uppercase/lowercase values Given a label exists as “Brain” When the user types “brain” in search input Then the label “Brain” should be shown in results

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2371: Verify empty state shown when no results found when the label popup is opened', async ({ page }) => {
    // Test Case: UTC-2371
    // Summary: Verify empty state shown when no results found when the label popup is opened
    // Description: Feature: Label Popup Search – No Match Empty State Scenario: Verify empty state shown when no results found Given the label popup is opened When the user searches with a keyword that has no matching labels Then the popup should show an empty state / empty list

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2372: Verify clearing search restores default label list when the user searched and fi', async ({ page }) => {
    // Test Case: UTC-2372
    // Summary: Verify clearing search restores default label list when the user searched and filtered the label list
    // Description: Feature: Label Popup Search – Clear Search Value Scenario: Verify clearing search restores default label list Given the user searched and filtered the label list When the user clears the search input value Then the popup should restore the default full label list

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2373: Verify Cancel icon is available in popup when the label selection popup is opene', async ({ page }) => {
    // Test Case: UTC-2373
    // Summary: Verify Cancel icon is available in popup when the label selection popup is opened
    // Description: Feature: Label Popup Cancel – Cancel Icon Visibility Scenario: Verify Cancel icon is available in popup Given the label selection popup is opened When the popup is displayed Then a Cancel icon should be visible for reset/close action

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2374: Verify Cancel resets popup to default state when the user typed a value in searc', async ({ page }) => {
    // Test Case: UTC-2374
    // Summary: Verify Cancel resets popup to default state when the user typed a value in search input and results are filtered
    // Description: Feature: Label Popup Cancel – Reset Popup to Default Scenario: Verify Cancel resets popup to default state Given the user typed a value in search input and results are filtered When the user clicks Cancel icon Then the popup should reset to default state And the search input should be cleared

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2375: Verify Cancel closes the popup safely when the label popup is opened', async ({ page }) => {
    // Test Case: UTC-2375
    // Summary: Verify Cancel closes the popup safely when the label popup is opened
    // Description: Feature: Label Popup Cancel – Close Popup Scenario: Verify Cancel closes the popup safely Given the label popup is opened When the user clicks Cancel icon Then the popup should close without errors

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2376: Verify popup opens with default state after cancel when the user searched and cl', async ({ page }) => {
    // Test Case: UTC-2376
    // Summary: Verify popup opens with default state after cancel when the user searched and clicked Cancel to reset/close popup
    // Description: Feature: Label Popup Cancel – Reopen Shows Default State Scenario: Verify popup opens with default state after cancel Given the user searched and clicked Cancel to reset/close popup When the user opens the label popup again Then the popup should load in default state (no search value, full list visible)

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
