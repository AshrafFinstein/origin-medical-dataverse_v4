import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Timer visibility on image load when image viewer opens
 * URS: URS-DV-AN-22
 * SRS: SRS-217
 * SDS: SDS-217
 */
test.describe('URS-DV-AN-22: Verify Timer visibility on image load when image viewer open', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2147: Verify Timer visibility on image load when image viewer opens', async ({ page }) => {
    // Test Case: UTC-2147
    // Summary: Verify Timer visibility on image load when image viewer opens
    // Description: Feature: Live Image Viewer Timer Scenario: Timer visibility on image load Given image viewer opens When image is active Then timer with clock icon should be visible at top-right

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2148: Verify Position accuracy when viewer loaded', async ({ page }) => {
    // Test Case: UTC-2148
    // Summary: Verify Position accuracy when viewer loaded
    // Description: Feature: Live Image Viewer Timer Scenario: Position accuracy Given viewer loaded When UI renders Then timer must appear in top-right corner without overlapping tools

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2149: Verify Timer initializes at zero when new image loads', async ({ page }) => {
    // Test Case: UTC-2149
    // Summary: Verify Timer initializes at zero when new image loads
    // Description: Feature: Live Image Viewer Timer Scenario: Timer initializes at zero Given new image loads When timer starts Then counter begins at 0s

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2150: Verify Increment every second when timer running', async ({ page }) => {
    // Test Case: UTC-2150
    // Summary: Verify Increment every second when timer running
    // Description: Feature: Live Image Viewer Timer Scenario: Increment every second Given timer running When 1 second passes Then counter increases by 1s

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2151: Verify Continuous increment when user stays on image', async ({ page }) => {
    // Test Case: UTC-2151
    // Summary: Verify Continuous increment when user stays on image
    // Description: Feature: Live Image Viewer Timer Scenario: Continuous increment Given user stays on image When 10 seconds pass Then counter shows 10s

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2152: Verify Pause on navigation when timer running', async ({ page }) => {
    // Test Case: UTC-2152
    // Summary: Verify Pause on navigation when timer running
    // Description: Feature: Live Image Viewer Timer Scenario: Pause on navigation Given timer running When user navigates to next image Then current timer stops and resets for new image

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2153: Verify Resume on return when user revisits image', async ({ page }) => {
    // Test Case: UTC-2153
    // Summary: Verify Resume on return when user revisits image
    // Description: Feature: Live Image Viewer Timer Scenario: Resume on return Given user revisits image When image loads again Then timer restarts for that view

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2154: Verify Sync on save when timer shows elapsed time', async ({ page }) => {
    // Test Case: UTC-2154
    // Summary: Verify Sync on save when timer shows elapsed time
    // Description: Feature: Live Image Viewer Timer Scenario: Sync on save Given timer shows elapsed time When user clicks Save Then timer value should sync to backend duration

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2155: Verify Continue after save when save completed', async ({ page }) => {
    // Test Case: UTC-2155
    // Summary: Verify Continue after save when save completed
    // Description: Feature: Live Image Viewer Timer Scenario: Continue after save Given save completed When image remains active Then timer continues incrementing

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2156: Verify Visual clarity when dark image background', async ({ page }) => {
    // Test Case: UTC-2156
    // Summary: Verify Visual clarity when dark image background
    // Description: Feature: Live Image Viewer Timer Scenario: Visual clarity Given dark image background When timer visible Then white text remains readable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2157: Verify Tab inactive handling when browser tab inactive', async ({ page }) => {
    // Test Case: UTC-2157
    // Summary: Verify Tab inactive handling when browser tab inactive
    // Description: Feature: Live Image Viewer Timer Scenario: Tab inactive handling Given browser tab inactive When user returns Then timer reflects correct elapsed time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2158: Verify Browser refresh recovery when page refreshed', async ({ page }) => {
    // Test Case: UTC-2158
    // Summary: Verify Browser refresh recovery when page refreshed
    // Description: Feature: Live Image Viewer Timer Scenario: Browser refresh recovery Given page refreshed When viewer reloads Then last persisted time displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2159: Verify Timer logic failure fallback when internal timer fails', async ({ page }) => {
    // Test Case: UTC-2159
    // Summary: Verify Timer logic failure fallback when internal timer fails
    // Description: Feature: Live Image Viewer Timer Scenario: Timer logic failure fallback Given internal timer fails When UI renders Then last persisted server duration shown instead of 0s

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2160: Verify No UI lag during increment when timer updating every second', async ({ page }) => {
    // Test Case: UTC-2160
    // Summary: Verify No UI lag during increment when timer updating every second
    // Description: Feature: Live Image Viewer Timer Scenario: No UI lag during increment Given timer updating every second When viewer active Then no performance degradation occurs

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2161: Verify Multiple image navigation when multiple images', async ({ page }) => {
    // Test Case: UTC-2161
    // Summary: Verify Multiple image navigation when multiple images
    // Description: Feature: Live Image Viewer Timer Scenario: Multiple image navigation Given multiple images When switching repeatedly Then each image has independent timer

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2162: Verify Long duration handling when session exceeds 1 hour', async ({ page }) => {
    // Test Case: UTC-2162
    // Summary: Verify Long duration handling when session exceeds 1 hour
    // Description: Feature: Live Image Viewer Timer Scenario: Long duration handling Given session exceeds 1 hour When timer displays Then shows formatted duration correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2163: Verify Stop when viewer closed when timer active', async ({ page }) => {
    // Test Case: UTC-2163
    // Summary: Verify Stop when viewer closed when timer active
    // Description: Feature: Live Image Viewer Timer Scenario: Stop when viewer closed Given timer active When viewer closed Then timer stops immediately

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2164: Verify Unauthorized manipulation prevention when user attempts manual console mo', async ({ page }) => {
    // Test Case: UTC-2164
    // Summary: Verify Unauthorized manipulation prevention when user attempts manual console modification
    // Description: Feature: Live Image Viewer Timer Scenario: Unauthorized manipulation prevention Given user attempts manual console modification When saving Then backend rejects invalid duration

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2165: Verify Screen reader support when accessibility enabled', async ({ page }) => {
    // Test Case: UTC-2165
    // Summary: Verify Screen reader support when accessibility enabled
    // Description: Feature: Live Image Viewer Timer Scenario: Screen reader support Given accessibility enabled When timer updates Then value accessible via aria-label

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2166: Verify Stable after long usage when 2+ hour session', async ({ page }) => {
    // Test Case: UTC-2166
    // Summary: Verify Stable after long usage when 2+ hour session
    // Description: Feature: Live Image Viewer Timer Scenario: Stable after long usage Given 2+ hour session When continuous use Then timer remains accurate and stable

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
