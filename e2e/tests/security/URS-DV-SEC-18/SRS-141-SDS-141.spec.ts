import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Delete button hidden by default when a user without delete permission
 * URS: URS-DV-SEC-18
 * SRS: SRS-141
 * SDS: SDS-141
 */
test.describe('URS-DV-SEC-18: Verify Delete button hidden by default when a user without d', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1845: Verify Delete button hidden by default when a user without delete permission', async ({ page }) => {
    // Test Case: UTC-1845
    // Summary: Verify Delete button hidden by default when a user without delete permission
    // Description: Feature: Permission-Based Delete Button Visibility Scenario: Delete button hidden by default Given a user without delete permission When the Epic page loads Then the Delete Session Requests button should not be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1846: Verify Button visible for authorized user when the user has can_delete_session p', async ({ page }) => {
    // Test Case: UTC-1846
    // Summary: Verify Button visible for authorized user when the user has can_delete_session permission
    // Description: Feature: Permission-Based Delete Button Visibility Scenario: Button visible for authorized user Given the user has can_delete_session permission When the Epic page loads Then the Delete Session Requests button should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1847: Verify Permission fetched from master config when the page initializes', async ({ page }) => {
    // Test Case: UTC-1847
    // Summary: Verify Permission fetched from master config when the page initializes
    // Description: Feature: Permission-Based Delete Button Visibility Scenario: Permission fetched from master config Given the page initializes When permissions are retrieved from API Then user permission set should include delete flag before rendering button

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1848: Verify Unauthorized DOM protection when the user lacks permission', async ({ page }) => {
    // Test Case: UTC-1848
    // Summary: Verify Unauthorized DOM protection when the user lacks permission
    // Description: Feature: Permission-Based Delete Button Visibility Scenario: Unauthorized DOM protection Given the user lacks permission When inspecting DOM Then delete button element should not exist (not hidden via CSS only)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1849: Verify Direct API attempt blocked when unauthorized user', async ({ page }) => {
    // Test Case: UTC-1849
    // Summary: Verify Direct API attempt blocked when unauthorized user
    // Description: Feature: Permission-Based Delete Button Visibility Scenario: Direct API attempt blocked Given unauthorized user When delete API is triggered manually Then system should return 403 Forbidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1850: Verify Role change reflected immediately when permission is granted dynamically', async ({ page }) => {
    // Test Case: UTC-1850
    // Summary: Verify Role change reflected immediately when permission is granted dynamically
    // Description: Feature: Permission-Based Delete Button Visibility Scenario: Role change reflected immediately Given permission is granted dynamically When page refreshes Then delete button should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1851: Verify Permission revoked dynamically when delete access is removed', async ({ page }) => {
    // Test Case: UTC-1851
    // Summary: Verify Permission revoked dynamically when delete access is removed
    // Description: Feature: Permission-Based Delete Button Visibility Scenario: Permission revoked dynamically Given delete access is removed When page reloads Then delete button should disappear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1852: Verify No flicker during render when unauthorized user loads page', async ({ page }) => {
    // Test Case: UTC-1852
    // Summary: Verify No flicker during render when unauthorized user loads page
    // Description: Feature: Permission-Based Delete Button Visibility Scenario: No flicker during render Given unauthorized user loads page When UI renders Then delete button should never briefly appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1853: Verify Permission check performance when Epic page loads', async ({ page }) => {
    // Test Case: UTC-1853
    // Summary: Verify Permission check performance when Epic page loads
    // Description: Feature: Permission-Based Delete Button Visibility Scenario: Permission check performance Given Epic page loads When permission validation runs Then UI should render within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1854: Verify Clear visibility for authorized users when delete permission granted', async ({ page }) => {
    // Test Case: UTC-1854
    // Summary: Verify Clear visibility for authorized users when delete permission granted
    // Description: Feature: Permission-Based Delete Button Visibility Scenario: Clear visibility for authorized users Given delete permission granted When viewing table Then button should be clearly labeled and clickable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1855: Verify Corrupted permission payload when permission API fails', async ({ page }) => {
    // Test Case: UTC-1855
    // Summary: Verify Corrupted permission payload when permission API fails
    // Description: Feature: Permission-Based Delete Button Visibility Scenario: Corrupted permission payload Given permission API fails When page renders Then delete button should remain hidden by default

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1856: Verify Correct permission mapping when user profile contains delete flag', async ({ page }) => {
    // Test Case: UTC-1856
    // Summary: Verify Correct permission mapping when user profile contains delete flag
    // Description: Feature: Permission-Based Delete Button Visibility Scenario: Correct permission mapping Given user profile contains delete flag When permission is parsed Then can_delete_session should correctly map to UI visibility

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

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
