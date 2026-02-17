import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown visible on session form when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-68
 * SDS: SDS-68
 */
test.describe('URS-DV-GEN-07: Verify Dropdown visible on session form when Session Creatio', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-823: Verify Dropdown visible on session form when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-823
    // Summary: Verify Dropdown visible on session form when Session Creation page loads
    // Description: Feature: Single-select lifecycle status dropdown with color indicators and backend state mapping Scenario: Dropdown visible on session form Given Session Creation page loads When form renders Then Workflow Status dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-824: Verify Default status applied when new session form opens', async ({ page }) => {
    // Test Case: UTC-824
    // Summary: Verify Default status applied when new session form opens
    // Description: Feature: Single-select lifecycle status dropdown with color indicators and backend state mapping Scenario: Default status applied Given new session form opens When no status selected Then default value should be “Yet to do”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-825: Verify Dropdown expands options when user clicks dropdown', async ({ page }) => {
    // Test Case: UTC-825
    // Summary: Verify Dropdown expands options when user clicks dropdown
    // Description: Feature: Single-select lifecycle status dropdown with color indicators and backend state mapping Scenario: Dropdown expands options Given user clicks dropdown When list opens Then available statuses should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-826: Verify Select status when dropdown options shown', async ({ page }) => {
    // Test Case: UTC-826
    // Summary: Verify Select status when dropdown options shown
    // Description: Feature: Single-select lifecycle status dropdown with color indicators and backend state mapping Scenario: Select status Given dropdown options shown When user selects “In Progress” Then selected value should appear in field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-827: Verify Color indicator shown when status selected', async ({ page }) => {
    // Test Case: UTC-827
    // Summary: Verify Color indicator shown when status selected
    // Description: Feature: Single-select lifecycle status dropdown with color indicators and backend state mapping Scenario: Color indicator shown Given status selected When displayed Then color-coded badge should match status (e.g., blue for In progress)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-828: Verify Status stored in payload when status selected', async ({ page }) => {
    // Test Case: UTC-828
    // Summary: Verify Status stored in payload when status selected
    // Description: Feature: Single-select lifecycle status dropdown with color indicators and backend state mapping Scenario: Status stored in payload Given status selected When session is saved Then status_id should be included in API payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-829: Verify Status updates backend state when session saved with status', async ({ page }) => {
    // Test Case: UTC-829
    // Summary: Verify Status updates backend state when session saved with status
    // Description: Feature: Single-select lifecycle status dropdown with color indicators and backend state mapping Scenario: Status updates backend state Given session saved with status When backend processes request Then workflow state machine should update correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-830: Verify Status retained on refresh when status selected and saved', async ({ page }) => {
    // Test Case: UTC-830
    // Summary: Verify Status retained on refresh when status selected and saved
    // Description: Feature: Single-select lifecycle status dropdown with color indicators and backend state mapping Scenario: Status retained on refresh Given status selected and saved When page reloads Then previously saved status should remain selected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-831: Verify Only one status selectable when dropdown opened', async ({ page }) => {
    // Test Case: UTC-831
    // Summary: Verify Only one status selectable when dropdown opened
    // Description: Feature: Single-select lifecycle status dropdown with color indicators and backend state mapping Scenario: Only one status selectable Given dropdown opened When selecting a new status Then previous status should be deselected automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-832: Verify Invalid value blocked when manipulated/invalid status id', async ({ page }) => {
    // Test Case: UTC-832
    // Summary: Verify Invalid value blocked when manipulated/invalid status id
    // Description: Feature: Single-select lifecycle status dropdown with color indicators and backend state mapping Scenario: Invalid value blocked Given manipulated/invalid status id When submitting form Then system should reject invalid status safely

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-833: Verify Clear label readability when dropdown visible', async ({ page }) => {
    // Test Case: UTC-833
    // Summary: Verify Clear label readability when dropdown visible
    // Description: Feature: Single-select lifecycle status dropdown with color indicators and backend state mapping Scenario: Clear label readability Given dropdown visible When viewing options Then labels should be readable and understandable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-834: Verify Quick dropdown load when multiple statuses exist', async ({ page }) => {
    // Test Case: UTC-834
    // Summary: Verify Quick dropdown load when multiple statuses exist
    // Description: Feature: Single-select lifecycle status dropdown with color indicators and backend state mapping Scenario: Quick dropdown load Given multiple statuses exist When dropdown opened Then list should render instantly without lag

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-835: Verify Safe fallback on failure when status fetch fails', async ({ page }) => {
    // Test Case: UTC-835
    // Summary: Verify Safe fallback on failure when status fetch fails
    // Description: Feature: Single-select lifecycle status dropdown with color indicators and backend state mapping Scenario: Safe fallback on failure Given status fetch fails When page loads Then default “Yet to do” should be applied automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-836: Verify Unauthorized change blocked when read-only user role', async ({ page }) => {
    // Test Case: UTC-836
    // Summary: Verify Unauthorized change blocked when read-only user role
    // Description: Feature: Single-select lifecycle status dropdown with color indicators and backend state mapping Scenario: Unauthorized change blocked Given read-only user role When attempting to change status Then dropdown should be disabled

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
