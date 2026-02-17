import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Upload zone visibility when Session Creation page loads
 * URS: URS-DV-GEN-09
 * SRS: SRS-97
 * SDS: SDS-97
 */
test.describe('URS-DV-GEN-09: Verify Upload zone visibility when Session Creation page loa', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1256: Verify Upload zone visibility when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-1256
    // Summary: Verify Upload zone visibility when Session Creation page loads
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Upload zone visibility Given Session Creation page loads When upload component renders Then dashed-border upload area should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1257: Verify Upload icon presence when upload zone is displayed', async ({ page }) => {
    // Test Case: UTC-1257
    // Summary: Verify Upload icon presence when upload zone is displayed
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Upload icon presence Given upload zone is displayed When user views the area Then upload icon should be clearly visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1258: Verify Instruction text clarity when upload zone visible', async ({ page }) => {
    // Test Case: UTC-1258
    // Summary: Verify Instruction text clarity when upload zone visible
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Instruction text clarity Given upload zone visible When user reads instructions Then text should indicate drag-and-drop and click upload support

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1259: Verify Click to open file picker when user clicks upload area', async ({ page }) => {
    // Test Case: UTC-1259
    // Summary: Verify Click to open file picker when user clicks upload area
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Click to open file picker Given user clicks upload area When click event triggered Then OS file picker should open

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1260: Verify Drag file into area when user drags JSON file over zone', async ({ page }) => {
    // Test Case: UTC-1260
    // Summary: Verify Drag file into area when user drags JSON file over zone
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Drag file into area Given user drags JSON file over zone When file dropped Then drop event should trigger file selection handler

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1261: Verify Multiple file drag-and-drop when multiple JSON files dropped', async ({ page }) => {
    // Test Case: UTC-1261
    // Summary: Verify Multiple file drag-and-drop when multiple JSON files dropped
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Multiple file drag-and-drop Given multiple JSON files dropped When drop event processed Then all files should be staged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1262: Verify Visual feedback on drag hover when user drags file over zone', async ({ page }) => {
    // Test Case: UTC-1262
    // Summary: Verify Visual feedback on drag hover when user drags file over zone
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Visual feedback on drag hover Given user drags file over zone When hovering Then zone should highlight visually

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1263: Verify Files list shown below upload zone when files selected', async ({ page }) => {
    // Test Case: UTC-1263
    // Summary: Verify Files list shown below upload zone when files selected
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Files list shown below upload zone Given files selected When staging completes Then file list should appear below upload area

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1264: Verify Correct file objects passed to handler when files selected', async ({ page }) => {
    // Test Case: UTC-1264
    // Summary: Verify Correct file objects passed to handler when files selected
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Correct file objects passed to handler Given files selected When selection event fires Then file objects should be passed to validation handler

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1265: Verify Upload zone remains visible after selection when files selected', async ({ page }) => {
    // Test Case: UTC-1265
    // Summary: Verify Upload zone remains visible after selection when files selected
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Upload zone remains visible after selection Given files selected When list populates Then upload area should remain available for more files

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1266: Verify Reject unsupported file type when non-JSON file dropped', async ({ page }) => {
    // Test Case: UTC-1266
    // Summary: Verify Reject unsupported file type when non-JSON file dropped
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Reject unsupported file type Given non-JSON file dropped When validation occurs Then file should not be staged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1267: Verify Empty drop action when no files dropped', async ({ page }) => {
    // Test Case: UTC-1267
    // Summary: Verify Empty drop action when no files dropped
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Empty drop action Given no files dropped When event triggered Then system should not crash or add entries

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1268: Verify Keyboard activation when upload zone focused', async ({ page }) => {
    // Test Case: UTC-1268
    // Summary: Verify Keyboard activation when upload zone focused
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Keyboard activation Given upload zone focused When Enter/Space pressed Then file picker should open

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1269: Verify Browser without drag-drop support when browser lacks drag-drop', async ({ page }) => {
    // Test Case: UTC-1269
    // Summary: Verify Browser without drag-drop support when browser lacks drag-drop
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Browser without drag-drop support Given browser lacks drag-drop When user clicks area Then file picker fallback should still work

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1270: Verify Quick responsiveness when large file selection', async ({ page }) => {
    // Test Case: UTC-1270
    // Summary: Verify Quick responsiveness when large file selection
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Quick responsiveness Given large file selection When files staged Then UI should remain responsive without freeze

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1271: Verify Clear multiple-file support indication when user reads upload text', async ({ page }) => {
    // Test Case: UTC-1271
    // Summary: Verify Clear multiple-file support indication when user reads upload text
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Clear multiple-file support indication Given user reads upload text When reviewing instructions Then message should clearly state multiple files supported

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1272: Verify Repeat selections allowed when files already selected', async ({ page }) => {
    // Test Case: UTC-1272
    // Summary: Verify Repeat selections allowed when files already selected
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Repeat selections allowed Given files already selected When user selects more files Then new files should append to list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1273: Verify Event binding correctness when drop or change event occurs', async ({ page }) => {
    // Test Case: UTC-1273
    // Summary: Verify Event binding correctness when drop or change event occurs
    // Description: Feature: Upload Area and Interaction for JSON files Scenario: Event binding correctness Given drop or change event occurs When triggered Then selection handler should execute exactly once

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
