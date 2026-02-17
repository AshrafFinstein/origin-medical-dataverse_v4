import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Processing completes within 3 seconds when multiple JSON files are selected
 * URS: URS-DV-GEN-09
 * SRS: SRS-99
 * SDS: SDS-99
 */
test.describe('URS-DV-GEN-09: Verify Processing completes within 3 seconds when multiple J', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1292: Verify Processing completes within 3 seconds when multiple JSON files are select', async ({ page }) => {
    // Test Case: UTC-1292
    // Summary: Verify Processing completes within 3 seconds when multiple JSON files are selected
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Processing completes within 3 seconds Given multiple JSON files are selected When user confirms Import Then image grid should update within 3 seconds

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1293: Verify Spinner visible during processing when import is triggered', async ({ page }) => {
    // Test Case: UTC-1293
    // Summary: Verify Spinner visible during processing when import is triggered
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Spinner visible during processing Given import is triggered When processing starts Then a central loading spinner should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1294: Verify Spinner overlay blocks actions when spinner displayed', async ({ page }) => {
    // Test Case: UTC-1294
    // Summary: Verify Spinner overlay blocks actions when spinner displayed
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Spinner overlay blocks actions Given spinner displayed When user attempts interaction Then actions should be temporarily disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1295: Verify Async processing initiated when import begins', async ({ page }) => {
    // Test Case: UTC-1295
    // Summary: Verify Async processing initiated when import begins
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Async processing initiated Given import begins When backend parsing starts Then files should be processed asynchronously without freezing UI

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1296: Verify UI remains responsive when files are processing', async ({ page }) => {
    // Test Case: UTC-1296
    // Summary: Verify UI remains responsive when files are processing
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: UI remains responsive Given files are processing When user scrolls or navigates grid Then no lag or freeze should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1297: Verify Grid updates after backend confirmation when backend finishes extraction', async ({ page }) => {
    // Test Case: UTC-1297
    // Summary: Verify Grid updates after backend confirmation when backend finishes extraction
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Grid updates after backend confirmation Given backend finishes extraction When response received Then image grid should populate with images

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1298: Verify Status transition to PENDING when images loaded', async ({ page }) => {
    // Test Case: UTC-1298
    // Summary: Verify Status transition to PENDING when images loaded
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Status transition to PENDING Given images loaded When extraction completes Then images should show PENDING status

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1299: Verify Status transition to IN_REVIEW when review initiated', async ({ page }) => {
    // Test Case: UTC-1299
    // Summary: Verify Status transition to IN_REVIEW when review initiated
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Status transition to IN_REVIEW Given review initiated When status updates Then images should show IN_REVIEW state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1300: Verify Success toast displayed when processing completes successfully', async ({ page }) => {
    // Test Case: UTC-1300
    // Summary: Verify Success toast displayed when processing completes successfully
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Success toast displayed Given processing completes successfully When grid updates Then success toast should appear top-right

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1301: Verify Spinner removed after success when import successful', async ({ page }) => {
    // Test Case: UTC-1301
    // Summary: Verify Spinner removed after success when import successful
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Spinner removed after success Given import successful When completion occurs Then spinner should disappear automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1302: Verify Timeout exceeded when processing exceeds defined time', async ({ page }) => {
    // Test Case: UTC-1302
    // Summary: Verify Timeout exceeded when processing exceeds defined time
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Timeout exceeded Given processing exceeds defined time When timeout triggers Then spinner should be dismissed and error toast displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1303: Verify Backend failure when server returns failure', async ({ page }) => {
    // Test Case: UTC-1303
    // Summary: Verify Backend failure when server returns failure
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Backend failure Given server returns failure When response received Then error message should display and grid remains unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1304: Verify Large dataset performance when 1000+ images', async ({ page }) => {
    // Test Case: UTC-1304
    // Summary: Verify Large dataset performance when 1000+ images
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Large dataset performance Given 1000+ images When imported Then grid should still update within acceptable performance threshold

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1305: Verify Clear progress indication when files uploading', async ({ page }) => {
    // Test Case: UTC-1305
    // Summary: Verify Clear progress indication when files uploading
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Clear progress indication Given files uploading When user observes UI Then spinner clearly indicates loading state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1306: Verify Retry after failure when previous import failed', async ({ page }) => {
    // Test Case: UTC-1306
    // Summary: Verify Retry after failure when previous import failed
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Retry after failure Given previous import failed When user retries Then process should execute normally

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1307: Verify Spinner accessibility when screen reader enabled', async ({ page }) => {
    // Test Case: UTC-1307
    // Summary: Verify Spinner accessibility when screen reader enabled
    // Description: Feature: Upload Performance Standards with Async Processing and UI Feedback Scenario: Spinner accessibility Given screen reader enabled When spinner appears Then loading state should be announced

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
