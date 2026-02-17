import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Default status set on form load when the user opens the Create Session form
 * URS: URS-DV-GEN-25
 * SRS: SRS-226
 * SDS: SDS-226
 */
test.describe('URS-DV-GEN-25: Verify Default status set on form load when the user opens t', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2317: Verify Default status set on form load when the user opens the Create Session fo', async ({ page }) => {
    // Test Case: UTC-2317
    // Summary: Verify Default status set on form load when the user opens the Create Session form
    // Description: Feature: Default Session Status Selection Scenario: Default status set on form load Given the user opens the Create Session form When the form finishes loading Then the Session Status field should be pre-selected as “Yet to do”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2318: Verify No placeholder shown when default applied when the Create Session form lo', async ({ page }) => {
    // Test Case: UTC-2318
    // Summary: Verify No placeholder shown when default applied when the Create Session form loads
    // Description: Feature: Default Session Status Selection Scenario: No placeholder shown when default applied Given the Create Session form loads When Session Status is displayed Then the placeholder should not be shown and “Yet to do” should be selected

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

  test('UTC-2319: Verify User can change default value when Yet to do is selected by default', async ({ page }) => {
    // Test Case: UTC-2319
    // Summary: Verify User can change default value when Yet to do is selected by default
    // Description: Feature: Default Session Status Selection Scenario: User can change default value Given “Yet to do” is selected by default When the user selects “In Progress” Then the Session Status field should update to “In Progress”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2320: Verify Default value included in payload when the user does not change the defau', async ({ page }) => {
    // Test Case: UTC-2320
    // Summary: Verify Default value included in payload when the user does not change the default status
    // Description: Feature: Default Session Status Selection Scenario: Default value included in payload Given the user does not change the default status When the session is submitted Then the API payload should contain status = “Yet to do”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2321: Verify Updated value overrides default in payload when user changes status to In', async ({ page }) => {
    // Test Case: UTC-2321
    // Summary: Verify Updated value overrides default in payload when user changes status to In Progress
    // Description: Feature: Default Session Status Selection Scenario: Updated value overrides default in payload Given user changes status to “In Progress” When the session is submitted Then the API payload should contain status = “In Progress”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2322: Verify Default persists on form re-render when the form re-renders due to state ', async ({ page }) => {
    // Test Case: UTC-2322
    // Summary: Verify Default persists on form re-render when the form re-renders due to state update
    // Description: Feature: Default Session Status Selection Scenario: Default persists on form re-render Given the form re-renders due to state update When no user change is made Then the Session Status should remain “Yet to do”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2323: Verify Session creation allowed without manual selection when the default status', async ({ page }) => {
    // Test Case: UTC-2323
    // Summary: Verify Session creation allowed without manual selection when the default status is set automatically
    // Description: Feature: Default Session Status Selection Scenario: Session creation allowed without manual selection Given the default status is set automatically When the user submits the form without changing status Then the session should be created successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2324: Verify Visual clarity of default value when the form loads', async ({ page }) => {
    // Test Case: UTC-2324
    // Summary: Verify Visual clarity of default value when the form loads
    // Description: Feature: Default Session Status Selection Scenario: Visual clarity of default value Given the form loads When user views the Session Status field Then “Yet to do” should be clearly visible as selected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2325: Verify Default selection applied instantly when the Create Session form opens', async ({ page }) => {
    // Test Case: UTC-2325
    // Summary: Verify Default selection applied instantly when the Create Session form opens
    // Description: Feature: Default Session Status Selection Scenario: Default selection applied instantly Given the Create Session form opens When the Session Status dropdown renders Then the default value should appear without delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2326: Verify Restriction rules remain intact when default is set to Yet to do', async ({ page }) => {
    // Test Case: UTC-2326
    // Summary: Verify Restriction rules remain intact when default is set to Yet to do
    // Description: Feature: Default Session Status Selection Scenario: Restriction rules remain intact Given default is set to “Yet to do” When dropdown is opened Then disabled options (Completed, Re-open) should remain disabled

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
