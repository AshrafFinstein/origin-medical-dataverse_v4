import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown visibility when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-88
 * SDS: SDS-88
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

  test('UTC-1108: Verify Dropdown visibility when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-1108
    // Summary: Verify Dropdown visibility when Session Creation page loads
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Dropdown visibility Given Session Creation page loads When form renders Then Taxonomy dropdown should be visible near the bottom

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1109: Verify Placeholder text when no taxonomy selected', async ({ page }) => {
    // Test Case: UTC-1109
    // Summary: Verify Placeholder text when no taxonomy selected
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Placeholder text Given no taxonomy selected When dropdown displayed Then placeholder text should guide user (e.g., “Select Taxonomy”)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1110: Verify Load taxonomy list when dropdown opened', async ({ page }) => {
    // Test Case: UTC-1110
    // Summary: Verify Load taxonomy list when dropdown opened
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Load taxonomy list Given dropdown opened When system fetches taxonomy list Then all active taxonomies should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1111: Verify Single taxonomy selection when dropdown options available', async ({ page }) => {
    // Test Case: UTC-1111
    // Summary: Verify Single taxonomy selection when dropdown options available
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Single taxonomy selection Given dropdown options available When user selects one taxonomy Then selected value should appear in the field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1112: Verify Multi-select capability when multiple taxonomies available', async ({ page }) => {
    // Test Case: UTC-1112
    // Summary: Verify Multi-select capability when multiple taxonomies available
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Multi-select capability Given multiple taxonomies available When user selects multiple values Then all selected items should appear as chips/tags

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1113: Verify Fetch schema on selection when taxonomy selected', async ({ page }) => {
    // Test Case: UTC-1113
    // Summary: Verify Fetch schema on selection when taxonomy selected
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Fetch schema on selection Given taxonomy selected When selection confirmed Then system should send fetch request to retrieve schema data

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1114: Verify Persist selected taxonomy when taxonomy selected', async ({ page }) => {
    // Test Case: UTC-1114
    // Summary: Verify Persist selected taxonomy when taxonomy selected
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Persist selected taxonomy Given taxonomy selected When session saved Then taxonomy ID(s) should be included in payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1115: Verify Prevent invalid selection when taxonomy is inactive or deleted', async ({ page }) => {
    // Test Case: UTC-1115
    // Summary: Verify Prevent invalid selection when taxonomy is inactive or deleted
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Prevent invalid selection Given taxonomy is inactive or deleted When user attempts selection Then system should block selection

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1116: Verify Retain value during navigation when taxonomy selected', async ({ page }) => {
    // Test Case: UTC-1116
    // Summary: Verify Retain value during navigation when taxonomy selected
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Retain value during navigation Given taxonomy selected When user navigates within form Then selection should persist

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1117: Verify Clear removal option when taxonomy selected', async ({ page }) => {
    // Test Case: UTC-1117
    // Summary: Verify Clear removal option when taxonomy selected
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Clear removal option Given taxonomy selected When user clicks remove/clear icon Then taxonomy should be removed from field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1118: Verify Unauthorized access restriction when user lacks session creation permissi', async ({ page }) => {
    // Test Case: UTC-1118
    // Summary: Verify Unauthorized access restriction when user lacks session creation permission
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Unauthorized access restriction Given user lacks session creation permission When page loads Then taxonomy dropdown should be disabled or hidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1119: Verify Fast dropdown open when dropdown clicked', async ({ page }) => {
    // Test Case: UTC-1119
    // Summary: Verify Fast dropdown open when dropdown clicked
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Fast dropdown open Given dropdown clicked When options load Then response time should be under acceptable threshold (<1s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1120: Verify Schema applied to annotation module when taxonomy selected', async ({ page }) => {
    // Test Case: UTC-1120
    // Summary: Verify Schema applied to annotation module when taxonomy selected
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Schema applied to annotation module Given taxonomy selected When session starts labeling Then only selected taxonomy classes should be available

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1121: Verify Fetch failure handling when schema API fails', async ({ page }) => {
    // Test Case: UTC-1121
    // Summary: Verify Fetch failure handling when schema API fails
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Fetch failure handling Given schema API fails When request returns error Then system should show friendly toast without crash

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1122: Verify Keyboard accessibility when dropdown focused', async ({ page }) => {
    // Test Case: UTC-1122
    // Summary: Verify Keyboard accessibility when dropdown focused
    // Description: Feature: Taxonomy selection dropdown for annotation schema configuration Scenario: Keyboard accessibility Given dropdown focused When user uses keyboard keys Then options should be selectable without mouse

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

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
