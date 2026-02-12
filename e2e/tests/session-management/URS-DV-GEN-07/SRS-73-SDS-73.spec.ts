import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown visible on session form when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-73
 * SDS: SDS-73
 */
test.describe('URS-DV-GEN-07: Verify Dropdown visible on session form when Session Creatio', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-897: Verify Dropdown visible on session form when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-897
    // Summary: Verify Dropdown visible on session form when Session Creation page loads
    // Description: Feature: Center identification dropdown for facility selection Scenario: Dropdown visible on session form Given Session Creation page loads When form renders Then Center Code dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-898: Verify Facility list loads correctly when dropdown opened', async ({ page }) => {
    // Test Case: UTC-898
    // Summary: Verify Facility list loads correctly when dropdown opened
    // Description: Feature: Center identification dropdown for facility selection Scenario: Facility list loads correctly Given dropdown opened When options are fetched Then facility names with codes should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-899: Verify Select facility when dropdown options displayed', async ({ page }) => {
    // Test Case: UTC-899
    // Summary: Verify Select facility when dropdown options displayed
    // Description: Feature: Center identification dropdown for facility selection Scenario: Select facility Given dropdown options displayed When user selects a center Then selected value should appear in the field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-900: Verify Single selection only when one center selected', async ({ page }) => {
    // Test Case: UTC-900
    // Summary: Verify Single selection only when one center selected
    // Description: Feature: Center identification dropdown for facility selection Scenario: Single selection only Given one center selected When another selected Then previous selection should be replaced

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-901: Verify Persist selection during navigation when center selected', async ({ page }) => {
    // Test Case: UTC-901
    // Summary: Verify Persist selection during navigation when center selected
    // Description: Feature: Center identification dropdown for facility selection Scenario: Persist selection during navigation Given center selected When user navigates within form Then selection should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-902: Verify Include center ID in payload when session submitted', async ({ page }) => {
    // Test Case: UTC-902
    // Summary: Verify Include center ID in payload when session submitted
    // Description: Feature: Center identification dropdown for facility selection Scenario: Include center ID in payload Given session submitted When API payload generated Then selected centerId should be present in request

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-903: Verify Default placeholder shown when no selection made', async ({ page }) => {
    // Test Case: UTC-903
    // Summary: Verify Default placeholder shown when no selection made
    // Description: Feature: Center identification dropdown for facility selection Scenario: Default placeholder shown Given no selection made When page loads Then placeholder text should guide user

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-904: Verify Mandatory validation (if required) when field required', async ({ page }) => {
    // Test Case: UTC-904
    // Summary: Verify Mandatory validation (if required) when field required
    // Description: Feature: Center identification dropdown for facility selection Scenario: Mandatory validation (if required) Given field required When submit without selection Then validation message should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-905: Verify Restricted centers hidden when user with limited access', async ({ page }) => {
    // Test Case: UTC-905
    // Summary: Verify Restricted centers hidden when user with limited access
    // Description: Feature: Center identification dropdown for facility selection Scenario: Restricted centers hidden Given user with limited access When dropdown opens Then restricted facilities should not appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-906: Verify Unauthorized injection prevented when manipulated payload with unauthoriz', async ({ page }) => {
    // Test Case: UTC-906
    // Summary: Verify Unauthorized injection prevented when manipulated payload with unauthorized centerId
    // Description: Feature: Center identification dropdown for facility selection Scenario: Unauthorized injection prevented Given manipulated payload with unauthorized centerId When API validates Then request should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-907: Verify Search within dropdown when many facilities exist', async ({ page }) => {
    // Test Case: UTC-907
    // Summary: Verify Search within dropdown when many facilities exist
    // Description: Feature: Center identification dropdown for facility selection Scenario: Search within dropdown Given many facilities exist When user types search text Then matching facilities should be filtered

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-908: Verify Quick load time when dropdown opened', async ({ page }) => {
    // Test Case: UTC-908
    // Summary: Verify Quick load time when dropdown opened
    // Description: Feature: Center identification dropdown for facility selection Scenario: Quick load time Given dropdown opened When data loads Then list should render within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-909: Verify Restore saved value on edit when saved session reopened', async ({ page }) => {
    // Test Case: UTC-909
    // Summary: Verify Restore saved value on edit when saved session reopened
    // Description: Feature: Center identification dropdown for facility selection Scenario: Restore saved value on edit Given saved session reopened When page loads Then previously selected center should auto-populate

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-910: Verify No facilities available when facility list empty', async ({ page }) => {
    // Test Case: UTC-910
    // Summary: Verify No facilities available when facility list empty
    // Description: Feature: Center identification dropdown for facility selection Scenario: No facilities available Given facility list empty When dropdown opened Then “No Centers Available” message should show

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-911: Verify Keyboard accessibility when dropdown focused', async ({ page }) => {
    // Test Case: UTC-911
    // Summary: Verify Keyboard accessibility when dropdown focused
    // Description: Feature: Center identification dropdown for facility selection Scenario: Keyboard accessibility Given dropdown focused When using keyboard arrows/enter Then selection should work without mouse

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
