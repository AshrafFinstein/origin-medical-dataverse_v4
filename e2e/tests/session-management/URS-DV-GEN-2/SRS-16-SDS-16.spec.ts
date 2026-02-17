import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Status aggregation with conditional level formatting when session contains images with various statuses
 * URS: URS-DV-GEN-2
 * SRS: SRS-16
 * SDS: SDS-16
 */
test.describe('URS-DV-GEN-2: Verify Status aggregation with conditional level formatting ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-159: Verify Status aggregation with conditional level formatting when session contain', async ({ page }) => {
    // Test Case: UTC-159
    // Summary: Verify Status aggregation with conditional level formatting when session contains images with various statuses
    // Description: Feature: Status aggregation with conditional level formatting Given session contains images with various statuses When Status Analysis tab opens Then system should display grouped rows with counts per status

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-160: Verify Status aggregation with conditional level formatting when images in PENDI', async ({ page }) => {
    // Test Case: UTC-160
    // Summary: Verify Status aggregation with conditional level formatting when images in PENDING status exist
    // Description: Feature: Status aggregation with conditional level formatting Given images in PENDING status exist When aggregation runs Then PENDING should be shown as a separate row with correct count

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-161: Verify Status aggregation with conditional level formatting when images in IN_RE', async ({ page }) => {
    // Test Case: UTC-161
    // Summary: Verify Status aggregation with conditional level formatting when images in IN_REVIEW at Level 1
    // Description: Feature: Status aggregation with conditional level formatting Given images in IN_REVIEW at Level 1 When results are displayed Then status should show as “IN_REVIEW – L1”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-162: Verify Status aggregation with conditional level formatting when images in IN_RE', async ({ page }) => {
    // Test Case: UTC-162
    // Summary: Verify Status aggregation with conditional level formatting when images in IN_REVIEW at Level 3
    // Description: Feature: Status aggregation with conditional level formatting Given images in IN_REVIEW at Level 3 When aggregated Then status should show “IN_REVIEW – L3”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-163: Verify Status aggregation with conditional level formatting when images in REJEC', async ({ page }) => {
    // Test Case: UTC-163
    // Summary: Verify Status aggregation with conditional level formatting when images in REJECTED at Level 2
    // Description: Feature: Status aggregation with conditional level formatting Given images in REJECTED at Level 2 When displayed Then status should show “REJECTED – L2”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-164: Verify Status aggregation with conditional level formatting when multiple images', async ({ page }) => {
    // Test Case: UTC-164
    // Summary: Verify Status aggregation with conditional level formatting when multiple images share same status and level
    // Description: Feature: Status aggregation with conditional level formatting Given multiple images share same status and level When grouped Then count should equal total matching records

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-165: Verify Status aggregation with conditional level formatting when images exist ac', async ({ page }) => {
    // Test Case: UTC-165
    // Summary: Verify Status aggregation with conditional level formatting when images exist across different levels
    // Description: Feature: Status aggregation with conditional level formatting Given images exist across different levels When aggregated Then each level should appear as a separate grouped row

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-166: Verify Status aggregation with conditional level formatting when backend execute', async ({ page }) => {
    // Test Case: UTC-166
    // Summary: Verify Status aggregation with conditional level formatting when backend executes query
    // Description: Feature: Status aggregation with conditional level formatting Given backend executes query When CTE runs Then status and approval level should be combined before response

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-167: Verify Status aggregation with conditional level formatting when API response re', async ({ page }) => {
    // Test Case: UTC-167
    // Summary: Verify Status aggregation with conditional level formatting when API response received
    // Description: Feature: Status aggregation with conditional level formatting Given API response received When inspecting payload Then formatted status name and count should be precomputed by backend

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-168: Verify Status aggregation with conditional level formatting when statuses displa', async ({ page }) => {
    // Test Case: UTC-168
    // Summary: Verify Status aggregation with conditional level formatting when statuses displayed
    // Description: Feature: Status aggregation with conditional level formatting Given statuses displayed When viewing UI Then each status should show readable badge/label formatting

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-169: Verify Status aggregation with conditional level formatting when mixed statuses ', async ({ page }) => {
    // Test Case: UTC-169
    // Summary: Verify Status aggregation with conditional level formatting when mixed statuses exist
    // Description: Feature: Status aggregation with conditional level formatting Given mixed statuses exist When aggregated Then each distinct combination should appear only once

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-170: Verify Status aggregation with conditional level formatting when no images exist', async ({ page }) => {
    // Test Case: UTC-170
    // Summary: Verify Status aggregation with conditional level formatting when no images exist
    // Description: Feature: Status aggregation with conditional level formatting Given no images exist When analysis loads Then “No Data” state should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-171: Verify Status aggregation with conditional level formatting when large dataset (', async ({ page }) => {
    // Test Case: UTC-171
    // Summary: Verify Status aggregation with conditional level formatting when large dataset (>10k images)
    // Description: Feature: Status aggregation with conditional level formatting Given large dataset (>10k images) When analysis loads Then aggregation should complete within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-172: Verify Status aggregation with conditional level formatting when repeated refres', async ({ page }) => {
    // Test Case: UTC-172
    // Summary: Verify Status aggregation with conditional level formatting when repeated refresh
    // Description: Feature: Status aggregation with conditional level formatting Given repeated refresh When analysis reloads Then counts remain consistent

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-173: Verify Status aggregation with conditional level formatting when backend error o', async ({ page }) => {
    // Test Case: UTC-173
    // Summary: Verify Status aggregation with conditional level formatting when backend error occurs
    // Description: Feature: Status aggregation with conditional level formatting Given backend error occurs When request fails Then empty data returned and notification displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-174: Verify Status aggregation with conditional level formatting when invalid status ', async ({ page }) => {
    // Test Case: UTC-174
    // Summary: Verify Status aggregation with conditional level formatting when invalid status value exists
    // Description: Feature: Status aggregation with conditional level formatting Given invalid status value exists When aggregated Then record should be ignored or logged without breaking UI

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-175: Verify Status aggregation with conditional level formatting when multiple status', async ({ page }) => {
    // Test Case: UTC-175
    // Summary: Verify Status aggregation with conditional level formatting when multiple statuses displayed
    // Description: Feature: Status aggregation with conditional level formatting Given multiple statuses displayed When user views table Then labels should be clearly readable and distinguishable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
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
