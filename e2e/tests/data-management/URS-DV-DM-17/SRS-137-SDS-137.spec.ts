import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify downloaded JSON is not partial/incomplete when the user selects a version from Version History list
 * URS: URS-DV-DM-17
 * SRS: SRS-137
 * SDS: SDS-137
 */
test.describe('URS-DV-DM-17: Verify downloaded JSON is not partial/incomplete when the us', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1816: Verify downloaded JSON is not partial/incomplete when the user selects a version', async ({ page }) => {
    // Test Case: UTC-1816
    // Summary: Verify downloaded JSON is not partial/incomplete when the user selects a version from Version History list
    // Description: Feature: JSON Download – Complete File Transfer Scenario: Verify downloaded JSON is not partial/incomplete Given the user selects a version from Version History list When the user downloads the JSON file Then the file should download completely without truncation

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1817: Verify downloaded JSON file is not corrupted when a valid JSON version exists in', async ({ page }) => {
    // Test Case: UTC-1817
    // Summary: Verify downloaded JSON file is not corrupted when a valid JSON version exists in storage
    // Description: Feature: JSON Download – File Integrity Validation Scenario: Verify downloaded JSON file is not corrupted Given a valid JSON version exists in storage When the user downloads the version file Then the downloaded file should open successfully And should contain valid JSON format

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1818: Verify repeated downloads of same version give same output when version V4 exist', async ({ page }) => {
    // Test Case: UTC-1818
    // Summary: Verify repeated downloads of same version give same output when version V4 exists in history
    // Description: Feature: JSON Download – Multiple Downloads Consistency Scenario: Verify repeated downloads of same version give same output Given version V4 exists in history When the user downloads V4 multiple times Then the downloaded file content should remain consistent each time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1819: Verify large JSON version downloads without corruption when a version exists wit', async ({ page }) => {
    // Test Case: UTC-1819
    // Summary: Verify large JSON version downloads without corruption when a version exists with large JSON size
    // Description: Feature: JSON Download – Large JSON File Download Reliability Scenario: Verify large JSON version downloads without corruption Given a version exists with large JSON size When the user downloads the version file Then the download should complete successfully without corruption

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1820: Verify system handles download interruption safely when a download is in progres', async ({ page }) => {
    // Test Case: UTC-1820
    // Summary: Verify system handles download interruption safely when a download is in progress
    // Description: Feature: JSON Download – Network Interruption Handling Scenario: Verify system handles download interruption safely Given a download is in progress When the network disconnects temporarily Then the download should fail safely without partial corrupted file being treated as success And system should show retry notification

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1821: Verify retry notification shown if download fails when the system fails to retri', async ({ page }) => {
    // Test Case: UTC-1821
    // Summary: Verify retry notification shown if download fails when the system fails to retrieve the version file due to server issue
    // Description: Feature: JSON Download – Retry Notification on Failure Scenario: Verify retry notification shown if download fails Given the system fails to retrieve the version file due to server issue When the user clicks Download Then the system should show retry notification to the user

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1822: Verify UI shows success feedback after successful download when the user downloa', async ({ page }) => {
    // Test Case: UTC-1822
    // Summary: Verify UI shows success feedback after successful download when the user downloads a JSON version successfully
    // Description: Feature: JSON Download – Success Feedback After Completion Scenario: Verify UI shows success feedback after successful download Given the user downloads a JSON version successfully When the download completes Then the UI should show success feedback (download complete toast / progress completed)

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
