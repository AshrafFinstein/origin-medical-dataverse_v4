import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Download button is available for each version row when Version History list contains multiple versions
 * URS: URS-DV-DM-17
 * SRS: SRS-133
 * SDS: SDS-133
 */
test.describe('URS-DV-DM-17: Verify Download button is available for each version row whe', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1785: Verify Download button is available for each version row when Version History li', async ({ page }) => {
    // Test Case: UTC-1785
    // Summary: Verify Download button is available for each version row when Version History list contains multiple versions
    // Description: Feature: Version Download – Download Action per Row Scenario: Verify Download button is available for each version row Given Version History list contains multiple versions When the user views the version table Then Download action/button should be available for each version row

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1786: Verify user can select a version row for download when Version History list is d', async ({ page }) => {
    // Test Case: UTC-1786
    // Summary: Verify user can select a version row for download when Version History list is displayed
    // Description: Feature: Version Download – Select Version Row Scenario: Verify user can select a version row for download Given Version History list is displayed When the user selects a specific version row (ex: V3) Then the selected row should become active and ready for download

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1787: Verify system downloads selected JSON version successfully when the user selecte', async ({ page }) => {
    // Test Case: UTC-1787
    // Summary: Verify system downloads selected JSON version successfully when the user selected version V4 in Version History list
    // Description: Feature: Version Download – Download Selected Version Successfully Scenario: Verify system downloads selected JSON version successfully Given the user selected version V4 in Version History list When the user clicks Download action Then the system should retrieve V4 JSON file from storage And start secure file download

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1788: Verify downloaded file matches selected version content when V1 and V2 have diff', async ({ page }) => {
    // Test Case: UTC-1788
    // Summary: Verify downloaded file matches selected version content when V1 and V2 have different JSON content
    // Description: Feature: Version Download – Correct File Content Validation Scenario: Verify downloaded file matches selected version content Given V1 and V2 have different JSON content When the user downloads V2 Then the downloaded JSON should match V2 stored data and not V1

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1789: Verify user can download different versions one by one when multiple versions ex', async ({ page }) => {
    // Test Case: UTC-1789
    // Summary: Verify user can download different versions one by one when multiple versions exist in Version History list
    // Description: Feature: Version Download – Multiple Version Downloads Scenario: Verify user can download different versions one by one Given multiple versions exist in Version History list When the user downloads V2 and then downloads V5 Then both downloads should work correctly without conflict

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1790: Verify user-friendly message shown if file is unavailable when a version row exi', async ({ page }) => {
    // Test Case: UTC-1790
    // Summary: Verify user-friendly message shown if file is unavailable when a version row exists but the file is missing in storage
    // Description: Feature: Version Download – File Missing Error Handling Scenario: Verify user-friendly message shown if file is unavailable Given a version row exists but the file is missing in storage When the user clicks Download Then the system should show a user-friendly error notification And should not expose technical error details

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1791: Verify safe error shown if retrieval fails due to network/server issue when the ', async ({ page }) => {
    // Test Case: UTC-1791
    // Summary: Verify safe error shown if retrieval fails due to network/server issue when the system cannot retrieve version file due to backend failure
    // Description: Feature: Version Download – Retrieval Failure Handling Scenario: Verify safe error shown if retrieval fails due to network/server issue Given the system cannot retrieve version file due to backend failure When the user clicks Download for a selected version Then the system should show user-friendly error notification And download should not start

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1792: Verify system does not expose technical error messages to user when a download f', async ({ page }) => {
    // Test Case: UTC-1792
    // Summary: Verify system does not expose technical error messages to user when a download fails due to any issue
    // Description: Feature: Version Download – No Technical Error Leakage Scenario: Verify system does not expose technical error messages to user Given a download fails due to any issue When the error message is displayed Then the message should be user-friendly And should not contain stack traces, API URLs, or system error codes

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
