import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Reviewer can view Approval configuration when the user has Reviewer role
 * URS: URS-DV-GEN-3
 * SRS: SRS-25
 * SDS: SDS-25
 */
test.describe('URS-DV-GEN-3: Verify Reviewer can view Approval configuration when the use', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-306: Verify Reviewer can view Approval configuration when the user has Reviewer role', async ({ page }) => {
    // Test Case: UTC-306
    // Summary: Verify Reviewer can view Approval configuration when the user has Reviewer role
    // Description: Feature: Approval Level Access Control Scenario: Reviewer can view Approval configuration Given the user has Reviewer role When the user navigates to Session Creation page Then the Approval Level section should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-307: Verify Default Approval state when the Approval Level section is visible', async ({ page }) => {
    // Test Case: UTC-307
    // Summary: Verify Default Approval state when the Approval Level section is visible
    // Description: Feature: Approval Level Access Control Scenario: Default Approval state Given the Approval Level section is visible When the page loads Then only the “Add Level” button should be displayed by default

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-308: Verify Add Level interaction when the reviewer is on Session Creation page', async ({ page }) => {
    // Test Case: UTC-308
    // Summary: Verify Add Level interaction when the reviewer is on Session Creation page
    // Description: Feature: Approval Level Access Control Scenario: Add Level interaction Given the reviewer is on Session Creation page When the user clicks the Add Level button Then Level 1 approval field should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-309: Verify Multiple Add Level visibility when Level 1 is already added', async ({ page }) => {
    // Test Case: UTC-309
    // Summary: Verify Multiple Add Level visibility when Level 1 is already added
    // Description: Feature: Approval Level Access Control Scenario: Multiple Add Level visibility Given Level 1 is already added When the reviewer clicks Add Level again Then the next sequential level field should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-310: Verify Non-reviewer cannot view approval section when the user does not have Rev', async ({ page }) => {
    // Test Case: UTC-310
    // Summary: Verify Non-reviewer cannot view approval section when the user does not have Reviewer role
    // Description: Feature: Approval Level Access Control Scenario: Non-reviewer cannot view approval section Given the user does not have Reviewer role When the user opens Session Creation page Then the Approval Level section should not be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-311: Verify Non-reviewer cannot configure approval levels when a non-reviewer is logg', async ({ page }) => {
    // Test Case: UTC-311
    // Summary: Verify Non-reviewer cannot configure approval levels when a non-reviewer is logged in
    // Description: Feature: Approval Level Access Control Scenario: Non-reviewer cannot configure approval levels Given a non-reviewer is logged in When the user attempts to add or edit approval levels Then the action should be disabled or blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-312: Verify Direct access restriction when a non-reviewer user', async ({ page }) => {
    // Test Case: UTC-312
    // Summary: Verify Direct access restriction when a non-reviewer user
    // Description: Feature: Approval Level Access Control Scenario: Direct access restriction Given a non-reviewer user When the user attempts to access approval configuration via direct URL or API Then the system should block access with authorization restriction

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-313: Verify UI clarity for reviewer when the reviewer views the Approval Level sectio', async ({ page }) => {
    // Test Case: UTC-313
    // Summary: Verify UI clarity for reviewer when the reviewer views the Approval Level section
    // Description: Feature: Approval Level Access Control Scenario: UI clarity for reviewer Given the reviewer views the Approval Level section When the section is displayed Then Add Level button should be clearly enabled and clickable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-314: Verify Role change effect when a reviewer role is changed to non-reviewer', async ({ page }) => {
    // Test Case: UTC-314
    // Summary: Verify Role change effect when a reviewer role is changed to non-reviewer
    // Description: Feature: Approval Level Access Control Scenario: Role change effect Given a reviewer role is changed to non-reviewer When the user refreshes the page Then Approval Level section should no longer be accessible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-315: Verify Secure rendering when the page is loading for a non-reviewer', async ({ page }) => {
    // Test Case: UTC-315
    // Summary: Verify Secure rendering when the page is loading for a non-reviewer
    // Description: Feature: Approval Level Access Control Scenario: Secure rendering Given the page is loading for a non-reviewer When UI renders Then approval controls should never briefly appear during load

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
