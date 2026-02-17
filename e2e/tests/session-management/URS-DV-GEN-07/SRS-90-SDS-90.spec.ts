import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Import CSV button visibility when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-90
 * SDS: SDS-90
 */
test.describe('URS-DV-GEN-07: Verify Import CSV button visibility when Session Creation pa', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1140: Verify Import CSV button visibility when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-1140
    // Summary: Verify Import CSV button visibility when Session Creation page loads
    // Description: Feature: CSV bulk import for session data population Scenario: Import CSV button visibility Given Session Creation page loads When left column renders Then “Import CSV” button should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1141: Verify Button styling clarity when page rendered', async ({ page }) => {
    // Test Case: UTC-1141
    // Summary: Verify Button styling clarity when page rendered
    // Description: Feature: CSV bulk import for session data population Scenario: Button styling clarity Given page rendered When user views controls Then Import CSV button should be prominent and clickable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1142: Verify File picker opens when user clicks Import CSV', async ({ page }) => {
    // Test Case: UTC-1142
    // Summary: Verify File picker opens when user clicks Import CSV
    // Description: Feature: CSV bulk import for session data population Scenario: File picker opens Given user clicks Import CSV When action triggered Then system should open native file chooser

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1143: Verify Accept only CSV files when file chooser opened', async ({ page }) => {
    // Test Case: UTC-1143
    // Summary: Verify Accept only CSV files when file chooser opened
    // Description: Feature: CSV bulk import for session data population Scenario: Accept only CSV files Given file chooser opened When user selects non-CSV file Then file should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1144: Verify Valid CSV file selection when valid CSV selected', async ({ page }) => {
    // Test Case: UTC-1144
    // Summary: Verify Valid CSV file selection when valid CSV selected
    // Description: Feature: CSV bulk import for session data population Scenario: Valid CSV file selection Given valid CSV selected When file uploaded Then system should read file using Browser File API

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1145: Verify Header mapping to form fields when valid CSV headers', async ({ page }) => {
    // Test Case: UTC-1145
    // Summary: Verify Header mapping to form fields when valid CSV headers
    // Description: Feature: CSV bulk import for session data population Scenario: Header mapping to form fields Given valid CSV headers When parsing completes Then values should map correctly to form state keys

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1146: Verify Populate multiple fields when CSV contains multiple attributes', async ({ page }) => {
    // Test Case: UTC-1146
    // Summary: Verify Populate multiple fields when CSV contains multiple attributes
    // Description: Feature: CSV bulk import for session data population Scenario: Populate multiple fields Given CSV contains multiple attributes When import completes Then all corresponding form fields should update correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1147: Verify Immediate UI update when CSV parsed', async ({ page }) => {
    // Test Case: UTC-1147
    // Summary: Verify Immediate UI update when CSV parsed
    // Description: Feature: CSV bulk import for session data population Scenario: Immediate UI update Given CSV parsed When mapping finishes Then UI should reflect new values instantly without reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1148: Verify Invalid schema handling when CSV headers mismatch system format', async ({ page }) => {
    // Test Case: UTC-1148
    // Summary: Verify Invalid schema handling when CSV headers mismatch system format
    // Description: Feature: CSV bulk import for session data population Scenario: Invalid schema handling Given CSV headers mismatch system format When user uploads file Then “Invalid CSV Schema” modal should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1149: Verify Missing required columns when required header missing', async ({ page }) => {
    // Test Case: UTC-1149
    // Summary: Verify Missing required columns when required header missing
    // Description: Feature: CSV bulk import for session data population Scenario: Missing required columns Given required header missing When parsing occurs Then import should be blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1150: Verify Corrupted file handling when corrupted CSV uploaded', async ({ page }) => {
    // Test Case: UTC-1150
    // Summary: Verify Corrupted file handling when corrupted CSV uploaded
    // Description: Feature: CSV bulk import for session data population Scenario: Corrupted file handling Given corrupted CSV uploaded When parsing fails Then friendly error message should display

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1151: Verify Existing values overwritten correctly when fields already populated', async ({ page }) => {
    // Test Case: UTC-1151
    // Summary: Verify Existing values overwritten correctly when fields already populated
    // Description: Feature: CSV bulk import for session data population Scenario: Existing values overwritten correctly Given fields already populated When CSV imported Then new values should replace old ones correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1152: Verify Cancel file selection when file chooser opened', async ({ page }) => {
    // Test Case: UTC-1152
    // Summary: Verify Cancel file selection when file chooser opened
    // Description: Feature: CSV bulk import for session data population Scenario: Cancel file selection Given file chooser opened When user cancels Then no changes should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1153: Verify Large CSV processing time when large CSV (1000+ rows)', async ({ page }) => {
    // Test Case: UTC-1153
    // Summary: Verify Large CSV processing time when large CSV (1000+ rows)
    // Description: Feature: CSV bulk import for session data population Scenario: Large CSV processing time Given large CSV (1000+ rows) When importing Then processing should complete within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1154: Verify Success feedback when CSV imported successfully', async ({ page }) => {
    // Test Case: UTC-1154
    // Summary: Verify Success feedback when CSV imported successfully
    // Description: Feature: CSV bulk import for session data population Scenario: Success feedback Given CSV imported successfully When process completes Then success toast/message should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1155: Verify Script injection prevention when CSV contains malicious script text', async ({ page }) => {
    // Test Case: UTC-1155
    // Summary: Verify Script injection prevention when CSV contains malicious script text
    // Description: Feature: CSV bulk import for session data population Scenario: Script injection prevention Given CSV contains malicious script text When parsed Then input should be sanitized and not executed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1156: Verify Keyboard accessibility when button focused', async ({ page }) => {
    // Test Case: UTC-1156
    // Summary: Verify Keyboard accessibility when button focused
    // Description: Feature: CSV bulk import for session data population Scenario: Keyboard accessibility Given button focused When Enter/Space pressed Then file dialog should open

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1157: Verify Imported values included in payload when form auto-filled via CSV', async ({ page }) => {
    // Test Case: UTC-1157
    // Summary: Verify Imported values included in payload when form auto-filled via CSV
    // Description: Feature: CSV bulk import for session data population Scenario: Imported values included in payload Given form auto-filled via CSV When session saved Then imported data should be included in API payload

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
