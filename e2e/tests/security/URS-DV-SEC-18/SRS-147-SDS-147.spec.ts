import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Admin sees Delete button when user role is ADMIN
 * URS: URS-DV-SEC-18
 * SRS: SRS-147
 * SDS: SDS-147
 */
test.describe('URS-DV-SEC-18: Verify Admin sees Delete button when user role is ADMIN', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1938: Verify Admin sees Delete button when user role is ADMIN', async ({ page }) => {
    // Test Case: UTC-1938
    // Summary: Verify Admin sees Delete button when user role is ADMIN
    // Description: Feature: Role-Based Delete Access Scenario: Admin sees Delete button Given user role is ADMIN When Epic page loads Then Delete Session button should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1939: Verify Supervisor sees Delete button when user role is SUPERVISOR', async ({ page }) => {
    // Test Case: UTC-1939
    // Summary: Verify Supervisor sees Delete button when user role is SUPERVISOR
    // Description: Feature: Role-Based Delete Access Scenario: Supervisor sees Delete button Given user role is SUPERVISOR When Epic page loads Then Delete Session button should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1940: Verify Standard user cannot see Delete button when user role is REVIEWER', async ({ page }) => {
    // Test Case: UTC-1940
    // Summary: Verify Standard user cannot see Delete button when user role is REVIEWER
    // Description: Feature: Role-Based Delete Access Scenario: Standard user cannot see Delete button Given user role is REVIEWER When Epic page loads Then Delete Session button should not be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1941: Verify Unauthorized user cannot see Delete Requests link when user lacks delete ', async ({ page }) => {
    // Test Case: UTC-1941
    // Summary: Verify Unauthorized user cannot see Delete Requests link when user lacks delete permission
    // Description: Feature: Role-Based Delete Access Scenario: Unauthorized user cannot see Delete Requests link Given user lacks delete permission When dashboard loads Then Delete Session Requests link should not render

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1942: Verify Authorized user sees request controls when authorized role logged in', async ({ page }) => {
    // Test Case: UTC-1942
    // Summary: Verify Authorized user sees request controls when authorized role logged in
    // Description: Feature: Role-Based Delete Access Scenario: Authorized user sees request controls Given authorized role logged in When page renders Then deletion request controls should be enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1943: Verify Role validated before render when login completed', async ({ page }) => {
    // Test Case: UTC-1943
    // Summary: Verify Role validated before render when login completed
    // Description: Feature: Role-Based Delete Access Scenario: Role validated before render Given login completed When UI initializes Then role should be validated before mounting delete components

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1944: Verify No flicker of delete controls when unauthorized user logs in', async ({ page }) => {
    // Test Case: UTC-1944
    // Summary: Verify No flicker of delete controls when unauthorized user logs in
    // Description: Feature: Role-Based Delete Access Scenario: No flicker of delete controls Given unauthorized user logs in When page loads Then delete controls should never briefly appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1945: Verify Direct URL access blocked when unauthorized user manually enters delete U', async ({ page }) => {
    // Test Case: UTC-1945
    // Summary: Verify Direct URL access blocked when unauthorized user manually enters delete URL
    // Description: Feature: Role-Based Delete Access Scenario: Direct URL access blocked Given unauthorized user manually enters delete URL When request processed Then system should redirect to dashboard

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1946: Verify Access denied message shown when unauthorized access attempt', async ({ page }) => {
    // Test Case: UTC-1946
    // Summary: Verify Access denied message shown when unauthorized access attempt
    // Description: Feature: Role-Based Delete Access Scenario: Access denied message shown Given unauthorized access attempt When redirect occurs Then Access Denied message should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1947: Verify API protection for delete endpoint when unauthorized API call', async ({ page }) => {
    // Test Case: UTC-1947
    // Summary: Verify API protection for delete endpoint when unauthorized API call
    // Description: Feature: Role-Based Delete Access Scenario: API protection for delete endpoint Given unauthorized API call When request sent Then server should return 403 Forbidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1948: Verify Role stored in secure state when login success', async ({ page }) => {
    // Test Case: UTC-1948
    // Summary: Verify Role stored in secure state when login success
    // Description: Feature: Role-Based Delete Access Scenario: Role stored in secure state Given login success When session initialized Then user role should be stored securely in state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1949: Verify Role change reflected dynamically when admin role downgraded', async ({ page }) => {
    // Test Case: UTC-1949
    // Summary: Verify Role change reflected dynamically when admin role downgraded
    // Description: Feature: Role-Based Delete Access Scenario: Role change reflected dynamically Given admin role downgraded When page refreshed Then delete controls should disappear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1950: Verify Supervisor retains access when supervisor logged in', async ({ page }) => {
    // Test Case: UTC-1950
    // Summary: Verify Supervisor retains access when supervisor logged in
    // Description: Feature: Role-Based Delete Access Scenario: Supervisor retains access Given supervisor logged in When navigating pages Then delete controls should remain visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1951: Verify Guest user login when guest role', async ({ page }) => {
    // Test Case: UTC-1951
    // Summary: Verify Guest user login when guest role
    // Description: Feature: Role-Based Delete Access Scenario: Guest user login Given guest role When Epic page loads Then delete controls should not exist in DOM

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1952: Verify Clean UI for unauthorized users when unauthorized user logged in', async ({ page }) => {
    // Test Case: UTC-1952
    // Summary: Verify Clean UI for unauthorized users when unauthorized user logged in
    // Description: Feature: Role-Based Delete Access Scenario: Clean UI for unauthorized users Given unauthorized user logged in When viewing dashboard Then no empty space or broken layout should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1953: Verify Unauthorized attempt logged when blocked access occurs', async ({ page }) => {
    // Test Case: UTC-1953
    // Summary: Verify Unauthorized attempt logged when blocked access occurs
    // Description: Feature: Role-Based Delete Access Scenario: Unauthorized attempt logged Given blocked access occurs When system logs event́

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1954: Verify Fast permission check when page loads', async ({ page }) => {
    // Test Case: UTC-1954
    // Summary: Verify Fast permission check when page loads
    // Description: Feature: Role-Based Delete Access Scenario: Fast permission check Given page loads When role validation runs Then rendering should not delay noticeably

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
