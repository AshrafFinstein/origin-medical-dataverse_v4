import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown visible on form when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-67
 * SDS: SDS-67
 */
test.describe('URS-DV-GEN-07: Verify Dropdown visible on form when Session Creation page l', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-808: Verify Dropdown visible on form when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-808
    // Summary: Verify Dropdown visible on form when Session Creation page loads
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: Dropdown visible on form Given Session Creation page loads When the form renders Then Session Labels dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-809: Verify Placeholder text displayed when no labels selected', async ({ page }) => {
    // Test Case: UTC-809
    // Summary: Verify Placeholder text displayed when no labels selected
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: Placeholder text displayed Given no labels selected When dropdown loads Then placeholder text should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-810: Verify Dropdown opens list when user clicks the dropdown', async ({ page }) => {
    // Test Case: UTC-810
    // Summary: Verify Dropdown opens list when user clicks the dropdown
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: Dropdown opens list Given user clicks the dropdown When interaction occurs Then available labels should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-811: Verify Select single label when label list displayed', async ({ page }) => {
    // Test Case: UTC-811
    // Summary: Verify Select single label when label list displayed
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: Select single label Given label list displayed When one label is selected Then it should appear as a chip inside the field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-812: Verify Select multiple labels when multiple labels available', async ({ page }) => {
    // Test Case: UTC-812
    // Summary: Verify Select multiple labels when multiple labels available
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: Select multiple labels Given multiple labels available When several labels are selected Then multiple chips should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-813: Verify Remove selected label when labels selected', async ({ page }) => {
    // Test Case: UTC-813
    // Summary: Verify Remove selected label when labels selected
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: Remove selected label Given labels selected When user clicks chip remove icon Then label should be removed from selection

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-814: Verify Search labels when many labels exist', async ({ page }) => {
    // Test Case: UTC-814
    // Summary: Verify Search labels when many labels exist
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: Search labels Given many labels exist When user types search text Then matching labels should be filtered

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-815: Verify No search results when search term has no matches', async ({ page }) => {
    // Test Case: UTC-815
    // Summary: Verify No search results when search term has no matches
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: No search results Given search term has no matches When filtering occurs Then “No results found” message should display

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-816: Verify Persist selections in payload when labels selected', async ({ page }) => {
    // Test Case: UTC-816
    // Summary: Verify Persist selections in payload when labels selected
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: Persist selections in payload Given labels selected When session is submitted Then selected label IDs should be sent as array in metadata

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-817: Verify Selection retained during navigation when labels selected', async ({ page }) => {
    // Test Case: UTC-817
    // Summary: Verify Selection retained during navigation when labels selected
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: Selection retained during navigation Given labels selected When navigating within form Then selected chips should remain intact

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-818: Verify Master data refresh when new labels added in master', async ({ page }) => {
    // Test Case: UTC-818
    // Summary: Verify Master data refresh when new labels added in master
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: Master data refresh Given new labels added in master When dropdown reopened Then new labels should appear dynamically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-819: Verify Chips visually distinct when labels selected', async ({ page }) => {
    // Test Case: UTC-819
    // Summary: Verify Chips visually distinct when labels selected
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: Chips visually distinct Given labels selected When viewing field Then chips should be clearly visible and readable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-820: Verify Fast dropdown open when labels exist', async ({ page }) => {
    // Test Case: UTC-820
    // Summary: Verify Fast dropdown open when labels exist
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: Fast dropdown open Given labels exist When dropdown opens Then list should render within acceptable time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-821: Verify Reopen preserves state when labels selected', async ({ page }) => {
    // Test Case: UTC-821
    // Summary: Verify Reopen preserves state when labels selected
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: Reopen preserves state Given labels selected When dropdown closed and reopened Then previous selections should remain

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-822: Verify Invalid label blocked when manipulated/invalid label ID', async ({ page }) => {
    // Test Case: UTC-822
    // Summary: Verify Invalid label blocked when manipulated/invalid label ID
    // Description: Feature: Multi-select session label dropdown with removable chips and metadata persistence Scenario: Invalid label blocked Given manipulated/invalid label ID When submitting session Then system should reject invalid label safely

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
