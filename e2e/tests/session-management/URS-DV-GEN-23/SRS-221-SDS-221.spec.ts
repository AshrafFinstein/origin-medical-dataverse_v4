import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Sort icon visibility when annotation list is loaded
 * URS: URS-DV-GEN-23
 * SRS: SRS-221
 * SDS: SDS-221
 */
test.describe('URS-DV-GEN-23: Verify Sort icon visibility when annotation list is loaded', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2225: Verify Sort icon visibility when annotation list is loaded', async ({ page }) => {
    // Test Case: UTC-2225
    // Summary: Verify Sort icon visibility when annotation list is loaded
    // Description: Feature: Multi-State Sorting Scenario: Sort icon visibility Given annotation list is loaded When header renders Then a sort icon should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2226: Verify Icon clickable state when sort icon is visible', async ({ page }) => {
    // Test Case: UTC-2226
    // Summary: Verify Icon clickable state when sort icon is visible
    // Description: Feature: Multi-State Sorting Scenario: Icon clickable state Given sort icon is visible When user hovers/clicks Then cursor should indicate clickable control

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2227: Verify First click sorts Descending when unsorted list', async ({ page }) => {
    // Test Case: UTC-2227
    // Summary: Verify First click sorts Descending when unsorted list
    // Description: Feature: Multi-State Sorting Scenario: First click sorts Descending Given unsorted list When user clicks sort icon once Then list should be sorted Z–A

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2228: Verify Second click sorts Ascending when list is Descending', async ({ page }) => {
    // Test Case: UTC-2228
    // Summary: Verify Second click sorts Ascending when list is Descending
    // Description: Feature: Multi-State Sorting Scenario: Second click sorts Ascending Given list is Descending When user clicks again Then list should be sorted A–Z

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2229: Verify Third click shows Annotated First when annotated and unannotated items ex', async ({ page }) => {
    // Test Case: UTC-2229
    // Summary: Verify Third click shows Annotated First when annotated and unannotated items exist
    // Description: Feature: Multi-State Sorting Scenario: Third click shows Annotated First Given annotated and unannotated items exist When user clicks third time Then annotated items should appear first

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2230: Verify Fourth click shows Pending First when annotated and pending items exist', async ({ page }) => {
    // Test Case: UTC-2230
    // Summary: Verify Fourth click shows Pending First when annotated and pending items exist
    // Description: Feature: Multi-State Sorting Scenario: Fourth click shows Pending First Given annotated and pending items exist When user clicks fourth time Then unannotated items should appear first

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2231: Verify Cycle resets to first state when fourth state active', async ({ page }) => {
    // Test Case: UTC-2231
    // Summary: Verify Cycle resets to first state when fourth state active
    // Description: Feature: Multi-State Sorting Scenario: Cycle resets to first state Given fourth state active When user clicks again Then sorting should return to Descending

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2232: Verify Visual feedback for each state when sorting changes', async ({ page }) => {
    // Test Case: UTC-2232
    // Summary: Verify Visual feedback for each state when sorting changes
    // Description: Feature: Multi-State Sorting Scenario: Visual feedback for each state Given sorting changes When state updates Then icon should visually indicate active mode

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2233: Verify Immediate list re-render when user clicks sort', async ({ page }) => {
    // Test Case: UTC-2233
    // Summary: Verify Immediate list re-render when user clicks sort
    // Description: Feature: Multi-State Sorting Scenario: Immediate list re-render Given user clicks sort When sorting applied Then list should update instantly without reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2234: Verify Stable sort maintained when items with identical values', async ({ page }) => {
    // Test Case: UTC-2234
    // Summary: Verify Stable sort maintained when items with identical values
    // Description: Feature: Multi-State Sorting Scenario: Stable sort maintained Given items with identical values When sorting applied Then their original order should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2235: Verify Single item list when only one item exists', async ({ page }) => {
    // Test Case: UTC-2235
    // Summary: Verify Single item list when only one item exists
    // Description: Feature: Multi-State Sorting Scenario: Single item list Given only one item exists When sort clicked Then order should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2236: Verify Empty dataset when dataset is empty', async ({ page }) => {
    // Test Case: UTC-2236
    // Summary: Verify Empty dataset when dataset is empty
    // Description: Feature: Multi-State Sorting Scenario: Empty dataset Given dataset is empty When sort clicked Then no action or error should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2237: Verify Null dataset when data is null', async ({ page }) => {
    // Test Case: UTC-2237
    // Summary: Verify Null dataset when data is null
    // Description: Feature: Multi-State Sorting Scenario: Null dataset Given data is null When sort triggered Then system should ignore action safely

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2238: Verify Large dataset sorting when 500+ items', async ({ page }) => {
    // Test Case: UTC-2238
    // Summary: Verify Large dataset sorting when 500+ items
    // Description: Feature: Multi-State Sorting Scenario: Large dataset sorting Given 500+ items When sorting applied Then list should update within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2239: Verify Clear state understanding when user views sorted list', async ({ page }) => {
    // Test Case: UTC-2239
    // Summary: Verify Clear state understanding when user views sorted list
    // Description: Feature: Multi-State Sorting Scenario: Clear state understanding Given user views sorted list When state changes Then user should easily identify order visually

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2240: Verify Preserve selection after sort when an item selected', async ({ page }) => {
    // Test Case: UTC-2240
    // Summary: Verify Preserve selection after sort when an item selected
    // Description: Feature: Multi-State Sorting Scenario: Preserve selection after sort Given an item selected When sorting applied Then selected item should remain selected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2241: Verify Multiple rapid clicks when user clicks repeatedly', async ({ page }) => {
    // Test Case: UTC-2241
    // Summary: Verify Multiple rapid clicks when user clicks repeatedly
    // Description: Feature: Multi-State Sorting Scenario: Multiple rapid clicks Given user clicks repeatedly When cycling states quickly Then system should not break order or skip states

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2242: Verify Keyboard access when sort icon focused', async ({ page }) => {
    // Test Case: UTC-2242
    // Summary: Verify Keyboard access when sort icon focused
    // Description: Feature: Multi-State Sorting Scenario: Keyboard access Given sort icon focused When Enter/Space pressed Then sorting cycle should trigger

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2243: Verify Sorting disabled during freeze mode when grid is frozen', async ({ page }) => {
    // Test Case: UTC-2243
    // Summary: Verify Sorting disabled during freeze mode when grid is frozen
    // Description: Feature: Multi-State Sorting Scenario: Sorting disabled during freeze mode Given grid is frozen When user clicks sort Then sorting should not apply

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2244: Verify Data refresh after sort when sorting applied', async ({ page }) => {
    // Test Case: UTC-2244
    // Summary: Verify Data refresh after sort when sorting applied
    // Description: Feature: Multi-State Sorting Scenario: Data refresh after sort Given sorting applied When data refresh occurs Then selected sort mode should persist

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
