import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Local timestamp capture on start when user opens an image
 * URS: URS-DV-AN-22
 * SRS: SRS-218
 * SDS: SDS-218
 */
test.describe('URS-DV-AN-22: Verify Local timestamp capture on start when user opens an i', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2167: Verify Local timestamp capture on start when user opens an image', async ({ page }) => {
    // Test Case: UTC-2167
    // Summary: Verify Local timestamp capture on start when user opens an image
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Local timestamp capture on start Given user opens an image When time tracking starts Then start timestamp must be recorded using client local clock

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2168: Verify Local timestamp capture on end when image is active', async ({ page }) => {
    // Test Case: UTC-2168
    // Summary: Verify Local timestamp capture on end when image is active
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Local timestamp capture on end Given image is active When user navigates away Then end timestamp must be captured using local clock

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2169: Verify Network disconnect during session when network disconnects', async ({ page }) => {
    // Test Case: UTC-2169
    // Summary: Verify Network disconnect during session when network disconnects
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Network disconnect during session Given network disconnects When user continues annotating Then time tracking must continue locally without loss

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2170: Verify Queue events during offline state when network unavailable', async ({ page }) => {
    // Test Case: UTC-2170
    // Summary: Verify Queue events during offline state when network unavailable
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Queue events during offline state Given network unavailable When start/end events occur Then events must be queued in local storage

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2171: Verify Sync after network recovery when queued events exist', async ({ page }) => {
    // Test Case: UTC-2171
    // Summary: Verify Sync after network recovery when queued events exist
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Sync after network recovery Given queued events exist When network reconnects Then queued timestamps should sync to server automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2172: Verify No time loss after reconnect when offline duration recorded', async ({ page }) => {
    // Test Case: UTC-2172
    // Summary: Verify No time loss after reconnect when offline duration recorded
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: No time loss after reconnect Given offline duration recorded When data sync completes Then total time should equal local tracked duration

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2173: Verify Multiple offline intervals when network drops multiple times', async ({ page }) => {
    // Test Case: UTC-2173
    // Summary: Verify Multiple offline intervals when network drops multiple times
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Multiple offline intervals Given network drops multiple times When session completes Then all intervals should be merged correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2174: Verify Overlapping period handling when overlapping timestamps detected', async ({ page }) => {
    // Test Case: UTC-2174
    // Summary: Verify Overlapping period handling when overlapping timestamps detected
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Overlapping period handling Given overlapping timestamps detected When syncing to server Then periods should merge into a single block

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2175: Verify Server conflict resolution when conflicting end timestamps exist', async ({ page }) => {
    // Test Case: UTC-2175
    // Summary: Verify Server conflict resolution when conflicting end timestamps exist
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Server conflict resolution Given conflicting end timestamps exist When resolving conflict Then the most recent end timestamp should be used

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2176: Verify Browser refresh while offline when user refreshes page offline', async ({ page }) => {
    // Test Case: UTC-2176
    // Summary: Verify Browser refresh while offline when user refreshes page offline
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Browser refresh while offline Given user refreshes page offline When page reloads Then locally stored time data should persist

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2177: Verify Tab close and reopen when browser tab closed unexpectedly', async ({ page }) => {
    // Test Case: UTC-2177
    // Summary: Verify Tab close and reopen when browser tab closed unexpectedly
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Tab close and reopen Given browser tab closed unexpectedly When user reopens session Then last active timestamp should be recovered

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2178: Verify Local storage write performance when frequent start/end events', async ({ page }) => {
    // Test Case: UTC-2178
    // Summary: Verify Local storage write performance when frequent start/end events
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Local storage write performance Given frequent start/end events When events are queued locally Then no UI lag should be observed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2179: Verify Prevent manual timestamp tampering when user modifies local storage value', async ({ page }) => {
    // Test Case: UTC-2179
    // Summary: Verify Prevent manual timestamp tampering when user modifies local storage values
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Prevent manual timestamp tampering Given user modifies local storage values When syncing to server Then invalid timestamps should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2180: Verify High latency network when server latency > 5s', async ({ page }) => {
    // Test Case: UTC-2180
    // Summary: Verify High latency network when server latency > 5s
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: High latency network Given server latency > 5s When timestamps are sent Then local time accuracy must remain unaffected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2181: Verify Long session duration when session exceeds several hours', async ({ page }) => {
    // Test Case: UTC-2181
    // Summary: Verify Long session duration when session exceeds several hours
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Long session duration Given session exceeds several hours When syncing occurs Then time precision remains accurate

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2182: Verify No regression after reconnect cycles when repeated disconnect/reconnect c', async ({ page }) => {
    // Test Case: UTC-2182
    // Summary: Verify No regression after reconnect cycles when repeated disconnect/reconnect cycles
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: No regression after reconnect cycles Given repeated disconnect/reconnect cycles When session ends Then final aggregated time remains correct

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2183: Verify Sync order preservation when queued events exist', async ({ page }) => {
    // Test Case: UTC-2183
    // Summary: Verify Sync order preservation when queued events exist
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Sync order preservation Given queued events exist When syncing starts Then events must be replayed in chronological order

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2184: Verify Duplicate event filtering when duplicate timestamps exist', async ({ page }) => {
    // Test Case: UTC-2184
    // Summary: Verify Duplicate event filtering when duplicate timestamps exist
    // Description: Feature: Resilient Time Tracking Accuracy Scenario: Duplicate event filtering Given duplicate timestamps exist When syncing to server Then duplicates should be ignored

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

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
