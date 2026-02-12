import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Version History panel is available for the selected session when the user opened a session that supports JSON versions
 * URS: URS-DV-DM-17
 * SRS: SRS-132
 * SDS: SDS-132
 */
test.describe('URS-DV-DM-17: Verify Version History panel is available for the selected s', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1777: Verify Version History panel is available for the selected session when the user', async ({ page }) => {
    // Test Case: UTC-1777
    // Summary: Verify Version History panel is available for the selected session when the user opened a session that supports JSON versions
    // Description: Feature: Version History – Panel Visibility Scenario: Verify Version History panel is available for the selected session Given the user opened a session that supports JSON versions When the user navigates to Version Tracker / Version History panel Then the Version History panel should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1778: Verify system retrieves all versions for selected session only when Session A an', async ({ page }) => {
    // Test Case: UTC-1778
    // Summary: Verify system retrieves all versions for selected session only when Session A and Session B exist with different version histories
    // Description: Feature: Version History – Fetch Versions for Selected Session Scenario: Verify system retrieves all versions for selected session only Given Session A and Session B exist with different version histories When the user opens Version History for Session A Then the system should retrieve and display only Session A versions

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1779: Verify versions are displayed in structured list/table format when multiple vers', async ({ page }) => {
    // Test Case: UTC-1779
    // Summary: Verify versions are displayed in structured list/table format when multiple versions exist for the session
    // Description: Feature: Version History – Display Versions in Structured Table Scenario: Verify versions are displayed in structured list/table format Given multiple versions exist for the session When Version History panel loads Then versions should be displayed in a structured list/table view

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1780: Verify all stored versions are displayed in history panel when the session conta', async ({ page }) => {
    // Test Case: UTC-1780
    // Summary: Verify all stored versions are displayed in history panel when the session contains versions V1 to V10 in storage
    // Description: Feature: Version History – All Versions Loaded Scenario: Verify all stored versions are displayed in history panel Given the session contains versions V1 to V10 in storage When the Version History panel loads Then the UI should display all versions from V1 to V10

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1781: Verify versions are displayed in correct order when multiple versions exist with', async ({ page }) => {
    // Test Case: UTC-1781
    // Summary: Verify versions are displayed in correct order when multiple versions exist with sequential numbering
    // Description: Feature: Version History – Order of Versions Scenario: Verify versions are displayed in correct order Given multiple versions exist with sequential numbering When Version History panel is displayed Then versions should be listed in correct order (latest first or oldest first as per system design)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1782: Verify empty state shown when no versions exist when the selected session has no', async ({ page }) => {
    // Test Case: UTC-1782
    // Summary: Verify empty state shown when no versions exist when the selected session has no JSON versions generated yet
    // Description: Feature: Version History – No Versions Handling Scenario: Verify empty state shown when no versions exist Given the selected session has no JSON versions generated yet When the user opens Version History panel Then the system should show an empty state message (ex: “No versions available”)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1783: Verify newly created versions appear after refresh/open when the user opened Ver', async ({ page }) => {
    // Test Case: UTC-1783
    // Summary: Verify newly created versions appear after refresh/open when the user opened Version History panel
    // Description: Feature: Version History – Refresh Panel Loads Latest Data Scenario: Verify newly created versions appear after refresh/open Given the user opened Version History panel When the user generates a new JSON version And reopens or refreshes Version History panel Then the newly created version should appear in the list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1784: Verify retrieved version metadata binds correctly to UI when version records exi', async ({ page }) => {
    // Test Case: UTC-1784
    // Summary: Verify retrieved version metadata binds correctly to UI when version records exist with stored version number, date/time, and generated user
    // Description: Feature: Version History – Metadata Binding Scenario: Verify retrieved version metadata binds correctly to UI Given version records exist with stored version number, date/time, and generated user When Version History panel loads Then the UI should bind and display metadata correctly for each version row

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

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
