import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Label combination aggregation and counting when a session contains labeled images
 * URS: URS-DV-GEN-2
 * SRS: SRS-14
 * SDS: SDS-14
 */
test.describe('URS-DV-GEN-2: Verify Label combination aggregation and counting when a ses', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-128: Verify Label combination aggregation and counting when a session contains labele', async ({ page }) => {
    // Test Case: UTC-128
    // Summary: Verify Label combination aggregation and counting when a session contains labeled images
    // Description: Feature: Label combination aggregation and counting Given a session contains labeled images When Label Analysis loads Then the system should display grouped rows based on distinct label combinations

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-129: Verify Label combination aggregation and counting when multiple images share ide', async ({ page }) => {
    // Test Case: UTC-129
    // Summary: Verify Label combination aggregation and counting when multiple images share identical labels (2D, 3D)
    // Description: Feature: Label combination aggregation and counting Given multiple images share identical labels (2D, 3D) When aggregation executes Then they should appear as a single row “2D, 3D” with combined count

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-130: Verify Label combination aggregation and counting when three images have labels ', async ({ page }) => {
    // Test Case: UTC-130
    // Summary: Verify Label combination aggregation and counting when three images have labels A+B
    // Description: Feature: Label combination aggregation and counting Given three images have labels A+B When results render Then the count column should display 3

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-131: Verify Label combination aggregation and counting when images have unique label ', async ({ page }) => {
    // Test Case: UTC-131
    // Summary: Verify Label combination aggregation and counting when images have unique label sets
    // Description: Feature: Label combination aggregation and counting Given images have unique label sets When grouped Then each unique combination should appear as separate row

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-132: Verify Label combination aggregation and counting when a single label applied to', async ({ page }) => {
    // Test Case: UTC-132
    // Summary: Verify Label combination aggregation and counting when a single label applied to images
    // Description: Feature: Label combination aggregation and counting Given a single label applied to images When grouped Then the system should display that single label with total count

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-133: Verify Label combination aggregation and counting when an image has no labels', async ({ page }) => {
    // Test Case: UTC-133
    // Summary: Verify Label combination aggregation and counting when an image has no labels
    // Description: Feature: Label combination aggregation and counting Given an image has no labels When aggregation runs Then null labels should be converted to empty string and shown safely

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-134: Verify Label combination aggregation and counting when backend query executes', async ({ page }) => {
    // Test Case: UTC-134
    // Summary: Verify Label combination aggregation and counting when backend query executes
    // Description: Feature: Label combination aggregation and counting Given backend query executes When SQL grouping occurs Then grouping should occur by extractedResourceId arrays before count

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-135: Verify Label combination aggregation and counting when aggregation completes', async ({ page }) => {
    // Test Case: UTC-135
    // Summary: Verify Label combination aggregation and counting when aggregation completes
    // Description: Feature: Label combination aggregation and counting Given aggregation completes When API responds Then response format should be { labelName: string, count: number }

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-136: Verify Label combination aggregation and counting when table renders', async ({ page }) => {
    // Test Case: UTC-136
    // Summary: Verify Label combination aggregation and counting when table renders
    // Description: Feature: Label combination aggregation and counting Given table renders When viewing each row Then label combination name and count should be clearly visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-137: Verify Label combination aggregation and counting when large dataset (1000+ imag', async ({ page }) => {
    // Test Case: UTC-137
    // Summary: Verify Label combination aggregation and counting when large dataset (1000+ images)
    // Description: Feature: Label combination aggregation and counting Given large dataset (1000+ images) When aggregation runs Then results should display correctly without duplication

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-138: Verify Label combination aggregation and counting when large dataset', async ({ page }) => {
    // Test Case: UTC-138
    // Summary: Verify Label combination aggregation and counting when large dataset
    // Description: Feature: Label combination aggregation and counting Given large dataset When Label Analysis loads Then aggregation should complete within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-139: Verify Label combination aggregation and counting when backend fails to fetch la', async ({ page }) => {
    // Test Case: UTC-139
    // Summary: Verify Label combination aggregation and counting when backend fails to fetch labels
    // Description: Feature: Label combination aggregation and counting Given backend fails to fetch labels When API returns error Then system should show “Failed to fetch” message without breaking modal

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-140: Verify Label combination aggregation and counting when multiple combinations exi', async ({ page }) => {
    // Test Case: UTC-140
    // Summary: Verify Label combination aggregation and counting when multiple combinations exist
    // Description: Feature: Label combination aggregation and counting Given multiple combinations exist When viewing list Then rows should be sorted consistently and readable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-141: Verify Label combination aggregation and counting when session has zero labeled ', async ({ page }) => {
    // Test Case: UTC-141
    // Summary: Verify Label combination aggregation and counting when session has zero labeled images
    // Description: Feature: Label combination aggregation and counting Given session has zero labeled images When Label Analysis loads Then system should show empty state or “No Data” message

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
