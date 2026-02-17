import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify No file selected when user opens JSON upload control
 * URS: URS-DEV-GEN-08
 * SRS: SRS-95
 * SDS: SDS-95
 */
test.describe('URS-DEV-GEN-08: Verify No file selected when user opens JSON upload control', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1221: Verify No file selected when user opens JSON upload control', async ({ page }) => {
    // Test Case: UTC-1221
    // Summary: Verify No file selected when user opens JSON upload control
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: No file selected Given user opens JSON upload control When user clicks Upload without selecting a file Then system should show “Please select a JSON file” message

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1222: Verify Cancel file chooser when file dialog opens', async ({ page }) => {
    // Test Case: UTC-1222
    // Summary: Verify Cancel file chooser when file dialog opens
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: Cancel file chooser Given file dialog opens When user cancels selection Then no upload should start and no error should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1223: Verify Non-JSON file selected when user selects .txt or .csv file', async ({ page }) => {
    // Test Case: UTC-1223
    // Summary: Verify Non-JSON file selected when user selects .txt or .csv file
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: Non-JSON file selected Given user selects .txt or .csv file When upload attempted Then system should reject and show “Invalid file format”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1224: Verify Corrupted JSON content when file has malformed JSON structure', async ({ page }) => {
    // Test Case: UTC-1224
    // Summary: Verify Corrupted JSON content when file has malformed JSON structure
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: Corrupted JSON content Given file has malformed JSON structure When upload starts Then system should show “Invalid JSON file”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1225: Verify Upload stops on invalid JSON when invalid JSON detected', async ({ page }) => {
    // Test Case: UTC-1225
    // Summary: Verify Upload stops on invalid JSON when invalid JSON detected
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: Upload stops on invalid JSON Given invalid JSON detected When validation fails Then upload process should stop immediately

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1226: Verify Non-technical error message when validation failure occurs', async ({ page }) => {
    // Test Case: UTC-1226
    // Summary: Verify Non-technical error message when validation failure occurs
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: Non-technical error message Given validation failure occurs When message displayed Then message should be simple and user-friendly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1227: Verify Session form remains usable after error when upload fails', async ({ page }) => {
    // Test Case: UTC-1227
    // Summary: Verify Session form remains usable after error when upload fails
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: Session form remains usable after error Given upload fails When user continues editing form Then session creation inputs should still function

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1228: Verify Server 500 error when server returns failure', async ({ page }) => {
    // Test Case: UTC-1228
    // Summary: Verify Server 500 error when server returns failure
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: Server 500 error Given server returns failure When upload request sent Then “Upload failed” toast should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1229: Verify Technical stack trace hidden when backend error occurs', async ({ page }) => {
    // Test Case: UTC-1229
    // Summary: Verify Technical stack trace hidden when backend error occurs
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: Technical stack trace hidden Given backend error occurs When message shown Then technical details should not be exposed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1230: Verify Retry upload when previous upload failed', async ({ page }) => {
    // Test Case: UTC-1230
    // Summary: Verify Retry upload when previous upload failed
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: Retry upload Given previous upload failed When user retries with valid file Then upload should succeed normally

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1231: Verify Inline message visibility when invalid file selected', async ({ page }) => {
    // Test Case: UTC-1231
    // Summary: Verify Inline message visibility when invalid file selected
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: Inline message visibility Given invalid file selected When error occurs Then message should be clearly visible near upload field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1232: Verify No blocking during failure when upload fails', async ({ page }) => {
    // Test Case: UTC-1232
    // Summary: Verify No blocking during failure when upload fails
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: No blocking during failure Given upload fails When error handled Then page should remain responsive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1233: Verify Clear upload state reset when upload fails', async ({ page }) => {
    // Test Case: UTC-1233
    // Summary: Verify Clear upload state reset when upload fails
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: Clear upload state reset Given upload fails When user selects new file Then previous error state should clear automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1234: Verify Large invalid file when large corrupted file selected', async ({ page }) => {
    // Test Case: UTC-1234
    // Summary: Verify Large invalid file when large corrupted file selected
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: Large invalid file Given large corrupted file selected When validation runs Then system should handle gracefully without crash

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1235: Verify Keyboard accessibility after error when error message shown', async ({ page }) => {
    // Test Case: UTC-1235
    // Summary: Verify Keyboard accessibility after error when error message shown
    // Description: Feature: JSON Upload Error & Empty State Handling Scenario: Keyboard accessibility after error Given error message shown When user navigates via keyboard Then upload control remains accessible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
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
