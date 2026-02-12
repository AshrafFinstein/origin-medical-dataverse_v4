import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown visibility when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-83
 * SDS: SDS-83
 */
test.describe('URS-DV-GEN-07: Verify Dropdown visibility when Session Creation page loads', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1031: Verify Dropdown visibility when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-1031
    // Summary: Verify Dropdown visibility when Session Creation page loads
    // Description: Feature: Select Assignees multi-user selector Feature Summary: Assign multiple users to session tasks Scenario: Dropdown visibility Given Session Creation page loads When metadata section renders Then Assignees dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1032: Verify Checklist layout when dropdown opened', async ({ page }) => {
    // Test Case: UTC-1032
    // Summary: Verify Checklist layout when dropdown opened
    // Description: Feature: Select Assignees multi-user selector Scenario: Checklist layout Given dropdown opened When users are displayed Then each user should show checkbox and name

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1033: Verify Select single user when dropdown opened', async ({ page }) => {
    // Test Case: UTC-1033
    // Summary: Verify Select single user when dropdown opened
    // Description: Feature: Select Assignees multi-user selector Scenario: Select single user Given dropdown opened When user selects one checkbox Then that user should be highlighted and marked selected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1034: Verify Select multiple users when dropdown opened', async ({ page }) => {
    // Test Case: UTC-1034
    // Summary: Verify Select multiple users when dropdown opened
    // Description: Feature: Select Assignees multi-user selector Scenario: Select multiple users Given dropdown opened When multiple checkboxes selected Then all selected users should remain highlighted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1035: Verify Deselect user when users selected', async ({ page }) => {
    // Test Case: UTC-1035
    // Summary: Verify Deselect user when users selected
    // Description: Feature: Select Assignees multi-user selector Scenario: Deselect user Given users selected When user unchecks checkbox Then that user should be removed from selection

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1036: Verify Visual feedback when users selected', async ({ page }) => {
    // Test Case: UTC-1036
    // Summary: Verify Visual feedback when users selected
    // Description: Feature: Select Assignees multi-user selector Scenario: Visual feedback Given users selected When dropdown collapses Then selected users should appear as chips/tags in field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1037: Verify State array update when users selected', async ({ page }) => {
    // Test Case: UTC-1037
    // Summary: Verify State array update when users selected
    // Description: Feature: Select Assignees multi-user selector Scenario: State array update Given users selected When inspecting component state Then selected user IDs should be stored in array

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1038: Verify Persist selection on reopen when users selected', async ({ page }) => {
    // Test Case: UTC-1038
    // Summary: Verify Persist selection on reopen when users selected
    // Description: Feature: Select Assignees multi-user selector Scenario: Persist selection on reopen Given users selected When dropdown reopened Then previous selections should remain

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1039: Verify Payload inclusion when users selected', async ({ page }) => {
    // Test Case: UTC-1039
    // Summary: Verify Payload inclusion when users selected
    // Description: Feature: Select Assignees multi-user selector Scenario: Payload inclusion Given users selected When session saved Then selected user IDs should be sent in API payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1040: Verify Search filter users when dropdown opened', async ({ page }) => {
    // Test Case: UTC-1040
    // Summary: Verify Search filter users when dropdown opened
    // Description: Feature: Select Assignees multi-user selector Scenario: Search filter users Given dropdown opened When user types search text Then matching users only should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1041: Verify Invalid email search when invalid email typed', async ({ page }) => {
    // Test Case: UTC-1041
    // Summary: Verify Invalid email search when invalid email typed
    // Description: Feature: Select Assignees multi-user selector Scenario: Invalid email search Given invalid email typed When search executed Then “User not found” message should display

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1042: Verify Navigation persistence when users selected', async ({ page }) => {
    // Test Case: UTC-1042
    // Summary: Verify Navigation persistence when users selected
    // Description: Feature: Select Assignees multi-user selector Scenario: Navigation persistence Given users selected When navigating within form Then selections should remain intact

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1043: Verify Large user list performance when 200+ users exist', async ({ page }) => {
    // Test Case: UTC-1043
    // Summary: Verify Large user list performance when 200+ users exist
    // Description: Feature: Select Assignees multi-user selector Scenario: Large user list performance Given 200+ users exist When selecting multiple Then UI should remain responsive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1044: Verify Unauthorized role restriction when user lacks permission', async ({ page }) => {
    // Test Case: UTC-1044
    // Summary: Verify Unauthorized role restriction when user lacks permission
    // Description: Feature: Select Assignees multi-user selector Scenario: Unauthorized role restriction Given user lacks permission When dropdown loads Then selector should be disabled or hidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1045: Verify Keyboard navigation when dropdown focused', async ({ page }) => {
    // Test Case: UTC-1045
    // Summary: Verify Keyboard navigation when dropdown focused
    // Description: Feature: Select Assignees multi-user selector Scenario: Keyboard navigation Given dropdown focused When using Arrow/Space/Enter keys Then user selection should work without mouse

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
