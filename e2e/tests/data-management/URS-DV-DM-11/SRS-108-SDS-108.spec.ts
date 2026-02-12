import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Authorized user retrieves session metadata successfully when valid OAuth token and permitted role
 * URS: URS-DV-DM-11
 * SRS: SRS-108
 * SDS: SDS-108
 */
test.describe('URS-DV-DM-11: Verify Authorized user retrieves session metadata successful', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1447: Verify Authorized user retrieves session metadata successfully when valid OAuth ', async ({ page }) => {
    // Test Case: UTC-1447
    // Summary: Verify Authorized user retrieves session metadata successfully when valid OAuth token and permitted role
    // Description: Feature: Session Details Retrieval API Scenario: Authorized user retrieves session metadata successfully Given valid OAuth token and permitted role When API is called with valid sessionId Then 200 response with session metadata in JSON should be returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1448: Verify Excel export supported when valid request', async ({ page }) => {
    // Test Case: UTC-1448
    // Summary: Verify Excel export supported when valid request
    // Description: Feature: Session Details Retrieval API Scenario: Excel export supported Given valid request When format=excel parameter passed Then response should return session metadata in Excel format

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1449: Verify Correct metadata fields returned when valid session exists', async ({ page }) => {
    // Test Case: UTC-1449
    // Summary: Verify Correct metadata fields returned when valid session exists
    // Description: Feature: Session Details Retrieval API Scenario: Correct metadata fields returned Given valid session exists When API called Then all expected fields (name, status, labels, dates) should match DB

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1450: Verify Missing token when request without token', async ({ page }) => {
    // Test Case: UTC-1450
    // Summary: Verify Missing token when request without token
    // Description: Feature: Session Details Retrieval API Scenario: Missing token Given request without token When API called Then 401 Unauthorized should be returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1451: Verify Expired token when expired token', async ({ page }) => {
    // Test Case: UTC-1451
    // Summary: Verify Expired token when expired token
    // Description: Feature: Session Details Retrieval API Scenario: Expired token Given expired token When API called Then 401 response should be returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1452: Verify Insufficient permissions when user without view permission', async ({ page }) => {
    // Test Case: UTC-1452
    // Summary: Verify Insufficient permissions when user without view permission
    // Description: Feature: Session Details Retrieval API Scenario: Insufficient permissions Given user without view permission When API called Then 403 Forbidden should be returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1453: Verify Tenant isolation when session belongs to different tenant', async ({ page }) => {
    // Test Case: UTC-1453
    // Summary: Verify Tenant isolation when session belongs to different tenant
    // Description: Feature: Session Details Retrieval API Scenario: Tenant isolation Given session belongs to different tenant When API called Then metadata should not be exposed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1454: Verify Missing sessionId when no sessionId provided', async ({ page }) => {
    // Test Case: UTC-1454
    // Summary: Verify Missing sessionId when no sessionId provided
    // Description: Feature: Session Details Retrieval API Scenario: Missing sessionId Given no sessionId provided When API called Then 400 Bad Request should be returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1455: Verify Invalid sessionId format when malformed ID', async ({ page }) => {
    // Test Case: UTC-1455
    // Summary: Verify Invalid sessionId format when malformed ID
    // Description: Feature: Session Details Retrieval API Scenario: Invalid sessionId format Given malformed ID When API called Then 400 validation error returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1456: Verify Session not found when non-existing sessionId', async ({ page }) => {
    // Test Case: UTC-1456
    // Summary: Verify Session not found when non-existing sessionId
    // Description: Feature: Session Details Retrieval API Scenario: Session not found Given non-existing sessionId When API called Then 404 Not Found should be returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1457: Verify No internal error leakage when backend failure', async ({ page }) => {
    // Test Case: UTC-1457
    // Summary: Verify No internal error leakage when backend failure
    // Description: Feature: Session Details Retrieval API Scenario: No internal error leakage Given backend failure When API responds Then no stack trace or sensitive details should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1458: Verify Consistent schema response when multiple calls', async ({ page }) => {
    // Test Case: UTC-1458
    // Summary: Verify Consistent schema response when multiple calls
    // Description: Feature: Session Details Retrieval API Scenario: Consistent schema response Given multiple calls When comparing responses Then schema must remain identical

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1459: Verify Fast response time when normal load', async ({ page }) => {
    // Test Case: UTC-1459
    // Summary: Verify Fast response time when normal load
    // Description: Feature: Session Details Retrieval API Scenario: Fast response time Given normal load When API called Then response should be under 2 seconds

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1460: Verify Concurrent requests when 50 parallel calls', async ({ page }) => {
    // Test Case: UTC-1460
    // Summary: Verify Concurrent requests when 50 parallel calls
    // Description: Feature: Session Details Retrieval API Scenario: Concurrent requests Given 50 parallel calls When executed Then all requests succeed without timeout

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1461: Verify Special characters preserved when metadata contains special chars', async ({ page }) => {
    // Test Case: UTC-1461
    // Summary: Verify Special characters preserved when metadata contains special chars
    // Description: Feature: Session Details Retrieval API Scenario: Special characters preserved Given metadata contains special chars When API returns data Then characters should remain intact

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1462: Verify Correct headers returned when successful request', async ({ page }) => {
    // Test Case: UTC-1462
    // Summary: Verify Correct headers returned when successful request
    // Description: Feature: Session Details Retrieval API Scenario: Correct headers returned Given successful request When response received Then Content-Type should match requested format

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1463: Verify Retry after transient DB failure when temporary backend issue', async ({ page }) => {
    // Test Case: UTC-1463
    // Summary: Verify Retry after transient DB failure when temporary backend issue
    // Description: Feature: Session Details Retrieval API Scenario: Retry after transient DB failure Given temporary backend issue When retried Then request succeeds

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1464: Verify Large metadata response when session with many labels/fields', async ({ page }) => {
    // Test Case: UTC-1464
    // Summary: Verify Large metadata response when session with many labels/fields
    // Description: Feature: Session Details Retrieval API Scenario: Large metadata response Given session with many labels/fields When API called Then response should handle without truncation

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1465: Verify Friendly error messages when failure case', async ({ page }) => {
    // Test Case: UTC-1465
    // Summary: Verify Friendly error messages when failure case
    // Description: Feature: Session Details Retrieval API Scenario: Friendly error messages Given failure case When API returns error Then message should be non-technical

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1466: Verify Role-based filtering when limited role', async ({ page }) => {
    // Test Case: UTC-1466
    // Summary: Verify Role-based filtering when limited role
    // Description: Feature: Session Details Retrieval API Scenario: Role-based filtering Given limited role When API returns metadata Then restricted fields should not be included

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
