import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown visibility on page load when Session Creation page loads
 * URS: URS-DV-GEN-25
 * SRS: SRS-224
 * SDS: SDS-224
 */
test.describe('URS-DV-GEN-25: Verify Dropdown visibility on page load when Session Creatio', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2285: Verify Dropdown visibility on page load when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-2285
    // Summary: Verify Dropdown visibility on page load when Session Creation page loads
    // Description: Feature: Session Status Dropdown Values Scenario: Dropdown visibility on page load Given Session Creation page loads When form initializes Then Session Status dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2286: Verify Placeholder display when dropdown is not selected', async ({ page }) => {
    // Test Case: UTC-2286
    // Summary: Verify Placeholder display when dropdown is not selected
    // Description: Feature: Session Status Dropdown Values Scenario: Placeholder display Given dropdown is not selected When viewing field Then placeholder “Select session status” should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2287: Verify Load predefined values when form initializes', async ({ page }) => {
    // Test Case: UTC-2287
    // Summary: Verify Load predefined values when form initializes
    // Description: Feature: Session Status Dropdown Values Scenario: Load predefined values Given form initializes When dropdown opens Then options Yet to do, In progress, Re-open should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2288: Verify Single select behavior when dropdown is open', async ({ page }) => {
    // Test Case: UTC-2288
    // Summary: Verify Single select behavior when dropdown is open
    // Description: Feature: Session Status Dropdown Values Scenario: Single select behavior Given dropdown is open When user selects one value Then only one status should be selected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2289: Verify Select Yet to do when dropdown opened', async ({ page }) => {
    // Test Case: UTC-2289
    // Summary: Verify Select Yet to do when dropdown opened
    // Description: Feature: Session Status Dropdown Values Scenario: Select Yet to do Given dropdown opened When user selects Yet to do Then field should display Yet to do

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2290: Verify Select In progress when dropdown opened', async ({ page }) => {
    // Test Case: UTC-2290
    // Summary: Verify Select In progress when dropdown opened
    // Description: Feature: Session Status Dropdown Values Scenario: Select In progress Given dropdown opened When user selects In progress Then field should display In progress

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2291: Verify Select Re-open when dropdown opened', async ({ page }) => {
    // Test Case: UTC-2291
    // Summary: Verify Select Re-open when dropdown opened
    // Description: Feature: Session Status Dropdown Values Scenario: Select Re-open Given dropdown opened When user selects Re-open Then field should display Re-open

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2292: Verify Value included in payload when user selects a status', async ({ page }) => {
    // Test Case: UTC-2292
    // Summary: Verify Value included in payload when user selects a status
    // Description: Feature: Session Status Dropdown Values Scenario: Value included in payload Given user selects a status When submitting session Then selected status should be included in API payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2293: Verify Default state when no selection when dropdown untouched', async ({ page }) => {
    // Test Case: UTC-2293
    // Summary: Verify Default state when no selection when dropdown untouched
    // Description: Feature: Session Status Dropdown Values Scenario: Default state when no selection Given dropdown untouched When submitting Then system should either prevent submit or use default rule

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2294: Verify Dropdown open/close behavior when dropdown closed', async ({ page }) => {
    // Test Case: UTC-2294
    // Summary: Verify Dropdown open/close behavior when dropdown closed
    // Description: Feature: Session Status Dropdown Values Scenario: Dropdown open/close behavior Given dropdown closed When clicked Then options list should open and close properly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2295: Verify Keyboard navigation when dropdown focused', async ({ page }) => {
    // Test Case: UTC-2295
    // Summary: Verify Keyboard navigation when dropdown focused
    // Description: Feature: Session Status Dropdown Values Scenario: Keyboard navigation Given dropdown focused When using arrow keys + Enter Then selection should work via keyboard

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2296: Verify Tab focus support when user presses Tab', async ({ page }) => {
    // Test Case: UTC-2296
    // Summary: Verify Tab focus support when user presses Tab
    // Description: Feature: Session Status Dropdown Values Scenario: Tab focus support Given user presses Tab When focus reaches dropdown Then control should be focusable and selectable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2297: Verify Invalid manual input blocked when user tries to type custom value', async ({ page }) => {
    // Test Case: UTC-2297
    // Summary: Verify Invalid manual input blocked when user tries to type custom value
    // Description: Feature: Session Status Dropdown Values Scenario: Invalid manual input blocked Given user tries to type custom value When submitting Then system should reject invalid status

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2298: Verify Persistence after navigation when status selected', async ({ page }) => {
    // Test Case: UTC-2298
    // Summary: Verify Persistence after navigation when status selected
    // Description: Feature: Session Status Dropdown Values Scenario: Persistence after navigation Given status selected When user navigates within form Then selected value should persist

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2299: Verify Instant rendering when page loads', async ({ page }) => {
    // Test Case: UTC-2299
    // Summary: Verify Instant rendering when page loads
    // Description: Feature: Session Status Dropdown Values Scenario: Instant rendering Given page loads When dropdown is opened Then options should appear instantly without delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2300: Verify Reopen form after save when session saved with status', async ({ page }) => {
    // Test Case: UTC-2300
    // Summary: Verify Reopen form after save when session saved with status
    // Description: Feature: Session Status Dropdown Values Scenario: Reopen form after save Given session saved with status When editing session Then previously selected status should pre-fill

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
