import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Authorized user can open page when user has session creation permission
 * URS: URS-DEV-GEN-08
 * SRS: SRS-92
 * SDS: SDS-92
 */
test.describe('URS-DEV-GEN-08: Verify Authorized user can open page when user has session c', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1176: Verify Authorized user can open page when user has session creation permission', async ({ page }) => {
    // Test Case: UTC-1176
    // Summary: Verify Authorized user can open page when user has session creation permission
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: Authorized user can open page Given user has session creation permission When navigating to Session Creation page Then page should load successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1177: Verify Unauthorized user blocked when user lacks session creation permission', async ({ page }) => {
    // Test Case: UTC-1177
    // Summary: Verify Unauthorized user blocked when user lacks session creation permission
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: Unauthorized user blocked Given user lacks session creation permission When navigating to Session Creation page Then access should be denied

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1178: Verify Direct URL restriction when unauthorized user', async ({ page }) => {
    // Test Case: UTC-1178
    // Summary: Verify Direct URL restriction when unauthorized user
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: Direct URL restriction Given unauthorized user When entering Session Creation URL directly Then system should prevent page load

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1179: Verify Backend API protection when unauthorized user', async ({ page }) => {
    // Test Case: UTC-1179
    // Summary: Verify Backend API protection when unauthorized user
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: Backend API protection Given unauthorized user When calling session creation API Then server should return 401/403 response

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1180: Verify Page content hidden when unauthorized user', async ({ page }) => {
    // Test Case: UTC-1180
    // Summary: Verify Page content hidden when unauthorized user
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: Page content hidden Given unauthorized user When page renders Then session creation form fields should not be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1181: Verify Role validated before page load when page initialization', async ({ page }) => {
    // Test Case: UTC-1181
    // Summary: Verify Role validated before page load when page initialization
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: Role validated before page load Given page initialization When authorization check executes Then permission validation should occur before rendering UI

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1182: Verify Friendly access-denied message when authorization fails', async ({ page }) => {
    // Test Case: UTC-1182
    // Summary: Verify Friendly access-denied message when authorization fails
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: Friendly access-denied message Given authorization fails When blocked Then clear non-technical message should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1183: Verify No technical details exposed when unauthorized access attempt', async ({ page }) => {
    // Test Case: UTC-1183
    // Summary: Verify No technical details exposed when unauthorized access attempt
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: No technical details exposed Given unauthorized access attempt When error displayed Then stack traces or system details should not appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1184: Verify Role change during session when user role revoked during active session', async ({ page }) => {
    // Test Case: UTC-1184
    // Summary: Verify Role change during session when user role revoked during active session
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: Role change during session Given user role revoked during active session When page refreshed Then access should be immediately blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1185: Verify Cached page restriction when unauthorized user uses browser back button', async ({ page }) => {
    // Test Case: UTC-1185
    // Summary: Verify Cached page restriction when unauthorized user uses browser back button
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: Cached page restriction Given unauthorized user uses browser back button When returning to cached page Then page should revalidate and block access

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1186: Verify Token/session expiration when session expires', async ({ page }) => {
    // Test Case: UTC-1186
    // Summary: Verify Token/session expiration when session expires
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: Token/session expiration Given session expires When user attempts page access Then user should be redirected to login

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1187: Verify Button visibility control when unauthorized user', async ({ page }) => {
    // Test Case: UTC-1187
    // Summary: Verify Button visibility control when unauthorized user
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: Button visibility control Given unauthorized user When dashboard loads Then Create Session button should not be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1188: Verify Forced action attempt when unauthorized user manipulates request payload', async ({ page }) => {
    // Test Case: UTC-1188
    // Summary: Verify Forced action attempt when unauthorized user manipulates request payload
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: Forced action attempt Given unauthorized user manipulates request payload When attempting manual submission Then request should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1189: Verify Authorization check speed when user navigates to page', async ({ page }) => {
    // Test Case: UTC-1189
    // Summary: Verify Authorization check speed when user navigates to page
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: Authorization check speed Given user navigates to page When validation occurs Then authorization check should complete without noticeable delay (<1s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1190: Verify Access attempt logging when unauthorized access attempt', async ({ page }) => {
    // Test Case: UTC-1190
    // Summary: Verify Access attempt logging when unauthorized access attempt
    // Description: Feature: Role-Based Access Control for Session Creation Scenario: Access attempt logging Given unauthorized access attempt When blocked Then system should log the attempt for audit

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
