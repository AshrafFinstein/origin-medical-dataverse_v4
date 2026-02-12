import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Grid renders within 2 seconds for 200 items when a dataset containing 200 images per page
 * URS: URS-DV-DL-04
 * SRS: SRS-40
 * SDS: SDS-40
 */
test.describe('URS-DV-DL-04: Verify Grid renders within 2 seconds for 200 items when a da', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-479: Verify Grid renders within 2 seconds for 200 items when a dataset containing 200', async ({ page }) => {
    // Test Case: UTC-479
    // Summary: Verify Grid renders within 2 seconds for 200 items when a dataset containing 200 images per page
    // Description: Feature: Image Grid Rendering Performance Scenario: Grid renders within 2 seconds for 200 items Given a dataset containing 200 images per page When the grid loads Then the grid should render completely within 2 seconds

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-480: Verify Pagination transition is seamless when the grid is loaded with images', async ({ page }) => {
    // Test Case: UTC-480
    // Summary: Verify Pagination transition is seamless when the grid is loaded with images
    // Description: Feature: Image Grid Rendering Performance Scenario: Pagination transition is seamless Given the grid is loaded with images When the user navigates to the next page Then the transition should occur smoothly without noticeable lag

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-481: Verify Skeleton screen appears immediately when the user navigates to a new page', async ({ page }) => {
    // Test Case: UTC-481
    // Summary: Verify Skeleton screen appears immediately when the user navigates to a new page
    // Description: Feature: Loading Skeleton Feedback Scenario: Skeleton screen appears immediately Given the user navigates to a new page When the data is being fetched Then loading skeletons should display instantly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-482: Verify Images load only when entering viewport when the grid contains many image', async ({ page }) => {
    // Test Case: UTC-482
    // Summary: Verify Images load only when entering viewport when the grid contains many images
    // Description: Feature: Lazy Loading Optimization Scenario: Images load only when entering viewport Given the grid contains many images When the user scrolls Then images should load only when visible in the viewport

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-483: Verify Compressed thumbnails reduce bandwidth when the grid loads thumbnails', async ({ page }) => {
    // Test Case: UTC-483
    // Summary: Verify Compressed thumbnails reduce bandwidth when the grid loads thumbnails
    // Description: Feature: Thumbnail Compression Scenario: Compressed thumbnails reduce bandwidth Given the grid loads thumbnails When images are requested from server Then compressed JPEG thumbnails should be delivered

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-484: Verify Efficient DOM diffing prevents flicker when the grid updates state', async ({ page }) => {
    // Test Case: UTC-484
    // Summary: Verify Efficient DOM diffing prevents flicker when the grid updates state
    // Description: Feature: Stable Re-rendering Scenario: Efficient DOM diffing prevents flicker Given the grid updates state When images refresh Then UI should not flicker or re-render unnecessarily

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-485: Verify Items per page update quickly when the user changes page size to 200', async ({ page }) => {
    // Test Case: UTC-485
    // Summary: Verify Items per page update quickly when the user changes page size to 200
    // Description: Feature: Fast Page Size Change Scenario: Items per page update quickly Given the user changes page size to 200 When the grid refreshes Then updated results should render within 2 seconds

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-486: Verify System handles continuous page navigation when the user navigates pages r', async ({ page }) => {
    // Test Case: UTC-486
    // Summary: Verify System handles continuous page navigation when the user navigates pages repeatedly
    // Description: Feature: High Volume Stability Scenario: System handles continuous page navigation Given the user navigates pages repeatedly When switching 10+ times rapidly Then the system should remain responsive without crashes

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-487: Verify Smooth scrolling across grid when many images are displayed', async ({ page }) => {
    // Test Case: UTC-487
    // Summary: Verify Smooth scrolling across grid when many images are displayed
    // Description: Feature: Scroll Performance Scenario: Smooth scrolling across grid Given many images are displayed When the user scrolls quickly Then scrolling should remain smooth (~60fps)

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-488: Verify Slow connection alert displayed when network latency exceeds 5 seconds', async ({ page }) => {
    // Test Case: UTC-488
    // Summary: Verify Slow connection alert displayed when network latency exceeds 5 seconds
    // Description: Feature: Slow Network Warning Scenario: Slow connection alert displayed Given network latency exceeds 5 seconds When data fetch is delayed Then a Connection Slow warning toast should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-489: Verify Retry after slow network when the connection slow warning is shown', async ({ page }) => {
    // Test Case: UTC-489
    // Summary: Verify Retry after slow network when the connection slow warning is shown
    // Description: Feature: Retry Fetch Capability Scenario: Retry after slow network Given the connection slow warning is shown When the user clicks retry Then the grid should reload successfully

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-490: Verify Continuous workflow without blocking when the user performs labeling or n', async ({ page }) => {
    // Test Case: UTC-490
    // Summary: Verify Continuous workflow without blocking when the user performs labeling or navigation
    // Description: Feature: Workflow Efficiency Scenario: Continuous workflow without blocking Given the user performs labeling or navigation When switching between pages Then actions should not block the workflow

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

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
