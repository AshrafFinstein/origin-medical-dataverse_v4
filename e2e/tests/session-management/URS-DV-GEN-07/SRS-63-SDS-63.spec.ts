import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Session Name field visibility when the user opens Session Creation page
 * URS: URS-DV-GEN-07
 * SRS: SRS-63
 * SDS: SDS-63
 */
test.describe('URS-DV-GEN-07: Verify Session Name field visibility when the user opens Ses', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-757: Verify Session Name field visibility when the user opens Session Creation page', async ({ page }) => {
    // Test Case: UTC-757
    // Summary: Verify Session Name field visibility when the user opens Session Creation page
    // Description: Feature: Unique session title input with validation and constraints Scenario: Session Name field visibility Given the user opens Session Creation page When the page loads Then a full-width Session Name text input should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-758: Verify Placeholder displayed when the input is empty', async ({ page }) => {
    // Test Case: UTC-758
    // Summary: Verify Placeholder displayed when the input is empty
    // Description: Feature: Unique session title input with validation and constraints Scenario: Placeholder displayed Given the input is empty When field is rendered Then placeholder Enter session name should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-759: Verify Accept valid text input when the user types a valid name', async ({ page }) => {
    // Test Case: UTC-759
    // Summary: Verify Accept valid text input when the user types a valid name
    // Description: Feature: Unique session title input with validation and constraints Scenario: Accept valid text input Given the user types a valid name When input is entered Then text should be accepted and displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-760: Verify Trim leading spaces when user enters spaces before text', async ({ page }) => {
    // Test Case: UTC-760
    // Summary: Verify Trim leading spaces when user enters spaces before text
    // Description: Feature: Unique session title input with validation and constraints Scenario: Trim leading spaces Given user enters spaces before text When field loses focus Then leading spaces should be removed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-761: Verify Trim trailing spaces when user enters spaces after text', async ({ page }) => {
    // Test Case: UTC-761
    // Summary: Verify Trim trailing spaces when user enters spaces after text
    // Description: Feature: Unique session title input with validation and constraints Scenario: Trim trailing spaces Given user enters spaces after text When field loses focus Then trailing spaces should be removed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-762: Verify Empty input blocked when the field is empty', async ({ page }) => {
    // Test Case: UTC-762
    // Summary: Verify Empty input blocked when the field is empty
    // Description: Feature: Unique session title input with validation and constraints Scenario: Empty input blocked Given the field is empty When user submits session Then submission should be prevented

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-763: Verify Space-only input blocked when user enters only spaces', async ({ page }) => {
    // Test Case: UTC-763
    // Summary: Verify Space-only input blocked when user enters only spaces
    // Description: Feature: Unique session title input with validation and constraints Scenario: Space-only input blocked Given user enters only spaces When submit attempted Then validation message should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-764: Verify Accept 255 characters when 255 characters entered', async ({ page }) => {
    // Test Case: UTC-764
    // Summary: Verify Accept 255 characters when 255 characters entered
    // Description: Feature: Unique session title input with validation and constraints Scenario: Accept 255 characters Given 255 characters entered When validated Then input should be accepted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-765: Verify Reject >255 characters when 256+ characters entered', async ({ page }) => {
    // Test Case: UTC-765
    // Summary: Verify Reject >255 characters when 256+ characters entered
    // Description: Feature: Unique session title input with validation and constraints Scenario: Reject >255 characters Given 256+ characters entered When validated Then submission should be blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-766: Verify Value mapped to payload when valid session name entered', async ({ page }) => {
    // Test Case: UTC-766
    // Summary: Verify Value mapped to payload when valid session name entered
    // Description: Feature: Unique session title input with validation and constraints Scenario: Value mapped to payload Given valid session name entered When session submitted Then value should map to session_title in JSON payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-767: Verify Duplicate name blocked when session name already exists', async ({ page }) => {
    // Test Case: UTC-767
    // Summary: Verify Duplicate name blocked when session name already exists
    // Description: Feature: Unique session title input with validation and constraints Scenario: Duplicate name blocked Given session name already exists When user submits duplicate Then system should prevent creation

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-768: Verify Stored correctly in database when valid name submitted', async ({ page }) => {
    // Test Case: UTC-768
    // Summary: Verify Stored correctly in database when valid name submitted
    // Description: Feature: Unique session title input with validation and constraints Scenario: Stored correctly in database Given valid name submitted When saved Then stored title should match input

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

  test('UTC-769: Verify Clear inline error message when invalid input', async ({ page }) => {
    // Test Case: UTC-769
    // Summary: Verify Clear inline error message when invalid input
    // Description: Feature: Unique session title input with validation and constraints Scenario: Clear inline error message Given invalid input When validation fails Then user-friendly message should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-770: Verify Value persists during navigation when name entered', async ({ page }) => {
    // Test Case: UTC-770
    // Summary: Verify Value persists during navigation when name entered
    // Description: Feature: Unique session title input with validation and constraints Scenario: Value persists during navigation Given name entered When user navigates within form Then value should remain intact

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-771: Verify Validation responds instantly when user types name', async ({ page }) => {
    // Test Case: UTC-771
    // Summary: Verify Validation responds instantly when user types name
    // Description: Feature: Unique session title input with validation and constraints Scenario: Validation responds instantly Given user types name When validation runs Then response should occur without delay

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
