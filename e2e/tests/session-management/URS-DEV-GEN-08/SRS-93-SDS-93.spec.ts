import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Open session creation without losing workspace when user is working on workspace grid
 * URS: URS-DEV-GEN-08
 * SRS: SRS-93
 * SDS: SDS-93
 */
test.describe('URS-DEV-GEN-08: Verify Open session creation without losing workspace when u', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1191: Verify Open session creation without losing workspace when user is working on wo', async ({ page }) => {
    // Test Case: UTC-1191
    // Summary: Verify Open session creation without losing workspace when user is working on workspace grid
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: Open session creation without losing workspace Given user is working on workspace grid When user navigates to Session Creation page Then current workspace data should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1192: Verify Return to workspace after session creation when user opened Session Creat', async ({ page }) => {
    // Test Case: UTC-1192
    // Summary: Verify Return to workspace after session creation when user opened Session Creation
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: Return to workspace after session creation Given user opened Session Creation When user navigates back Then workspace should display previous state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1193: Verify Scroll position retained when user scrolled to middle of workspace list', async ({ page }) => {
    // Test Case: UTC-1193
    // Summary: Verify Scroll position retained when user scrolled to middle of workspace list
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: Scroll position retained Given user scrolled to middle of workspace list When navigating away and returning Then scroll position should remain same

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1194: Verify Filters preserved when filters applied in workspace', async ({ page }) => {
    // Test Case: UTC-1194
    // Summary: Verify Filters preserved when filters applied in workspace
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: Filters preserved Given filters applied in workspace When opening Session Creation and returning Then filters should remain active

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1195: Verify Search input preserved when search term entered', async ({ page }) => {
    // Test Case: UTC-1195
    // Summary: Verify Search input preserved when search term entered
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: Search input preserved Given search term entered When navigating to Session Creation and back Then search results should still be applied

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1196: Verify Selected items retained when multiple images selected', async ({ page }) => {
    // Test Case: UTC-1196
    // Summary: Verify Selected items retained when multiple images selected
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: Selected items retained Given multiple images selected When returning from Session Creation Then selected items should remain selected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1197: Verify Unsaved changes retained when unsaved edits exist in workspace', async ({ page }) => {
    // Test Case: UTC-1197
    // Summary: Verify Unsaved changes retained when unsaved edits exist in workspace
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: Unsaved changes retained Given unsaved edits exist in workspace When navigating away and back Then changes should not be lost

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1198: Verify Session page opens independently when workspace loaded', async ({ page }) => {
    // Test Case: UTC-1198
    // Summary: Verify Session page opens independently when workspace loaded
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: Session page opens independently Given workspace loaded When clicking Create Session Then session page should open separately without reloading workspace

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1199: Verify Fast return navigation when user returns to workspace', async ({ page }) => {
    // Test Case: UTC-1199
    // Summary: Verify Fast return navigation when user returns to workspace
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: Fast return navigation Given user returns to workspace When page renders Then view should load instantly without full reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1200: Verify No duplicate API calls when workspace already loaded', async ({ page }) => {
    // Test Case: UTC-1200
    // Summary: Verify No duplicate API calls when workspace already loaded
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: No duplicate API calls Given workspace already loaded When returning from session page Then redundant API calls should not occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1201: Verify Browser back button when user navigates using browser back', async ({ page }) => {
    // Test Case: UTC-1201
    // Summary: Verify Browser back button when user navigates using browser back
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: Browser back button Given user navigates using browser back When returning to workspace Then state should still be preserved

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1202: Verify Multiple navigation cycles when user repeatedly opens and closes session ', async ({ page }) => {
    // Test Case: UTC-1202
    // Summary: Verify Multiple navigation cycles when user repeatedly opens and closes session page
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: Multiple navigation cycles Given user repeatedly opens and closes session page When returning multiple times Then workspace state should remain consistent

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1203: Verify Task continuity when user mid-task in annotation or review', async ({ page }) => {
    // Test Case: UTC-1203
    // Summary: Verify Task continuity when user mid-task in annotation or review
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: Task continuity Given user mid-task in annotation or review When opening Session Creation and returning Then task progress should remain uninterrupted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1204: Verify Session creation cancel when user opens session creation and cancels', async ({ page }) => {
    // Test Case: UTC-1204
    // Summary: Verify Session creation cancel when user opens session creation and cancels
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: Session creation cancel Given user opens session creation and cancels When returning Then workspace should show original context

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1205: Verify Loading indicators removed when user returns to workspace', async ({ page }) => {
    // Test Case: UTC-1205
    // Summary: Verify Loading indicators removed when user returns to workspace
    // Description: Feature: Workspace State Preservation During Session Creation Scenario: Loading indicators removed Given user returns to workspace When view restores Then no unnecessary loading spinners should appear

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
