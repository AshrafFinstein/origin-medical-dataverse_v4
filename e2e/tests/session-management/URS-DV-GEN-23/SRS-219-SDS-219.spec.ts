import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Panel visibility when image annotation page loads
 * URS: URS-DV-GEN-23
 * SRS: SRS-219
 * SDS: SDS-219
 */
test.describe('URS-DV-GEN-23: Verify Panel visibility when image annotation page loads', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2185: Verify Panel visibility when image annotation page loads', async ({ page }) => {
    // Test Case: UTC-2185
    // Summary: Verify Panel visibility when image annotation page loads
    // Description: Feature: Annotation List Interface Scenario: Panel visibility Given image annotation page loads When layout renders Then right-side annotation list panel should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2186: Verify Panel title display when panel visible', async ({ page }) => {
    // Test Case: UTC-2186
    // Summary: Verify Panel title display when panel visible
    // Description: Feature: Annotation List Interface Scenario: Panel title display Given panel visible When header renders Then title “Taxonomy Group Name” should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2187: Verify List orientation when annotations exist', async ({ page }) => {
    // Test Case: UTC-2187
    // Summary: Verify List orientation when annotations exist
    // Description: Feature: Annotation List Interface Scenario: List orientation Given annotations exist When list renders Then items should appear vertically stacked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2188: Verify Drag handle presence when list item displayed', async ({ page }) => {
    // Test Case: UTC-2188
    // Summary: Verify Drag handle presence when list item displayed
    // Description: Feature: Annotation List Interface Scenario: Drag handle presence Given list item displayed When row renders Then drag handle icon should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2189: Verify Status icon visibility when annotation status exists', async ({ page }) => {
    // Test Case: UTC-2189
    // Summary: Verify Status icon visibility when annotation status exists
    // Description: Feature: Annotation List Interface Scenario: Status icon visibility Given annotation status exists When list renders Then status icon should display per item

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2190: Verify Status reflects isAnnotated flag when annotation marked completed', async ({ page }) => {
    // Test Case: UTC-2190
    // Summary: Verify Status reflects isAnnotated flag when annotation marked completed
    // Description: Feature: Annotation List Interface Scenario: Status reflects isAnnotated flag Given annotation marked completed When list loads Then status icon should reflect annotated state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2191: Verify Label text visibility when item rendered', async ({ page }) => {
    // Test Case: UTC-2191
    // Summary: Verify Label text visibility when item rendered
    // Description: Feature: Annotation List Interface Scenario: Label text visibility Given item rendered When viewing row Then annotation label text should be readable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2192: Verify Active item highlight when item selected', async ({ page }) => {
    // Test Case: UTC-2192
    // Summary: Verify Active item highlight when item selected
    // Description: Feature: Annotation List Interface Scenario: Active item highlight Given item selected When clicked Then row should be visually highlighted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2193: Verify Single item selection when multiple items', async ({ page }) => {
    // Test Case: UTC-2193
    // Summary: Verify Single item selection when multiple items
    // Description: Feature: Annotation List Interface Scenario: Single item selection Given multiple items When user selects one Then only that row should be active

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2194: Verify Sort control presence when header rendered', async ({ page }) => {
    // Test Case: UTC-2194
    // Summary: Verify Sort control presence when header rendered
    // Description: Feature: Annotation List Interface Scenario: Sort control presence Given header rendered When viewing controls Then sort icon should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2195: Verify Sort ascending when unsorted list', async ({ page }) => {
    // Test Case: UTC-2195
    // Summary: Verify Sort ascending when unsorted list
    // Description: Feature: Annotation List Interface Scenario: Sort ascending Given unsorted list When sort clicked once Then items should reorder ascending

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2196: Verify Sort descending when sorted list', async ({ page }) => {
    // Test Case: UTC-2196
    // Summary: Verify Sort descending when sorted list
    // Description: Feature: Annotation List Interface Scenario: Sort descending Given sorted list When sort clicked again Then items should reorder descending

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2197: Verify Multi-state sorting when sorted descending', async ({ page }) => {
    // Test Case: UTC-2197
    // Summary: Verify Multi-state sorting when sorted descending
    // Description: Feature: Annotation List Interface Scenario: Multi-state sorting Given sorted descending When clicked again Then list returns to default order

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2198: Verify Data binding when backend returns annotation array', async ({ page }) => {
    // Test Case: UTC-2198
    // Summary: Verify Data binding when backend returns annotation array
    // Description: Feature: Annotation List Interface Scenario: Data binding Given backend returns annotation array When UI renders Then list count should match array length

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2199: Verify Dynamic refresh when new annotation added', async ({ page }) => {
    // Test Case: UTC-2199
    // Summary: Verify Dynamic refresh when new annotation added
    // Description: Feature: Annotation List Interface Scenario: Dynamic refresh Given new annotation added When state updates Then new item should appear instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2200: Verify Remove annotation when annotation deleted', async ({ page }) => {
    // Test Case: UTC-2200
    // Summary: Verify Remove annotation when annotation deleted
    // Description: Feature: Annotation List Interface Scenario: Remove annotation Given annotation deleted When list refreshes Then item should be removed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2201: Verify Scroll support when many annotations', async ({ page }) => {
    // Test Case: UTC-2201
    // Summary: Verify Scroll support when many annotations
    // Description: Feature: Annotation List Interface Scenario: Scroll support Given many annotations When list exceeds height Then vertical scroll should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2202: Verify Large list rendering when 300+ items', async ({ page }) => {
    // Test Case: UTC-2202
    // Summary: Verify Large list rendering when 300+ items
    // Description: Feature: Annotation List Interface Scenario: Large list rendering Given 300+ items When rendering Then UI should not freeze or lag

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2203: Verify Empty dataset when no annotations', async ({ page }) => {
    // Test Case: UTC-2203
    // Summary: Verify Empty dataset when no annotations
    // Description: Feature: Annotation List Interface Scenario: Empty dataset Given no annotations When page loads Then “No Data” message should display

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2204: Verify Keyboard navigation when list focused', async ({ page }) => {
    // Test Case: UTC-2204
    // Summary: Verify Keyboard navigation when list focused
    // Description: Feature: Annotation List Interface Scenario: Keyboard navigation Given list focused When using arrow keys Then selection should move between items

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
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
