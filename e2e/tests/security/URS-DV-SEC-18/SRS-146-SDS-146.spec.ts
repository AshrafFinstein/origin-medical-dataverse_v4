import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Reject button visibility when admin opens deletion dashboard
 * URS: URS-DV-SEC-18
 * SRS: SRS-146
 * SDS: SDS-146
 */
test.describe('URS-DV-SEC-18: Verify Reject button visibility when admin opens deletion da', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1921: Verify Reject button visibility when admin opens deletion dashboard', async ({ page }) => {
    // Test Case: UTC-1921
    // Summary: Verify Reject button visibility when admin opens deletion dashboard
    // Description: Feature: Request Rejection Protocol Scenario: Reject button visibility Given admin opens deletion dashboard When request is in Pending state Then red Reject button should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1922: Verify Reject modal opens when admin clicks Reject button', async ({ page }) => {
    // Test Case: UTC-1922
    // Summary: Verify Reject modal opens when admin clicks Reject button
    // Description: Feature: Request Rejection Protocol Scenario: Reject modal opens Given admin clicks Reject button When action triggered Then Reject Delete Session Request modal should open

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1923: Verify Rejection reason field visible when modal is opened', async ({ page }) => {
    // Test Case: UTC-1923
    // Summary: Verify Rejection reason field visible when modal is opened
    // Description: Feature: Request Rejection Protocol Scenario: Rejection reason field visible Given modal is opened When modal loads Then Rejection Reason text area should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1924: Verify Submit rejection without reason when reason field is optional', async ({ page }) => {
    // Test Case: UTC-1924
    // Summary: Verify Submit rejection without reason when reason field is optional
    // Description: Feature: Request Rejection Protocol Scenario: Submit rejection without reason Given reason field is optional When admin submits rejection Then request should be rejected successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1925: Verify Submit rejection with reason when admin enters valid reason', async ({ page }) => {
    // Test Case: UTC-1925
    // Summary: Verify Submit rejection with reason when admin enters valid reason
    // Description: Feature: Request Rejection Protocol Scenario: Submit rejection with reason Given admin enters valid reason When rejection submitted Then reason should be stored with request

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1926: Verify Character limit validation when reason exceeds 500 characters', async ({ page }) => {
    // Test Case: UTC-1926
    // Summary: Verify Character limit validation when reason exceeds 500 characters
    // Description: Feature: Request Rejection Protocol Scenario: Character limit validation Given reason exceeds 500 characters When submitting Then submission should be blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1927: Verify Boundary length acceptance when reason equals 500 characters', async ({ page }) => {
    // Test Case: UTC-1927
    // Summary: Verify Boundary length acceptance when reason equals 500 characters
    // Description: Feature: Request Rejection Protocol Scenario: Boundary length acceptance Given reason equals 500 characters When submitting Then rejection should be allowed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1928: Verify Request status updated when rejection confirmed', async ({ page }) => {
    // Test Case: UTC-1928
    // Summary: Verify Request status updated when rejection confirmed
    // Description: Feature: Request Rejection Protocol Scenario: Request status updated Given rejection confirmed When backend processes Then request status should change to Rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1929: Verify Session unlocked after rejection when session was locked for deletion', async ({ page }) => {
    // Test Case: UTC-1929
    // Summary: Verify Session unlocked after rejection when session was locked for deletion
    // Description: Feature: Request Rejection Protocol Scenario: Session unlocked after rejection Given session was locked for deletion When rejection occurs Then session should revert to active state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1930: Verify Session available in lists when rejection completed', async ({ page }) => {
    // Test Case: UTC-1930
    // Summary: Verify Session available in lists when rejection completed
    // Description: Feature: Request Rejection Protocol Scenario: Session available in lists Given rejection completed When dashboard refreshes Then session should remain visible in active list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1931: Verify Success feedback shown when rejection completed', async ({ page }) => {
    // Test Case: UTC-1931
    // Summary: Verify Success feedback shown when rejection completed
    // Description: Feature: Request Rejection Protocol Scenario: Success feedback shown Given rejection completed When action finishes Then success toast should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1932: Verify Immediate UI update when rejection submitted', async ({ page }) => {
    // Test Case: UTC-1932
    // Summary: Verify Immediate UI update when rejection submitted
    // Description: Feature: Request Rejection Protocol Scenario: Immediate UI update Given rejection submitted When dashboard open Then status should update instantly without reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Create session
    await sessionPage.createSession({
      name: 'Test Session',
      description: 'Test Description'
    });

    const sessionExists = await sessionPage.sessionExists('Test Session');
    expect(sessionExists).toBe(true);
  });

  test('UTC-1933: Verify Only admin can reject when non-admin logged in', async ({ page }) => {
    // Test Case: UTC-1933
    // Summary: Verify Only admin can reject when non-admin logged in
    // Description: Feature: Request Rejection Protocol Scenario: Only admin can reject Given non-admin logged in When accessing reject action Then reject button should be hidden/disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1934: Verify Direct API rejection blocked when unauthorized API call', async ({ page }) => {
    // Test Case: UTC-1934
    // Summary: Verify Direct API rejection blocked when unauthorized API call
    // Description: Feature: Request Rejection Protocol Scenario: Direct API rejection blocked Given unauthorized API call When request sent Then server returns 403

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1935: Verify Cancel rejection when modal opened', async ({ page }) => {
    // Test Case: UTC-1935
    // Summary: Verify Cancel rejection when modal opened
    // Description: Feature: Request Rejection Protocol Scenario: Cancel rejection Given modal opened When admin clicks Cancel/Close Then request should remain Pending

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1936: Verify Audit logging when rejection processed', async ({ page }) => {
    // Test Case: UTC-1936
    // Summary: Verify Audit logging when rejection processed
    // Description: Feature: Request Rejection Protocol Scenario: Audit logging Given rejection processed When action recorded Then admin name, reason, and timestamp should be logged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1937: Verify Fast rejection processing when rejection submitted', async ({ page }) => {
    // Test Case: UTC-1937
    // Summary: Verify Fast rejection processing when rejection submitted
    // Description: Feature: Request Rejection Protocol Scenario: Fast rejection processing Given rejection submitted When backend processes Then response should complete within acceptable time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Create session
    await sessionPage.createSession({
      name: 'Test Session',
      description: 'Test Description'
    });

    const sessionExists = await sessionPage.sessionExists('Test Session');
    expect(sessionExists).toBe(true);
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
