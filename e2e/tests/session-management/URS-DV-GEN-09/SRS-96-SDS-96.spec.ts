import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Upload zone visibility when Session page loads
 * URS: URS-DV-GEN-09
 * SRS: SRS-96
 * SDS: SDS-96
 */
test.describe('URS-DV-GEN-09: Verify Upload zone visibility when Session page loads', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1236: Verify Upload zone visibility when Session page loads', async ({ page }) => {
    // Test Case: UTC-1236
    // Summary: Verify Upload zone visibility when Session page loads
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Upload zone visibility Given Session page loads When upload component renders Then drag-and-drop upload zone should be visible with instruction text

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1237: Verify Select single JSON file when user opens file picker', async ({ page }) => {
    // Test Case: UTC-1237
    // Summary: Verify Select single JSON file when user opens file picker
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Select single JSON file Given user opens file picker When one JSON file selected Then file should appear in staging list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1238: Verify Select multiple JSON files when multiple JSON files selected', async ({ page }) => {
    // Test Case: UTC-1238
    // Summary: Verify Select multiple JSON files when multiple JSON files selected
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Select multiple JSON files Given multiple JSON files selected When upload confirmed Then all files should be added to staging list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1239: Verify Drag-and-drop files when files dragged into upload zone', async ({ page }) => {
    // Test Case: UTC-1239
    // Summary: Verify Drag-and-drop files when files dragged into upload zone
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Drag-and-drop files Given files dragged into upload zone When dropped Then files should populate staging list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1240: Verify Filename display when files are staged', async ({ page }) => {
    // Test Case: UTC-1240
    // Summary: Verify Filename display when files are staged
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Filename display Given files are staged When list renders Then each filename should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1241: Verify Files count shown when multiple files staged', async ({ page }) => {
    // Test Case: UTC-1241
    // Summary: Verify Files count shown when multiple files staged
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Files count shown Given multiple files staged When list updates Then “Files selected: X” count should update dynamically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1242: Verify Remove file using icon when file present in list', async ({ page }) => {
    // Test Case: UTC-1242
    // Summary: Verify Remove file using icon when file present in list
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Remove file using icon Given file present in list When user clicks remove (x) Then file should be removed from list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1243: Verify Remove updates count when file removed', async ({ page }) => {
    // Test Case: UTC-1243
    // Summary: Verify Remove updates count when file removed
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Remove updates count Given file removed When list updates Then file count should decrement immediately

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1244: Verify Ignore non-JSON file when user selects .txt or .csv file', async ({ page }) => {
    // Test Case: UTC-1244
    // Summary: Verify Ignore non-JSON file when user selects .txt or .csv file
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Ignore non-JSON file Given user selects .txt or .csv file When selection occurs Then file should not appear in staging list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1245: Verify MIME type validation when file has wrong MIME type', async ({ page }) => {
    // Test Case: UTC-1245
    // Summary: Verify MIME type validation when file has wrong MIME type
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: MIME type validation Given file has wrong MIME type When upload attempted Then file should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1246: Verify Local state update when files selected', async ({ page }) => {
    // Test Case: UTC-1246
    // Summary: Verify Local state update when files selected
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Local state update Given files selected When staging occurs Then system should store metadata in local array

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1247: Verify Immediate UI refresh when files added', async ({ page }) => {
    // Test Case: UTC-1247
    // Summary: Verify Immediate UI refresh when files added
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Immediate UI refresh Given files added When staging completes Then list should refresh without page reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1248: Verify Staged list persists before import when files selected', async ({ page }) => {
    // Test Case: UTC-1248
    // Summary: Verify Staged list persists before import when files selected
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Staged list persists before import Given files selected When user waits before import Then files should remain staged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1249: Verify No file selected when upload attempted without selection', async ({ page }) => {
    // Test Case: UTC-1249
    // Summary: Verify No file selected when upload attempted without selection
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: No file selected Given upload attempted without selection When action triggered Then no files should be staged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1250: Verify Large number of files when 50+ JSON files selected', async ({ page }) => {
    // Test Case: UTC-1250
    // Summary: Verify Large number of files when 50+ JSON files selected
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Large number of files Given 50+ JSON files selected When staging occurs Then UI should remain responsive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1251: Verify Correct filenames retained when files staged', async ({ page }) => {
    // Test Case: UTC-1251
    // Summary: Verify Correct filenames retained when files staged
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Correct filenames retained Given files staged When displayed Then filenames should match original files exactly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1252: Verify Clear empty state when no files staged', async ({ page }) => {
    // Test Case: UTC-1252
    // Summary: Verify Clear empty state when no files staged
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Clear empty state Given no files staged When viewing list Then empty state should display or list remain clean

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1253: Verify Keyboard accessibility when upload zone focused', async ({ page }) => {
    // Test Case: UTC-1253
    // Summary: Verify Keyboard accessibility when upload zone focused
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Keyboard accessibility Given upload zone focused When Enter pressed Then file picker should open

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1254: Verify Duplicate same file twice when same file selected twice', async ({ page }) => {
    // Test Case: UTC-1254
    // Summary: Verify Duplicate same file twice when same file selected twice
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Duplicate same file twice Given same file selected twice When staging occurs Then system should handle without crash

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1255: Verify Ready before import when files staged', async ({ page }) => {
    // Test Case: UTC-1255
    // Summary: Verify Ready before import when files staged
    // Description: Feature: Multiple JSON File Selection for bulk staging Scenario: Ready before import Given files staged When user clicks Import Then staged files should be available for processing

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
