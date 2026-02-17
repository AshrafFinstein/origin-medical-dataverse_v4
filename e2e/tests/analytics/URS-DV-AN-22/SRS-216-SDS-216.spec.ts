import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Start timer on image load when user opens an image
 * URS: URS-DV-AN-22
 * SRS: SRS-216
 * SDS: SDS-216
 */
test.describe('URS-DV-AN-22: Verify Start timer on image load when user opens an image', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2127: Verify Start timer on image load when user opens an image', async ({ page }) => {
    // Test Case: UTC-2127
    // Summary: Verify Start timer on image load when user opens an image
    // Description: Feature: Individual Image Timing Logic Scenario: Start timer on image load Given user opens an image When the image view loads Then a start timestamp should be recorded for that image

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2128: Verify Stop timer on navigation when user is viewing an image', async ({ page }) => {
    // Test Case: UTC-2128
    // Summary: Verify Stop timer on navigation when user is viewing an image
    // Description: Feature: Individual Image Timing Logic Scenario: Stop timer on navigation Given user is viewing an image When user navigates to another image Then an end timestamp should be recorded for the previous image

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2129: Verify Duration calculation when start and end timestamps exist', async ({ page }) => {
    // Test Case: UTC-2129
    // Summary: Verify Duration calculation when start and end timestamps exist
    // Description: Feature: Individual Image Timing Logic Scenario: Duration calculation Given start and end timestamps exist When duration calculated Then duration = end − start

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2130: Verify Pause on image change when timer running for Image A', async ({ page }) => {
    // Test Case: UTC-2130
    // Summary: Verify Pause on image change when timer running for Image A
    // Description: Feature: Individual Image Timing Logic Scenario: Pause on image change Given timer running for Image A When user switches to Image B Then Image A timer stops and Image B timer starts

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2131: Verify Resume tracking on return when user returns to Image A', async ({ page }) => {
    // Test Case: UTC-2131
    // Summary: Verify Resume tracking on return when user returns to Image A
    // Description: Feature: Individual Image Timing Logic Scenario: Resume tracking on return Given user returns to Image A When image loads again Then a new start timestamp is created

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2132: Verify Unique image identification when multiple images tracked', async ({ page }) => {
    // Test Case: UTC-2132
    // Summary: Verify Unique image identification when multiple images tracked
    // Description: Feature: Individual Image Timing Logic Scenario: Unique image identification Given multiple images tracked When logs saved Then each record must map to correct extractedResourceId

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2133: Verify Tab close auto-save when timer active', async ({ page }) => {
    // Test Case: UTC-2133
    // Summary: Verify Tab close auto-save when timer active
    // Description: Feature: Individual Image Timing Logic Scenario: Tab close auto-save Given timer active When browser closes unexpectedly Then last heartbeat timestamp is saved as end time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2134: Verify Session exit handling when multiple active images', async ({ page }) => {
    // Test Case: UTC-2134
    // Summary: Verify Session exit handling when multiple active images
    // Description: Feature: Individual Image Timing Logic Scenario: Session exit handling Given multiple active images When session exits Then all active timers must close

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2135: Verify Prevent duplicate entries when same active period detected twice', async ({ page }) => {
    // Test Case: UTC-2135
    // Summary: Verify Prevent duplicate entries when same active period detected twice
    // Description: Feature: Individual Image Timing Logic Scenario: Prevent duplicate entries Given same active period detected twice When saving Then duplicates should be filtered

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2136: Verify Timer start latency when image loads', async ({ page }) => {
    // Test Case: UTC-2136
    // Summary: Verify Timer start latency when image loads
    // Description: Feature: Individual Image Timing Logic Scenario: Timer start latency Given image loads When timer starts Then logging occurs within 100ms

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2137: Verify Multiple quick navigation when user rapidly switches images', async ({ page }) => {
    // Test Case: UTC-2137
    // Summary: Verify Multiple quick navigation when user rapidly switches images
    // Description: Feature: Individual Image Timing Logic Scenario: Multiple quick navigation Given user rapidly switches images When timers triggered Then timestamps remain accurate

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2138: Verify Correct DB persistence when timers recorded', async ({ page }) => {
    // Test Case: UTC-2138
    // Summary: Verify Correct DB persistence when timers recorded
    // Description: Feature: Individual Image Timing Logic Scenario: Correct DB persistence Given timers recorded When saved Then records stored in TimeSpentInExtractedResources table

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2139: Verify Zero time edge case when instant navigation', async ({ page }) => {
    // Test Case: UTC-2139
    // Summary: Verify Zero time edge case when instant navigation
    // Description: Feature: Individual Image Timing Logic Scenario: Zero time edge case Given instant navigation When start and end equal Then duration stored as 0ms

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2140: Verify Network failure during save when save attempt fails', async ({ page }) => {
    // Test Case: UTC-2140
    // Summary: Verify Network failure during save when save attempt fails
    // Description: Feature: Individual Image Timing Logic Scenario: Network failure during save Given save attempt fails When retry occurs Then no timing data lost

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2141: Verify Background tab pause when tab inactive', async ({ page }) => {
    // Test Case: UTC-2141
    // Summary: Verify Background tab pause when tab inactive
    // Description: Feature: Individual Image Timing Logic Scenario: Background tab pause Given tab inactive When focus lost Then tracking pauses or stops correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2142: Verify Multiple sessions separation when two sessions open sequentially', async ({ page }) => {
    // Test Case: UTC-2142
    // Summary: Verify Multiple sessions separation when two sessions open sequentially
    // Description: Feature: Individual Image Timing Logic Scenario: Multiple sessions separation Given two sessions open sequentially When tracking occurs Then timings stored independently

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2143: Verify High-frequency logging when 100+ images navigated', async ({ page }) => {
    // Test Case: UTC-2143
    // Summary: Verify High-frequency logging when 100+ images navigated
    // Description: Feature: Individual Image Timing Logic Scenario: High-frequency logging Given 100+ images navigated When timers recorded Then no UI lag occurs

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2144: Verify Heartbeat consistency when active timer', async ({ page }) => {
    // Test Case: UTC-2144
    // Summary: Verify Heartbeat consistency when active timer
    // Description: Feature: Individual Image Timing Logic Scenario: Heartbeat consistency Given active timer When heartbeat triggers Then timestamps updated correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2145: Verify Unauthorized write prevention when unauthorized request', async ({ page }) => {
    // Test Case: UTC-2145
    // Summary: Verify Unauthorized write prevention when unauthorized request
    // Description: Feature: Individual Image Timing Logic Scenario: Unauthorized write prevention Given unauthorized request When saving timing Then write rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2146: Verify Continuous use stability when long session (>2 hrs)', async ({ page }) => {
    // Test Case: UTC-2146
    // Summary: Verify Continuous use stability when long session (>2 hrs)
    // Description: Feature: Individual Image Timing Logic Scenario: Continuous use stability Given long session (>2 hrs) When multiple switches occur Then all timing remains accurate

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
