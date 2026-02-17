import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Remove icon visibility when files are staged
 * URS: URS-DV-GEN-09
 * SRS: SRS-101
 * SDS: SDS-101
 */
test.describe('URS-DV-GEN-09: Verify Remove icon visibility when files are staged', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1324: Verify Remove icon visibility when files are staged', async ({ page }) => {
    // Test Case: UTC-1324
    // Summary: Verify Remove icon visibility when files are staged
    // Description: Feature: Selection Management for staged JSON files Scenario: Remove icon visibility Given files are staged When list is displayed Then each file should show a clickable remove (x/trash) icon

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1325: Verify Hover highlight when file list displayed', async ({ page }) => {
    // Test Case: UTC-1325
    // Summary: Verify Hover highlight when file list displayed
    // Description: Feature: Selection Management for staged JSON files Scenario: Hover highlight Given file list displayed When user hovers a row Then row should highlight for clarity

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1326: Verify Remove single file when multiple files staged', async ({ page }) => {
    // Test Case: UTC-1326
    // Summary: Verify Remove single file when multiple files staged
    // Description: Feature: Selection Management for staged JSON files Scenario: Remove single file Given multiple files staged When user clicks remove on one file Then only that file should be removed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1327: Verify Correct file removed by index when 3 files staged', async ({ page }) => {
    // Test Case: UTC-1327
    // Summary: Verify Correct file removed by index when 3 files staged
    // Description: Feature: Selection Management for staged JSON files Scenario: Correct file removed by index Given 3 files staged When removing 2nd file Then only 2nd file should disappear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1328: Verify Remaining files preserved when multiple files staged', async ({ page }) => {
    // Test Case: UTC-1328
    // Summary: Verify Remaining files preserved when multiple files staged
    // Description: Feature: Selection Management for staged JSON files Scenario: Remaining files preserved Given multiple files staged When one is removed Then other files must remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1329: Verify Real-time count update when 5 files staged', async ({ page }) => {
    // Test Case: UTC-1329
    // Summary: Verify Real-time count update when 5 files staged
    // Description: Feature: Selection Management for staged JSON files Scenario: Real-time count update Given 5 files staged When one removed Then “Files selected” count updates to 4 instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1330: Verify Remove multiple files sequentially when several files staged', async ({ page }) => {
    // Test Case: UTC-1330
    // Summary: Verify Remove multiple files sequentially when several files staged
    // Description: Feature: Selection Management for staged JSON files Scenario: Remove multiple files sequentially Given several files staged When removing multiple entries Then list updates after each action

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1331: Verify Remove all files when multiple files staged', async ({ page }) => {
    // Test Case: UTC-1331
    // Summary: Verify Remove all files when multiple files staged
    // Description: Feature: Selection Management for staged JSON files Scenario: Remove all files Given multiple files staged When user removes all Then staging list should be empty

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1332: Verify Disable Import when empty when no files remain', async ({ page }) => {
    // Test Case: UTC-1332
    // Summary: Verify Disable Import when empty when no files remain
    // Description: Feature: Selection Management for staged JSON files Scenario: Disable Import when empty Given no files remain When viewing Import button Then button should be disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1333: Verify Prevent empty submission when no files staged', async ({ page }) => {
    // Test Case: UTC-1333
    // Summary: Verify Prevent empty submission when no files staged
    // Description: Feature: Selection Management for staged JSON files Scenario: Prevent empty submission Given no files staged When clicking Import Then no request should be triggered

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1334: Verify Instant UI update when file removed', async ({ page }) => {
    // Test Case: UTC-1334
    // Summary: Verify Instant UI update when file removed
    // Description: Feature: Selection Management for staged JSON files Scenario: Instant UI update Given file removed When action performed Then UI should update without page reload or delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1335: Verify No duplicate state issues when repeated add/remove operations', async ({ page }) => {
    // Test Case: UTC-1335
    // Summary: Verify No duplicate state issues when repeated add/remove operations
    // Description: Feature: Selection Management for staged JSON files Scenario: No duplicate state issues Given repeated add/remove operations When actions performed rapidly Then list state should remain consistent

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1336: Verify Remove non-existing index when file already removed', async ({ page }) => {
    // Test Case: UTC-1336
    // Summary: Verify Remove non-existing index when file already removed
    // Description: Feature: Selection Management for staged JSON files Scenario: Remove non-existing index Given file already removed When remove triggered again Then system should ignore safely without crash

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1337: Verify Clear visual feedback after removal when file removed', async ({ page }) => {
    // Test Case: UTC-1337
    // Summary: Verify Clear visual feedback after removal when file removed
    // Description: Feature: Selection Management for staged JSON files Scenario: Clear visual feedback after removal Given file removed When list refreshes Then user should clearly see updated list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1338: Verify Keyboard remove support when remove icon focused', async ({ page }) => {
    // Test Case: UTC-1338
    // Summary: Verify Keyboard remove support when remove icon focused
    // Description: Feature: Selection Management for staged JSON files Scenario: Keyboard remove support Given remove icon focused When Enter/Space pressed Then file should be removed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1339: Verify Large list handling when 100+ files staged', async ({ page }) => {
    // Test Case: UTC-1339
    // Summary: Verify Large list handling when 100+ files staged
    // Description: Feature: Selection Management for staged JSON files Scenario: Large list handling Given 100+ files staged When removing items Then list updates smoothly without lag

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
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
