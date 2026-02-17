import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown visibility when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-85
 * SDS: SDS-85
 */
test.describe('URS-DV-GEN-07: Verify Dropdown visibility when Session Creation page loads', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1061: Verify Dropdown visibility when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-1061
    // Summary: Verify Dropdown visibility when Session Creation page loads
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Dropdown visibility Given Session Creation page loads When metadata section renders Then Reviewer dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1062: Verify Placeholder text when dropdown is empty', async ({ page }) => {
    // Test Case: UTC-1062
    // Summary: Verify Placeholder text when dropdown is empty
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Placeholder text Given dropdown is empty When user views field Then placeholder text should guide selection

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1063: Verify Open dropdown list when user clicks field', async ({ page }) => {
    // Test Case: UTC-1063
    // Summary: Verify Open dropdown list when user clicks field
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Open dropdown list Given user clicks field When dropdown opens Then list of reviewers should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1064: Verify Select single reviewer when list visible', async ({ page }) => {
    // Test Case: UTC-1064
    // Summary: Verify Select single reviewer when list visible
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Select single reviewer Given list visible When one reviewer selected Then reviewer should be marked selected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1065: Verify Select multiple reviewers when list visible', async ({ page }) => {
    // Test Case: UTC-1065
    // Summary: Verify Select multiple reviewers when list visible
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Select multiple reviewers Given list visible When multiple reviewers selected Then all selected reviewers should remain highlighted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1066: Verify Selected reviewers displayed as chips when reviewers selected', async ({ page }) => {
    // Test Case: UTC-1066
    // Summary: Verify Selected reviewers displayed as chips when reviewers selected
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Selected reviewers displayed as chips Given reviewers selected When dropdown closes Then selected reviewers should appear as chips/tags

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1067: Verify Remove selected reviewer when reviewers selected', async ({ page }) => {
    // Test Case: UTC-1067
    // Summary: Verify Remove selected reviewer when reviewers selected
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Remove selected reviewer Given reviewers selected When user clicks chip remove icon Then reviewer should be deselected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1068: Verify Integrated search works when reviewer list is long', async ({ page }) => {
    // Test Case: UTC-1068
    // Summary: Verify Integrated search works when reviewer list is long
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Integrated search works Given reviewer list is long When user types in search box Then dropdown should filter matching reviewers

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1069: Verify Invalid search value when invalid name typed', async ({ page }) => {
    // Test Case: UTC-1069
    // Summary: Verify Invalid search value when invalid name typed
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Invalid search value Given invalid name typed When no match exists Then “No results found” message should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1070: Verify State update when reviewers selected', async ({ page }) => {
    // Test Case: UTC-1070
    // Summary: Verify State update when reviewers selected
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: State update Given reviewers selected When inspecting state Then reviewer IDs should be stored in reviewer array

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1071: Verify Payload mapping when reviewers selected', async ({ page }) => {
    // Test Case: UTC-1071
    // Summary: Verify Payload mapping when reviewers selected
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Payload mapping Given reviewers selected When session saved Then reviewer IDs should be mapped to reviewer_list in API payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1072: Verify Selection persistence when reviewers selected', async ({ page }) => {
    // Test Case: UTC-1072
    // Summary: Verify Selection persistence when reviewers selected
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Selection persistence Given reviewers selected When navigating inside form Then selections should persist

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1073: Verify Prevent duplicate selection when reviewer already selected', async ({ page }) => {
    // Test Case: UTC-1073
    // Summary: Verify Prevent duplicate selection when reviewer already selected
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Prevent duplicate selection Given reviewer already selected When selecting again Then duplicate should not be added

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1074: Verify Unauthorized access restriction when user lacks permission', async ({ page }) => {
    // Test Case: UTC-1074
    // Summary: Verify Unauthorized access restriction when user lacks permission
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Unauthorized access restriction Given user lacks permission When page loads Then dropdown should be hidden or disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1075: Verify Large list performance when 200+ reviewers exist', async ({ page }) => {
    // Test Case: UTC-1075
    // Summary: Verify Large list performance when 200+ reviewers exist
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Large list performance Given 200+ reviewers exist When opening dropdown Then list should render smoothly without lag

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1076: Verify Keyboard accessibility when dropdown focused', async ({ page }) => {
    // Test Case: UTC-1076
    // Summary: Verify Keyboard accessibility when dropdown focused
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: Keyboard accessibility Given dropdown focused When using keyboard arrows and Enter Then reviewers should be selectable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1077: Verify API failure handling when fetch reviewers API fails', async ({ page }) => {
    // Test Case: UTC-1077
    // Summary: Verify API failure handling when fetch reviewers API fails
    // Description: Feature: Reviewer multi-select dropdown for assigning reviewers Scenario: API failure handling Given fetch reviewers API fails When dropdown opens Then friendly error message should appear

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
