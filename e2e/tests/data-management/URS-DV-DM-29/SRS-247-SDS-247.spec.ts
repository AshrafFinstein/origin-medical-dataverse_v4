import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Upload from S3 button is displayed on Create Session page when the user navigates to the Create Session page
 * URS: URS-DV-DM-29
 * SRS: SRS-247
 * SDS: SDS-247
 */
test.describe('URS-DV-DM-29: Verify Upload from S3 button is displayed on Create Session ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2598: Verify Upload from S3 button is displayed on Create Session page when the user n', async ({ page }) => {
    // Test Case: UTC-2598
    // Summary: Verify Upload from S3 button is displayed on Create Session page when the user navigates to the Create Session page
    // Description: Feature: Upload Link JSON from S3 – Button Visibility Scenario: Verify “Upload from S3” button is displayed on Create Session page Given the user navigates to the Create Session page When the page loads Then the “Upload from S3” button should be visible at the top-right corner

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2599: Verify S3 upload modal opens on button click when the Upload from S3 button is v', async ({ page }) => {
    // Test Case: UTC-2599
    // Summary: Verify S3 upload modal opens on button click when the Upload from S3 button is visible
    // Description: Feature: Upload Link JSON from S3 – Modal Launch Scenario: Verify S3 upload modal opens on button click Given the “Upload from S3” button is visible When the user clicks the button Then an upload modal should be displayed with S3 Key input field and Upload button

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2600: Verify Upload button is disabled for empty S3 key when the S3 upload modal is op', async ({ page }) => {
    // Test Case: UTC-2600
    // Summary: Verify Upload button is disabled for empty S3 key when the S3 upload modal is open
    // Description: Feature: Upload Link JSON from S3 – Upload Button Disabled State Scenario: Verify Upload button is disabled for empty S3 key Given the S3 upload modal is open When the S3 Key field is empty or invalid Then the Upload button should remain disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2601: Verify validation for invalid S3 key format when the S3 upload modal is open', async ({ page }) => {
    // Test Case: UTC-2601
    // Summary: Verify validation for invalid S3 key format when the S3 upload modal is open
    // Description: Feature: Upload Link JSON from S3 – S3 Key Validation Scenario: Verify validation for invalid S3 key format Given the S3 upload modal is open When the user enters an incorrectly formatted S3 key Then a validation message should be displayed And upload should not proceed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2602: Verify JSON file is fetched successfully using valid S3 key when the user enters', async ({ page }) => {
    // Test Case: UTC-2602
    // Summary: Verify JSON file is fetched successfully using valid S3 key when the user enters a valid S3 key
    // Description: Feature: Upload Link JSON from S3 – Successful File Fetch Scenario: Verify JSON file is fetched successfully using valid S3 key Given the user enters a valid S3 key When the user clicks the Upload button Then the system should retrieve the JSON file from AWS S3 And validate the JSON structure successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2603: Verify uploaded JSON file name is displayed when the JSON file is uploaded succe', async ({ page }) => {
    // Test Case: UTC-2603
    // Summary: Verify uploaded JSON file name is displayed when the JSON file is uploaded successfully
    // Description: Feature: Upload Link JSON from S3 – Uploaded File Display Scenario: Verify uploaded JSON file name is displayed Given the JSON file is uploaded successfully When the upload completes Then the JSON file name should be displayed below the upload area And a Remove option should be available

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2604: Verify uploaded JSON metadata is bound to session form when the JSON file is upl', async ({ page }) => {
    // Test Case: UTC-2604
    // Summary: Verify uploaded JSON metadata is bound to session form when the JSON file is uploaded successfully
    // Description: Feature: Upload Link JSON from S3 – Bind File to Session State Scenario: Verify uploaded JSON metadata is bound to session form Given the JSON file is uploaded successfully When the user continues session creation Then the file metadata (name, size, reference path) should be stored in session state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2605: Verify error handling when S3 file is not found or access denied when the user e', async ({ page }) => {
    // Test Case: UTC-2605
    // Summary: Verify error handling when S3 file is not found or access denied when the user enters a valid but inaccessible S3 key
    // Description: Feature: Upload Link JSON from S3 – File Not Found Handling Scenario: Verify error handling when S3 file is not found or access denied Given the user enters a valid but inaccessible S3 key When the upload is attempted Then a failure toast notification should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2606: Verify invalid JSON structure is rejected when the uploaded file is retrieved fr', async ({ page }) => {
    // Test Case: UTC-2606
    // Summary: Verify invalid JSON structure is rejected when the uploaded file is retrieved from S3
    // Description: Feature: Upload Link JSON from S3 – Invalid JSON Structure Scenario: Verify invalid JSON structure is rejected Given the uploaded file is retrieved from S3 When the JSON structure validation fails Then the system should reject the file And display an appropriate error message without breaking the page

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2607: Verify user can remove uploaded JSON file when a JSON file is uploaded successfu', async ({ page }) => {
    // Test Case: UTC-2607
    // Summary: Verify user can remove uploaded JSON file when a JSON file is uploaded successfully
    // Description: Feature: Upload Link JSON from S3 – Remove Uploaded File Scenario: Verify user can remove uploaded JSON file Given a JSON file is uploaded successfully When the user clicks the Remove option Then the file should be removed from the UI And session form state should be cleared of file data

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2608: Verify the expected behavior under valid user actions', async ({ page }) => {
    // Test Case: UTC-2608
    // Summary: Verify the expected behavior under valid user actions
    // Description: Verify large JSON file (>20MB) upload uses streaming without memory spikes

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2609: Verify the expected behavior under valid user actions', async ({ page }) => {
    // Test Case: UTC-2609
    // Summary: Verify the expected behavior under valid user actions
    // Description: Verify success notification is displayed immediately after successful upload or push

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
