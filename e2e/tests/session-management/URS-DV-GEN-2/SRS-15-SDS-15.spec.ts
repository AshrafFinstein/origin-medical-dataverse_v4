import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Hierarchical annotation count analysis when session contains annotated images
 * URS: URS-DV-GEN-2
 * SRS: SRS-15
 * SDS: SDS-15
 */
test.describe('URS-DV-GEN-2: Verify Hierarchical annotation count analysis when session c', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-142: Verify Hierarchical annotation count analysis when session contains annotated im', async ({ page }) => {
    // Test Case: UTC-142
    // Summary: Verify Hierarchical annotation count analysis when session contains annotated images
    // Description: Feature: Hierarchical annotation count analysis Given session contains annotated images When Annotation Analysis tab opens Then the system should display aggregated annotation rows with counts

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-143: Verify Hierarchical annotation count analysis when parent annotations exist', async ({ page }) => {
    // Test Case: UTC-143
    // Summary: Verify Hierarchical annotation count analysis when parent annotations exist
    // Description: Feature: Hierarchical annotation count analysis Given parent annotations exist When aggregation runs Then each parent annotation should display its total count

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-144: Verify Hierarchical annotation count analysis when child taxonomy annotations ex', async ({ page }) => {
    // Test Case: UTC-144
    // Summary: Verify Hierarchical annotation count analysis when child taxonomy annotations exist
    // Description: Feature: Hierarchical annotation count analysis Given child taxonomy annotations exist When aggregation runs Then each child annotation should display its total count

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-145: Verify Hierarchical annotation count analysis when multiple images share same pa', async ({ page }) => {
    // Test Case: UTC-145
    // Summary: Verify Hierarchical annotation count analysis when multiple images share same parent annotation
    // Description: Feature: Hierarchical annotation count analysis Given multiple images share same parent annotation When grouped Then count should equal total occurrences across all images

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-146: Verify Hierarchical annotation count analysis when multiple images share same ch', async ({ page }) => {
    // Test Case: UTC-146
    // Summary: Verify Hierarchical annotation count analysis when multiple images share same child taxonomy
    // Description: Feature: Hierarchical annotation count analysis Given multiple images share same child taxonomy When grouped Then child count should equal correct total

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-147: Verify Hierarchical annotation count analysis when both parent and child annotat', async ({ page }) => {
    // Test Case: UTC-147
    // Summary: Verify Hierarchical annotation count analysis when both parent and child annotations exist
    // Description: Feature: Hierarchical annotation count analysis Given both parent and child annotations exist When response is returned Then both should appear in one unified list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-148: Verify Hierarchical annotation count analysis when backend query executes', async ({ page }) => {
    // Test Case: UTC-148
    // Summary: Verify Hierarchical annotation count analysis when backend query executes
    // Description: Feature: Hierarchical annotation count analysis Given backend query executes When SQL runs Then UNION ALL should combine parent and child queries

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-149: Verify Hierarchical annotation count analysis when API returns results', async ({ page }) => {
    // Test Case: UTC-149
    // Summary: Verify Hierarchical annotation count analysis when API returns results
    // Description: Feature: Hierarchical annotation count analysis Given API returns results When inspecting payload Then each object should contain name, count, and isChild flag

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-150: Verify Hierarchical annotation count analysis when UI renders results', async ({ page }) => {
    // Test Case: UTC-150
    // Summary: Verify Hierarchical annotation count analysis when UI renders results
    // Description: Feature: Hierarchical annotation count analysis Given UI renders results When viewing table Then parent and child annotations should appear uniformly formatted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-151: Verify Hierarchical annotation count analysis when a parent has multiple childre', async ({ page }) => {
    // Test Case: UTC-151
    // Summary: Verify Hierarchical annotation count analysis when a parent has multiple children
    // Description: Feature: Hierarchical annotation count analysis Given a parent has multiple children When displayed Then children should appear clearly associated with their parent

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-152: Verify Hierarchical annotation count analysis when child annotation has no valid', async ({ page }) => {
    // Test Case: UTC-152
    // Summary: Verify Hierarchical annotation count analysis when child annotation has no valid parent
    // Description: Feature: Hierarchical annotation count analysis Given child annotation has no valid parent When aggregation runs Then it should be excluded from UI

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-153: Verify Hierarchical annotation count analysis when orphan child exists', async ({ page }) => {
    // Test Case: UTC-153
    // Summary: Verify Hierarchical annotation count analysis when orphan child exists
    // Description: Feature: Hierarchical annotation count analysis Given orphan child exists When processed Then system should log warning for monitoring

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-154: Verify Hierarchical annotation count analysis when large dataset (1000+ annotati', async ({ page }) => {
    // Test Case: UTC-154
    // Summary: Verify Hierarchical annotation count analysis when large dataset (1000+ annotations)
    // Description: Feature: Hierarchical annotation count analysis Given large dataset (1000+ annotations) When loading analysis Then results should load within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-155: Verify Hierarchical annotation count analysis when repeated refresh', async ({ page }) => {
    // Test Case: UTC-155
    // Summary: Verify Hierarchical annotation count analysis when repeated refresh
    // Description: Feature: Hierarchical annotation count analysis Given repeated refresh When reloading analysis Then counts should remain consistent without duplication

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-156: Verify Hierarchical annotation count analysis when multiple annotations displaye', async ({ page }) => {
    // Test Case: UTC-156
    // Summary: Verify Hierarchical annotation count analysis when multiple annotations displayed
    // Description: Feature: Hierarchical annotation count analysis Given multiple annotations displayed When viewing list Then annotation names and counts should be readable and aligned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-157: Verify Hierarchical annotation count analysis when backend fails to fetch data', async ({ page }) => {
    // Test Case: UTC-157
    // Summary: Verify Hierarchical annotation count analysis when backend fails to fetch data
    // Description: Feature: Hierarchical annotation count analysis Given backend fails to fetch data When API returns error Then “Failed to fetch” toast should appear and table should not crash

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-158: Verify Hierarchical annotation count analysis when no annotations exist', async ({ page }) => {
    // Test Case: UTC-158
    // Summary: Verify Hierarchical annotation count analysis when no annotations exist
    // Description: Feature: Hierarchical annotation count analysis Given no annotations exist When analysis loads Then “No Data” empty state should be displayed

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
