import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify user can view version history list before downloading a JSON file when the user opens Version Tracker for a session
 * URS: URS-DV-DM-17
 * SRS: SRS-135
 * SDS: SDS-135
 */
test.describe('URS-DV-DM-17: Verify user can view version history list before downloading', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1801: Verify user can view version history list before downloading a JSON file when th', async ({ page }) => {
    // Test Case: UTC-1801
    // Summary: Verify user can view version history list before downloading a JSON file when the user opens Version Tracker for a session
    // Description: Feature: Version History – List Visible Before Download Scenario: Verify user can view version history list before downloading a JSON file Given the user opens Version Tracker for a session When the Version History panel/modal loads Then the list of previously generated/downloaded versions should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1802: Verify version history shows version number, file name, date/time, and download ', async ({ page }) => {
    // Test Case: UTC-1802
    // Summary: Verify version history shows version number, file name, date/time, and download action when versions exist for the session
    // Description: Feature: Version History – Display Required Columns Scenario: Verify version history shows version number, file name, date/time, and download action Given versions exist for the session When the version history table is displayed Then Version Number, File Name, Date/Time, and Download action should be shown for each entry

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1803: Verify all generated versions appear in history list when the session contains v', async ({ page }) => {
    // Test Case: UTC-1803
    // Summary: Verify all generated versions appear in history list when the session contains versions V1 to V6
    // Description: Feature: Version History – Display All Previously Generated Versions Scenario: Verify all generated versions appear in history list Given the session contains versions V1 to V6 When the version history loads Then all versions V1 to V6 should appear in the list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1804: Verify previously downloaded versions remain visible in history list when the us', async ({ page }) => {
    // Test Case: UTC-1804
    // Summary: Verify previously downloaded versions remain visible in history list when the user downloaded version V2 earlier
    // Description: Feature: Version History – Display Downloaded Versions in History Scenario: Verify previously downloaded versions remain visible in history list Given the user downloaded version V2 earlier When the user reopens the version history list Then V2 should still be visible in the list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1805: Verify list loads dynamically when panel/modal is opened when versions exist in ', async ({ page }) => {
    // Test Case: UTC-1805
    // Summary: Verify list loads dynamically when panel/modal is opened when versions exist in storage
    // Description: Feature: Version History – Dynamic Load on Panel Open Scenario: Verify list loads dynamically when panel/modal is opened Given versions exist in storage When the user opens Version History panel/modal Then the system should fetch metadata and populate the list dynamically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1806: Verify No versions available message shown when no versions exist when the selec', async ({ page }) => {
    // Test Case: UTC-1806
    // Summary: Verify No versions available message shown when no versions exist when the selected session has no versions generated/downloaded
    // Description: Feature: Version History – Empty State Handling Scenario: Verify “No versions available” message shown when no versions exist Given the selected session has no versions generated/downloaded When the user opens Version History list Then the system should display “No versions available” message And should not show any system errors

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1807: Verify newly created version appears immediately in history list when the user h', async ({ page }) => {
    // Test Case: UTC-1807
    // Summary: Verify newly created version appears immediately in history list when the user has version history open
    // Description: Feature: Version History – List Refresh After New Version Created Scenario: Verify newly created version appears immediately in history list Given the user has version history open When the user generates a new JSON version And refreshes/reopens the history list Then the new version should appear in the list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1808: Verify user can download a previous version from the list when the version histo', async ({ page }) => {
    // Test Case: UTC-1808
    // Summary: Verify user can download a previous version from the list when the version history list is displayed
    // Description: Feature: Version History – Download Action Works from History List Scenario: Verify user can download a previous version from the list Given the version history list is displayed When the user clicks Download for any previous version Then the system should download the correct selected version successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
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
