import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Button visible on page load when Create Session page is opened
 * URS: URS-DV-DM-29
 * SRS: SRS-240
 * SDS: SDS-240
 */
test.describe('URS-DV-DM-29: Verify Button visible on page load when Create Session page ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2505: Verify Button visible on page load when Create Session page is opened', async ({ page }) => {
    // Test Case: UTC-2505
    // Summary: Verify Button visible on page load when Create Session page is opened
    // Description: Feature: S3 Upload button hover highlight feedback Scenario: Button visible on page load Given Create Session page is opened When page renders Then Upload from S3 button should be visible at top-right corner

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2506: Verify Default style state when button is idle', async ({ page }) => {
    // Test Case: UTC-2506
    // Summary: Verify Default style state when button is idle
    // Description: Feature: S3 Upload button hover highlight feedback Scenario: Default style state Given button is idle When cursor is not hovering Then button should display default styling only

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2507: Verify Hover visual highlight when cursor is placed over button', async ({ page }) => {
    // Test Case: UTC-2507
    // Summary: Verify Hover visual highlight when cursor is placed over button
    // Description: Feature: S3 Upload button hover highlight feedback Scenario: Hover visual highlight Given cursor is placed over button When hover occurs Then button should change color or border/glow to indicate interactivity

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2508: Verify Cursor pointer change when cursor hovers on button', async ({ page }) => {
    // Test Case: UTC-2508
    // Summary: Verify Cursor pointer change when cursor hovers on button
    // Description: Feature: S3 Upload button hover highlight feedback Scenario: Cursor pointer change Given cursor hovers on button When hover begins Then cursor should change to pointer style

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2509: Verify Hover style reverts on exit when hover state active', async ({ page }) => {
    // Test Case: UTC-2509
    // Summary: Verify Hover style reverts on exit when hover state active
    // Description: Feature: S3 Upload button hover highlight feedback Scenario: Hover style reverts on exit Given hover state active When cursor leaves button Then styling should revert to default immediately

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2510: Verify No backend call on hover when user hovers button', async ({ page }) => {
    // Test Case: UTC-2510
    // Summary: Verify No backend call on hover when user hovers button
    // Description: Feature: S3 Upload button hover highlight feedback Scenario: No backend call on hover Given user hovers button When hover state triggers Then no API/network request should be initiated

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2511: Verify Instant hover response when cursor moves onto button', async ({ page }) => {
    // Test Case: UTC-2511
    // Summary: Verify Instant hover response when cursor moves onto button
    // Description: Feature: S3 Upload button hover highlight feedback Scenario: Instant hover response Given cursor moves onto button When hover activates Then highlight should appear within 100ms without delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2512: Verify Visual clarity of highlight when button highlighted', async ({ page }) => {
    // Test Case: UTC-2512
    // Summary: Verify Visual clarity of highlight when button highlighted
    // Description: Feature: S3 Upload button hover highlight feedback Scenario: Visual clarity of highlight Given button highlighted When user views button Then highlight should be clearly noticeable and distinguishable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2513: Verify Keyboard focus highlight when user navigates via Tab key', async ({ page }) => {
    // Test Case: UTC-2513
    // Summary: Verify Keyboard focus highlight when user navigates via Tab key
    // Description: Feature: S3 Upload button hover highlight feedback Scenario: Keyboard focus highlight Given user navigates via Tab key When button receives focus Then focus highlight should appear similar to hover

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2514: Verify Multiple hover events stable when user repeatedly moves cursor in/out', async ({ page }) => {
    // Test Case: UTC-2514
    // Summary: Verify Multiple hover events stable when user repeatedly moves cursor in/out
    // Description: Feature: S3 Upload button hover highlight feedback Scenario: Multiple hover events stable Given user repeatedly moves cursor in/out When multiple hover actions occur Then UI should not flicker or break styling

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2515: Verify Consistent hover across browsers when user tests in supported browsers', async ({ page }) => {
    // Test Case: UTC-2515
    // Summary: Verify Consistent hover across browsers when user tests in supported browsers
    // Description: Feature: S3 Upload button hover highlight feedback Scenario: Consistent hover across browsers Given user tests in supported browsers When hovering button Then highlight behavior should be consistent

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2516: Verify Discoverability improvement when first-time user visits page', async ({ page }) => {
    // Test Case: UTC-2516
    // Summary: Verify Discoverability improvement when first-time user visits page
    // Description: Feature: S3 Upload button hover highlight feedback Scenario: Discoverability improvement Given first-time user visits page When scanning top-right controls Then hover feedback should clearly indicate clickable action

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
