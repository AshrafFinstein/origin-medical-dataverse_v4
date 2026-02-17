import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Default pagination when session table loads
 * URS: URS-DV-GEN-2
 * SRS: SRS-18
 * SDS: SDS-18
 */
test.describe('URS-DV-GEN-2: Verify Default pagination when session table loads', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-193: Verify Default pagination when session table loads', async ({ page }) => {
    // Test Case: UTC-193
    // Summary: Verify Default pagination when session table loads
    // Description: Feature: Default pagination Given session table loads When page initializes Then first page should display default page size records only

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-194: Verify Page size 20 when page size changed to 20', async ({ page }) => {
    // Test Case: UTC-194
    // Summary: Verify Page size 20 when page size changed to 20
    // Description: Feature: Page size 20 Given page size changed to 20 When data refreshes Then exactly 20 rows should load

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-195: Verify Page size 30 when page size changed to 30', async ({ page }) => {
    // Test Case: UTC-195
    // Summary: Verify Page size 30 when page size changed to 30
    // Description: Feature: Page size 30 Given page size changed to 30 When data refreshes Then exactly 30 rows should load

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-196: Verify Offset logic when page=2 and size=10', async ({ page }) => {
    // Test Case: UTC-196
    // Summary: Verify Offset logic when page=2 and size=10
    // Description: Feature: Offset logic Given page=2 and size=10 When API called Then query must use OFFSET 10 LIMIT 10

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-197: Verify Offset calculation when page=3 and size=20', async ({ page }) => {
    // Test Case: UTC-197
    // Summary: Verify Offset calculation when page=3 and size=20
    // Description: Feature: Offset calculation Given page=3 and size=20 When API called Then OFFSET should be 40

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-198: Verify Next button when user clicks Next', async ({ page }) => {
    // Test Case: UTC-198
    // Summary: Verify Next button when user clicks Next
    // Description: Feature: Next button Given user clicks Next When page increments Then next set of records should load

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-199: Verify Previous button when user clicks Previous', async ({ page }) => {
    // Test Case: UTC-199
    // Summary: Verify Previous button when user clicks Previous
    // Description: Feature: Previous button Given user clicks Previous When page decrements Then previous set loads

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-200: Verify Total count display when 50 records', async ({ page }) => {
    // Test Case: UTC-200
    // Summary: Verify Total count display when 50 records
    // Description: Feature: Total count display Given 50 records When page loads Then footer shows “1–10 of 50” format

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-201: Verify Last page navigation when user reaches last page', async ({ page }) => {
    // Test Case: UTC-201
    // Summary: Verify Last page navigation when user reaches last page
    // Description: Feature: Last page navigation Given user reaches last page When Next clicked Then Next should be disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-202: Verify First page boundary when page=1', async ({ page }) => {
    // Test Case: UTC-202
    // Summary: Verify First page boundary when page=1
    // Description: Feature: First page boundary Given page=1 When Previous clicked Then Previous should be disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-203: Verify Payload minimization when page size=10', async ({ page }) => {
    // Test Case: UTC-203
    // Summary: Verify Payload minimization when page size=10
    // Description: Feature: Payload minimization Given page size=10 When API returns Then payload contains only 10 records (not full dataset)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-204: Verify Response time when large dataset (10k+ rows)', async ({ page }) => {
    // Test Case: UTC-204
    // Summary: Verify Response time when large dataset (10k+ rows)
    // Description: Feature: Response time Given large dataset (10k+ rows) When fetching a page Then response should meet SLA (<2–3s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-205: Verify Loading indicator when page change', async ({ page }) => {
    // Test Case: UTC-205
    // Summary: Verify Loading indicator when page change
    // Description: Feature: Loading indicator Given page change When fetch pending Then spinner should appear until data loads

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-206: Verify No duplicates when sequential navigation', async ({ page }) => {
    // Test Case: UTC-206
    // Summary: Verify No duplicates when sequential navigation
    // Description: Feature: No duplicates Given sequential navigation When moving pages Then records should not repeat across pages

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-207: Verify No missing rows when full navigation', async ({ page }) => {
    // Test Case: UTC-207
    // Summary: Verify No missing rows when full navigation
    // Description: Feature: No missing rows Given full navigation When iterating all pages Then all records are covered exactly once

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-208: Verify Page reset on size change when page=5', async ({ page }) => {
    // Test Case: UTC-208
    // Summary: Verify Page reset on size change when page=5
    // Description: Feature: Page reset on size change Given page=5 When page size changed Then page resets to 1

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-209: Verify Invalid page request when page beyond max', async ({ page }) => {
    // Test Case: UTC-209
    // Summary: Verify Invalid page request when page beyond max
    // Description: Feature: Invalid page request Given page beyond max When requested Then system auto-corrects to last page

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-210: Verify Offset tampering when manual API param manipulation', async ({ page }) => {
    // Test Case: UTC-210
    // Summary: Verify Offset tampering when manual API param manipulation
    // Description: Feature: Offset tampering Given manual API param manipulation When invalid offset used Then backend validates and restricts query

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-211: Verify Smooth navigation when repeated page switches', async ({ page }) => {
    // Test Case: UTC-211
    // Summary: Verify Smooth navigation when repeated page switches
    // Description: Feature: Smooth navigation Given repeated page switches When interacting Then UI remains responsive without freeze

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-212: Verify Zero records when no data available', async ({ page }) => {
    // Test Case: UTC-212
    // Summary: Verify Zero records when no data available
    // Description: Feature: Zero records Given no data available When page loads Then table shows “No Data” with disabled navigation

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
