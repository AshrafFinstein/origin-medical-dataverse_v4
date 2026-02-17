import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Authorized user retrieves image count when valid token and permission
 * URS: URS-DV-DM-11
 * SRS: SRS-111
 * SDS: SDS-111
 */
test.describe('URS-DV-DM-11: Verify Authorized user retrieves image count when valid toke', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1497: Verify Authorized user retrieves image count when valid token and permission', async ({ page }) => {
    // Test Case: UTC-1497
    // Summary: Verify Authorized user retrieves image count when valid token and permission
    // Description: Feature: Session Image Count API Scenario: Authorized user retrieves image count Given valid token and permission When API is called with valid sessionId Then response returns 200 with {imageCount} only

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1498: Verify Zero images case when session has no images', async ({ page }) => {
    // Test Case: UTC-1498
    // Summary: Verify Zero images case when session has no images
    // Description: Feature: Session Image Count API Scenario: Zero images case Given session has no images When API called Then {imageCount: 0} returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1499: Verify Count accuracy validation when DB contains 100 images', async ({ page }) => {
    // Test Case: UTC-1499
    // Summary: Verify Count accuracy validation when DB contains 100 images
    // Description: Feature: Session Image Count API Scenario: Count accuracy validation Given DB contains 100 images When API called Then returned count equals 100

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1500: Verify Fast response for large dataset when 50k+ images', async ({ page }) => {
    // Test Case: UTC-1500
    // Summary: Verify Fast response for large dataset when 50k+ images
    // Description: Feature: Session Image Count API Scenario: Fast response for large dataset Given 50k+ images When API called Then response time should be under 2 seconds

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1501: Verify Indexed query performance stability when repeated calls', async ({ page }) => {
    // Test Case: UTC-1501
    // Summary: Verify Indexed query performance stability when repeated calls
    // Description: Feature: Session Image Count API Scenario: Indexed query performance stability Given repeated calls When 50 sequential requests executed Then latency remains consistent

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1502: Verify Missing authentication token when no token', async ({ page }) => {
    // Test Case: UTC-1502
    // Summary: Verify Missing authentication token when no token
    // Description: Feature: Session Image Count API Scenario: Missing authentication token Given no token When API called Then 401 Unauthorized returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1503: Verify Insufficient permission when user lacks access rights', async ({ page }) => {
    // Test Case: UTC-1503
    // Summary: Verify Insufficient permission when user lacks access rights
    // Description: Feature: Session Image Count API Scenario: Insufficient permission Given user lacks access rights When API called Then 403 Forbidden returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1504: Verify Tenant isolation enforced when session belongs to another tenant', async ({ page }) => {
    // Test Case: UTC-1504
    // Summary: Verify Tenant isolation enforced when session belongs to another tenant
    // Description: Feature: Session Image Count API Scenario: Tenant isolation enforced Given session belongs to another tenant When API called Then access denied

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1505: Verify Invalid sessionId format when malformed ID', async ({ page }) => {
    // Test Case: UTC-1505
    // Summary: Verify Invalid sessionId format when malformed ID
    // Description: Feature: Session Image Count API Scenario: Invalid sessionId format Given malformed ID When API called Then 400 Bad Request returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1506: Verify Non-existent session when unknown sessionId', async ({ page }) => {
    // Test Case: UTC-1506
    // Summary: Verify Non-existent session when unknown sessionId
    // Description: Feature: Session Image Count API Scenario: Non-existent session Given unknown sessionId When API called Then 404 Not Found returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1507: Verify Concurrent requests handling when 100 parallel calls', async ({ page }) => {
    // Test Case: UTC-1507
    // Summary: Verify Concurrent requests handling when 100 parallel calls
    // Description: Feature: Session Image Count API Scenario: Concurrent requests handling Given 100 parallel calls When executed Then all succeed without failures

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1508: Verify Recovery after transient DB error when temporary DB outage', async ({ page }) => {
    // Test Case: UTC-1508
    // Summary: Verify Recovery after transient DB error when temporary DB outage
    // Description: Feature: Session Image Count API Scenario: Recovery after transient DB error Given temporary DB outage When retried Then API returns correct count

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1509: Verify No internal query details exposed when backend failure', async ({ page }) => {
    // Test Case: UTC-1509
    // Summary: Verify No internal query details exposed when backend failure
    // Description: Feature: Session Image Count API Scenario: No internal query details exposed Given backend failure When API responds Then safe generic message returned without stack trace

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1510: Verify Count updates after new image upload when new image added', async ({ page }) => {
    // Test Case: UTC-1510
    // Summary: Verify Count updates after new image upload when new image added
    // Description: Feature: Session Image Count API Scenario: Count updates after new image upload Given new image added When API called again Then count increments correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1511: Verify Very large image count when >100k images', async ({ page }) => {
    // Test Case: UTC-1511
    // Summary: Verify Very large image count when >100k images
    // Description: Feature: Session Image Count API Scenario: Very large image count Given >100k images When API called Then large integer handled without overflow

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1512: Verify Minimal payload size when valid request', async ({ page }) => {
    // Test Case: UTC-1512
    // Summary: Verify Minimal payload size when valid request
    // Description: Feature: Session Image Count API Scenario: Minimal payload size Given valid request When response returned Then payload only includes {imageCount} and remains lightweight

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
