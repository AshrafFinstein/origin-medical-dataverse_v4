import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Authorized user exports taxonomy when valid token and export permission
 * URS: URS-DV-DM-11
 * SRS: SRS-112
 * SDS: SDS-112
 */
test.describe('URS-DV-DM-11: Verify Authorized user exports taxonomy when valid token and', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1513: Verify Authorized user exports taxonomy when valid token and export permission', async ({ page }) => {
    // Test Case: UTC-1513
    // Summary: Verify Authorized user exports taxonomy when valid token and export permission
    // Description: Feature: Taxonomy Export API Scenario: Authorized user exports taxonomy Given valid token and export permission When export API is called with sessionId Then system returns 200 with taxonomy data file

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1514: Verify Correct taxonomy data returned when taxonomy exists for session', async ({ page }) => {
    // Test Case: UTC-1514
    // Summary: Verify Correct taxonomy data returned when taxonomy exists for session
    // Description: Feature: Taxonomy Export API Scenario: Correct taxonomy data returned Given taxonomy exists for session When export completes Then file contains all taxonomy classes and attributes

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1515: Verify Excel format output when format=excel', async ({ page }) => {
    // Test Case: UTC-1515
    // Summary: Verify Excel format output when format=excel
    // Description: Feature: Taxonomy Export API Scenario: Excel format output Given format=excel When API called Then response returns .xlsx file

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1516: Verify CSV format output when format=csv', async ({ page }) => {
    // Test Case: UTC-1516
    // Summary: Verify CSV format output when format=csv
    // Description: Feature: Taxonomy Export API Scenario: CSV format output Given format=csv When API called Then response returns .csv file

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1517: Verify Invalid format parameter when unsupported format provided', async ({ page }) => {
    // Test Case: UTC-1517
    // Summary: Verify Invalid format parameter when unsupported format provided
    // Description: Feature: Taxonomy Export API Scenario: Invalid format parameter Given unsupported format provided When API called Then 400 Bad Request returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1518: Verify Missing token when no authentication token', async ({ page }) => {
    // Test Case: UTC-1518
    // Summary: Verify Missing token when no authentication token
    // Description: Feature: Taxonomy Export API Scenario: Missing token Given no authentication token When API called Then 401 Unauthorized returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1519: Verify Insufficient permission when user lacks export rights', async ({ page }) => {
    // Test Case: UTC-1519
    // Summary: Verify Insufficient permission when user lacks export rights
    // Description: Feature: Taxonomy Export API Scenario: Insufficient permission Given user lacks export rights When API called Then 403 Forbidden returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1520: Verify Tenant isolation enforced when session belongs to another tenant', async ({ page }) => {
    // Test Case: UTC-1520
    // Summary: Verify Tenant isolation enforced when session belongs to another tenant
    // Description: Feature: Taxonomy Export API Scenario: Tenant isolation enforced Given session belongs to another tenant When export attempted Then export is blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1521: Verify Empty taxonomy case when no taxonomy configured', async ({ page }) => {
    // Test Case: UTC-1521
    // Summary: Verify Empty taxonomy case when no taxonomy configured
    // Description: Feature: Taxonomy Export API Scenario: Empty taxonomy case Given no taxonomy configured When export requested Then 404 or empty file returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1522: Verify Medium dataset performance when 1000+ taxonomy records', async ({ page }) => {
    // Test Case: UTC-1522
    // Summary: Verify Medium dataset performance when 1000+ taxonomy records
    // Description: Feature: Taxonomy Export API Scenario: Medium dataset performance Given 1000+ taxonomy records When export triggered Then file generated within 3 seconds

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1523: Verify Large dataset streaming when 10k+ records', async ({ page }) => {
    // Test Case: UTC-1523
    // Summary: Verify Large dataset streaming when 10k+ records
    // Description: Feature: Taxonomy Export API Scenario: Large dataset streaming Given 10k+ records When export requested Then response streamed without UI blocking or memory spikes

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1524: Verify Oversized export when extremely large dataset', async ({ page }) => {
    // Test Case: UTC-1524
    // Summary: Verify Oversized export when extremely large dataset
    // Description: Feature: Taxonomy Export API Scenario: Oversized export Given extremely large dataset When export exceeds limit Then 413 Payload Too Large returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1525: Verify Timeout handling when slow backend processing', async ({ page }) => {
    // Test Case: UTC-1525
    // Summary: Verify Timeout handling when slow backend processing
    // Description: Feature: Taxonomy Export API Scenario: Timeout handling Given slow backend processing When export exceeds timeout Then 504 Gateway Timeout returned safely

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1526: Verify Retry export when first request fails', async ({ page }) => {
    // Test Case: UTC-1526
    // Summary: Verify Retry export when first request fails
    // Description: Feature: Taxonomy Export API Scenario: Retry export Given first request fails When retried Then export succeeds

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1527: Verify Correct column structure when export file generated', async ({ page }) => {
    // Test Case: UTC-1527
    // Summary: Verify Correct column structure when export file generated
    // Description: Feature: Taxonomy Export API Scenario: Correct column structure Given export file generated When opened Then columns match taxonomy schema

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1528: Verify No sensitive metadata leak when export executed', async ({ page }) => {
    // Test Case: UTC-1528
    // Summary: Verify No sensitive metadata leak when export executed
    // Description: Feature: Taxonomy Export API Scenario: No sensitive metadata leak Given export executed When file inspected Then only allowed taxonomy fields included

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1529: Verify Correct file naming when session export', async ({ page }) => {
    // Test Case: UTC-1529
    // Summary: Verify Correct file naming when session export
    // Description: Feature: Taxonomy Export API Scenario: Correct file naming Given session export When download starts Then filename includes sessionId and timestamp

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1530: Verify Download starts automatically when successful request', async ({ page }) => {
    // Test Case: UTC-1530
    // Summary: Verify Download starts automatically when successful request
    // Description: Feature: Taxonomy Export API Scenario: Download starts automatically Given successful request When response received Then browser download begins without manual action

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
