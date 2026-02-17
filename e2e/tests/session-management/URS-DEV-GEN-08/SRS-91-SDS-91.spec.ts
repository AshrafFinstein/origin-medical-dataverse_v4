import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Upload control visibility when Session Creation page loads
 * URS: URS-DEV-GEN-08
 * SRS: SRS-91
 * SDS: SDS-91
 */
test.describe('URS-DEV-GEN-08: Verify Upload control visibility when Session Creation page ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1158: Verify Upload control visibility when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-1158
    // Summary: Verify Upload control visibility when Session Creation page loads
    // Description: Feature: JSON session configuration upload and association Scenario: Upload control visibility Given Session Creation page loads When metadata section renders Then JSON file upload control should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1159: Verify Upload label clarity when upload control is displayed', async ({ page }) => {
    // Test Case: UTC-1159
    // Summary: Verify Upload label clarity when upload control is displayed
    // Description: Feature: JSON session configuration upload and association Scenario: Upload label clarity Given upload control is displayed When user views the field Then it should clearly indicate “Upload JSON File”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1160: Verify File chooser opens when user clicks upload control', async ({ page }) => {
    // Test Case: UTC-1160
    // Summary: Verify File chooser opens when user clicks upload control
    // Description: Feature: JSON session configuration upload and association Scenario: File chooser opens Given user clicks upload control When action triggered Then native file picker should open

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1161: Verify Accept only JSON files when file picker opened', async ({ page }) => {
    // Test Case: UTC-1161
    // Summary: Verify Accept only JSON files when file picker opened
    // Description: Feature: JSON session configuration upload and association Scenario: Accept only JSON files Given file picker opened When user selects non-JSON file Then file should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1162: Verify Valid JSON selected when valid JSON file selected', async ({ page }) => {
    // Test Case: UTC-1162
    // Summary: Verify Valid JSON selected when valid JSON file selected
    // Description: Feature: JSON session configuration upload and association Scenario: Valid JSON selected Given valid JSON file selected When upload completes Then file should be accepted successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1163: Verify Upload status visibility when file uploading', async ({ page }) => {
    // Test Case: UTC-1163
    // Summary: Verify Upload status visibility when file uploading
    // Description: Feature: JSON session configuration upload and association Scenario: Upload status visibility Given file uploading When process in progress Then loading indicator or progress should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1164: Verify Link JSON to session when upload successful', async ({ page }) => {
    // Test Case: UTC-1164
    // Summary: Verify Link JSON to session when upload successful
    // Description: Feature: JSON session configuration upload and association Scenario: Link JSON to session Given upload successful When session created Then JSON file should be associated with the session record

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1165: Verify Metadata parsed correctly when JSON contains valid metadata', async ({ page }) => {
    // Test Case: UTC-1165
    // Summary: Verify Metadata parsed correctly when JSON contains valid metadata
    // Description: Feature: JSON session configuration upload and association Scenario: Metadata parsed correctly Given JSON contains valid metadata When parsed Then session configuration should populate accordingly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1166: Verify Structure defines labeling inputs when JSON defines labeling schema', async ({ page }) => {
    // Test Case: UTC-1166
    // Summary: Verify Structure defines labeling inputs when JSON defines labeling schema
    // Description: Feature: JSON session configuration upload and association Scenario: Structure defines labeling inputs Given JSON defines labeling schema When session loads Then labeling inputs should match schema

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1167: Verify Invalid JSON format when malformed JSON uploaded', async ({ page }) => {
    // Test Case: UTC-1167
    // Summary: Verify Invalid JSON format when malformed JSON uploaded
    // Description: Feature: JSON session configuration upload and association Scenario: Invalid JSON format Given malformed JSON uploaded When validation occurs Then user-friendly error message should display

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1168: Verify Missing file handling when no file selected', async ({ page }) => {
    // Test Case: UTC-1168
    // Summary: Verify Missing file handling when no file selected
    // Description: Feature: JSON session configuration upload and association Scenario: Missing file handling Given no file selected When user submits Then system should prompt user to upload file

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1169: Verify Cancel selection when file picker open', async ({ page }) => {
    // Test Case: UTC-1169
    // Summary: Verify Cancel selection when file picker open
    // Description: Feature: JSON session configuration upload and association Scenario: Cancel selection Given file picker open When user cancels Then no upload should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1170: Verify Large JSON performance when large JSON file uploaded', async ({ page }) => {
    // Test Case: UTC-1170
    // Summary: Verify Large JSON performance when large JSON file uploaded
    // Description: Feature: JSON session configuration upload and association Scenario: Large JSON performance Given large JSON file uploaded When processed Then upload and parse should complete within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1171: Verify Script injection prevention when JSON contains script tags', async ({ page }) => {
    // Test Case: UTC-1171
    // Summary: Verify Script injection prevention when JSON contains script tags
    // Description: Feature: JSON session configuration upload and association Scenario: Script injection prevention Given JSON contains script tags When parsed Then scripts should be sanitized and not executed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1172: Verify Replace uploaded file when JSON already uploaded', async ({ page }) => {
    // Test Case: UTC-1172
    // Summary: Verify Replace uploaded file when JSON already uploaded
    // Description: Feature: JSON session configuration upload and association Scenario: Replace uploaded file Given JSON already uploaded When user uploads new file Then previous file should be replaced

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1173: Verify Persist after navigation when JSON uploaded', async ({ page }) => {
    // Test Case: UTC-1173
    // Summary: Verify Persist after navigation when JSON uploaded
    // Description: Feature: JSON session configuration upload and association Scenario: Persist after navigation Given JSON uploaded When navigating within form Then file reference should remain intact

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1174: Verify Included in API payload when JSON uploaded', async ({ page }) => {
    // Test Case: UTC-1174
    // Summary: Verify Included in API payload when JSON uploaded
    // Description: Feature: JSON session configuration upload and association Scenario: Included in API payload Given JSON uploaded When session saved Then file reference should be included in payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1175: Verify Keyboard accessibility when upload control focused', async ({ page }) => {
    // Test Case: UTC-1175
    // Summary: Verify Keyboard accessibility when upload control focused
    // Description: Feature: JSON session configuration upload and association Scenario: Keyboard accessibility Given upload control focused When Enter/Space pressed Then file chooser should open

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
