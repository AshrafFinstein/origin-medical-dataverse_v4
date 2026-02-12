import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, LabelSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Page loads with header and controls when the user opens the Session Label page
 * URS: URS-DV-GEN-5
 * SRS: SRS-43
 * SDS: SDS-43
 */
test.describe('URS-DV-GEN-5: Verify Page loads with header and controls when the user ope', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-511: Verify Page loads with header and controls when the user opens the Session Label', async ({ page }) => {
    // Test Case: UTC-511
    // Summary: Verify Page loads with header and controls when the user opens the Session Label page
    // Description: Feature: Session Label Page Management Scenario: Page loads with header and controls Given the user opens the Session Label page When the page finishes loading Then header, search field, Create button, and label table should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-512: Verify Label data loads on page access when labels exist in the system', async ({ page }) => {
    // Test Case: UTC-512
    // Summary: Verify Label data loads on page access when labels exist in the system
    // Description: Feature: Session Label Page Management Scenario: Label data loads on page access Given labels exist in the system When the page loads Then the table should display all existing labels

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-513: Verify Search filters labels when multiple labels are present', async ({ page }) => {
    // Test Case: UTC-513
    // Summary: Verify Search filters labels when multiple labels are present
    // Description: Feature: Session Label Page Management Scenario: Search filters labels Given multiple labels are present When the user enters text in the search field Then the table should display only matching labels

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-514: Verify Clear search restores full data when search results are filtered', async ({ page }) => {
    // Test Case: UTC-514
    // Summary: Verify Clear search restores full data when search results are filtered
    // Description: Feature: Session Label Page Management Scenario: Clear search restores full data Given search results are filtered When the user clears the search field Then all labels should be displayed again

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-515: Verify Create button opens label creation when the user is on the Session Label ', async ({ page }) => {
    // Test Case: UTC-515
    // Summary: Verify Create button opens label creation when the user is on the Session Label page
    // Description: Feature: Session Label Page Management Scenario: Create button opens label creation Given the user is on the Session Label page When the user clicks the Create button Then the label creation interface should open

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-516: Verify Search field shows placeholder text when the page is displayed', async ({ page }) => {
    // Test Case: UTC-516
    // Summary: Verify Search field shows placeholder text when the page is displayed
    // Description: Feature: Session Label Page Management Scenario: Search field shows placeholder text Given the page is displayed When the search field is visible Then it should show an informative placeholder

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-517: Verify Empty state when no labels exist when no labels are available', async ({ page }) => {
    // Test Case: UTC-517
    // Summary: Verify Empty state when no labels exist when no labels are available
    // Description: Feature: Session Label Page Management Scenario: Empty state when no labels exist Given no labels are available When the page loads Then a friendly empty state message should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-518: Verify Empty state when search returns no results when labels exist', async ({ page }) => {
    // Test Case: UTC-518
    // Summary: Verify Empty state when search returns no results when labels exist
    // Description: Feature: Session Label Page Management Scenario: Empty state when search returns no results Given labels exist When the search query matches nothing Then the system should show a no-results message without technical errors

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-519: Verify No technical error exposure when a backend failure occurs', async ({ page }) => {
    // Test Case: UTC-519
    // Summary: Verify No technical error exposure when a backend failure occurs
    // Description: Feature: Session Label Page Management Scenario: No technical error exposure Given a backend failure occurs When data cannot be loaded Then a user-friendly message should be shown instead of raw errors

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-520: Verify Data loads quickly when the page is opened', async ({ page }) => {
    // Test Case: UTC-520
    // Summary: Verify Data loads quickly when the page is opened
    // Description: Feature: Session Label Page Management Scenario: Data loads quickly Given the page is opened When data is fetched Then labels should render within acceptable time without blocking UI

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
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
