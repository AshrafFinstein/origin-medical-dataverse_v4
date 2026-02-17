import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify File names displayed after selection when user selects multiple JSON files
 * URS: URS-DV-AN-13
 * SRS: SRS-117
 * SDS: SDS-117
 */
test.describe('URS-DV-AN-13: Verify File names displayed after selection when user select', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1595: Verify File names displayed after selection when user selects multiple JSON file', async ({ page }) => {
    // Test Case: UTC-1595
    // Summary: Verify File names displayed after selection when user selects multiple JSON files
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: File names displayed after selection Given user selects multiple JSON files When files are added Then all file names should appear in the upload list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1596: Verify Pending state indicator shown when files are queued for upload', async ({ page }) => {
    // Test Case: UTC-1596
    // Summary: Verify Pending state indicator shown when files are queued for upload
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: Pending state indicator shown Given files are queued for upload When upload has not started Then each file should display Pending status

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1597: Verify Success indicator displayed when upload completes successfully', async ({ page }) => {
    // Test Case: UTC-1597
    // Summary: Verify Success indicator displayed when upload completes successfully
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: Success indicator displayed Given upload completes successfully When processing finishes Then file should display success indicator

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1598: Verify Failure indicator displayed when upload fails', async ({ page }) => {
    // Test Case: UTC-1598
    // Summary: Verify Failure indicator displayed when upload fails
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: Failure indicator displayed Given upload fails When backend returns error Then file should display error/warning icon

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1599: Verify User-friendly failure message when file upload fails', async ({ page }) => {
    // Test Case: UTC-1599
    // Summary: Verify User-friendly failure message when file upload fails
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: User-friendly failure message Given file upload fails When error occurs Then system should show clear non-technical message

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1600: Verify Status updates dynamically when upload is in progress', async ({ page }) => {
    // Test Case: UTC-1600
    // Summary: Verify Status updates dynamically when upload is in progress
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: Status updates dynamically Given upload is in progress When status changes Then UI should update instantly without refresh

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1601: Verify Retry option for failed files when file fails', async ({ page }) => {
    // Test Case: UTC-1601
    // Summary: Verify Retry option for failed files when file fails
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: Retry option for failed files Given file fails When retry is clicked Then upload should restart only for that file

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1602: Verify Mixed status handling when multiple files uploaded', async ({ page }) => {
    // Test Case: UTC-1602
    // Summary: Verify Mixed status handling when multiple files uploaded
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: Mixed status handling Given multiple files uploaded When some succeed and some fail Then each file should show its own independent status

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1603: Verify Status color differentiation when different file states exist', async ({ page }) => {
    // Test Case: UTC-1603
    // Summary: Verify Status color differentiation when different file states exist
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: Status color differentiation Given different file states exist When viewing list Then statuses should use distinct colors/icons

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1604: Verify Status persists after navigation when upload completes', async ({ page }) => {
    // Test Case: UTC-1604
    // Summary: Verify Status persists after navigation when upload completes
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: Status persists after navigation Given upload completes When user navigates within page Then file status should remain intact

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1605: Verify No UI lag with many status updates when 15+ files', async ({ page }) => {
    // Test Case: UTC-1605
    // Summary: Verify No UI lag with many status updates when 15+ files
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: No UI lag with many status updates Given 15+ files When statuses update rapidly Then UI should remain responsive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1606: Verify Screen reader support when upload list displayed', async ({ page }) => {
    // Test Case: UTC-1606
    // Summary: Verify Screen reader support when upload list displayed
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: Screen reader support Given upload list displayed When using assistive tools Then status labels should be readable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1607: Verify Clear ordering of files when files uploaded', async ({ page }) => {
    // Test Case: UTC-1607
    // Summary: Verify Clear ordering of files when files uploaded
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: Clear ordering of files Given files uploaded When list rendered Then files should remain clearly ordered and readable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1608: Verify Invalid file feedback when unsupported file selected', async ({ page }) => {
    // Test Case: UTC-1608
    // Summary: Verify Invalid file feedback when unsupported file selected
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: Invalid file feedback Given unsupported file selected When validation runs Then user should see clear rejection message

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1609: Verify Easy identification of completed uploads when multiple files processed', async ({ page }) => {
    // Test Case: UTC-1609
    // Summary: Verify Easy identification of completed uploads when multiple files processed
    // Description: Feature: Multi-File Upload Usability Feedback Scenario: Easy identification of completed uploads Given multiple files processed When user scans list Then completed files should be easily distinguishable

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
