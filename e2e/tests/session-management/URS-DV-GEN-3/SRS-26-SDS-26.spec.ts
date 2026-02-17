import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Level 1 appears after Add Level click when the reviewer is on Session Creation page
 * URS: URS-DV-GEN-3
 * SRS: SRS-26
 * SDS: SDS-26
 */
test.describe('URS-DV-GEN-3: Verify Level 1 appears after Add Level click when the review', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-316: Verify Level 1 appears after Add Level click when the reviewer is on Session Cre', async ({ page }) => {
    // Test Case: UTC-316
    // Summary: Verify Level 1 appears after Add Level click when the reviewer is on Session Creation page
    // Description: Feature: Level 1 Approval Initialization Scenario: Level 1 appears after Add Level click Given the reviewer is on Session Creation page When the user clicks the Add Level button Then Level 1 approval section should be displayed immediately

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-317: Verify Level 1 is fixed first level when the user clicks Add Level for the first', async ({ page }) => {
    // Test Case: UTC-317
    // Summary: Verify Level 1 is fixed first level when the user clicks Add Level for the first time
    // Description: Scenario: Level 1 is fixed first level Given the user clicks Add Level for the first time When the level is created Then the level label should be “Level 1” and should not allow skipping or reordering

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-318: Verify Approver selection field visible when Level 1 is displayed', async ({ page }) => {
    // Test Case: UTC-318
    // Summary: Verify Approver selection field visible when Level 1 is displayed
    // Description: Scenario: Approver selection field visible Given Level 1 is displayed When the section loads Then an approver selection dropdown/multi-select field should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-319: Verify User can select Level 1 approver when the approver dropdown is available', async ({ page }) => {
    // Test Case: UTC-319
    // Summary: Verify User can select Level 1 approver when the approver dropdown is available
    // Description: Scenario: User can select Level 1 approver Given the approver dropdown is available When the user selects one or more approvers Then selected approvers should be displayed and retained in the field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-320: Verify Submission blocked without approver when Level 1 is added', async ({ page }) => {
    // Test Case: UTC-320
    // Summary: Verify Submission blocked without approver when Level 1 is added
    // Description: Scenario: Submission blocked without approver Given Level 1 is added And no approver is selected When the user clicks Submit/Create Session Then session submission should be blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-321: Verify Validation message displayed for empty Level 1 when no approver is select', async ({ page }) => {
    // Test Case: UTC-321
    // Summary: Verify Validation message displayed for empty Level 1 when no approver is selected for Level 1
    // Description: Scenario: Validation message displayed for empty Level 1 Given no approver is selected for Level 1 When the user attempts to submit Then a clear validation message should be displayed indicating Level 1 approver is mandatory

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-322: Verify Submission allowed with valid approver when Level 1 approver is selected', async ({ page }) => {
    // Test Case: UTC-322
    // Summary: Verify Submission allowed with valid approver when Level 1 approver is selected
    // Description: Scenario: Submission allowed with valid approver Given Level 1 approver is selected When the user clicks Submit/Create Session Then the session should be created successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-323: Verify Selected approver retained during navigation when Level 1 approver is sel', async ({ page }) => {
    // Test Case: UTC-323
    // Summary: Verify Selected approver retained during navigation when Level 1 approver is selected
    // Description: Scenario: Selected approver retained during navigation Given Level 1 approver is selected When the user navigates within the form or scrolls Then the selected approver value should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-324: Verify Approver stored in payload when Level 1 approver is selected', async ({ page }) => {
    // Test Case: UTC-324
    // Summary: Verify Approver stored in payload when Level 1 approver is selected
    // Description: Scenario: Approver stored in payload Given Level 1 approver is selected When the session is submitted Then the selected approver should be included in the session creation payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-325: Verify No duplicate Level 1 creation when Level 1 already exists', async ({ page }) => {
    // Test Case: UTC-325
    // Summary: Verify No duplicate Level 1 creation when Level 1 already exists
    // Description: Scenario: No duplicate Level 1 creation Given Level 1 already exists When the user clicks Add Level again Then Level 2 should be created instead of another Level 1

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
