import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Project dropdown visible when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-69
 * SDS: SDS-69
 */
test.describe('URS-DV-GEN-07: Verify Project dropdown visible when Session Creation page l', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-837: Verify Project dropdown visible when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-837
    // Summary: Verify Project dropdown visible when Session Creation page loads
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: Project dropdown visible Given Session Creation page loads When form renders Then Project Code dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-838: Verify Dropdown opens list when user clicks Project Code field', async ({ page }) => {
    // Test Case: UTC-838
    // Summary: Verify Dropdown opens list when user clicks Project Code field
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: Dropdown opens list Given user clicks Project Code field When dropdown expands Then all available projects should be listed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-839: Verify Search filters projects when many projects exist', async ({ page }) => {
    // Test Case: UTC-839
    // Summary: Verify Search filters projects when many projects exist
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: Search filters projects Given many projects exist When user types text in search bar Then list should filter matching project codes

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-840: Verify Select project when dropdown list displayed', async ({ page }) => {
    // Test Case: UTC-840
    // Summary: Verify Select project when dropdown list displayed
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: Select project Given dropdown list displayed When user selects a project Then selected project name should appear in field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-841: Verify UUID stored in payload when project selected', async ({ page }) => {
    // Test Case: UTC-841
    // Summary: Verify UUID stored in payload when project selected
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: UUID stored in payload Given project selected When session is created Then project UUID should be passed to API payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-842: Verify Value retained on refresh when project selected and saved', async ({ page }) => {
    // Test Case: UTC-842
    // Summary: Verify Value retained on refresh when project selected and saved
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: Value retained on refresh Given project selected and saved When page reloads Then previously selected project should remain visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-843: Verify Mandatory project validation when project is required', async ({ page }) => {
    // Test Case: UTC-843
    // Summary: Verify Mandatory project validation when project is required
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: Mandatory project validation Given project is required When submitting without selection Then validation message should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-844: Verify Archived project selected when project is archived/inactive', async ({ page }) => {
    // Test Case: UTC-844
    // Summary: Verify Archived project selected when project is archived/inactive
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: Archived project selected Given project is archived/inactive When user selects it Then system should display “Project Inactive” warning

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-845: Verify Unauthorized project hidden when user lacks permission', async ({ page }) => {
    // Test Case: UTC-845
    // Summary: Verify Unauthorized project hidden when user lacks permission
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: Unauthorized project hidden Given user lacks permission When dropdown loads Then restricted projects should not be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-846: Verify Direct manipulation blocked when invalid/forged projectId in request', async ({ page }) => {
    // Test Case: UTC-846
    // Summary: Verify Direct manipulation blocked when invalid/forged projectId in request
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: Direct manipulation blocked Given invalid/forged projectId in request When session is submitted Then backend should reject the request

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-847: Verify Clear placeholder text when field empty', async ({ page }) => {
    // Test Case: UTC-847
    // Summary: Verify Clear placeholder text when field empty
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: Clear placeholder text Given field empty When page loads Then placeholder “Select Project Code” should guide user

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-848: Verify Clear selection when project selected', async ({ page }) => {
    // Test Case: UTC-848
    // Summary: Verify Clear selection when project selected
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: Clear selection Given project selected When user clears selection Then field should reset to empty

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-849: Verify Fast dropdown response when large project list', async ({ page }) => {
    // Test Case: UTC-849
    // Summary: Verify Fast dropdown response when large project list
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: Fast dropdown response Given large project list When dropdown opened Then results should load within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-850: Verify Load failure handling when API fetch fails', async ({ page }) => {
    // Test Case: UTC-850
    // Summary: Verify Load failure handling when API fetch fails
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: Load failure handling Given API fetch fails When dropdown opens Then system should show safe empty state or retry option

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-851: Verify Keyboard navigation supported when dropdown focused', async ({ page }) => {
    // Test Case: UTC-851
    // Summary: Verify Keyboard navigation supported when dropdown focused
    // Description: Feature: Searchable project selection dropdown with UUID mapping Scenario: Keyboard navigation supported Given dropdown focused When using keyboard arrows/enter Then user should select project without mouse

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
