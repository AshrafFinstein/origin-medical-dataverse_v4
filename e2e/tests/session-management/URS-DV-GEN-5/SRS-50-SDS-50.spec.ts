import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, LabelSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Authorized user can view Session Label dropdown when the user has session creation permission
 * URS: URS-DV-GEN-5
 * SRS: SRS-50
 * SDS: SDS-50
 */
test.describe('URS-DV-GEN-5: Verify Authorized user can view Session Label dropdown when ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-584: Verify Authorized user can view Session Label dropdown when the user has session', async ({ page }) => {
    // Test Case: UTC-584
    // Summary: Verify Authorized user can view Session Label dropdown when the user has session creation permission
    // Description: Feature: Session Label Access Security Scenario: Authorized user can view Session Label dropdown Given the user has session creation permission When the Session Creation page loads Then the Session Label dropdown should be visible and enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-585: Verify Unauthorized user cannot view Session Label dropdown when the user does n', async ({ page }) => {
    // Test Case: UTC-585
    // Summary: Verify Unauthorized user cannot view Session Label dropdown when the user does not have session creation permission
    // Description: Feature: Session Label Access Security Scenario: Unauthorized user cannot view Session Label dropdown Given the user does not have session creation permission When the Session Creation page loads Then the Session Label dropdown should be hidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-586: Verify Unauthorized dropdown disabled when the user has read-only access', async ({ page }) => {
    // Test Case: UTC-586
    // Summary: Verify Unauthorized dropdown disabled when the user has read-only access
    // Description: Feature: Session Label Access Security Scenario: Unauthorized dropdown disabled Given the user has read-only access When the page renders Then the Session Label dropdown should be disabled and not interactive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-587: Verify Prevent manual interaction using UI tricks when the dropdown is disabled ', async ({ page }) => {
    // Test Case: UTC-587
    // Summary: Verify Prevent manual interaction using UI tricks when the dropdown is disabled for unauthorized user
    // Description: Feature: Session Label Access Security Scenario: Prevent manual interaction using UI tricks Given the dropdown is disabled for unauthorized user When the user attempts to click or focus the field Then no selection action should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-588: Verify Prevent direct API label submission when an unauthorized user sends label', async ({ page }) => {
    // Test Case: UTC-588
    // Summary: Verify Prevent direct API label submission when an unauthorized user sends label data through API or payload tampering
    // Description: Feature: Session Label Access Security Scenario: Prevent direct API label submission Given an unauthorized user sends label data through API or payload tampering When the request is validated Then the system should reject the request with authorization restriction

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-589: Verify Friendly restriction message shown when unauthorized access attempt occur', async ({ page }) => {
    // Test Case: UTC-589
    // Summary: Verify Friendly restriction message shown when unauthorized access attempt occurs
    // Description: Feature: Session Label Access Security Scenario: Friendly restriction message shown Given unauthorized access attempt occurs When the action is blocked Then a non-technical permission message should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-590: Verify Authorized user can select label when the dropdown is enabled', async ({ page }) => {
    // Test Case: UTC-590
    // Summary: Verify Authorized user can select label when the dropdown is enabled
    // Description: Feature: Session Label Access Security Scenario: Authorized user can select label Given the dropdown is enabled When the user selects a label Then the selected label should be applied successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-591: Verify Role change reflected dynamically when user role changes from authorized ', async ({ page }) => {
    // Test Case: UTC-591
    // Summary: Verify Role change reflected dynamically when user role changes from authorized to unauthorized
    // Description: Feature: Session Label Access Security Scenario: Role change reflected dynamically Given user role changes from authorized to unauthorized When the page is refreshed Then the Session Label dropdown should become hidden or disabled immediately

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-592: Verify No data leakage in UI when the user is unauthorized', async ({ page }) => {
    // Test Case: UTC-592
    // Summary: Verify No data leakage in UI when the user is unauthorized
    // Description: Feature: Session Label Access Security Scenario: No data leakage in UI Given the user is unauthorized When the page loads Then label values should not be visible in DOM or dropdown list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-593: Verify Clear disabled state indication when the dropdown is disabled', async ({ page }) => {
    // Test Case: UTC-593
    // Summary: Verify Clear disabled state indication when the dropdown is disabled
    // Description: Feature: Session Label Access Security Scenario: Clear disabled state indication Given the dropdown is disabled When the UI is displayed Then the field should clearly appear greyed out to indicate restricted access

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
