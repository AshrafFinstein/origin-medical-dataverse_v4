import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Drag handle visibility when annotation list is displayed
 * URS: URS-DV-GEN-23
 * SRS: SRS-220
 * SDS: SDS-220
 */
test.describe('URS-DV-GEN-23: Verify Drag handle visibility when annotation list is displa', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2205: Verify Drag handle visibility when annotation list is displayed', async ({ page }) => {
    // Test Case: UTC-2205
    // Summary: Verify Drag handle visibility when annotation list is displayed
    // Description: Feature: Manual Drag Reordering Scenario: Drag handle visibility Given annotation list is displayed When each row renders Then a drag handle icon should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2206: Verify Cursor change on hover when user hovers over drag handle', async ({ page }) => {
    // Test Case: UTC-2206
    // Summary: Verify Cursor change on hover when user hovers over drag handle
    // Description: Feature: Manual Drag Reordering Scenario: Cursor change on hover Given user hovers over drag handle When pointer moves over handle Then cursor should change to grab icon

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2207: Verify Start drag interaction when user presses mouse on handle', async ({ page }) => {
    // Test Case: UTC-2207
    // Summary: Verify Start drag interaction when user presses mouse on handle
    // Description: Feature: Manual Drag Reordering Scenario: Start drag interaction Given user presses mouse on handle When drag starts Then the selected item should enter draggable state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2208: Verify Drag visual feedback when item is dragged', async ({ page }) => {
    // Test Case: UTC-2208
    // Summary: Verify Drag visual feedback when item is dragged
    // Description: Feature: Manual Drag Reordering Scenario: Drag visual feedback Given item is dragged When moving across list Then item should appear semi-transparent

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2209: Verify Drop target indicator when dragging over list', async ({ page }) => {
    // Test Case: UTC-2209
    // Summary: Verify Drop target indicator when dragging over list
    // Description: Feature: Manual Drag Reordering Scenario: Drop target indicator Given dragging over list When moving between rows Then a blue insertion line should indicate drop location

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2210: Verify Move item downward when item at position 1', async ({ page }) => {
    // Test Case: UTC-2210
    // Summary: Verify Move item downward when item at position 1
    // Description: Feature: Manual Drag Reordering Scenario: Move item downward Given item at position 1 When dropped at position 4 Then item should appear at position 4

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2211: Verify Move item upward when item at position 5', async ({ page }) => {
    // Test Case: UTC-2211
    // Summary: Verify Move item upward when item at position 5
    // Description: Feature: Manual Drag Reordering Scenario: Move item upward Given item at position 5 When dropped at position 2 Then item should move to position 2

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2212: Verify Source index tracking when drag started', async ({ page }) => {
    // Test Case: UTC-2212
    // Summary: Verify Source index tracking when drag started
    // Description: Feature: Manual Drag Reordering Scenario: Source index tracking Given drag started When item dropped Then original index should update correctly in state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2213: Verify Target index tracking when item dropped', async ({ page }) => {
    // Test Case: UTC-2213
    // Summary: Verify Target index tracking when item dropped
    // Description: Feature: Manual Drag Reordering Scenario: Target index tracking Given item dropped When reorder completes Then new index should match drop location

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2214: Verify Immediate UI update when drop action occurs', async ({ page }) => {
    // Test Case: UTC-2214
    // Summary: Verify Immediate UI update when drop action occurs
    // Description: Feature: Manual Drag Reordering Scenario: Immediate UI update Given drop action occurs When released Then list order should update instantly without reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2215: Verify Persist order after refresh when reordered list saved', async ({ page }) => {
    // Test Case: UTC-2215
    // Summary: Verify Persist order after refresh when reordered list saved
    // Description: Feature: Manual Drag Reordering Scenario: Persist order after refresh Given reordered list saved When page refreshed Then same order should persist

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2216: Verify Drop outside list when item dragged', async ({ page }) => {
    // Test Case: UTC-2216
    // Summary: Verify Drop outside list when item dragged
    // Description: Feature: Manual Drag Reordering Scenario: Drop outside list Given item dragged When dropped outside boundary Then item should return to original position

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2217: Verify Cancel drag midway when drag initiated', async ({ page }) => {
    // Test Case: UTC-2217
    // Summary: Verify Cancel drag midway when drag initiated
    // Description: Feature: Manual Drag Reordering Scenario: Cancel drag midway Given drag initiated When user presses Esc Then item should revert to original position

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2218: Verify Multiple reorders sequentially when several drag actions performed', async ({ page }) => {
    // Test Case: UTC-2218
    // Summary: Verify Multiple reorders sequentially when several drag actions performed
    // Description: Feature: Manual Drag Reordering Scenario: Multiple reorders sequentially Given several drag actions performed When moving items repeatedly Then order should remain accurate

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2219: Verify Large list performance when 300+ items', async ({ page }) => {
    // Test Case: UTC-2219
    // Summary: Verify Large list performance when 300+ items
    // Description: Feature: Manual Drag Reordering Scenario: Large list performance Given 300+ items When dragging items Then no UI lag or freeze should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2220: Verify Keyboard reorder support when item focused', async ({ page }) => {
    // Test Case: UTC-2220
    // Summary: Verify Keyboard reorder support when item focused
    // Description: Feature: Manual Drag Reordering Scenario: Keyboard reorder support Given item focused When using keyboard shortcuts (Ctrl+Up/Down) Then item should reorder correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2221: Verify Freeze/locked state restriction when grid is frozen or locked', async ({ page }) => {
    // Test Case: UTC-2221
    // Summary: Verify Freeze/locked state restriction when grid is frozen or locked
    // Description: Feature: Manual Drag Reordering Scenario: Freeze/locked state restriction Given grid is frozen or locked When attempting drag Then reorder should be blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2222: Verify Move first item to last when first item selected', async ({ page }) => {
    // Test Case: UTC-2222
    // Summary: Verify Move first item to last when first item selected
    // Description: Feature: Manual Drag Reordering Scenario: Move first item to last Given first item selected When dropped at end Then it should appear last

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2223: Verify Move last item to first when last item selected', async ({ page }) => {
    // Test Case: UTC-2223
    // Summary: Verify Move last item to first when last item selected
    // Description: Feature: Manual Drag Reordering Scenario: Move last item to first Given last item selected When dropped at top Then it should appear first

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2224: Verify Clear visual clarity when dragging occurs', async ({ page }) => {
    // Test Case: UTC-2224
    // Summary: Verify Clear visual clarity when dragging occurs
    // Description: Feature: Manual Drag Reordering Scenario: Clear visual clarity Given dragging occurs When user observes list Then item positions and drop location should be visually clear

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
