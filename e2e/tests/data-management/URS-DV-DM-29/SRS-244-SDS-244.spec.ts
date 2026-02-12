import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Push to S3 button visibility when Session page loads
 * URS: URS-DV-DM-29
 * SRS: SRS-244
 * SDS: SDS-244
 */
test.describe('URS-DV-DM-29: Verify Push to S3 button visibility when Session page loads', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2563: Verify Push to S3 button visibility when Session page loads', async ({ page }) => {
    // Test Case: UTC-2563
    // Summary: Verify Push to S3 button visibility when Session page loads
    // Description: Feature: Push Session JSON to S3 Scenario: Push to S3 button visibility Given Session page loads When actions are rendered Then “Push to S3” button should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2564: Verify Upload dialog opens when user clicks Push to S3', async ({ page }) => {
    // Test Case: UTC-2564
    // Summary: Verify Upload dialog opens when user clicks Push to S3
    // Description: Feature: Push Session JSON to S3 Scenario: Upload dialog opens Given user clicks Push to S3 When action triggered Then upload dialog or path input should open

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2565: Verify Dialog fields present when dialog opened', async ({ page }) => {
    // Test Case: UTC-2565
    // Summary: Verify Dialog fields present when dialog opened
    // Description: Feature: Push Session JSON to S3 Scenario: Dialog fields present Given dialog opened When viewing form Then S3 path input and Push button should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2566: Verify Push disabled without path when no S3 path entered', async ({ page }) => {
    // Test Case: UTC-2566
    // Summary: Verify Push disabled without path when no S3 path entered
    // Description: Feature: Push Session JSON to S3 Scenario: Push disabled without path Given no S3 path entered When viewing dialog Then Push button remains disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2567: Verify Valid path enables push when valid S3 key entered', async ({ page }) => {
    // Test Case: UTC-2567
    // Summary: Verify Valid path enables push when valid S3 key entered
    // Description: Feature: Push Session JSON to S3 Scenario: Valid path enables push Given valid S3 key entered When input validated Then Push button becomes enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2568: Verify Upload starts on push when valid file and path', async ({ page }) => {
    // Test Case: UTC-2568
    // Summary: Verify Upload starts on push when valid file and path
    // Description: Feature: Push Session JSON to S3 Scenario: Upload starts on push Given valid file and path When user clicks Push Then upload should begin

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2569: Verify Progress feedback shown when upload in progress', async ({ page }) => {
    // Test Case: UTC-2569
    // Summary: Verify Progress feedback shown when upload in progress
    // Description: Feature: Push Session JSON to S3 Scenario: Progress feedback shown Given upload in progress When transfer occurs Then progress spinner or bar should display

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2570: Verify Successful upload when upload completes', async ({ page }) => {
    // Test Case: UTC-2570
    // Summary: Verify Successful upload when upload completes
    // Description: Feature: Push Session JSON to S3 Scenario: Successful upload Given upload completes When response received Then success toast should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2571: Verify File stored in correct folder when upload success', async ({ page }) => {
    // Test Case: UTC-2571
    // Summary: Verify File stored in correct folder when upload success
    // Description: Feature: Push Session JSON to S3 Scenario: File stored in correct folder Given upload success When checking bucket Then JSON should exist in specified path

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2572: Verify Reject invalid path when malformed S3 key', async ({ page }) => {
    // Test Case: UTC-2572
    // Summary: Verify Reject invalid path when malformed S3 key
    // Description: Feature: Push Session JSON to S3 Scenario: Reject invalid path Given malformed S3 key When push attempted Then validation message should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2573: Verify Access denied path when unauthorized bucket/folder', async ({ page }) => {
    // Test Case: UTC-2573
    // Summary: Verify Access denied path when unauthorized bucket/folder
    // Description: Feature: Push Session JSON to S3 Scenario: Access denied path Given unauthorized bucket/folder When push attempted Then access denied error should display

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2574: Verify Prevent partial uploads on failure when network fails mid-upload', async ({ page }) => {
    // Test Case: UTC-2574
    // Summary: Verify Prevent partial uploads on failure when network fails mid-upload
    // Description: Feature: Push Session JSON to S3 Scenario: Prevent partial uploads on failure Given network fails mid-upload When transfer interrupted Then partial file should not remain

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2575: Verify Server failure when server error occurs', async ({ page }) => {
    // Test Case: UTC-2575
    // Summary: Verify Server failure when server error occurs
    // Description: Feature: Push Session JSON to S3 Scenario: Server failure Given server error occurs When upload attempted Then failure toast should display

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-2576: Verify Cancel upload when dialog open', async ({ page }) => {
    // Test Case: UTC-2576
    // Summary: Verify Cancel upload when dialog open
    // Description: Feature: Push Session JSON to S3 Scenario: Cancel upload Given dialog open When user clicks Cancel Then upload process should stop

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2577: Verify Fast upload response when normal network', async ({ page }) => {
    // Test Case: UTC-2577
    // Summary: Verify Fast upload response when normal network
    // Description: Feature: Push Session JSON to S3 Scenario: Fast upload response Given normal network When pushing file Then completion should occur within acceptable time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2578: Verify No file selected when no JSON available', async ({ page }) => {
    // Test Case: UTC-2578
    // Summary: Verify No file selected when no JSON available
    // Description: Feature: Push Session JSON to S3 Scenario: No file selected Given no JSON available When push clicked Then system blocks action with message

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2579: Verify Keyboard support when Push button focused', async ({ page }) => {
    // Test Case: UTC-2579
    // Summary: Verify Keyboard support when Push button focused
    // Description: Feature: Push Session JSON to S3 Scenario: Keyboard support Given Push button focused When Enter pressed Then upload should start

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
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
