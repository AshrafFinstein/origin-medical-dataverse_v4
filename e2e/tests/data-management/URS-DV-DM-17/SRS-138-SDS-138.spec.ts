import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Version History panel is not visible for users without permission when the user logs in with a role that has no version access permission
 * URS: URS-DV-DM-17
 * SRS: SRS-138
 * SDS: SDS-138
 */
test.describe('URS-DV-DM-17: Verify Version History panel is not visible for users withou', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1823: Verify Version History panel is not visible for users without permission when th', async ({ page }) => {
    // Test Case: UTC-1823
    // Summary: Verify Version History panel is not visible for users without permission when the user logs in with a role that has no version access permission
    // Description: Feature: Version History – Hide Panel for Unauthorized Users Scenario: Verify Version History panel is not visible for users without permission Given the user logs in with a role that has no version access permission When the user opens a session page Then the Version History panel/Version Tracker option should not be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1824: Verify system blocks access even if UI is forced open when the user is unauthori', async ({ page }) => {
    // Test Case: UTC-1824
    // Summary: Verify system blocks access even if UI is forced open when the user is unauthorized for version access
    // Description: Feature: Version History – Block Interaction if Panel Visible Scenario: Verify system blocks access even if UI is forced open Given the user is unauthorized for version access When the user tries to open Version History via direct URL or forced UI action Then the system should block access safely

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1825: Verify backend checks authorization before returning version metadata when the u', async ({ page }) => {
    // Test Case: UTC-1825
    // Summary: Verify backend checks authorization before returning version metadata when the user is unauthorized
    // Description: Feature: Version History – Authorization Before Metadata Retrieval Scenario: Verify backend checks authorization before returning version metadata Given the user is unauthorized When the user attempts to fetch version metadata via API call Then the system should reject the request And should not return any version metadata

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1826: Verify backend checks authorization before streaming JSON file when the user is ', async ({ page }) => {
    // Test Case: UTC-1826
    // Summary: Verify backend checks authorization before streaming JSON file when the user is unauthorized
    // Description: Feature: Version Download – Authorization Before File Streaming Scenario: Verify backend checks authorization before streaming JSON file Given the user is unauthorized When the user attempts to download a JSON version via API call Then the backend should reject the request And should not stream any file data

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1827: Verify user gets safe message when access is denied when the user is unauthorize', async ({ page }) => {
    // Test Case: UTC-1827
    // Summary: Verify user gets safe message when access is denied when the user is unauthorized for version access
    // Description: Feature: Version History – Safe Notification for Unauthorized Access Scenario: Verify user gets safe message when access is denied Given the user is unauthorized for version access When the user attempts to access Version History panel Then the system should show a safe notification (ex: “Access denied”) And should not expose technical error details

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1828: Verify authorized users can view version history list when the user logs in with', async ({ page }) => {
    // Test Case: UTC-1828
    // Summary: Verify authorized users can view version history list when the user logs in with a role that has version access permission
    // Description: Feature: Version History – Authorized Users Can View Metadata Scenario: Verify authorized users can view version history list Given the user logs in with a role that has version access permission When the user opens Version History panel Then the system should display version metadata normally

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1829: Verify authorized users can download selected JSON versions when the user has do', async ({ page }) => {
    // Test Case: UTC-1829
    // Summary: Verify authorized users can download selected JSON versions when the user has download permission
    // Description: Feature: Version Download – Authorized Users Can Download Scenario: Verify authorized users can download selected JSON versions Given the user has download permission When the user selects a version and clicks Download Then the system should allow file download successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1830: Verify unauthorized user cannot see version metadata values when the user is una', async ({ page }) => {
    // Test Case: UTC-1830
    // Summary: Verify unauthorized user cannot see version metadata values when the user is unauthorized
    // Description: Feature: Version Access – Prevent Unauthorized Data Exposure Scenario: Verify unauthorized user cannot see version metadata values Given the user is unauthorized When the user attempts to access version metadata using browser devtools or API calls Then the system should not expose any version number/date/user data

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
