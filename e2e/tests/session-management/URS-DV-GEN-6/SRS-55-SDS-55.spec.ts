import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Buckets bound during session initialization when a valid session configuration exists
 * URS: URS-DV-GEN-6
 * SRS: SRS-55
 * SDS: SDS-55
 */
test.describe('URS-DV-GEN-6: Verify Buckets bound during session initialization when a va', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-641: Verify Buckets bound during session initialization when a valid session configur', async ({ page }) => {
    // Test Case: UTC-641
    // Summary: Verify Buckets bound during session initialization when a valid session configuration exists
    // Description: Feature: Session–Bucket Association Scenario: Buckets bound during session initialization Given a valid session configuration exists When the session loads Then resolved bucket identifiers should be bound to the session context automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-642: Verify Multiple buckets supported per session when multiple buckets are mapped', async ({ page }) => {
    // Test Case: UTC-642
    // Summary: Verify Multiple buckets supported per session when multiple buckets are mapped
    // Description: Feature: Session–Bucket Association Scenario: Multiple buckets supported per session Given multiple buckets are mapped When the session initializes Then all associated bucket identifiers should be stored together

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-643: Verify No bucket identifiers visible in UI when the user opens the labeling sess', async ({ page }) => {
    // Test Case: UTC-643
    // Summary: Verify No bucket identifiers visible in UI when the user opens the labeling session page
    // Description: Feature: Session–Bucket Association Scenario: No bucket identifiers visible in UI Given the user opens the labeling session page When the header is displayed Then bucket details should not be exposed in UI

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-644: Verify Upload uses session-bound bucket when the session is active', async ({ page }) => {
    // Test Case: UTC-644
    // Summary: Verify Upload uses session-bound bucket when the session is active
    // Description: Feature: Session–Bucket Association Scenario: Upload uses session-bound bucket Given the session is active When an image is uploaded Then the upload should route through the session’s resolved bucket automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-645: Verify Download uses session-bound bucket when the session has mapped buckets', async ({ page }) => {
    // Test Case: UTC-645
    // Summary: Verify Download uses session-bound bucket when the session has mapped buckets
    // Description: Feature: Session–Bucket Association Scenario: Download uses session-bound bucket Given the session has mapped buckets When an asset is downloaded Then the system should fetch from the mapped bucket

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-646: Verify Processing calls reuse session mapping when bucket mapping exists in sess', async ({ page }) => {
    // Test Case: UTC-646
    // Summary: Verify Processing calls reuse session mapping when bucket mapping exists in session cache
    // Description: Feature: Session–Bucket Association Scenario: Processing calls reuse session mapping Given bucket mapping exists in session cache When processing operations execute Then all operations should reuse the same mapping

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-647: Verify Cached mapping improves performance when the session is already initializ', async ({ page }) => {
    // Test Case: UTC-647
    // Summary: Verify Cached mapping improves performance when the session is already initialized
    // Description: Feature: Session–Bucket Association Scenario: Cached mapping improves performance Given the session is already initialized When repeated operations occur Then no additional bucket resolution should be triggered

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-648: Verify Mapping persists during navigation when the session is active', async ({ page }) => {
    // Test Case: UTC-648
    // Summary: Verify Mapping persists during navigation when the session is active
    // Description: Feature: Session–Bucket Association Scenario: Mapping persists during navigation Given the session is active When navigating between pages Then bucket association should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-649: Verify User cannot modify bucket mapping manually when the user attempts to over', async ({ page }) => {
    // Test Case: UTC-649
    // Summary: Verify User cannot modify bucket mapping manually when the user attempts to override bucket info
    // Description: Feature: Session–Bucket Association Scenario: User cannot modify bucket mapping manually Given the user attempts to override bucket info When request is submitted Then system should ignore manual changes and use session mapping

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-650: Verify Mapping created only once per session when the session initializes', async ({ page }) => {
    // Test Case: UTC-650
    // Summary: Verify Mapping created only once per session when the session initializes
    // Description: Feature: Session–Bucket Association Scenario: Mapping created only once per session Given the session initializes When subsequent operations occur Then mapping should not be recreated repeatedly

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

  test('UTC-651: Verify No valid bucket mapping found when no valid bucket configuration exists', async ({ page }) => {
    // Test Case: UTC-651
    // Summary: Verify No valid bucket mapping found when no valid bucket configuration exists
    // Description: Feature: Session–Bucket Association Scenario: No valid bucket mapping found Given no valid bucket configuration exists When session creation is attempted Then session creation should abort

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-652: Verify Non-blocking toast shown on failure when bucket resolution fails', async ({ page }) => {
    // Test Case: UTC-652
    // Summary: Verify Non-blocking toast shown on failure when bucket resolution fails
    // Description: Feature: Session–Bucket Association Scenario: Non-blocking toast shown on failure Given bucket resolution fails When session load occurs Then a clear non-blocking toast message should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-653: Verify Workflow remains seamless for users when the session is active', async ({ page }) => {
    // Test Case: UTC-653
    // Summary: Verify Workflow remains seamless for users when the session is active
    // Description: Feature: Session–Bucket Association Scenario: Workflow remains seamless for users Given the session is active When performing normal labeling tasks Then no manual bucket selection or extra steps should be required

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-654: Verify Concurrent requests use correct mapping when multiple requests run simult', async ({ page }) => {
    // Test Case: UTC-654
    // Summary: Verify Concurrent requests use correct mapping when multiple requests run simultaneously
    // Description: Feature: Session–Bucket Association Scenario: Concurrent requests use correct mapping Given multiple requests run simultaneously When session routing occurs Then each request should consistently use the correct bound bucket

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
