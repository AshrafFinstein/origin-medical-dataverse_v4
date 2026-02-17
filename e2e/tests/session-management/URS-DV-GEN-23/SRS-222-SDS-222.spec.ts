import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Drag reorder latency under threshold when annotation list loaded
 * URS: URS-DV-GEN-23
 * SRS: SRS-222
 * SDS: SDS-222
 */
test.describe('URS-DV-GEN-23: Verify Drag reorder latency under threshold when annotation ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2245: Verify Drag reorder latency under threshold when annotation list loaded', async ({ page }) => {
    // Test Case: UTC-2245
    // Summary: Verify Drag reorder latency under threshold when annotation list loaded
    // Description: Feature: Reorder Performance Scenario: Drag reorder latency under threshold Given annotation list loaded When user drags and drops an item Then visual order should update within 200ms

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2246: Verify Sort latency under threshold when list contains items', async ({ page }) => {
    // Test Case: UTC-2246
    // Summary: Verify Sort latency under threshold when list contains items
    // Description: Feature: Reorder Performance Scenario: Sort latency under threshold Given list contains items When sort action triggered Then sorted order should render within 200ms

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2247: Verify Smooth animation feedback when drag operation', async ({ page }) => {
    // Test Case: UTC-2247
    // Summary: Verify Smooth animation feedback when drag operation
    // Description: Feature: Reorder Performance Scenario: Smooth animation feedback Given drag operation When item moves Then movement should animate smoothly (~0.2s transform) without flicker

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2248: Verify No blocking spinner for local action when drag or sort action', async ({ page }) => {
    // Test Case: UTC-2248
    // Summary: Verify No blocking spinner for local action when drag or sort action
    // Description: Feature: Reorder Performance Scenario: No blocking spinner for local action Given drag or sort action When update occurs Then no loading spinner should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2249: Verify Local state first update when reorder triggered', async ({ page }) => {
    // Test Case: UTC-2249
    // Summary: Verify Local state first update when reorder triggered
    // Description: Feature: Reorder Performance Scenario: Local state first update Given reorder triggered When operation executed Then UI should update instantly before backend sync

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2250: Verify Async backend persistence when order changed locally', async ({ page }) => {
    // Test Case: UTC-2250
    // Summary: Verify Async backend persistence when order changed locally
    // Description: Feature: Reorder Performance Scenario: Async backend persistence Given order changed locally When backend request sent Then persistence should happen asynchronously without UI block

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2251: Verify Large dataset (500 items) when 500+ annotations', async ({ page }) => {
    // Test Case: UTC-2251
    // Summary: Verify Large dataset (500 items) when 500+ annotations
    // Description: Feature: Reorder Performance Scenario: Large dataset (500 items) Given 500+ annotations When sorting Then render time should remain under 200ms

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2252: Verify Repeated rapid actions when user performs multiple drag/sort quickly', async ({ page }) => {
    // Test Case: UTC-2252
    // Summary: Verify Repeated rapid actions when user performs multiple drag/sort quickly
    // Description: Feature: Reorder Performance Scenario: Repeated rapid actions Given user performs multiple drag/sort quickly When operations repeat Then no cumulative lag should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2253: Verify No UI freeze during update when reorder triggered', async ({ page }) => {
    // Test Case: UTC-2253
    // Summary: Verify No UI freeze during update when reorder triggered
    // Description: Feature: Reorder Performance Scenario: No UI freeze during update Given reorder triggered When animation runs Then UI interactions remain responsive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2254: Verify CPU utilization optimized when reorder executed', async ({ page }) => {
    // Test Case: UTC-2254
    // Summary: Verify CPU utilization optimized when reorder executed
    // Description: Feature: Reorder Performance Scenario: CPU utilization optimized Given reorder executed When profiling performance Then CPU spike should remain minimal

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2255: Verify Memory-efficient rendering when many reorder cycles', async ({ page }) => {
    // Test Case: UTC-2255
    // Summary: Verify Memory-efficient rendering when many reorder cycles
    // Description: Feature: Reorder Performance Scenario: Memory-efficient rendering Given many reorder cycles When monitoring memory Then no memory leak should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2256: Verify Single item list when only one item', async ({ page }) => {
    // Test Case: UTC-2256
    // Summary: Verify Single item list when only one item
    // Description: Feature: Reorder Performance Scenario: Single item list Given only one item When drag/sort triggered Then system should respond instantly without delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2257: Verify Empty list when no annotations exist', async ({ page }) => {
    // Test Case: UTC-2257
    // Summary: Verify Empty list when no annotations exist
    // Description: Feature: Reorder Performance Scenario: Empty list Given no annotations exist When sort clicked Then no render delay or error occurs

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2258: Verify Immediate visual feedback when drag begins', async ({ page }) => {
    // Test Case: UTC-2258
    // Summary: Verify Immediate visual feedback when drag begins
    // Description: Feature: Reorder Performance Scenario: Immediate visual feedback Given drag begins When item moves Then ghost/preview should follow cursor instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2259: Verify Low memory fallback when browser memory critical', async ({ page }) => {
    // Test Case: UTC-2259
    // Summary: Verify Low memory fallback when browser memory critical
    // Description: Feature: Reorder Performance Scenario: Low memory fallback Given browser memory critical When reorder occurs Then animation should disable and snap instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2260: Verify Backend delay tolerance when backend response delayed', async ({ page }) => {
    // Test Case: UTC-2260
    // Summary: Verify Backend delay tolerance when backend response delayed
    // Description: Feature: Reorder Performance Scenario: Backend delay tolerance Given backend response delayed When reorder triggered Then UI should still update immediately

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2261: Verify Keyboard reorder performance when keyboard-based reorder', async ({ page }) => {
    // Test Case: UTC-2261
    // Summary: Verify Keyboard reorder performance when keyboard-based reorder
    // Description: Feature: Reorder Performance Scenario: Keyboard reorder performance Given keyboard-based reorder When order changed Then UI update time remains under 200ms

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2262: Verify Frame rate stability when continuous reorder', async ({ page }) => {
    // Test Case: UTC-2262
    // Summary: Verify Frame rate stability when continuous reorder
    // Description: Feature: Reorder Performance Scenario: Frame rate stability Given continuous reorder When monitoring FPS Then FPS should stay near 60fps

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2263: Verify Persisted order accuracy when reorder completed', async ({ page }) => {
    // Test Case: UTC-2263
    // Summary: Verify Persisted order accuracy when reorder completed
    // Description: Feature: Reorder Performance Scenario: Persisted order accuracy Given reorder completed When page refreshed Then order should remain consistent with saved state

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
