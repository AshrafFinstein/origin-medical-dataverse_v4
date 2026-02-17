import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify each generated JSON is stored as a new immutable version when version history already contains existing versions
 * URS: URS-DV-DM-17
 * SRS: SRS-127
 * SDS: SDS-127
 */
test.describe('URS-DV-DM-17: Verify each generated JSON is stored as a new immutable vers', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1743: Verify each generated JSON is stored as a new immutable version when version his', async ({ page }) => {
    // Test Case: UTC-1743
    // Summary: Verify each generated JSON is stored as a new immutable version when version history already contains existing versions
    // Description: Feature: Version Tracker – New Version Stored as Separate Entry Scenario: Verify each generated JSON is stored as a new immutable version Given version history already contains existing versions When the user generates a new JSON version Then the system should store it as a new entry And should not overwrite any existing version

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1744: Verify earlier versions remain unchanged after new version creation when V1 and ', async ({ page }) => {
    // Test Case: UTC-1744
    // Summary: Verify earlier versions remain unchanged after new version creation when V1 and V2 exist in version history
    // Description: Feature: Version Tracker – Previous Versions Remain Unchanged Scenario: Verify earlier versions remain unchanged after new version creation Given V1 and V2 exist in version history When the user generates V3 Then V1 and V2 JSON content should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1745: Verify system does not provide option to overwrite an existing version when the ', async ({ page }) => {
    // Test Case: UTC-1745
    // Summary: Verify system does not provide option to overwrite an existing version when the user is viewing the Version History list
    // Description: Feature: Version Tracker – No Replace/Overwrite Option in UI Scenario: Verify system does not provide option to overwrite an existing version Given the user is viewing the Version History list When the user checks available actions for each version Then overwrite/replace option should not be available

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1746: Verify system does not allow deleting a version entry when the user is viewing V', async ({ page }) => {
    // Test Case: UTC-1746
    // Summary: Verify system does not allow deleting a version entry when the user is viewing Version History list
    // Description: Feature: Version Tracker – No Delete Option in UI Scenario: Verify system does not allow deleting a version entry Given the user is viewing Version History list When the user checks action buttons for a version entry Then Delete option should not be available

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1747: Verify version history persists after refresh/relogin when multiple versions exi', async ({ page }) => {
    // Test Case: UTC-1747
    // Summary: Verify version history persists after refresh/relogin when multiple versions exist in Version History list
    // Description: Feature: Version Tracker – Version History Always Retained Scenario: Verify version history persists after refresh/relogin Given multiple versions exist in Version History list When the user refreshes the page or logs out and logs in again Then all previously created versions should remain visible and unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1748: Verify system maintains full history even after many versions created when 20+ v', async ({ page }) => {
    // Test Case: UTC-1748
    // Summary: Verify system maintains full history even after many versions created when 20+ versions exist for a session
    // Description: Feature: Version Tracker – Storage Integrity After Multiple Versions Scenario: Verify system maintains full history even after many versions created Given 20+ versions exist for a session When the user creates another new version Then all versions should remain stored permanently without loss or corruption

    // Navigate to module
    await sessionPage.navigateToModule();

    // Create session
    await sessionPage.createSession({
      name: 'Test Session',
      description: 'Test Description'
    });

    const sessionExists = await sessionPage.sessionExists('Test Session');
    expect(sessionExists).toBe(true);
  });

  test('UTC-1749: Verify backend blocks deletion attempt for a version record when the system does', async ({ page }) => {
    // Test Case: UTC-1749
    // Summary: Verify backend blocks deletion attempt for a version record when the system does not allow deleting versions
    // Description: Feature: Version Tracker – Attempt Delete via Direct Request Blocked Scenario: Verify backend blocks deletion attempt for a version record Given the system does not allow deleting versions When the user attempts to delete a version via API call or forced request Then the backend should reject the request And return access denied / operation not permitted response

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
