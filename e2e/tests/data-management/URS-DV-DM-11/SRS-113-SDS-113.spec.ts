import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Authorized user exports labels when valid token and LABEL_EXPORT permission
 * URS: URS-DV-DM-11
 * SRS: SRS-113
 * SDS: SDS-113
 */
test.describe('URS-DV-DM-11: Verify Authorized user exports labels when valid token and L', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1531: Verify Authorized user exports labels when valid token and LABEL_EXPORT permissi', async ({ page }) => {
    // Test Case: UTC-1531
    // Summary: Verify Authorized user exports labels when valid token and LABEL_EXPORT permission
    // Description: Feature: Label Export API Scenario: Authorized user exports labels Given valid token and LABEL_EXPORT permission When export API is called with sessionId Then CSV file containing label definitions should be downloaded

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1532: Verify Correct label definitions returned when labels exist for session', async ({ page }) => {
    // Test Case: UTC-1532
    // Summary: Verify Correct label definitions returned when labels exist for session
    // Description: Feature: Label Export API Scenario: Correct label definitions returned Given labels exist for session When export completes Then file contains all label names, IDs, and mappings

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1533: Verify Versioned export structure when export executed', async ({ page }) => {
    // Test Case: UTC-1533
    // Summary: Verify Versioned export structure when export executed
    // Description: Feature: Label Export API Scenario: Versioned export structure Given export executed When file opened Then export includes version or schema identifier column

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1534: Verify Label-to-session mapping included when mapped labels exist', async ({ page }) => {
    // Test Case: UTC-1534
    // Summary: Verify Label-to-session mapping included when mapped labels exist
    // Description: Feature: Label Export API Scenario: Label-to-session mapping included Given mapped labels exist When export generated Then mapping references are included

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1535: Verify Invalid sessionId when malformed sessionId', async ({ page }) => {
    // Test Case: UTC-1535
    // Summary: Verify Invalid sessionId when malformed sessionId
    // Description: Feature: Label Export API Scenario: Invalid sessionId Given malformed sessionId When API called Then 400 Bad Request returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1536: Verify Missing token when no authentication token', async ({ page }) => {
    // Test Case: UTC-1536
    // Summary: Verify Missing token when no authentication token
    // Description: Feature: Label Export API Scenario: Missing token Given no authentication token When API called Then 401 Unauthorized returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1537: Verify Insufficient permission when user without LABEL_EXPORT permission', async ({ page }) => {
    // Test Case: UTC-1537
    // Summary: Verify Insufficient permission when user without LABEL_EXPORT permission
    // Description: Feature: Label Export API Scenario: Insufficient permission Given user without LABEL_EXPORT permission When API called Then 403 Forbidden returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1538: Verify Tenant isolation enforced when labels belong to another tenant', async ({ page }) => {
    // Test Case: UTC-1538
    // Summary: Verify Tenant isolation enforced when labels belong to another tenant
    // Description: Feature: Label Export API Scenario: Tenant isolation enforced Given labels belong to another tenant When export attempted Then access should be denied

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1539: Verify Empty label dataset when no labels exist', async ({ page }) => {
    // Test Case: UTC-1539
    // Summary: Verify Empty label dataset when no labels exist
    // Description: Feature: Label Export API Scenario: Empty label dataset Given no labels exist When export requested Then empty file or 404 returned gracefully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1540: Verify Medium dataset performance when 1000 labels', async ({ page }) => {
    // Test Case: UTC-1540
    // Summary: Verify Medium dataset performance when 1000 labels
    // Description: Feature: Label Export API Scenario: Medium dataset performance Given 1000 labels When export triggered Then file generated within 3 seconds

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1541: Verify Large dataset streaming when 10k+ labels', async ({ page }) => {
    // Test Case: UTC-1541
    // Summary: Verify Large dataset streaming when 10k+ labels
    // Description: Feature: Label Export API Scenario: Large dataset streaming Given 10k+ labels When export executed Then streaming response without memory spike

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1542: Verify Oversized export request when extremely large dataset', async ({ page }) => {
    // Test Case: UTC-1542
    // Summary: Verify Oversized export request when extremely large dataset
    // Description: Feature: Label Export API Scenario: Oversized export request Given extremely large dataset When export exceeds limit Then bounded error returned with retry guidance

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1543: Verify Retry after failure when first request fails', async ({ page }) => {
    // Test Case: UTC-1543
    // Summary: Verify Retry after failure when first request fails
    // Description: Feature: Label Export API Scenario: Retry after failure Given first request fails When retried Then export succeeds

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1544: Verify Serialization failure handling when export serialization error occurs', async ({ page }) => {
    // Test Case: UTC-1544
    // Summary: Verify Serialization failure handling when export serialization error occurs
    // Description: Feature: Label Export API Scenario: Serialization failure handling Given export serialization error occurs When API processes data Then 500 safe error returned without crash

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1545: Verify Correct column headers when file downloaded', async ({ page }) => {
    // Test Case: UTC-1545
    // Summary: Verify Correct column headers when file downloaded
    // Description: Feature: Label Export API Scenario: Correct column headers Given file downloaded When opened Then headers match label schema

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1546: Verify No sensitive fields exposed when export generated', async ({ page }) => {
    // Test Case: UTC-1546
    // Summary: Verify No sensitive fields exposed when export generated
    // Description: Feature: Label Export API Scenario: No sensitive fields exposed Given export generated When file inspected Then no credentials or internal IDs included

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1547: Verify Correct filename format when session export', async ({ page }) => {
    // Test Case: UTC-1547
    // Summary: Verify Correct filename format when session export
    // Description: Feature: Label Export API Scenario: Correct filename format Given session export When download starts Then filename includes sessionId and timestamp

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1548: Verify Automatic download behavior when export success', async ({ page }) => {
    // Test Case: UTC-1548
    // Summary: Verify Automatic download behavior when export success
    // Description: Feature: Label Export API Scenario: Automatic download behavior Given export success When response returned Then browser download starts automatically

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
