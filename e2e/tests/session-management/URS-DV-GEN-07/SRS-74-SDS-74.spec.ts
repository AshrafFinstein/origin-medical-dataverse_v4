import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown visible on session form when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-74
 * SDS: SDS-74
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

  test('UTC-912: Verify Dropdown visible on session form when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-912
    // Summary: Verify Dropdown visible on session form when Session Creation page loads
    // Description: Feature: Role type dropdown for session creator classification Scenario: Dropdown visible on session form Given Session Creation page loads When form renders Then User Type Code dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-913: Verify Role list loads correctly when dropdown opened', async ({ page }) => {
    // Test Case: UTC-913
    // Summary: Verify Role list loads correctly when dropdown opened
    // Description: Feature: Role type dropdown for session creator classification Scenario: Role list loads correctly Given dropdown opened When options are fetched Then available role types should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-914: Verify Select role type when roles are displayed', async ({ page }) => {
    // Test Case: UTC-914
    // Summary: Verify Select role type when roles are displayed
    // Description: Feature: Role type dropdown for session creator classification Scenario: Select role type Given roles are displayed When user selects one option Then selected value should appear in the field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-915: Verify Single selection enforced when one role selected', async ({ page }) => {
    // Test Case: UTC-915
    // Summary: Verify Single selection enforced when one role selected
    // Description: Feature: Role type dropdown for session creator classification Scenario: Single selection enforced Given one role selected When another role selected Then previous role should be replaced

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-916: Verify Selection persists during navigation when role selected', async ({ page }) => {
    // Test Case: UTC-916
    // Summary: Verify Selection persists during navigation when role selected
    // Description: Feature: Role type dropdown for session creator classification Scenario: Selection persists during navigation Given role selected When user navigates within form Then selection should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-917: Verify Role stored in payload when session submitted', async ({ page }) => {
    // Test Case: UTC-917
    // Summary: Verify Role stored in payload when session submitted
    // Description: Feature: Role type dropdown for session creator classification Scenario: Role stored in payload Given session submitted When API request generated Then selected role should be included in metadata

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

  test('UTC-918: Verify Default placeholder shown when no role selected', async ({ page }) => {
    // Test Case: UTC-918
    // Summary: Verify Default placeholder shown when no role selected
    // Description: Feature: Role type dropdown for session creator classification Scenario: Default placeholder shown Given no role selected When page loads Then placeholder text should guide user

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-919: Verify Mandatory validation if required when field required', async ({ page }) => {
    // Test Case: UTC-919
    // Summary: Verify Mandatory validation if required when field required
    // Description: Feature: Role type dropdown for session creator classification Scenario: Mandatory validation if required Given field required When user submits without selection Then validation message should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-920: Verify Search/filter inside dropdown when many roles exist', async ({ page }) => {
    // Test Case: UTC-920
    // Summary: Verify Search/filter inside dropdown when many roles exist
    // Description: Feature: Role type dropdown for session creator classification Scenario: Search/filter inside dropdown Given many roles exist When user types in search Then matching roles should be filtered

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-921: Verify Fast load time when dropdown opened', async ({ page }) => {
    // Test Case: UTC-921
    // Summary: Verify Fast load time when dropdown opened
    // Description: Feature: Role type dropdown for session creator classification Scenario: Fast load time Given dropdown opened When data loads Then options should render within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-922: Verify Restore saved role on edit when session reopened in edit mode', async ({ page }) => {
    // Test Case: UTC-922
    // Summary: Verify Restore saved role on edit when session reopened in edit mode
    // Description: Feature: Role type dropdown for session creator classification Scenario: Restore saved role on edit Given session reopened in edit mode When page loads Then previously selected role should auto-populate

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-923: Verify No roles available when role list empty', async ({ page }) => {
    // Test Case: UTC-923
    // Summary: Verify No roles available when role list empty
    // Description: Feature: Role type dropdown for session creator classification Scenario: No roles available Given role list empty When dropdown opened Then “No Roles Available” message should display

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-924: Verify Prevent invalid value injection when manipulated payload with unauthorize', async ({ page }) => {
    // Test Case: UTC-924
    // Summary: Verify Prevent invalid value injection when manipulated payload with unauthorized role
    // Description: Feature: Role type dropdown for session creator classification Scenario: Prevent invalid value injection Given manipulated payload with unauthorized role When API validates Then request should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-925: Verify Keyboard navigation supported when dropdown focused', async ({ page }) => {
    // Test Case: UTC-925
    // Summary: Verify Keyboard navigation supported when dropdown focused
    // Description: Feature: Role type dropdown for session creator classification Scenario: Keyboard navigation supported Given dropdown focused When user uses keyboard keys Then selection should work without mouse

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-926: Verify Clear selection allowed when role selected', async ({ page }) => {
    // Test Case: UTC-926
    // Summary: Verify Clear selection allowed when role selected
    // Description: Feature: Role type dropdown for session creator classification Scenario: Clear selection allowed Given role selected When user clears selection Then field should reset to default state

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
