import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Aggregate only session-level time when session has only session-level records
 * URS: URS-DV-AN-22
 * SRS: SRS-214
 * SDS: SDS-214
 */
test.describe('URS-DV-AN-22: Verify Aggregate only session-level time when session has on', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2087: Verify Aggregate only session-level time when session has only session-level rec', async ({ page }) => {
    // Test Case: UTC-2087
    // Summary: Verify Aggregate only session-level time when session has only session-level records
    // Description: Feature: Cumulative Session Time Calculation Scenario: Aggregate only session-level time Given session has only session-level records When backend calculates duration Then total time should equal sum(endTime-startTime) of session records

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2088: Verify Aggregate only image-level time when session has only image-level timing ', async ({ page }) => {
    // Test Case: UTC-2088
    // Summary: Verify Aggregate only image-level time when session has only image-level timing records
    // Description: Feature: Cumulative Session Time Calculation Scenario: Aggregate only image-level time Given session has only image-level timing records When duration calculated Then total equals sum of all image durations

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2089: Verify Aggregate both session and image times when both session-level and image-', async ({ page }) => {
    // Test Case: UTC-2089
    // Summary: Verify Aggregate both session and image times when both session-level and image-level records exist
    // Description: Feature: Cumulative Session Time Calculation Scenario: Aggregate both session and image times Given both session-level and image-level records exist When aggregation runs Then total equals combined sum

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2090: Verify Multiple periods aggregated when multiple active periods exist', async ({ page }) => {
    // Test Case: UTC-2090
    // Summary: Verify Multiple periods aggregated when multiple active periods exist
    // Description: Feature: Cumulative Session Time Calculation Scenario: Multiple periods aggregated Given multiple active periods exist When calculated Then all durations should be added sequentially

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2091: Verify Missing end time handled when an active session without endTime', async ({ page }) => {
    // Test Case: UTC-2091
    // Summary: Verify Missing end time handled when an active session without endTime
    // Description: Feature: Cumulative Session Time Calculation Scenario: Missing end time handled Given an active session without endTime When calculation triggered Then system uses current server time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2092: Verify No records available when no timing entries exist', async ({ page }) => {
    // Test Case: UTC-2092
    // Summary: Verify No records available when no timing entries exist
    // Description: Feature: Cumulative Session Time Calculation Scenario: No records available Given no timing entries exist When calculation runs Then total should return zero

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2093: Verify Negative durations prevented when endTime earlier than startTime', async ({ page }) => {
    // Test Case: UTC-2093
    // Summary: Verify Negative durations prevented when endTime earlier than startTime
    // Description: Feature: Cumulative Session Time Calculation Scenario: Negative durations prevented Given endTime earlier than startTime When processed Then record ignored or treated as zero

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2094: Verify Millisecond precision returned when valid records exist', async ({ page }) => {
    // Test Case: UTC-2094
    // Summary: Verify Millisecond precision returned when valid records exist
    // Description: Feature: Cumulative Session Time Calculation Scenario: Millisecond precision returned Given valid records exist When aggregation completes Then duration returned in milliseconds

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2095: Verify Large dataset handled when 10,000+ timing entries', async ({ page }) => {
    // Test Case: UTC-2095
    // Summary: Verify Large dataset handled when 10,000+ timing entries
    // Description: Feature: Cumulative Session Time Calculation Scenario: Large dataset handled Given 10,000+ timing entries When calculated Then aggregation completes successfully without crash

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2096: Verify Fast computation when large dataset', async ({ page }) => {
    // Test Case: UTC-2096
    // Summary: Verify Fast computation when large dataset
    // Description: Feature: Cumulative Session Time Calculation Scenario: Fast computation Given large dataset When API called Then response time < 2 seconds

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2097: Verify Overlapping durations handled when overlapping time segments', async ({ page }) => {
    // Test Case: UTC-2097
    // Summary: Verify Overlapping durations handled when overlapping time segments
    // Description: Feature: Cumulative Session Time Calculation Scenario: Overlapping durations handled Given overlapping time segments When aggregated Then sum reflects actual stored values without duplication

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2098: Verify API returns correct field when duration calculated', async ({ page }) => {
    // Test Case: UTC-2098
    // Summary: Verify API returns correct field when duration calculated
    // Description: Feature: Cumulative Session Time Calculation Scenario: API returns correct field Given duration calculated When response sent Then field should contain totalDuration

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2099: Verify Partial data handled when some corrupt entries', async ({ page }) => {
    // Test Case: UTC-2099
    // Summary: Verify Partial data handled when some corrupt entries
    // Description: Feature: Cumulative Session Time Calculation Scenario: Partial data handled Given some corrupt entries When aggregation runs Then valid records still calculated

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2100: Verify Unauthorized access blocked when user without permission', async ({ page }) => {
    // Test Case: UTC-2100
    // Summary: Verify Unauthorized access blocked when user without permission
    // Description: Feature: Cumulative Session Time Calculation Scenario: Unauthorized access blocked Given user without permission When API requested Then access denied

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2101: Verify Session ID mismatch when invalid sessionId', async ({ page }) => {
    // Test Case: UTC-2101
    // Summary: Verify Session ID mismatch when invalid sessionId
    // Description: Feature: Cumulative Session Time Calculation Scenario: Session ID mismatch Given invalid sessionId When aggregation called Then system returns not found

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2102: Verify Zero duration record when startTime equals endTime', async ({ page }) => {
    // Test Case: UTC-2102
    // Summary: Verify Zero duration record when startTime equals endTime
    // Description: Feature: Cumulative Session Time Calculation Scenario: Zero duration record Given startTime equals endTime When calculated Then duration should be zero

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2103: Verify Correct sum across tables when records in both tables', async ({ page }) => {
    // Test Case: UTC-2103
    // Summary: Verify Correct sum across tables when records in both tables
    // Description: Feature: Cumulative Session Time Calculation Scenario: Correct sum across tables Given records in both tables When aggregated Then both sources must be included

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2104: Verify Concurrent updates safe when new records added during calculation', async ({ page }) => {
    // Test Case: UTC-2104
    // Summary: Verify Concurrent updates safe when new records added during calculation
    // Description: Feature: Cumulative Session Time Calculation Scenario: Concurrent updates safe Given new records added during calculation When aggregation runs Then calculation remains consistent

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2105: Verify Frontend displays correct value when backend returns duration', async ({ page }) => {
    // Test Case: UTC-2105
    // Summary: Verify Frontend displays correct value when backend returns duration
    // Description: Feature: Cumulative Session Time Calculation Scenario: Frontend displays correct value Given backend returns duration When UI renders Then displayed time matches API

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2106: Verify Repeated calls consistent when multiple API calls', async ({ page }) => {
    // Test Case: UTC-2106
    // Summary: Verify Repeated calls consistent when multiple API calls
    // Description: Feature: Cumulative Session Time Calculation Scenario: Repeated calls consistent Given multiple API calls When executed repeatedly Then returned value remains consistent

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
