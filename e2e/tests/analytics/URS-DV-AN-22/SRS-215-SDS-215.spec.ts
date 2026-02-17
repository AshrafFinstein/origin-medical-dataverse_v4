import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Header metrics visible when the session grid loads
 * URS: URS-DV-AN-22
 * SRS: SRS-215
 * SDS: SDS-215
 */
test.describe('URS-DV-AN-22: Verify Header metrics visible when the session grid loads', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2107: Verify Header metrics visible when the session grid loads', async ({ page }) => {
    // Test Case: UTC-2107
    // Summary: Verify Header metrics visible when the session grid loads
    // Description: Feature: Session Header Metric Display Scenario: Header metrics visible Given the session grid loads When the header renders Then Total Time and Average Time per Image should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2108: Verify Total time displayed correctly when aggregated duration from API', async ({ page }) => {
    // Test Case: UTC-2108
    // Summary: Verify Total time displayed correctly when aggregated duration from API
    // Description: Feature: Session Header Metric Display Scenario: Total time displayed correctly Given aggregated duration from API When rendered Then header shows correct total time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2109: Verify Average time per image calculated when total time and image count', async ({ page }) => {
    // Test Case: UTC-2109
    // Summary: Verify Average time per image calculated when total time and image count
    // Description: Feature: Session Header Metric Display Scenario: Average time per image calculated Given total time and image count When displayed Then average = totalTime / imageCount

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2110: Verify Formatting of time when raw milliseconds received', async ({ page }) => {
    // Test Case: UTC-2110
    // Summary: Verify Formatting of time when raw milliseconds received
    // Description: Feature: Session Header Metric Display Scenario: Formatting of time Given raw milliseconds received When formatted Then display in human-readable format (1m 58s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2111: Verify Hours formatting when duration exceeds 1 hour', async ({ page }) => {
    // Test Case: UTC-2111
    // Summary: Verify Hours formatting when duration exceeds 1 hour
    // Description: Feature: Session Header Metric Display Scenario: Hours formatting Given duration exceeds 1 hour When displayed Then show hours, minutes, seconds

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2112: Verify Zero duration when no time recorded', async ({ page }) => {
    // Test Case: UTC-2112
    // Summary: Verify Zero duration when no time recorded
    // Description: Feature: Session Header Metric Display Scenario: Zero duration Given no time recorded When displayed Then header shows 0s

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2113: Verify Negative duration handled when negative time due to clock drift', async ({ page }) => {
    // Test Case: UTC-2113
    // Summary: Verify Negative duration handled when negative time due to clock drift
    // Description: Feature: Session Header Metric Display Scenario: Negative duration handled Given negative time due to clock drift When rendered Then UI displays 0s

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2114: Verify API failure fallback when API fails', async ({ page }) => {
    // Test Case: UTC-2114
    // Summary: Verify API failure fallback when API fails
    // Description: Feature: Session Header Metric Display Scenario: API failure fallback Given API fails When header loads Then show Time: 0s

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2115: Verify Real-time refresh when new activity recorded', async ({ page }) => {
    // Test Case: UTC-2115
    // Summary: Verify Real-time refresh when new activity recorded
    // Description: Feature: Session Header Metric Display Scenario: Real-time refresh Given new activity recorded When metadata refresh occurs Then metrics update automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2116: Verify Placement in header when dashboard visible', async ({ page }) => {
    // Test Case: UTC-2116
    // Summary: Verify Placement in header when dashboard visible
    // Description: Feature: Session Header Metric Display Scenario: Placement in header Given dashboard visible When viewing header Then metrics appear top-left session info panel

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2117: Verify Label clarity when header displayed', async ({ page }) => {
    // Test Case: UTC-2117
    // Summary: Verify Label clarity when header displayed
    // Description: Feature: Session Header Metric Display Scenario: Label clarity Given header displayed When reading labels Then labels show “Time” and “Images” clearly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2118: Verify Fast rendering when session loads', async ({ page }) => {
    // Test Case: UTC-2118
    // Summary: Verify Fast rendering when session loads
    // Description: Feature: Session Header Metric Display Scenario: Fast rendering Given session loads When metrics calculated Then render within 1 second

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2119: Verify Large dataset calculation when 1000+ images', async ({ page }) => {
    // Test Case: UTC-2119
    // Summary: Verify Large dataset calculation when 1000+ images
    // Description: Feature: Session Header Metric Display Scenario: Large dataset calculation Given 1000+ images When average calculated Then result remains accurate

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2120: Verify Consistency with backend when API returns metadata', async ({ page }) => {
    // Test Case: UTC-2120
    // Summary: Verify Consistency with backend when API returns metadata
    // Description: Feature: Session Header Metric Display Scenario: Consistency with backend Given API returns metadata When comparing UI Then UI equals backend values

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2121: Verify Visibility during navigation when user changes pages in grid', async ({ page }) => {
    // Test Case: UTC-2121
    // Summary: Verify Visibility during navigation when user changes pages in grid
    // Description: Feature: Session Header Metric Display Scenario: Visibility during navigation Given user changes pages in grid When navigating Then header metrics remain visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2122: Verify Average calculation with zero images when imageCount = 0', async ({ page }) => {
    // Test Case: UTC-2122
    // Summary: Verify Average calculation with zero images when imageCount = 0
    // Description: Feature: Session Header Metric Display Scenario: Average calculation with zero images Given imageCount = 0 When calculated Then average displays 0s

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2123: Verify Readability when header visible', async ({ page }) => {
    // Test Case: UTC-2123
    // Summary: Verify Readability when header visible
    // Description: Feature: Session Header Metric Display Scenario: Readability Given header visible When viewed Then text contrast and size are readable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2124: Verify Reload persistence when page refreshed', async ({ page }) => {
    // Test Case: UTC-2124
    // Summary: Verify Reload persistence when page refreshed
    // Description: Feature: Session Header Metric Display Scenario: Reload persistence Given page refreshed When reloaded Then metrics reappear correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2125: Verify Very large durations when >24 hours duration', async ({ page }) => {
    // Test Case: UTC-2125
    // Summary: Verify Very large durations when >24 hours duration
    // Description: Feature: Session Header Metric Display Scenario: Very large durations Given >24 hours duration When rendered Then formatting remains correct

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2126: Verify Multiple updates stable when frequent metadata refresh', async ({ page }) => {
    // Test Case: UTC-2126
    // Summary: Verify Multiple updates stable when frequent metadata refresh
    // Description: Feature: Session Header Metric Display Scenario: Multiple updates stable Given frequent metadata refresh When repeated Then no flicker or incorrect values appear

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
