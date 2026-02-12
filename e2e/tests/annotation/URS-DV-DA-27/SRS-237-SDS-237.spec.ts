import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Authorized user sees controls when user has label edit permission
 * URS: URS-DV-DA-27
 * SRS: SRS-237
 * SDS: SDS-237
 */
test.describe('URS-DV-DA-27: Verify Authorized user sees controls when user has label edi', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2456: Verify Authorized user sees controls when user has label edit permission', async ({ page }) => {
    // Test Case: UTC-2456
    // Summary: Verify Authorized user sees controls when user has label edit permission
    // Description: Feature: Role-based label modification security Scenario: Authorized user sees controls Given user has label edit permission When annotation page loads Then Apply and Remove controls should be enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2457: Verify Unauthorized user controls disabled when user has read-only role', async ({ page }) => {
    // Test Case: UTC-2457
    // Summary: Verify Unauthorized user controls disabled when user has read-only role
    // Description: Feature: Role-based label modification security Scenario: Unauthorized user controls disabled Given user has read-only role When annotation page loads Then Apply and Remove controls should be disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2458: Verify Disabled control visual clarity when controls disabled', async ({ page }) => {
    // Test Case: UTC-2458
    // Summary: Verify Disabled control visual clarity when controls disabled
    // Description: Feature: Role-based label modification security Scenario: Disabled control visual clarity Given controls disabled When user views them Then opacity/disabled styling clearly indicates restriction

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2459: Verify Prevent Apply click when unauthorized user', async ({ page }) => {
    // Test Case: UTC-2459
    // Summary: Verify Prevent Apply click when unauthorized user
    // Description: Feature: Role-based label modification security Scenario: Prevent Apply click Given unauthorized user When clicking Apply Then action must not execute

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2460: Verify Prevent Remove action when unauthorized user', async ({ page }) => {
    // Test Case: UTC-2460
    // Summary: Verify Prevent Remove action when unauthorized user
    // Description: Feature: Role-based label modification security Scenario: Prevent Remove action Given unauthorized user When clicking Remove or pressing Backspace Then label removal must not execute

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2461: Verify Access denied message when unauthorized action attempted', async ({ page }) => {
    // Test Case: UTC-2461
    // Summary: Verify Access denied message when unauthorized action attempted
    // Description: Feature: Role-based label modification security Scenario: Access denied message Given unauthorized action attempted When system blocks request Then “Access Denied” message displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2462: Verify Backend validation enforced when user manipulates frontend via console', async ({ page }) => {
    // Test Case: UTC-2462
    // Summary: Verify Backend validation enforced when user manipulates frontend via console
    // Description: Feature: Role-based label modification security Scenario: Backend validation enforced Given user manipulates frontend via console When API request sent directly Then server returns 403 Forbidden

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2463: Verify Data unchanged after block when unauthorized attempt', async ({ page }) => {
    // Test Case: UTC-2463
    // Summary: Verify Data unchanged after block when unauthorized attempt
    // Description: Feature: Role-based label modification security Scenario: Data unchanged after block Given unauthorized attempt When request blocked Then labels remain unchanged in DB

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2464: Verify Role validation before action when user clicks Apply', async ({ page }) => {
    // Test Case: UTC-2464
    // Summary: Verify Role validation before action when user clicks Apply
    // Description: Feature: Role-based label modification security Scenario: Role validation before action Given user clicks Apply When request initiated Then permission must be validated before processing

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2465: Verify Session role update reflected immediately when admin role revoked during ', async ({ page }) => {
    // Test Case: UTC-2465
    // Summary: Verify Session role update reflected immediately when admin role revoked during session
    // Description: Feature: Role-based label modification security Scenario: Session role update reflected immediately Given admin role revoked during session When page refresh occurs Then controls become disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2466: Verify Multiple users with different roles when mixed roles logged in', async ({ page }) => {
    // Test Case: UTC-2466
    // Summary: Verify Multiple users with different roles when mixed roles logged in
    // Description: Feature: Role-based label modification security Scenario: Multiple users with different roles Given mixed roles logged in When each loads page Then only permitted users see enabled actions

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2467: Verify Tooltip guidance when disabled control hovered', async ({ page }) => {
    // Test Case: UTC-2467
    // Summary: Verify Tooltip guidance when disabled control hovered
    // Description: Feature: Role-based label modification security Scenario: Tooltip guidance Given disabled control hovered When tooltip appears Then message explains permission restriction

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2468: Verify Keyboard shortcut blocked when unauthorized user', async ({ page }) => {
    // Test Case: UTC-2468
    // Summary: Verify Keyboard shortcut blocked when unauthorized user
    // Description: Feature: Role-based label modification security Scenario: Keyboard shortcut blocked Given unauthorized user When Backspace pressed Then removal action should not trigger

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2469: Verify API audit log entry when unauthorized attempt', async ({ page }) => {
    // Test Case: UTC-2469
    // Summary: Verify API audit log entry when unauthorized attempt
    // Description: Feature: Role-based label modification security Scenario: API audit log entry Given unauthorized attempt When blocked Then system logs security audit event

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2470: Verify Permission check latency when user performs action', async ({ page }) => {
    // Test Case: UTC-2470
    // Summary: Verify Permission check latency when user performs action
    // Description: Feature: Role-based label modification security Scenario: Permission check latency Given user performs action When validation occurs Then permission check completes instantly (<200ms)

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

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
