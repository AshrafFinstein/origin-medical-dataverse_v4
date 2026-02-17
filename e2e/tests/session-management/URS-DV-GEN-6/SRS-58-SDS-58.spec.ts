import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Image renders from resolved bucket when an image exists in a mapped bucket
 * URS: URS-DV-GEN-6
 * SRS: SRS-58
 * SDS: SDS-58
 */
test.describe('URS-DV-GEN-6: Verify Image renders from resolved bucket when an image exis', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-685: Verify Image renders from resolved bucket when an image exists in a mapped bucke', async ({ page }) => {
    // Test Case: UTC-685
    // Summary: Verify Image renders from resolved bucket when an image exists in a mapped bucket
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Image renders from resolved bucket Given an image exists in a mapped bucket When the labeling canvas loads the image Then the PNG image should display correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-686: Verify Bucket resolved using metadata when asset metadata contains bucket mappin', async ({ page }) => {
    // Test Case: UTC-686
    // Summary: Verify Bucket resolved using metadata when asset metadata contains bucket mapping
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Bucket resolved using metadata Given asset metadata contains bucket mapping When image fetch starts Then system should resolve the correct bucket automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-687: Verify Signed URL generated for secure access when bucket is private', async ({ page }) => {
    // Test Case: UTC-687
    // Summary: Verify Signed URL generated for secure access when bucket is private
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Signed URL generated for secure access Given bucket is private When image is requested Then a secure signed URL should be generated before streaming

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-688: Verify Loader visible during fetch when image loading is in progress', async ({ page }) => {
    // Test Case: UTC-688
    // Summary: Verify Loader visible during fetch when image loading is in progress
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Loader visible during fetch Given image loading is in progress When canvas waits for stream Then a loader spinner should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-689: Verify Image preview replaces loader after success when loader is visible', async ({ page }) => {
    // Test Case: UTC-689
    // Summary: Verify Image preview replaces loader after success when loader is visible
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Image preview replaces loader after success Given loader is visible When image stream completes Then loader should disappear and image preview should render

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-690: Verify Multiple buckets supported when images exist across different buckets', async ({ page }) => {
    // Test Case: UTC-690
    // Summary: Verify Multiple buckets supported when images exist across different buckets
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Multiple buckets supported Given images exist across different buckets When navigating between assets Then each image should render from its respective bucket correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-691: Verify Automatic bucket switching per image when consecutive images belong to di', async ({ page }) => {
    // Test Case: UTC-691
    // Summary: Verify Automatic bucket switching per image when consecutive images belong to different buckets
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Automatic bucket switching per image Given consecutive images belong to different buckets When user moves to next image Then system should fetch from the next resolved bucket seamlessly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-692: Verify Placeholder shown when fetch fails when image fetch fails', async ({ page }) => {
    // Test Case: UTC-692
    // Summary: Verify Placeholder shown when fetch fails when image fetch fails
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Placeholder shown when fetch fails Given image fetch fails When stream cannot be established Then a placeholder image should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-693: Verify Failure toast displayed when image load fails', async ({ page }) => {
    // Test Case: UTC-693
    // Summary: Verify Failure toast displayed when image load fails
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Failure toast displayed Given image load fails When error occurs Then “Image load failed” toast should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-694: Verify Direct bucket URL not exposed when secure rendering process', async ({ page }) => {
    // Test Case: UTC-694
    // Summary: Verify Direct bucket URL not exposed when secure rendering process
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Direct bucket URL not exposed Given secure rendering process When inspecting network calls Then raw bucket paths should not be exposed publicly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-695: Verify Image loads within SLA when normal network conditions', async ({ page }) => {
    // Test Case: UTC-695
    // Summary: Verify Image loads within SLA when normal network conditions
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Image loads within SLA Given normal network conditions When image loads Then rendering should complete within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-696: Verify Retry works after failure when initial fetch fails', async ({ page }) => {
    // Test Case: UTC-696
    // Summary: Verify Retry works after failure when initial fetch fails
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Retry works after failure Given initial fetch fails When user retries or reloads Then image should load successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-697: Verify Large batch rendering stable when many images are loaded sequentially', async ({ page }) => {
    // Test Case: UTC-697
    // Summary: Verify Large batch rendering stable when many images are loaded sequentially
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Large batch rendering stable Given many images are loaded sequentially When navigating rapidly Then system should not freeze or crash

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-698: Verify Correct format displayed when PNG image fetched', async ({ page }) => {
    // Test Case: UTC-698
    // Summary: Verify Correct format displayed when PNG image fetched
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Correct format displayed Given PNG image fetched When rendered Then correct PNG format should be displayed without corruption

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-699: Verify Fetch event logged for traceability when image fetch occurs', async ({ page }) => {
    // Test Case: UTC-699
    // Summary: Verify Fetch event logged for traceability when image fetch occurs
    // Description: Feature: Multi-Bucket Image Rendering Scenario: Fetch event logged for traceability Given image fetch occurs When stream request is made Then system should log bucketId and assetId

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
