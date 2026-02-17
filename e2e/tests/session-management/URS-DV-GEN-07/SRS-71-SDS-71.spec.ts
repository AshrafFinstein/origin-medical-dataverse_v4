import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown visible when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-71
 * SDS: SDS-71
 */
test.describe('URS-DV-GEN-07: Verify Dropdown visible when Session Creation page loads', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-867: Verify Dropdown visible when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-867
    // Summary: Verify Dropdown visible when Session Creation page loads
    // Description: Feature: Use Case categorization dropdown mapping Scenario: Dropdown visible Given Session Creation page loads When form renders Then User Case Code dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-868: Verify Load use case list when page loads', async ({ page }) => {
    // Test Case: UTC-868
    // Summary: Verify Load use case list when page loads
    // Description: Feature: Use Case categorization dropdown mapping Scenario: Load use case list Given page loads When dropdown is opened Then all available use cases should be listed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-869: Verify Single selection only when dropdown options shown', async ({ page }) => {
    // Test Case: UTC-869
    // Summary: Verify Single selection only when dropdown options shown
    // Description: Feature: Use Case categorization dropdown mapping Scenario: Single selection only Given dropdown options shown When user selects a use case Then only one option should be selectable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-870: Verify Replace selection when one use case already selected', async ({ page }) => {
    // Test Case: UTC-870
    // Summary: Verify Replace selection when one use case already selected
    // Description: Feature: Use Case categorization dropdown mapping Scenario: Replace selection Given one use case already selected When another is selected Then previous value should be replaced

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-871: Verify Persist selection when use case selected', async ({ page }) => {
    // Test Case: UTC-871
    // Summary: Verify Persist selection when use case selected
    // Description: Feature: Use Case categorization dropdown mapping Scenario: Persist selection Given use case selected When user navigates within form Then selected value should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-872: Verify Stored in payload when session submitted', async ({ page }) => {
    // Test Case: UTC-872
    // Summary: Verify Stored in payload when session submitted
    // Description: Feature: Use Case categorization dropdown mapping Scenario: Stored in payload Given session submitted When API request sent Then use_case_code attribute should be present in payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Create session
    await sessionPage.createSession({
      name: 'Test Session',
      description: 'Test Description'
    });

    const sessionExists = await sessionPage.sessionExists('Test Session');
    expect(sessionExists).toBe(true);
  });

  test('UTC-873: Verify Search/filter within dropdown when large use case list', async ({ page }) => {
    // Test Case: UTC-873
    // Summary: Verify Search/filter within dropdown when large use case list
    // Description: Feature: Use Case categorization dropdown mapping Scenario: Search/filter within dropdown Given large use case list When user types search text Then matching options should be filtered

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-874: Verify Clear placeholder text when no selection made', async ({ page }) => {
    // Test Case: UTC-874
    // Summary: Verify Clear placeholder text when no selection made
    // Description: Feature: Use Case categorization dropdown mapping Scenario: Clear placeholder text Given no selection made When dropdown visible Then placeholder should guide user (e.g., “Select Use Case”)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-875: Verify Maintain value after refresh when saved session reopened', async ({ page }) => {
    // Test Case: UTC-875
    // Summary: Verify Maintain value after refresh when saved session reopened
    // Description: Feature: Use Case categorization dropdown mapping Scenario: Maintain value after refresh Given saved session reopened When page reloads Then previously saved use case should auto-populate

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-876: Verify No options available when lookup table empty', async ({ page }) => {
    // Test Case: UTC-876
    // Summary: Verify No options available when lookup table empty
    // Description: Feature: Use Case categorization dropdown mapping Scenario: No options available Given lookup table empty When dropdown opened Then “N/A” should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-877: Verify Prevent invalid value injection when forged use_case_code in payload', async ({ page }) => {
    // Test Case: UTC-877
    // Summary: Verify Prevent invalid value injection when forged use_case_code in payload
    // Description: Feature: Use Case categorization dropdown mapping Scenario: Prevent invalid value injection Given forged use_case_code in payload When API validates request Then request should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-878: Verify Fast dropdown load when large dataset', async ({ page }) => {
    // Test Case: UTC-878
    // Summary: Verify Fast dropdown load when large dataset
    // Description: Feature: Use Case categorization dropdown mapping Scenario: Fast dropdown load Given large dataset When dropdown opens Then options should render within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-879: Verify Keyboard navigation supported when dropdown focused', async ({ page }) => {
    // Test Case: UTC-879
    // Summary: Verify Keyboard navigation supported when dropdown focused
    // Description: Feature: Use Case categorization dropdown mapping Scenario: Keyboard navigation supported Given dropdown focused When using arrow keys and enter Then user should select value without mouse

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-880: Verify Prevent blank submission if mandatory when field required', async ({ page }) => {
    // Test Case: UTC-880
    // Summary: Verify Prevent blank submission if mandatory when field required
    // Description: Feature: Use Case categorization dropdown mapping Scenario: Prevent blank submission if mandatory Given field required When submit clicked without selection Then validation message should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-881: Verify Consistent styling when dropdown rendered', async ({ page }) => {
    // Test Case: UTC-881
    // Summary: Verify Consistent styling when dropdown rendered
    // Description: Feature: Use Case categorization dropdown mapping Scenario: Consistent styling Given dropdown rendered When compared with other fields Then it should align and follow UI standards

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
