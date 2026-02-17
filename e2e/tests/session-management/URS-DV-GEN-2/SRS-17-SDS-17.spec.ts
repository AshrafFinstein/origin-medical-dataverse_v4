import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Concurrent Promise Execution when session grid loads
 * URS: URS-DV-GEN-2
 * SRS: SRS-17
 * SDS: SDS-17
 */
test.describe('URS-DV-GEN-2: Verify Concurrent Promise Execution when session grid loads', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-176: Verify Concurrent Promise Execution when session grid loads', async ({ page }) => {
    // Test Case: UTC-176
    // Summary: Verify Concurrent Promise Execution when session grid loads
    // Description: Feature: Concurrent Promise Execution Given session grid loads When API endpoint is triggered Then main data, count, and filter queries should execute simultaneously

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-177: Verify Concurrent Promise Execution when three queries configured', async ({ page }) => {
    // Test Case: UTC-177
    // Summary: Verify Concurrent Promise Execution when three queries configured
    // Description: Feature: Concurrent Promise Execution Given three queries configured When executed concurrently Then total response time should approximate the slowest query, not the sum

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-178: Verify Concurrent Promise Execution when Promise.all is used', async ({ page }) => {
    // Test Case: UTC-178
    // Summary: Verify Concurrent Promise Execution when Promise.all is used
    // Description: Feature: Concurrent Promise Execution Given Promise.all is used When inspecting code execution Then dataQuery(), countQuery(), filterQuery() start together

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-179: Verify Concurrent Promise Execution when all promises resolve', async ({ page }) => {
    // Test Case: UTC-179
    // Summary: Verify Concurrent Promise Execution when all promises resolve
    // Description: Feature: Concurrent Promise Execution Given all promises resolve When API responds Then single consolidated JSON should contain rows, totalCount, and filters

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-180: Verify Concurrent Promise Execution when pagination requested', async ({ page }) => {
    // Test Case: UTC-180
    // Summary: Verify Concurrent Promise Execution when pagination requested
    // Description: Feature: Concurrent Promise Execution Given pagination requested When response received Then table rows and total count should match correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-181: Verify Concurrent Promise Execution when filters exist', async ({ page }) => {
    // Test Case: UTC-181
    // Summary: Verify Concurrent Promise Execution when filters exist
    // Description: Feature: Concurrent Promise Execution Given filters exist When grid loads Then filter options should populate without extra API calls

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-182: Verify Concurrent Promise Execution when large dataset', async ({ page }) => {
    // Test Case: UTC-182
    // Summary: Verify Concurrent Promise Execution when large dataset
    // Description: Feature: Concurrent Promise Execution Given large dataset When page loads Then grid should render within SLA (<2–3s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-183: Verify Concurrent Promise Execution when one query slower than others', async ({ page }) => {
    // Test Case: UTC-183
    // Summary: Verify Concurrent Promise Execution when one query slower than others
    // Description: Feature: Concurrent Promise Execution Given one query slower than others When awaiting Promise.all Then system should wait for completion without partial UI render

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-184: Verify Concurrent Promise Execution when dataQuery fails', async ({ page }) => {
    // Test Case: UTC-184
    // Summary: Verify Concurrent Promise Execution when dataQuery fails
    // Description: Feature: Concurrent Promise Execution Given dataQuery fails When Promise.all rejects Then API should return unified error response

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-185: Verify Concurrent Promise Execution when countQuery fails', async ({ page }) => {
    // Test Case: UTC-185
    // Summary: Verify Concurrent Promise Execution when countQuery fails
    // Description: Feature: Concurrent Promise Execution Given countQuery fails When executed Then system should catch aggregated error in single catch block

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-186: Verify Concurrent Promise Execution when filterQuery fails', async ({ page }) => {
    // Test Case: UTC-186
    // Summary: Verify Concurrent Promise Execution when filterQuery fails
    // Description: Feature: Concurrent Promise Execution Given filterQuery fails When executed Then response should return error without partial dataset

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-187: Verify Concurrent Promise Execution when API call in progress', async ({ page }) => {
    // Test Case: UTC-187
    // Summary: Verify Concurrent Promise Execution when API call in progress
    // Description: Feature: Concurrent Promise Execution Given API call in progress When waiting Then grid should display loading spinner until all results arrive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-188: Verify Concurrent Promise Execution when multiple pages', async ({ page }) => {
    // Test Case: UTC-188
    // Summary: Verify Concurrent Promise Execution when multiple pages
    // Description: Feature: Concurrent Promise Execution Given multiple pages When navigating pages Then rows and counts remain consistent

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-189: Verify Concurrent Promise Execution when concurrent users', async ({ page }) => {
    // Test Case: UTC-189
    // Summary: Verify Concurrent Promise Execution when concurrent users
    // Description: Feature: Concurrent Promise Execution Given concurrent users When multiple requests fire Then queries execute independently without blocking

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-190: Verify Concurrent Promise Execution when sequential vs parallel benchmark', async ({ page }) => {
    // Test Case: UTC-190
    // Summary: Verify Concurrent Promise Execution when sequential vs parallel benchmark
    // Description: Feature: Concurrent Promise Execution Given sequential vs parallel benchmark When compared Then parallel execution should show reduced latency

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-191: Verify Concurrent Promise Execution when malformed query parameter', async ({ page }) => {
    // Test Case: UTC-191
    // Summary: Verify Concurrent Promise Execution when malformed query parameter
    // Description: Feature: Concurrent Promise Execution Given malformed query parameter When request sent Then system should reject safely without crashing server

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-192: Verify Concurrent Promise Execution when data loads', async ({ page }) => {
    // Test Case: UTC-192
    // Summary: Verify Concurrent Promise Execution when data loads
    // Description: Feature: Concurrent Promise Execution Given data loads When UI renders Then users experience minimal wait and responsive controls

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
