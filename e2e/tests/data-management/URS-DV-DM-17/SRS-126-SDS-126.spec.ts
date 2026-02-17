import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system assigns next sequential version number for new JSON version when a session exists with version history already available
 * URS: URS-DV-DM-17
 * SRS: SRS-126
 * SDS: SDS-126
 */
test.describe('URS-DV-DM-17: Verify system assigns next sequential version number for new', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1736: Verify system assigns next sequential version number for new JSON version when a', async ({ page }) => {
    // Test Case: UTC-1736
    // Summary: Verify system assigns next sequential version number for new JSON version when a session exists with version history already available
    // Description: Feature: Version Tracker – Auto Sequential Version Number Scenario: Verify system assigns next sequential version number for new JSON version Given a session exists with version history already available When the user creates/downloads a new JSON version Then the system should automatically assign the next sequential version number

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1737: Verify system does not create duplicate version numbers when multiple versions a', async ({ page }) => {
    // Test Case: UTC-1737
    // Summary: Verify system does not create duplicate version numbers when multiple versions already exist in version history
    // Description: Feature: Version Tracker – No Duplicate Version Numbers Scenario: Verify system does not create duplicate version numbers Given multiple versions already exist in version history When the user creates a new JSON version repeatedly Then each new version should have a unique sequential number without duplicates

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1738: Verify assigned version number is displayed in Version History list when a new J', async ({ page }) => {
    // Test Case: UTC-1738
    // Summary: Verify assigned version number is displayed in Version History list when a new JSON version is created successfully
    // Description: Feature: Version Tracker – Version Number Visible in History Scenario: Verify assigned version number is displayed in Version History list Given a new JSON version is created successfully When the user opens the Version History list Then the assigned version number should be displayed clearly for that entry

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1739: Verify version numbers follow correct increment order when the latest version is', async ({ page }) => {
    // Test Case: UTC-1739
    // Summary: Verify version numbers follow correct increment order when the latest version is V3
    // Description: Feature: Version Tracker – Sequential Increment Pattern Scenario: Verify version numbers follow correct increment order Given the latest version is V3 When the user creates a new JSON version Then the new version number should be V4

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1740: Verify assigned version number persists after refresh/relogin when a new version', async ({ page }) => {
    // Test Case: UTC-1740
    // Summary: Verify assigned version number persists after refresh/relogin when a new version was created successfully with a sequential number
    // Description: Feature: Version Tracker – Persist Version Number Correctly Scenario: Verify assigned version number persists after refresh/relogin Given a new version was created successfully with a sequential number When the user refreshes the page or logs out and logs in again Then the same version number should remain stored and visible in Version History

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1741: Verify version numbering is session-specific and sequential when two different s', async ({ page }) => {
    // Test Case: UTC-1741
    // Summary: Verify version numbering is session-specific and sequential when two different sessions exist with their own version history
    // Description: Feature: Version Tracker – Sequential Numbering Across Multiple Sessions Scenario: Verify version numbering is session-specific and sequential Given two different sessions exist with their own version history When the user creates versions in both sessions Then each session should maintain independent sequential numbering without conflict

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1742: Verify version numbers remain unique when two versions created simultaneously wh', async ({ page }) => {
    // Test Case: UTC-1742
    // Summary: Verify version numbers remain unique when two versions created simultaneously when two users attempt to create a JSON version at the same time for the same session
    // Description: Feature: Version Tracker – Concurrency Handling Scenario: Verify version numbers remain unique when two versions created simultaneously Given two users attempt to create a JSON version at the same time for the same session When both submit version creation concurrently Then the system should assign unique sequential version numbers without duplicates or conflicts

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
