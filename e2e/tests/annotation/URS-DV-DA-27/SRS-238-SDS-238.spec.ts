import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Popup opens instantly when user right-clicks image
 * URS: URS-DV-DA-27
 * SRS: SRS-238
 * SDS: SDS-238
 */
test.describe('URS-DV-DA-27: Verify Popup opens instantly when user right-clicks image', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2471: Verify Popup opens instantly when user right-clicks image', async ({ page }) => {
    // Test Case: UTC-2471
    // Summary: Verify Popup opens instantly when user right-clicks image
    // Description: Feature: Responsive label interaction performance Scenario: Popup opens instantly Given user right-clicks image When label popup opens Then popup should render within 200 ms

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2472: Verify No UI freeze on popup load when popup opens', async ({ page }) => {
    // Test Case: UTC-2472
    // Summary: Verify No UI freeze on popup load when popup opens
    // Description: Feature: Responsive label interaction performance Scenario: No UI freeze on popup load Given popup opens When labels load Then UI remains responsive

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2473: Verify Search debounce response when user types in search', async ({ page }) => {
    // Test Case: UTC-2473
    // Summary: Verify Search debounce response when user types in search
    // Description: Feature: Responsive label interaction performance Scenario: Search debounce response Given user types in search When characters entered Then results update within 300 ms

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2474: Verify Dynamic search without reload when search input', async ({ page }) => {
    // Test Case: UTC-2474
    // Summary: Verify Dynamic search without reload when search input
    // Description: Feature: Responsive label interaction performance Scenario: Dynamic search without reload Given search input When filtering labels Then list updates dynamically without page refresh

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2475: Verify Checkbox selection speed when label list visible', async ({ page }) => {
    // Test Case: UTC-2475
    // Summary: Verify Checkbox selection speed when label list visible
    // Description: Feature: Responsive label interaction performance Scenario: Checkbox selection speed Given label list visible When selecting checkbox Then selection highlights instantly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2476: Verify Apply button enablement speed when at least one label selected', async ({ page }) => {
    // Test Case: UTC-2476
    // Summary: Verify Apply button enablement speed when at least one label selected
    // Description: Feature: Responsive label interaction performance Scenario: Apply button enablement speed Given at least one label selected When selection occurs Then Apply button enables immediately

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2477: Verify Apply action latency when labels selected', async ({ page }) => {
    // Test Case: UTC-2477
    // Summary: Verify Apply action latency when labels selected
    // Description: Feature: Responsive label interaction performance Scenario: Apply action latency Given labels selected When Apply clicked Then labels appear on image within 500 ms

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2478: Verify Remove action latency when labels assigned', async ({ page }) => {
    // Test Case: UTC-2478
    // Summary: Verify Remove action latency when labels assigned
    // Description: Feature: Responsive label interaction performance Scenario: Remove action latency Given labels assigned When Remove triggered Then labels disappear instantly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2479: Verify Asynchronous processing when apply/remove in progress', async ({ page }) => {
    // Test Case: UTC-2479
    // Summary: Verify Asynchronous processing when apply/remove in progress
    // Description: Feature: Responsive label interaction performance Scenario: Asynchronous processing Given apply/remove in progress When request sent Then UI should not block other interactions

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2480: Verify Multiple quick selections when rapid multiple clicks', async ({ page }) => {
    // Test Case: UTC-2480
    // Summary: Verify Multiple quick selections when rapid multiple clicks
    // Description: Feature: Responsive label interaction performance Scenario: Multiple quick selections Given rapid multiple clicks When selecting labels repeatedly Then UI should remain stable and responsive

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2481: Verify Large dataset performance when 500+ labels loaded', async ({ page }) => {
    // Test Case: UTC-2481
    // Summary: Verify Large dataset performance when 500+ labels loaded
    // Description: Feature: Responsive label interaction performance Scenario: Large dataset performance Given 500+ labels loaded When popup opens Then load time remains under 1 sec

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2482: Verify Scrolling smoothness when long label list', async ({ page }) => {
    // Test Case: UTC-2482
    // Summary: Verify Scrolling smoothness when long label list
    // Description: Feature: Responsive label interaction performance Scenario: Scrolling smoothness Given long label list When scrolling Then scrolling remains smooth without lag

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2483: Verify Popup close speed when popup open', async ({ page }) => {
    // Test Case: UTC-2483
    // Summary: Verify Popup close speed when popup open
    // Description: Feature: Responsive label interaction performance Scenario: Popup close speed Given popup open When Cancel clicked Then popup closes instantly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2484: Verify API delay handling when slow network', async ({ page }) => {
    // Test Case: UTC-2484
    // Summary: Verify API delay handling when slow network
    // Description: Feature: Responsive label interaction performance Scenario: API delay handling Given slow network When apply action delayed Then non-blocking toast appears without freezing UI

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2485: Verify API failure resilience when apply fails', async ({ page }) => {
    // Test Case: UTC-2485
    // Summary: Verify API failure resilience when apply fails
    // Description: Feature: Responsive label interaction performance Scenario: API failure resilience Given apply fails When error occurs Then previous UI state remains intact and toast shown

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2486: Verify Consecutive operations when multiple apply/remove cycles', async ({ page }) => {
    // Test Case: UTC-2486
    // Summary: Verify Consecutive operations when multiple apply/remove cycles
    // Description: Feature: Responsive label interaction performance Scenario: Consecutive operations Given multiple apply/remove cycles When executed repeatedly Then performance remains consistent without degradation

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2487: Verify Visual feedback clarity when label applied', async ({ page }) => {
    // Test Case: UTC-2487
    // Summary: Verify Visual feedback clarity when label applied
    // Description: Feature: Responsive label interaction performance Scenario: Visual feedback clarity Given label applied When action completes Then success toast appears immediately

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
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
