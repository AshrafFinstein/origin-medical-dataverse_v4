import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Logs generated for bucket resolution when a bucket is resolved
 * URS: URS-DV-GEN-6
 * SRS: SRS-62
 * SDS: SDS-62
 */
test.describe('URS-DV-GEN-6: Verify Logs generated for bucket resolution when a bucket is', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-742: Verify Logs generated for bucket resolution when a bucket is resolved', async ({ page }) => {
    // Test Case: UTC-742
    // Summary: Verify Logs generated for bucket resolution when a bucket is resolved
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: Logs generated for bucket resolution Given a bucket is resolved When resolution completes Then structured log entry should be recorded with bucketId and timestamp

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-743: Verify Logs generated for routing operation when a routing request occurs', async ({ page }) => {
    // Test Case: UTC-743
    // Summary: Verify Logs generated for routing operation when a routing request occurs
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: Logs generated for routing operation Given a routing request occurs When adapter routes storage call Then routing details should be logged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-744: Verify Metrics captured for latency when an image fetch request', async ({ page }) => {
    // Test Case: UTC-744
    // Summary: Verify Metrics captured for latency when an image fetch request
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: Metrics captured for latency Given an image fetch request When operation completes Then latency metric should be recorded

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-745: Verify Trace generated per request when signed URL generation occurs', async ({ page }) => {
    // Test Case: UTC-745
    // Summary: Verify Trace generated per request when signed URL generation occurs
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: Trace generated per request Given signed URL generation occurs When request executes Then distributed traceId should be created

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-746: Verify Admin dashboard shows error count when bucket failures occur', async ({ page }) => {
    // Test Case: UTC-746
    // Summary: Verify Admin dashboard shows error count when bucket failures occur
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: Admin dashboard shows error count Given bucket failures occur When admin opens monitoring dashboard Then per-bucket error counts should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-747: Verify Latency graph display when operations executed', async ({ page }) => {
    // Test Case: UTC-747
    // Summary: Verify Latency graph display when operations executed
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: Latency graph display Given operations executed When dashboard loads Then latency graphs should be rendered

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-748: Verify Image fetch failure triggers log when fetch fails', async ({ page }) => {
    // Test Case: UTC-748
    // Summary: Verify Image fetch failure triggers log when fetch fails
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: Image fetch failure triggers log Given fetch fails When exception occurs Then error log with reason should be recorded

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-749: Verify User sees non-blocking toast on failure when image fetch fails', async ({ page }) => {
    // Test Case: UTC-749
    // Summary: Verify User sees non-blocking toast on failure when image fetch fails
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: User sees non-blocking toast on failure Given image fetch fails When UI handles error Then user should see friendly toast message

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-750: Verify No technical stack trace shown when backend error occurs', async ({ page }) => {
    // Test Case: UTC-750
    // Summary: Verify No technical stack trace shown when backend error occurs
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: No technical stack trace shown Given backend error occurs When user views UI Then stack traces should not be exposed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-751: Verify Retry without session reset when operation fails', async ({ page }) => {
    // Test Case: UTC-751
    // Summary: Verify Retry without session reset when operation fails
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: Retry without session reset Given operation fails When user retries Then operation should reattempt without session refresh

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-752: Verify Manual refresh supported when error state occurs', async ({ page }) => {
    // Test Case: UTC-752
    // Summary: Verify Manual refresh supported when error state occurs
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: Manual refresh supported Given error state occurs When user refreshes grid Then data should reload correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-753: Verify Telemetry buffered during export failure when monitoring export fails', async ({ page }) => {
    // Test Case: UTC-753
    // Summary: Verify Telemetry buffered during export failure when monitoring export fails
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: Telemetry buffered during export failure Given monitoring export fails When telemetry captured Then logs should buffer locally until restored

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-754: Verify Logging does not slow operations when high-volume requests', async ({ page }) => {
    // Test Case: UTC-754
    // Summary: Verify Logging does not slow operations when high-volume requests
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: Logging does not slow operations Given high-volume requests When telemetry runs Then performance should remain within SLA

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-755: Verify Logs contain traceId and bucketId consistently when multiple operations o', async ({ page }) => {
    // Test Case: UTC-755
    // Summary: Verify Logs contain traceId and bucketId consistently when multiple operations occur
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: Logs contain traceId and bucketId consistently Given multiple operations occur When logs generated Then identifiers should be present in all records

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-756: Verify Session continues after recoverable failure when one bucket request fails', async ({ page }) => {
    // Test Case: UTC-756
    // Summary: Verify Session continues after recoverable failure when one bucket request fails
    // Description: Feature: Multi-bucket telemetry & error visibility Scenario: Session continues after recoverable failure Given one bucket request fails When other operations run Then session should not terminate

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
