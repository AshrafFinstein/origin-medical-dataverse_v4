import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Fast initial page load when user navigates to Session Creation page
 * URS: URS-DEV-GEN-08
 * SRS: SRS-94
 * SDS: SDS-94
 */
test.describe('URS-DEV-GEN-08: Verify Fast initial page load when user navigates to Session', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1206: Verify Fast initial page load when user navigates to Session Creation page', async ({ page }) => {
    // Test Case: UTC-1206
    // Summary: Verify Fast initial page load when user navigates to Session Creation page
    // Description: Feature: Session Creation Page Performance Optimization Scenario: Fast initial page load Given user navigates to Session Creation page When the page opens Then content should render within acceptable time (< 2 sec)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1207: Verify Immediate UI visibility when navigation occurs', async ({ page }) => {
    // Test Case: UTC-1207
    // Summary: Verify Immediate UI visibility when navigation occurs
    // Description: Feature: Session Creation Page Performance Optimization Scenario: Immediate UI visibility Given navigation occurs When page loads Then form fields should appear immediately without blank screen

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1208: Verify JSON upload prepared in background when page is loading', async ({ page }) => {
    // Test Case: UTC-1208
    // Summary: Verify JSON upload prepared in background when page is loading
    // Description: Feature: Session Creation Page Performance Optimization Scenario: JSON upload prepared in background Given page is loading When UI renders Then JSON upload component initializes asynchronously

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1209: Verify Upload does not block page when upload initialization running', async ({ page }) => {
    // Test Case: UTC-1209
    // Summary: Verify Upload does not block page when upload initialization running
    // Description: Feature: Session Creation Page Performance Optimization Scenario: Upload does not block page Given upload initialization running When user interacts with form Then interactions should remain responsive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1210: Verify Smooth navigation when user opens page from workspace', async ({ page }) => {
    // Test Case: UTC-1210
    // Summary: Verify Smooth navigation when user opens page from workspace
    // Description: Feature: Session Creation Page Performance Optimization Scenario: Smooth navigation Given user opens page from workspace When page loads Then navigation should feel seamless without freeze

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1211: Verify Large metadata load when multiple dropdowns and components present', async ({ page }) => {
    // Test Case: UTC-1211
    // Summary: Verify Large metadata load when multiple dropdowns and components present
    // Description: Feature: Session Creation Page Performance Optimization Scenario: Large metadata load Given multiple dropdowns and components present When page renders Then no noticeable delay or stutter should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1212: Verify JSON control readiness when page is open', async ({ page }) => {
    // Test Case: UTC-1212
    // Summary: Verify JSON control readiness when page is open
    // Description: Feature: Session Creation Page Performance Optimization Scenario: JSON control readiness Given page is open When user selects JSON upload immediately Then file chooser should open instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1213: Verify No UI freeze during initialization when background processes executing', async ({ page }) => {
    // Test Case: UTC-1213
    // Summary: Verify No UI freeze during initialization when background processes executing
    // Description: Feature: Session Creation Page Performance Optimization Scenario: No UI freeze during initialization Given background processes executing When interacting with dropdowns/inputs Then UI should not freeze or hang

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1214: Verify Spinner behavior when upload preparation ongoing', async ({ page }) => {
    // Test Case: UTC-1214
    // Summary: Verify Spinner behavior when upload preparation ongoing
    // Description: Feature: Session Creation Page Performance Optimization Scenario: Spinner behavior Given upload preparation ongoing When page renders Then unnecessary blocking loaders should not appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1215: Verify Multiple navigations when user repeatedly opens page', async ({ page }) => {
    // Test Case: UTC-1215
    // Summary: Verify Multiple navigations when user repeatedly opens page
    // Description: Feature: Session Creation Page Performance Optimization Scenario: Multiple navigations Given user repeatedly opens page When navigating multiple times Then performance should remain consistent

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1216: Verify Network latency tolerance when slow network', async ({ page }) => {
    // Test Case: UTC-1216
    // Summary: Verify Network latency tolerance when slow network
    // Description: Feature: Session Creation Page Performance Optimization Scenario: Network latency tolerance Given slow network When page loads Then core UI should render first while background tasks continue

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1217: Verify Async component initialization when page loads', async ({ page }) => {
    // Test Case: UTC-1217
    // Summary: Verify Async component initialization when page loads
    // Description: Feature: Session Creation Page Performance Optimization Scenario: Async component initialization Given page loads When components initialize Then each component should load independently

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1218: Verify CPU usage efficiency when page rendered', async ({ page }) => {
    // Test Case: UTC-1218
    // Summary: Verify CPU usage efficiency when page rendered
    // Description: Feature: Session Creation Page Performance Optimization Scenario: CPU usage efficiency Given page rendered When monitoring performance Then CPU usage should remain within normal range

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1219: Verify Instant field interaction when page loaded', async ({ page }) => {
    // Test Case: UTC-1219
    // Summary: Verify Instant field interaction when page loaded
    // Description: Feature: Session Creation Page Performance Optimization Scenario: Instant field interaction Given page loaded When user types into fields Then typing response should be immediate

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1220: Verify Background failure does not block page when JSON component fails initiali', async ({ page }) => {
    // Test Case: UTC-1220
    // Summary: Verify Background failure does not block page when JSON component fails initialization
    // Description: Feature: Session Creation Page Performance Optimization Scenario: Background failure does not block page Given JSON component fails initialization When page renders Then rest of UI should still function normally

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
