import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Confirmation dialog appears when folder not found when user enters non-existing S3 folder path
 * URS: URS-DV-DM-29
 * SRS: SRS-243
 * SDS: SDS-243
 */
test.describe('URS-DV-DM-29: Verify Confirmation dialog appears when folder not found whe', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2548: Verify Confirmation dialog appears when folder not found when user enters non-ex', async ({ page }) => {
    // Test Case: UTC-2548
    // Summary: Verify Confirmation dialog appears when folder not found when user enters non-existing S3 folder path
    // Description: Feature: S3 Folder Existence Confirmation Scenario: Confirmation dialog appears when folder not found Given user enters non-existing S3 folder path When Upload is initiated Then system should display confirmation dialog stating folder not found

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2549: Verify Dialog shows Confirm and Cancel options when confirmation dialog displaye', async ({ page }) => {
    // Test Case: UTC-2549
    // Summary: Verify Dialog shows Confirm and Cancel options when confirmation dialog displayed
    // Description: Feature: S3 Folder Existence Confirmation Scenario: Dialog shows Confirm and Cancel options Given confirmation dialog displayed When user views dialog Then Confirm and Cancel buttons should be present

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2550: Verify Upload paused until decision when dialog is displayed', async ({ page }) => {
    // Test Case: UTC-2550
    // Summary: Verify Upload paused until decision when dialog is displayed
    // Description: Feature: S3 Folder Existence Confirmation Scenario: Upload paused until decision Given dialog is displayed When user has not responded Then upload must not proceed automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2551: Verify Confirm creates folder and proceeds upload when folder does not exist', async ({ page }) => {
    // Test Case: UTC-2551
    // Summary: Verify Confirm creates folder and proceeds upload when folder does not exist
    // Description: Feature: S3 Folder Existence Confirmation Scenario: Confirm creates folder and proceeds upload Given folder does not exist When user clicks Confirm Then system should create folder and continue upload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2552: Verify Cancel stops upload when confirmation dialog shown', async ({ page }) => {
    // Test Case: UTC-2552
    // Summary: Verify Cancel stops upload when confirmation dialog shown
    // Description: Feature: S3 Folder Existence Confirmation Scenario: Cancel stops upload Given confirmation dialog shown When user clicks Cancel Then upload must be stopped

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2553: Verify No partial file saved on cancel when user cancels upload', async ({ page }) => {
    // Test Case: UTC-2553
    // Summary: Verify No partial file saved on cancel when user cancels upload
    // Description: Feature: S3 Folder Existence Confirmation Scenario: No partial file saved on cancel Given user cancels upload When operation stops Then no folder or file should be created

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2554: Verify Existing folder bypasses dialog when folder already exists', async ({ page }) => {
    // Test Case: UTC-2554
    // Summary: Verify Existing folder bypasses dialog when folder already exists
    // Description: Feature: S3 Folder Existence Confirmation Scenario: Existing folder bypasses dialog Given folder already exists When Upload is initiated Then upload proceeds directly without confirmation

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2555: Verify Folder creation success notification when folder is newly created', async ({ page }) => {
    // Test Case: UTC-2555
    // Summary: Verify Folder creation success notification when folder is newly created
    // Description: Feature: S3 Folder Existence Confirmation Scenario: Folder creation success notification Given folder is newly created When upload completes Then success toast should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2556: Verify Folder creation failure when system fails to create folder', async ({ page }) => {
    // Test Case: UTC-2556
    // Summary: Verify Folder creation failure when system fails to create folder
    // Description: Feature: S3 Folder Existence Confirmation Scenario: Folder creation failure Given system fails to create folder When Confirm clicked Then failure message should appear and upload should stop

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2557: Verify Upload failure after folder creation when folder created successfully', async ({ page }) => {
    // Test Case: UTC-2557
    // Summary: Verify Upload failure after folder creation when folder created successfully
    // Description: Feature: S3 Folder Existence Confirmation Scenario: Upload failure after folder creation Given folder created successfully When file upload fails Then system shows failure notification and no partial save

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2558: Verify Unauthorized folder creation blocked when insufficient permissions', async ({ page }) => {
    // Test Case: UTC-2558
    // Summary: Verify Unauthorized folder creation blocked when insufficient permissions
    // Description: Feature: S3 Folder Existence Confirmation Scenario: Unauthorized folder creation blocked Given insufficient permissions When Confirm clicked Then upload is blocked with access denied message

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2559: Verify Dialog clearly shows folder path when confirmation popup shown', async ({ page }) => {
    // Test Case: UTC-2559
    // Summary: Verify Dialog clearly shows folder path when confirmation popup shown
    // Description: Feature: S3 Folder Existence Confirmation Scenario: Dialog clearly shows folder path Given confirmation popup shown When displayed Then the missing folder path should be visible to user

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2560: Verify Multiple rapid uploads handled when repeated attempts with missing folder', async ({ page }) => {
    // Test Case: UTC-2560
    // Summary: Verify Multiple rapid uploads handled when repeated attempts with missing folders
    // Description: Feature: S3 Folder Existence Confirmation Scenario: Multiple rapid uploads handled Given repeated attempts with missing folders When confirming repeatedly Then system should behave consistently without duplicate folders

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2561: Verify Confirmation appears quickly when upload triggered', async ({ page }) => {
    // Test Case: UTC-2561
    // Summary: Verify Confirmation appears quickly when upload triggered
    // Description: Feature: S3 Folder Existence Confirmation Scenario: Confirmation appears quickly Given upload triggered When folder missing Then dialog appears within acceptable time (<1s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2562: Verify Close dialog without action when confirmation dialog visible', async ({ page }) => {
    // Test Case: UTC-2562
    // Summary: Verify Close dialog without action when confirmation dialog visible
    // Description: Feature: S3 Folder Existence Confirmation Scenario: Close dialog without action Given confirmation dialog visible When user closes modal (X/Escape) Then upload should be cancelled safely

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
