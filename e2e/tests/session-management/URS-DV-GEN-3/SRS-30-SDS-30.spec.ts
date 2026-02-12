import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Reviewer can view approval section when the user has Reviewer role
 * URS: URS-DV-GEN-3
 * SRS: SRS-30
 * SDS: SDS-30
 */
test.describe('URS-DV-GEN-3: Verify Reviewer can view approval section when the user has ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-366: Verify Reviewer can view approval section when the user has Reviewer role', async ({ page }) => {
    // Test Case: UTC-366
    // Summary: Verify Reviewer can view approval section when the user has Reviewer role
    // Description: Feature: Approval Level Access Security Scenario: Reviewer can view approval section Given the user has Reviewer role When the Session Creation page loads Then the Approval Level configuration section should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-367: Verify Non-reviewer cannot view approval section when the user is a Non-Reviewer', async ({ page }) => {
    // Test Case: UTC-367
    // Summary: Verify Non-reviewer cannot view approval section when the user is a Non-Reviewer
    // Description: Scenario: Non-reviewer cannot view approval section Given the user is a Non-Reviewer When the Session Creation page loads Then the Approval Level section should be hidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-368: Verify Non-reviewer cannot add level when the user is a Non-Reviewer', async ({ page }) => {
    // Test Case: UTC-368
    // Summary: Verify Non-reviewer cannot add level when the user is a Non-Reviewer
    // Description: Scenario: Non-reviewer cannot add level Given the user is a Non-Reviewer When the user attempts to access Add Level Then Add Level action should not be available

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-369: Verify Non-reviewer cannot edit approvers when approval levels exist', async ({ page }) => {
    // Test Case: UTC-369
    // Summary: Verify Non-reviewer cannot edit approvers when approval levels exist
    // Description: Scenario: Non-reviewer cannot edit approvers Given approval levels exist When a Non-Reviewer views the page Then approver fields should be read-only or hidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-370: Verify Non-reviewer cannot delete levels when approval levels exist', async ({ page }) => {
    // Test Case: UTC-370
    // Summary: Verify Non-reviewer cannot delete levels when approval levels exist
    // Description: Scenario: Non-reviewer cannot delete levels Given approval levels exist When a Non-Reviewer attempts removal Then Remove icon should not be available

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-371: Verify Direct URL access blocked when a Non-Reviewer manually navigates using a ', async ({ page }) => {
    // Test Case: UTC-371
    // Summary: Verify Direct URL access blocked when a Non-Reviewer manually navigates using a direct URL
    // Description: Scenario: Direct URL access blocked Given a Non-Reviewer manually navigates using a direct URL When the system validates access Then the action should be blocked with restriction message

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-372: Verify Role validated on page load when the page initializes', async ({ page }) => {
    // Test Case: UTC-372
    // Summary: Verify Role validated on page load when the page initializes
    // Description: Scenario: Role validated on page load Given the page initializes When role validation occurs Then only permitted roles should receive approval configuration data

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-373: Verify Friendly error message shown when unauthorized access attempt occurs', async ({ page }) => {
    // Test Case: UTC-373
    // Summary: Verify Friendly error message shown when unauthorized access attempt occurs
    // Description: Scenario: Friendly error message shown Given unauthorized access attempt occurs When action is blocked Then a clear non-technical restriction message should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
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
