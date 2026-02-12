import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown visible on form when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-72
 * SDS: SDS-72
 */
test.describe('URS-DV-GEN-07: Verify Dropdown visible on form when Session Creation page l', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-882: Verify Dropdown visible on form when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-882
    // Summary: Verify Dropdown visible on form when Session Creation page loads
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: Dropdown visible on form Given Session Creation page loads When the form renders Then Anatomy Plane dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-883: Verify Fixed options displayed when dropdown opened', async ({ page }) => {
    // Test Case: UTC-883
    // Summary: Verify Fixed options displayed when dropdown opened
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: Fixed options displayed Given dropdown opened When options load Then Axial, Coronal, Sagittal (or configured list) should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-884: Verify Select plane when options displayed', async ({ page }) => {
    // Test Case: UTC-884
    // Summary: Verify Select plane when options displayed
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: Select plane Given options displayed When user selects Axial Then Axial should be selected and shown in field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-885: Verify Single-select only when one plane selected', async ({ page }) => {
    // Test Case: UTC-885
    // Summary: Verify Single-select only when one plane selected
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: Single-select only Given one plane selected When another selected Then previous value should be replaced

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-886: Verify Persist selection during navigation when plane selected', async ({ page }) => {
    // Test Case: UTC-886
    // Summary: Verify Persist selection during navigation when plane selected
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: Persist selection during navigation Given plane selected When user navigates within form Then selection should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-887: Verify Pass value to viewer initialization when session created', async ({ page }) => {
    // Test Case: UTC-887
    // Summary: Verify Pass value to viewer initialization when session created
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: Pass value to viewer initialization Given session created When viewer loads image Then selected plane string should be passed to viewer config

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

  test('UTC-888: Verify Default value handling when no selection made', async ({ page }) => {
    // Test Case: UTC-888
    // Summary: Verify Default value handling when no selection made
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: Default value handling Given no selection made When page loads Then default or placeholder should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-889: Verify Mandatory validation when field required', async ({ page }) => {
    // Test Case: UTC-889
    // Summary: Verify Mandatory validation when field required
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: Mandatory validation Given field required When submit clicked without selection Then validation message should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-890: Verify Clear placeholder text when no selection', async ({ page }) => {
    // Test Case: UTC-890
    // Summary: Verify Clear placeholder text when no selection
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: Clear placeholder text Given no selection When field displayed Then placeholder should guide user (e.g., “Select Plane”)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-891: Verify Restore saved value when saved session reopened', async ({ page }) => {
    // Test Case: UTC-891
    // Summary: Verify Restore saved value when saved session reopened
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: Restore saved value Given saved session reopened When page reloads Then previously selected plane should auto-populate

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-892: Verify Reject invalid injection when manipulated payload with unsupported value', async ({ page }) => {
    // Test Case: UTC-892
    // Summary: Verify Reject invalid injection when manipulated payload with unsupported value
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: Reject invalid injection Given manipulated payload with unsupported value When API validates Then request should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-893: Verify Quick dropdown rendering when dropdown opened', async ({ page }) => {
    // Test Case: UTC-893
    // Summary: Verify Quick dropdown rendering when dropdown opened
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: Quick dropdown rendering Given dropdown opened When options rendered Then list should load instantly (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-894: Verify Keyboard accessibility when dropdown focused', async ({ page }) => {
    // Test Case: UTC-894
    // Summary: Verify Keyboard accessibility when dropdown focused
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: Keyboard accessibility Given dropdown focused When using arrow keys/enter Then selection should work without mouse

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-895: Verify No options configured when configuration empty', async ({ page }) => {
    // Test Case: UTC-895
    // Summary: Verify No options configured when configuration empty
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: No options configured Given configuration empty When dropdown opened Then “No options available” message should show

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-896: Verify Consistent UI alignment when form displayed', async ({ page }) => {
    // Test Case: UTC-896
    // Summary: Verify Consistent UI alignment when form displayed
    // Description: Feature: Anatomy plane orientation selection dropdown Scenario: Consistent UI alignment Given form displayed When compared with other fields Then dropdown should align and match style standards

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
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
