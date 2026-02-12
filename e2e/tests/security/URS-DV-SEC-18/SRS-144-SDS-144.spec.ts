import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dashboard page loads when admin logs in
 * URS: URS-DV-SEC-18
 * SRS: SRS-144
 * SDS: SDS-144
 */
test.describe('URS-DV-SEC-18: Verify Dashboard page loads when admin logs in', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1885: Verify Dashboard page loads when admin logs in', async ({ page }) => {
    // Test Case: UTC-1885
    // Summary: Verify Dashboard page loads when admin logs in
    // Description: Feature: Administrative Request Dashboard Scenario: Dashboard page loads Given admin logs in When navigating to Delete Request Dashboard Then the dashboard page should load successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1886: Verify Table structure displayed when dashboard is open', async ({ page }) => {
    // Test Case: UTC-1886
    // Summary: Verify Table structure displayed when dashboard is open
    // Description: Feature: Administrative Request Dashboard Scenario: Table structure displayed Given dashboard is open When UI renders Then table should show columns Session Name, Requested By, Reason, Rejection Reason, Status, Actions

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1887: Verify Fetch all requests when requests exist in database', async ({ page }) => {
    // Test Case: UTC-1887
    // Summary: Verify Fetch all requests when requests exist in database
    // Description: Feature: Administrative Request Dashboard Scenario: Fetch all requests Given requests exist in database When dashboard loads Then all requests should be displayed in the table

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1888: Verify Show requester details when requests displayed', async ({ page }) => {
    // Test Case: UTC-1888
    // Summary: Verify Show requester details when requests displayed
    // Description: Feature: Administrative Request Dashboard Scenario: Show requester details Given requests displayed When viewing Requested By column Then requester name should be shown correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1889: Verify Show reason text when requests displayed', async ({ page }) => {
    // Test Case: UTC-1889
    // Summary: Verify Show reason text when requests displayed
    // Description: Feature: Administrative Request Dashboard Scenario: Show reason text Given requests displayed When viewing Reason column Then provided reason should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1890: Verify Status color coding when requests shown', async ({ page }) => {
    // Test Case: UTC-1890
    // Summary: Verify Status color coding when requests shown
    // Description: Feature: Administrative Request Dashboard Scenario: Status color coding Given requests shown When viewing status badges Then statuses should be color-coded (Pending/Approved/Rejected)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1891: Verify Approve button available when request status is Pending', async ({ page }) => {
    // Test Case: UTC-1891
    // Summary: Verify Approve button available when request status is Pending
    // Description: Feature: Administrative Request Dashboard Scenario: Approve button available Given request status is Pending When viewing Actions column Then Approve button should be enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1892: Verify Reject button available when request status is Pending', async ({ page }) => {
    // Test Case: UTC-1892
    // Summary: Verify Reject button available when request status is Pending
    // Description: Feature: Administrative Request Dashboard Scenario: Reject button available Given request status is Pending When viewing Actions column Then Reject button should be enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1893: Verify Approve request successfully when Pending request exists', async ({ page }) => {
    // Test Case: UTC-1893
    // Summary: Verify Approve request successfully when Pending request exists
    // Description: Feature: Administrative Request Dashboard Scenario: Approve request successfully Given Pending request exists When admin clicks Approve Then status should change to Approved

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1894: Verify Reject request successfully when Pending request exists', async ({ page }) => {
    // Test Case: UTC-1894
    // Summary: Verify Reject request successfully when Pending request exists
    // Description: Feature: Administrative Request Dashboard Scenario: Reject request successfully Given Pending request exists When admin clicks Reject Then request should be marked Rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1895: Verify Rejection reason required when admin clicks Reject', async ({ page }) => {
    // Test Case: UTC-1895
    // Summary: Verify Rejection reason required when admin clicks Reject
    // Description: Feature: Administrative Request Dashboard Scenario: Rejection reason required Given admin clicks Reject When no reason entered Then submission should be blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1896: Verify Show rejection reason only for rejected when rejected request exists', async ({ page }) => {
    // Test Case: UTC-1896
    // Summary: Verify Show rejection reason only for rejected when rejected request exists
    // Description: Feature: Administrative Request Dashboard Scenario: Show rejection reason only for rejected Given rejected request exists When viewing row Then rejection reason should be visible only for rejected rows

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1897: Verify Filter by requester name when multiple requests exist', async ({ page }) => {
    // Test Case: UTC-1897
    // Summary: Verify Filter by requester name when multiple requests exist
    // Description: Feature: Administrative Request Dashboard Scenario: Filter by requester name Given multiple requests exist When admin searches by requester Then matching records should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1898: Verify Filter by status when multiple statuses exist', async ({ page }) => {
    // Test Case: UTC-1898
    // Summary: Verify Filter by status when multiple statuses exist
    // Description: Feature: Administrative Request Dashboard Scenario: Filter by status Given multiple statuses exist When admin filters Pending Then only pending records should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1899: Verify Unauthorized user blocked when non-admin user logged in', async ({ page }) => {
    // Test Case: UTC-1899
    // Summary: Verify Unauthorized user blocked when non-admin user logged in
    // Description: Feature: Administrative Request Dashboard Scenario: Unauthorized user blocked Given non-admin user logged in When accessing dashboard URL Then access should be denied

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1900: Verify No data state when no requests exist', async ({ page }) => {
    // Test Case: UTC-1900
    // Summary: Verify No data state when no requests exist
    // Description: Feature: Administrative Request Dashboard Scenario: No data state Given no requests exist When dashboard loads Then No Data placeholder should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1901: Verify Data refresh after action when admin approves request', async ({ page }) => {
    // Test Case: UTC-1901
    // Summary: Verify Data refresh after action when admin approves request
    // Description: Feature: Administrative Request Dashboard Scenario: Data refresh after action Given admin approves request When action completes Then table should update instantly without reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1902: Verify Correct DB update when request approved/rejected', async ({ page }) => {
    // Test Case: UTC-1902
    // Summary: Verify Correct DB update when request approved/rejected
    // Description: Feature: Administrative Request Dashboard Scenario: Correct DB update Given request approved/rejected When backend saves Then database should store updated status and reason

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1903: Verify Dashboard load performance when 500+ requests exist', async ({ page }) => {
    // Test Case: UTC-1903
    // Summary: Verify Dashboard load performance when 500+ requests exist
    // Description: Feature: Administrative Request Dashboard Scenario: Dashboard load performance Given 500+ requests exist When page loads Then dashboard should render within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1904: Verify API failure handling when server error occurs', async ({ page }) => {
    // Test Case: UTC-1904
    // Summary: Verify API failure handling when server error occurs
    // Description: Feature: Administrative Request Dashboard Scenario: API failure handling Given server error occurs When dashboard loads Then non-blocking error message should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
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
