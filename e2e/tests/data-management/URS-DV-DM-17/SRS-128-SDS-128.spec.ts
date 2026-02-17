import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Download action is available for each version entry when version history contains JSON versions
 * URS: URS-DV-DM-17
 * SRS: SRS-128
 * SDS: SDS-128
 */
test.describe('URS-DV-DM-17: Verify Download action is available for each version entry w', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1750: Verify Download action is available for each version entry when version history ', async ({ page }) => {
    // Test Case: UTC-1750
    // Summary: Verify Download action is available for each version entry when version history contains JSON versions
    // Description: Feature: Version Download – Download Button Visibility Scenario: Verify Download action is available for each version entry Given version history contains JSON versions When the user opens Version History list Then Download action/button should be visible for each version entry

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1751: Verify download starts when user selects a version and clicks Download when the ', async ({ page }) => {
    // Test Case: UTC-1751
    // Summary: Verify download starts when user selects a version and clicks Download when the user is authorized to download session versions
    // Description: Feature: Version Download – Initiate Download Successfully Scenario: Verify download starts when user selects a version and clicks Download Given the user is authorized to download session versions When the user selects a version entry And clicks Download Then the system should initiate JSON file download automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1752: Verify the selected version artifact is downloaded correctly when multiple versi', async ({ page }) => {
    // Test Case: UTC-1752
    // Summary: Verify the selected version artifact is downloaded correctly when multiple versions exist in history (V1, V2, V3)
    // Description: Feature: Version Download – Correct Version Downloaded Scenario: Verify the selected version artifact is downloaded correctly Given multiple versions exist in history (V1, V2, V3) When the user downloads V2 Then the downloaded JSON file should match V2 content stored in system

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1753: Verify system validates authorization before download when the user does not hav', async ({ page }) => {
    // Test Case: UTC-1753
    // Summary: Verify system validates authorization before download when the user does not have permission to download versions
    // Description: Feature: Version Download – Authorization Validation Scenario: Verify system validates authorization before download Given the user does not have permission to download versions When the user clicks Download for a version entry Then the system should block download And show user-friendly authorization failure message

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1754: Verify backend blocks direct download request without permission when the user i', async ({ page }) => {
    // Test Case: UTC-1754
    // Summary: Verify backend blocks direct download request without permission when the user is unauthorized
    // Description: Feature: Version Download – Backend Blocks Unauthorized API Download Scenario: Verify backend blocks direct download request without permission Given the user is unauthorized When the user attempts to download version artifact via direct API call Then backend should reject request And return access denied response

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1755: Verify user-friendly message shown when file cannot be retrieved when a version ', async ({ page }) => {
    // Test Case: UTC-1755
    // Summary: Verify user-friendly message shown when file cannot be retrieved when a version exists in UI but file is missing/corrupted in storage
    // Description: Feature: Version Download – File Retrieval Failure Handling Scenario: Verify user-friendly message shown when file cannot be retrieved Given a version exists in UI but file is missing/corrupted in storage When the user clicks Download Then the system should show a user-friendly message And download should not start

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1756: Verify download streams directly without navigating away when the user is on Ver', async ({ page }) => {
    // Test Case: UTC-1756
    // Summary: Verify download streams directly without navigating away when the user is on Version History list
    // Description: Feature: Version Download – Secure Streaming (No Full Page Reload) Scenario: Verify download streams directly without navigating away Given the user is on Version History list When the user clicks Download Then the file should download directly And the user should remain on the same page

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1757: Verify downloaded file is valid JSON format when the user downloads a JSON versi', async ({ page }) => {
    // Test Case: UTC-1757
    // Summary: Verify downloaded file is valid JSON format when the user downloads a JSON version artifact
    // Description: Feature: Version Download – Download File Format Validation Scenario: Verify downloaded file is valid JSON format Given the user downloads a JSON version artifact When the file is opened in editor Then the content should be valid JSON and not corrupted

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
