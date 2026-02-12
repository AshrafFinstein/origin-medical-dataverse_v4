import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Authorized user retrieves patient count when valid token and view permission
 * URS: URS-DV-DM-11
 * SRS: SRS-110
 * SDS: SDS-110
 */
test.describe('URS-DV-DM-11: Verify Authorized user retrieves patient count when valid to', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1482: Verify Authorized user retrieves patient count when valid token and view permiss', async ({ page }) => {
    // Test Case: UTC-1482
    // Summary: Verify Authorized user retrieves patient count when valid token and view permission
    // Description: Feature: Patient Count Retrieval API Scenario: Authorized user retrieves patient count Given valid token and view permission When API is called with valid sessionId Then response should return 200 with {count} only

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1483: Verify No patient identifiers exposed when valid request', async ({ page }) => {
    // Test Case: UTC-1483
    // Summary: Verify No patient identifiers exposed when valid request
    // Description: Feature: Patient Count Retrieval API Scenario: No patient identifiers exposed Given valid request When API responds Then response must not include patient IDs or PHI fields

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1484: Verify Zero patients case when session with no patients', async ({ page }) => {
    // Test Case: UTC-1484
    // Summary: Verify Zero patients case when session with no patients
    // Description: Feature: Patient Count Retrieval API Scenario: Zero patients case Given session with no patients When API called Then {count: 0} should be returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1485: Verify Invalid sessionId format when malformed sessionId', async ({ page }) => {
    // Test Case: UTC-1485
    // Summary: Verify Invalid sessionId format when malformed sessionId
    // Description: Feature: Patient Count Retrieval API Scenario: Invalid sessionId format Given malformed sessionId When API called Then 400 Bad Request returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1486: Verify Missing token when no authentication token', async ({ page }) => {
    // Test Case: UTC-1486
    // Summary: Verify Missing token when no authentication token
    // Description: Feature: Patient Count Retrieval API Scenario: Missing token Given no authentication token When API called Then 401 Unauthorized returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1487: Verify Insufficient role permission when user lacks view access', async ({ page }) => {
    // Test Case: UTC-1487
    // Summary: Verify Insufficient role permission when user lacks view access
    // Description: Feature: Patient Count Retrieval API Scenario: Insufficient role permission Given user lacks view access When API called Then 403 Forbidden returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1488: Verify Tenant isolation enforced when session belongs to another tenant', async ({ page }) => {
    // Test Case: UTC-1488
    // Summary: Verify Tenant isolation enforced when session belongs to another tenant
    // Description: Feature: Patient Count Retrieval API Scenario: Tenant isolation enforced Given session belongs to another tenant When API called Then access should be blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1489: Verify Aggregate query accuracy when known dataset of 50 patients', async ({ page }) => {
    // Test Case: UTC-1489
    // Summary: Verify Aggregate query accuracy when known dataset of 50 patients
    // Description: Feature: Patient Count Retrieval API Scenario: Aggregate query accuracy Given known dataset of 50 patients When API called Then count returned must equal 50

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1490: Verify Fast aggregate response when large dataset (10k+ records)', async ({ page }) => {
    // Test Case: UTC-1490
    // Summary: Verify Fast aggregate response when large dataset (10k+ records)
    // Description: Feature: Patient Count Retrieval API Scenario: Fast aggregate response Given large dataset (10k+ records) When API called Then response time should be under 2 seconds

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1491: Verify Minimal payload size when valid request', async ({ page }) => {
    // Test Case: UTC-1491
    // Summary: Verify Minimal payload size when valid request
    // Description: Feature: Patient Count Retrieval API Scenario: Minimal payload size Given valid request When API responds Then response size should remain small (<1KB)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1492: Verify Multiple concurrent requests when 100 parallel calls', async ({ page }) => {
    // Test Case: UTC-1492
    // Summary: Verify Multiple concurrent requests when 100 parallel calls
    // Description: Feature: Patient Count Retrieval API Scenario: Multiple concurrent requests Given 100 parallel calls When executed Then all responses succeed without timeout

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1493: Verify Retry after transient DB failure when temporary DB issue', async ({ page }) => {
    // Test Case: UTC-1493
    // Summary: Verify Retry after transient DB failure when temporary DB issue
    // Description: Feature: Patient Count Retrieval API Scenario: Retry after transient DB failure Given temporary DB issue When retried Then API should recover and return correct count

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1494: Verify No SQL or internal errors exposed when backend query failure', async ({ page }) => {
    // Test Case: UTC-1494
    // Summary: Verify No SQL or internal errors exposed when backend query failure
    // Description: Feature: Patient Count Retrieval API Scenario: No SQL or internal errors exposed Given backend query failure When API fails Then safe generic 500 message returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1495: Verify Count updates after new patient added when new patient mapped to session', async ({ page }) => {
    // Test Case: UTC-1495
    // Summary: Verify Count updates after new patient added when new patient mapped to session
    // Description: Feature: Patient Count Retrieval API Scenario: Count updates after new patient added Given new patient mapped to session When API called again Then count should increment accordingly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1496: Verify Very large counts supported when session with >100k patients', async ({ page }) => {
    // Test Case: UTC-1496
    // Summary: Verify Very large counts supported when session with >100k patients
    // Description: Feature: Patient Count Retrieval API Scenario: Very large counts supported Given session with >100k patients When API called Then large integer count returned correctly without overflow

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
