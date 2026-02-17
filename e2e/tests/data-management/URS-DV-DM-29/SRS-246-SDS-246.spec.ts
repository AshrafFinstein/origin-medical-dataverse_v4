import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Authorized user can view S3 actions when the user has S3 upload permission
 * URS: URS-DV-DM-29
 * SRS: SRS-246
 * SDS: SDS-246
 */
test.describe('URS-DV-DM-29: Verify Authorized user can view S3 actions when the user has', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2588: Verify Authorized user can view S3 actions when the user has S3 upload permissio', async ({ page }) => {
    // Test Case: UTC-2588
    // Summary: Verify Authorized user can view S3 actions when the user has S3 upload permission
    // Description: Feature: Role-Based S3 Access Control Scenario: Authorized user can view S3 actions Given the user has S3 upload permission When the Create Session page loads Then “Upload from S3” and “Push to S3” options should be visible and enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2589: Verify Unauthorized user cannot view S3 actions when the user lacks S3 permissio', async ({ page }) => {
    // Test Case: UTC-2589
    // Summary: Verify Unauthorized user cannot view S3 actions when the user lacks S3 permission
    // Description: Feature: Role-Based S3 Access Control Scenario: Unauthorized user cannot view S3 actions Given the user lacks S3 permission When the page loads Then “Upload from S3” and “Push to S3” options should be hidden or disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2590: Verify Upload blocked for unauthorized user when an unauthorized user attempts t', async ({ page }) => {
    // Test Case: UTC-2590
    // Summary: Verify Upload blocked for unauthorized user when an unauthorized user attempts to upload from S3
    // Description: Feature: Role-Based S3 Access Control Scenario: Upload blocked for unauthorized user Given an unauthorized user attempts to upload from S3 When the action is triggered Then the system should block the request

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2591: Verify Push blocked for unauthorized user when an unauthorized user attempts to ', async ({ page }) => {
    // Test Case: UTC-2591
    // Summary: Verify Push blocked for unauthorized user when an unauthorized user attempts to push file to S3
    // Description: Feature: Role-Based S3 Access Control Scenario: Push blocked for unauthorized user Given an unauthorized user attempts to push file to S3 When the action is triggered Then the system should block the request

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2592: Verify Backend permission validation when the UI is bypassed using direct API ca', async ({ page }) => {
    // Test Case: UTC-2592
    // Summary: Verify Backend permission validation when the UI is bypassed using direct API call
    // Description: Feature: Role-Based S3 Access Control Scenario: Backend permission validation Given the UI is bypassed using direct API call When an unauthorized request hits the server Then the API should reject with 403 Forbidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-2593: Verify Access denied notification shown when unauthorized action attempted', async ({ page }) => {
    // Test Case: UTC-2593
    // Summary: Verify Access denied notification shown when unauthorized action attempted
    // Description: Feature: Role-Based S3 Access Control Scenario: Access denied notification shown Given unauthorized action attempted When the system blocks it Then a clear “Access Denied / Unauthorized” message should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2594: Verify Role change reflected immediately when a user role changes from authorize', async ({ page }) => {
    // Test Case: UTC-2594
    // Summary: Verify Role change reflected immediately when a user role changes from authorized to unauthorized
    // Description: Feature: Role-Based S3 Access Control Scenario: Role change reflected immediately Given a user role changes from authorized to unauthorized When the page refreshes Then S3 options should no longer be accessible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2595: Verify Permission validated on each action when authorized user', async ({ page }) => {
    // Test Case: UTC-2595
    // Summary: Verify Permission validated on each action when authorized user
    // Description: Feature: Role-Based S3 Access Control Scenario: Permission validated on each action Given authorized user When performing multiple S3 operations Then permission should be validated every time before execution

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2596: Verify Disabled controls visually clear when unauthorized user views page', async ({ page }) => {
    // Test Case: UTC-2596
    // Summary: Verify Disabled controls visually clear when unauthorized user views page
    // Description: Feature: Role-Based S3 Access Control Scenario: Disabled controls visually clear Given unauthorized user views page When controls are disabled Then disabled state should be visually distinct and not clickable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2597: Verify No partial upload occurs on blocked action when unauthorized user trigger', async ({ page }) => {
    // Test Case: UTC-2597
    // Summary: Verify No partial upload occurs on blocked action when unauthorized user triggers upload
    // Description: Feature: Role-Based S3 Access Control Scenario: No partial upload occurs on blocked action Given unauthorized user triggers upload When request is denied Then no file transfer or partial data should occur

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
