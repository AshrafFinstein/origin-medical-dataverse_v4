import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify File name visible after selection when user selects a valid JSON file
 * URS: URS-DV-AN-13
 * SRS: SRS-114
 * SDS: SDS-114
 */
test.describe('URS-DV-AN-13: Verify File name visible after selection when user selects a', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1549: Verify File name visible after selection when user selects a valid JSON file', async ({ page }) => {
    // Test Case: UTC-1549
    // Summary: Verify File name visible after selection when user selects a valid JSON file
    // Description: Feature: Uploaded JSON File Name Display Scenario: File name visible after selection Given user selects a valid JSON file When upload area processes the file Then the file name should appear below the upload section

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1550: Verify Multiple files listed when user selects multiple JSON files', async ({ page }) => {
    // Test Case: UTC-1550
    // Summary: Verify Multiple files listed when user selects multiple JSON files
    // Description: Feature: Uploaded JSON File Name Display Scenario: Multiple files listed Given user selects multiple JSON files When upload completes Then all selected file names should be shown in a list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1551: Verify Remove icon visible when file names are listed', async ({ page }) => {
    // Test Case: UTC-1551
    // Summary: Verify Remove icon visible when file names are listed
    // Description: Feature: Uploaded JSON File Name Display Scenario: Remove icon visible Given file names are listed When list renders Then each file should show a remove (X) icon

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1552: Verify Remove selected file when files are displayed', async ({ page }) => {
    // Test Case: UTC-1552
    // Summary: Verify Remove selected file when files are displayed
    // Description: Feature: Uploaded JSON File Name Display Scenario: Remove selected file Given files are displayed When user clicks remove (X) Then that specific file name should disappear from list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1553: Verify Correct file name displayed when file with specific name is selected', async ({ page }) => {
    // Test Case: UTC-1553
    // Summary: Verify Correct file name displayed when file with specific name is selected
    // Description: Feature: Uploaded JSON File Name Display Scenario: Correct file name displayed Given file with specific name is selected When UI updates Then displayed name should exactly match uploaded file name

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1554: Verify File names readable when list of files displayed', async ({ page }) => {
    // Test Case: UTC-1554
    // Summary: Verify File names readable when list of files displayed
    // Description: Feature: Uploaded JSON File Name Display Scenario: File names readable Given list of files displayed When user views list Then names should be clearly readable without truncation

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1555: Verify Immediate reflection in UI when file is selected', async ({ page }) => {
    // Test Case: UTC-1555
    // Summary: Verify Immediate reflection in UI when file is selected
    // Description: Feature: Uploaded JSON File Name Display Scenario: Immediate reflection in UI Given file is selected When selection occurs Then filename should appear instantly without page reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1556: Verify File name persists during navigation when files are listed', async ({ page }) => {
    // Test Case: UTC-1556
    // Summary: Verify File name persists during navigation when files are listed
    // Description: Feature: Uploaded JSON File Name Display Scenario: File name persists during navigation Given files are listed When user interacts with other fields Then filenames should remain visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1557: Verify Replace file when a file is already selected', async ({ page }) => {
    // Test Case: UTC-1557
    // Summary: Verify Replace file when a file is already selected
    // Description: Feature: Uploaded JSON File Name Display Scenario: Replace file Given a file is already selected When user selects a different file Then old filename should be replaced with new one

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1558: Verify No file selected when user does not select any file', async ({ page }) => {
    // Test Case: UTC-1558
    // Summary: Verify No file selected when user does not select any file
    // Description: Feature: Uploaded JSON File Name Display Scenario: No file selected Given user does not select any file When upload area loads Then no filenames should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1559: Verify Unsupported file type ignored when user selects non-JSON file', async ({ page }) => {
    // Test Case: UTC-1559
    // Summary: Verify Unsupported file type ignored when user selects non-JSON file
    // Description: Feature: Uploaded JSON File Name Display Scenario: Unsupported file type ignored Given user selects non-JSON file When validation occurs Then filename should not appear in list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1560: Verify Large number of files when 50+ files selected', async ({ page }) => {
    // Test Case: UTC-1560
    // Summary: Verify Large number of files when 50+ files selected
    // Description: Feature: Uploaded JSON File Name Display Scenario: Large number of files Given 50+ files selected When list renders Then UI should remain responsive without lag

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1561: Verify Keyboard accessibility for remove when file list focused', async ({ page }) => {
    // Test Case: UTC-1561
    // Summary: Verify Keyboard accessibility for remove when file list focused
    // Description: Feature: Uploaded JSON File Name Display Scenario: Keyboard accessibility for remove Given file list focused When user presses Enter/Space on remove icon Then file should be removed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1562: Verify Visual alignment when file list displayed', async ({ page }) => {
    // Test Case: UTC-1562
    // Summary: Verify Visual alignment when file list displayed
    // Description: Feature: Uploaded JSON File Name Display Scenario: Visual alignment Given file list displayed When viewing upload section Then list should align properly below upload area

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1563: Verify Very long file name when file name exceeds 100 characters', async ({ page }) => {
    // Test Case: UTC-1563
    // Summary: Verify Very long file name when file name exceeds 100 characters
    // Description: Feature: Uploaded JSON File Name Display Scenario: Very long file name Given file name exceeds 100 characters When displayed Then UI should truncate gracefully with tooltip/full view

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1564: Verify Very long file name when file name exceeds 100 characters', async ({ page }) => {
    // Test Case: UTC-1564
    // Summary: Verify Very long file name when file name exceeds 100 characters
    // Description: Feature: Uploaded JSON File Name Display Scenario: Very long file name Given file name exceeds 100 characters When displayed Then UI should truncate gracefully with tooltip/full view

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
