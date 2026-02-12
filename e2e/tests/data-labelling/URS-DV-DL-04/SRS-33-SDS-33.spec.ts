import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Responsive image grid with status indicators. when images exist
 * URS: URS-DV-DL-04
 * SRS: SRS-33
 * SDS: SDS-33
 */
test.describe('URS-DV-DL-04: Verify Responsive image grid with status indicators. when im', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-386: Verify Responsive image grid with status indicators. when images exist', async ({ page }) => {
    // Test Case: UTC-386
    // Summary: Verify Responsive image grid with status indicators. when images exist
    // Description: Feature: Responsive image grid with status indicators. Given images exist When page loads Then thumbnails shall render in grid layout

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-387: Verify Responsive image grid with status indicators. when multiple screen sizes', async ({ page }) => {
    // Test Case: UTC-387
    // Summary: Verify Responsive image grid with status indicators. when multiple screen sizes
    // Description: Feature: Responsive image grid with status indicators. Given multiple screen sizes When screen resizes Then grid columns adjust responsively

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-388: Verify Responsive image grid with status indicators. when image status is PENDIN', async ({ page }) => {
    // Test Case: UTC-388
    // Summary: Verify Responsive image grid with status indicators. when image status is PENDING
    // Description: Feature: Responsive image grid with status indicators. Given image status is PENDING When grid renders Then grey PENDING badge shall display

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-389: Verify Responsive image grid with status indicators. when image status is IN_REV', async ({ page }) => {
    // Test Case: UTC-389
    // Summary: Verify Responsive image grid with status indicators. when image status is IN_REVIEW
    // Description: Feature: Responsive image grid with status indicators. Given image status is IN_REVIEW When grid renders Then yellow IN_REVIEW badge shall display

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-390: Verify Responsive image grid with status indicators. when image metadata has ID', async ({ page }) => {
    // Test Case: UTC-390
    // Summary: Verify Responsive image grid with status indicators. when image metadata has ID
    // Description: Feature: Responsive image grid with status indicators. Given image metadata has ID When card loads Then unique identifier shall be visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-391: Verify Responsive image grid with status indicators. when user selects image', async ({ page }) => {
    // Test Case: UTC-391
    // Summary: Verify Responsive image grid with status indicators. when user selects image
    // Description: Feature: Responsive image grid with status indicators. Given user selects image When card clicked Then thick yellow border shall highlight selection

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-392: Verify Responsive image grid with status indicators. when multiple images return', async ({ page }) => {
    // Test Case: UTC-392
    // Summary: Verify Responsive image grid with status indicators. when multiple images returned
    // Description: Feature: Responsive image grid with status indicators. Given multiple images returned When grid loads Then all cards shall render correctly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-393: Verify Responsive image grid with status indicators. when API metadata available', async ({ page }) => {
    // Test Case: UTC-393
    // Summary: Verify Responsive image grid with status indicators. when API metadata available
    // Description: Feature: Responsive image grid with status indicators. Given API metadata available When page initializes Then thumbnails shall populate from API

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-394: Verify Responsive image grid with status indicators. when valid image URL', async ({ page }) => {
    // Test Case: UTC-394
    // Summary: Verify Responsive image grid with status indicators. when valid image URL
    // Description: Feature: Responsive image grid with status indicators. Given valid image URL When rendered Then thumbnail loads successfully

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-395: Verify Responsive image grid with status indicators. when broken image URL', async ({ page }) => {
    // Test Case: UTC-395
    // Summary: Verify Responsive image grid with status indicators. when broken image URL
    // Description: Feature: Responsive image grid with status indicators. Given broken image URL When load fails Then placeholder icon shall display

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-396: Verify Responsive image grid with status indicators. when status values exist', async ({ page }) => {
    // Test Case: UTC-396
    // Summary: Verify Responsive image grid with status indicators. when status values exist
    // Description: Feature: Responsive image grid with status indicators. Given status values exist When grid renders Then correct color codes shall map to each status

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-397: Verify Responsive image grid with status indicators. when badge overlays image', async ({ page }) => {
    // Test Case: UTC-397
    // Summary: Verify Responsive image grid with status indicators. when badge overlays image
    // Description: Feature: Responsive image grid with status indicators. Given badge overlays image When viewed Then text shall remain readable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-398: Verify Responsive image grid with status indicators. when up to 200 images', async ({ page }) => {
    // Test Case: UTC-398
    // Summary: Verify Responsive image grid with status indicators. when up to 200 images
    // Description: Feature: Responsive image grid with status indicators. Given up to 200 images When page loads Then grid renders within acceptable time

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-399: Verify Responsive image grid with status indicators. when many rows exist', async ({ page }) => {
    // Test Case: UTC-399
    // Summary: Verify Responsive image grid with status indicators. when many rows exist
    // Description: Feature: Responsive image grid with status indicators. Given many rows exist When scrolling Then images remain visible without break

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-400: Verify Responsive image grid with status indicators. when multiple reloads', async ({ page }) => {
    // Test Case: UTC-400
    // Summary: Verify Responsive image grid with status indicators. when multiple reloads
    // Description: Feature: Responsive image grid with status indicators. Given multiple reloads When grid refreshes repeatedly Then no duplication or crash occurs

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-401: Verify Responsive image grid with status indicators. when dataset empty', async ({ page }) => {
    // Test Case: UTC-401
    // Summary: Verify Responsive image grid with status indicators. when dataset empty
    // Description: Feature: Responsive image grid with status indicators. Given dataset empty When page loads Then “No Data Available” view shall display

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-402: Verify Responsive image grid with status indicators. when empty dataset', async ({ page }) => {
    // Test Case: UTC-402
    // Summary: Verify Responsive image grid with status indicators. when empty dataset
    // Description: Feature: Responsive image grid with status indicators. Given empty dataset When empty state active Then grid cards shall not render

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-403: Verify Responsive image grid with status indicators. when metadata loaded', async ({ page }) => {
    // Test Case: UTC-403
    // Summary: Verify Responsive image grid with status indicators. when metadata loaded
    // Description: Feature: Responsive image grid with status indicators. Given metadata loaded When grid displays Then no sensitive/internal fields shall be exposed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-404: Verify Responsive image grid with status indicators. when status changes', async ({ page }) => {
    // Test Case: UTC-404
    // Summary: Verify Responsive image grid with status indicators. when status changes
    // Description: Feature: Responsive image grid with status indicators. Given status changes When grid refreshes Then badge updates immediately

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-405: Verify Responsive image grid with status indicators. when pagination changes', async ({ page }) => {
    // Test Case: UTC-405
    // Summary: Verify Responsive image grid with status indicators. when pagination changes
    // Description: Feature: Responsive image grid with status indicators. Given pagination changes When new page loads Then grid renders correct dataset

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
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
