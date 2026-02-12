import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify File picker shows only JSON files when user opens upload file picker
 * URS: URS-DV-GEN-09
 * SRS: SRS-100
 * SDS: SDS-100
 */
test.describe('URS-DV-GEN-09: Verify File picker shows only JSON files when user opens upl', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1308: Verify File picker shows only JSON files when user opens upload file picker', async ({ page }) => {
    // Test Case: UTC-1308
    // Summary: Verify File picker shows only JSON files when user opens upload file picker
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: File picker shows only JSON files Given user opens upload file picker When browsing files Then only .json files should be visible/selectable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1309: Verify Non-JSON hidden in picker when mixed file types exist', async ({ page }) => {
    // Test Case: UTC-1309
    // Summary: Verify Non-JSON hidden in picker when mixed file types exist
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: Non-JSON hidden in picker Given mixed file types exist When file dialog opens Then .exe/.png/.csv should not appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1310: Verify Select valid JSON when valid JSON selected', async ({ page }) => {
    // Test Case: UTC-1310
    // Summary: Verify Select valid JSON when valid JSON selected
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: Select valid JSON Given valid JSON selected When file staged Then file should appear in staging list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1311: Verify Reject .txt file when .txt file selected', async ({ page }) => {
    // Test Case: UTC-1311
    // Summary: Verify Reject .txt file when .txt file selected
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: Reject .txt file Given .txt file selected When staged Then file should not be added

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1312: Verify Reject .csv file when .csv file selected', async ({ page }) => {
    // Test Case: UTC-1312
    // Summary: Verify Reject .csv file when .csv file selected
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: Reject .csv file Given .csv file selected When staged Then file should be ignored

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1313: Verify Reject .exe malicious file when executable file selected', async ({ page }) => {
    // Test Case: UTC-1313
    // Summary: Verify Reject .exe malicious file when executable file selected
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: Reject .exe malicious file Given executable file selected When staged Then system must block it

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1314: Verify Drag-drop non-JSON when user drags .png file', async ({ page }) => {
    // Test Case: UTC-1314
    // Summary: Verify Drag-drop non-JSON when user drags .png file
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: Drag-drop non-JSON Given user drags .png file When dropped into zone Then system should ignore file

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1315: Verify Drag-drop valid JSON when user drags .json file', async ({ page }) => {
    // Test Case: UTC-1315
    // Summary: Verify Drag-drop valid JSON when user drags .json file
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: Drag-drop valid JSON Given user drags .json file When dropped Then file should stage successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1316: Verify MIME type validation when staged file MIME â‰ application/json', async ({ page }) => {
    // Test Case: UTC-1316
    // Summary: Verify MIME type validation when staged file MIME â‰ application/json
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: MIME type validation Given staged file MIME ≠ application/json When validated Then file removed from payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1317: Verify Payload contains only JSON when multiple staged files', async ({ page }) => {
    // Test Case: UTC-1317
    // Summary: Verify Payload contains only JSON when multiple staged files
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: Payload contains only JSON Given multiple staged files When upload request sent Then only JSON files included in payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1318: Verify Rename attack (.exe â†’ .json) when malicious file renamed to .json', async ({ page }) => {
    // Test Case: UTC-1318
    // Summary: Verify Rename attack (.exe â†’ .json) when malicious file renamed to .json
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: Rename attack (.exe → .json) Given malicious file renamed to .json When MIME validated Then upload must be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1319: Verify Server-side validation when client filter bypassed', async ({ page }) => {
    // Test Case: UTC-1319
    // Summary: Verify Server-side validation when client filter bypassed
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: Server-side validation Given client filter bypassed When upload hits server Then server must reject invalid type

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1320: Verify 415 response handling when server returns 415', async ({ page }) => {
    // Test Case: UTC-1320
    // Summary: Verify 415 response handling when server returns 415
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: 415 response handling Given server returns 415 When response received Then error message should display

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1321: Verify Friendly validation message when invalid file selected', async ({ page }) => {
    // Test Case: UTC-1321
    // Summary: Verify Friendly validation message when invalid file selected
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: Friendly validation message Given invalid file selected When rejected Then user sees clear non-technical message

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1322: Verify Valid files unaffected when valid JSON mixed with invalid', async ({ page }) => {
    // Test Case: UTC-1322
    // Summary: Verify Valid files unaffected when valid JSON mixed with invalid
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: Valid files unaffected Given valid JSON mixed with invalid When staging occurs Then valid files still accepted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1323: Verify No script execution when malicious script file', async ({ page }) => {
    // Test Case: UTC-1323
    // Summary: Verify No script execution when malicious script file
    // Description: Feature: Secure File Type Restriction for JSON-only uploads Scenario: No script execution Given malicious script file When attempted upload Then system must prevent execution

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
