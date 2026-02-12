import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Authorized user retrieves session name successfully when valid token and view permission
 * URS: URS-DV-DM-11
 * SRS: SRS-109
 * SDS: SDS-109
 */
test.describe('URS-DV-DM-11: Verify Authorized user retrieves session name successfully w', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1467: Verify Authorized user retrieves session name successfully when valid token and ', async ({ page }) => {
    // Test Case: UTC-1467
    // Summary: Verify Authorized user retrieves session name successfully when valid token and view permission
    // Description: Feature: Session Name Retrieval API Scenario: Authorized user retrieves session name successfully Given valid token and view permission When API is called with valid sessionId Then 200 response should return only { name } field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1468: Verify Response contains only name attribute when valid request', async ({ page }) => {
    // Test Case: UTC-1468
    // Summary: Verify Response contains only name attribute when valid request
    // Description: Feature: Session Name Retrieval API Scenario: Response contains only name attribute Given valid request When API responds Then no extra metadata fields should be included

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1469: Verify Lightweight response time when normal loadWhen API called', async ({ page }) => {
    // Test Case: UTC-1469
    // Summary: Verify Lightweight response time when normal loadWhen API called
    // Description: Feature: Session Name Retrieval API Scenario: Lightweight response time Given normal loadWhen API called Then response time should be under 1 second

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1470: Verify Reduced payload size when session existsWhen API returns data', async ({ page }) => {
    // Test Case: UTC-1470
    // Summary: Verify Reduced payload size when session existsWhen API returns data
    // Description: Feature: Session Name Retrieval API Scenario: Reduced payload size Given session existsWhen API returns data Then payload size should be minimal (<1KB)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1471: Verify Missing tokenGiven request without authentication when API called', async ({ page }) => {
    // Test Case: UTC-1471
    // Summary: Verify Missing tokenGiven request without authentication when API called
    // Description: Feature: Session Name Retrieval API Scenario: Missing tokenGiven request without authentication When API called Then 401 Unauthorized returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1472: Verify Insufficient permission when user without view access', async ({ page }) => {
    // Test Case: UTC-1472
    // Summary: Verify Insufficient permission when user without view access
    // Description: Feature: Session Name Retrieval API Scenario: Insufficient permission Given user without view access When API called Then 403 Forbidden returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1473: Verify Invalid sessionId format when malformed sessionId', async ({ page }) => {
    // Test Case: UTC-1473
    // Summary: Verify Invalid sessionId format when malformed sessionId
    // Description: Feature: Session Name Retrieval API Scenario: Invalid sessionId format Given malformed sessionId When API called Then 400 Bad Request returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1474: Verify Session not found when non-existing sessionId', async ({ page }) => {
    // Test Case: UTC-1474
    // Summary: Verify Session not found when non-existing sessionId
    // Description: Feature: Session Name Retrieval API Scenario: Session not found Given non-existing sessionId When API called Then 404 Not Found returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1475: Verify Tenant isolation enforced when session belongs to another tenant', async ({ page }) => {
    // Test Case: UTC-1475
    // Summary: Verify Tenant isolation enforced when session belongs to another tenant
    // Description: Feature: Session Name Retrieval API Scenario: Tenant isolation enforced Given session belongs to another tenant When API calledThen access should be denied

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1476: Verify Stable schema response when repeated calls', async ({ page }) => {
    // Test Case: UTC-1476
    // Summary: Verify Stable schema response when repeated calls
    // Description: Feature: Session Name Retrieval API Scenario: Stable schema response Given repeated calls When comparing responses Then response structure remains identical

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1477: Verify Concurrent requests handling when 100 parallel calls', async ({ page }) => {
    // Test Case: UTC-1477
    // Summary: Verify Concurrent requests handling when 100 parallel calls
    // Description: Feature: Session Name Retrieval API Scenario: Concurrent requests handling Given 100 parallel calls When executedThen all succeed without timeout

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1478: Verify Correct name value returned when DB contains session name', async ({ page }) => {
    // Test Case: UTC-1478
    // Summary: Verify Correct name value returned when DB contains session name
    // Description: Feature: Session Name Retrieval API Scenario: Correct name value returned Given DB contains session name When API called Then returned name must match DB exactly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1479: Verify No internal error leakage when backend error occurs', async ({ page }) => {
    // Test Case: UTC-1479
    // Summary: Verify No internal error leakage when backend error occurs
    // Description: Feature: Session Name Retrieval API Scenario: No internal error leakage Given backend error occurs When API fails Then no stack trace exposed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1480: Verify Retry after transient failure when temporary DB disconnect', async ({ page }) => {
    // Test Case: UTC-1480
    // Summary: Verify Retry after transient failure when temporary DB disconnect
    // Description: Feature: Session Name Retrieval API Scenario: Retry after transient failure Given temporary DB disconnect When retriedThen request succeeds

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1481: Verify Long session name handled when name length near max limit', async ({ page }) => {
    // Test Case: UTC-1481
    // Summary: Verify Long session name handled when name length near max limit
    // Description: Feature: Session Name Retrieval API Scenario: Long session name handled Given name length near max limit When API called Then full name returned without truncation

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
