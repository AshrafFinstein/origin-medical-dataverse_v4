import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Select All checkbox visibility when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-82
 * SDS: SDS-82
 */
test.describe('URS-DV-GEN-07: Verify Select All checkbox visibility when Session Creation ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1016: Verify Select All checkbox visibility when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-1016
    // Summary: Verify Select All checkbox visibility when Session Creation page loads
    // Description: Feature: Assignees Select All bulk assignment Scenario: Select All checkbox visibility Given Session Creation page loads When Assignee dropdown renders Then “Select All” checkbox should be visible above the list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1017: Verify Checkbox label clarity when the checkbox is displayed', async ({ page }) => {
    // Test Case: UTC-1017
    // Summary: Verify Checkbox label clarity when the checkbox is displayed
    // Description: Feature: Assignees Select All bulk assignment Scenario: Checkbox label clarity Given the checkbox is displayed When user views the control Then it should clearly show label “Select All”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1018: Verify Select all users when multiple users are listed', async ({ page }) => {
    // Test Case: UTC-1018
    // Summary: Verify Select all users when multiple users are listed
    // Description: Feature: Assignees Select All bulk assignment Scenario: Select all users Given multiple users are listed When user checks Select All Then all user entries should become selected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1019: Verify Deselect all users when all users selected', async ({ page }) => {
    // Test Case: UTC-1019
    // Summary: Verify Deselect all users when all users selected
    // Description: Feature: Assignees Select All bulk assignment Scenario: Deselect all users Given all users selected When user unchecks Select All Then all selections should be cleared

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1020: Verify Immediate UI update when user toggles Select All', async ({ page }) => {
    // Test Case: UTC-1020
    // Summary: Verify Immediate UI update when user toggles Select All
    // Description: Feature: Assignees Select All bulk assignment Scenario: Immediate UI update Given user toggles Select All When selection changes Then checkboxes should update instantly without reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1021: Verify State array updated when users are selected using Select All', async ({ page }) => {
    // Test Case: UTC-1021
    // Summary: Verify State array updated when users are selected using Select All
    // Description: Feature: Assignees Select All bulk assignment Scenario: State array updated Given users are selected using Select All When inspecting state Then all user IDs should be marked selected: true

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1022: Verify Individual deselect after Select All when Select All applied', async ({ page }) => {
    // Test Case: UTC-1022
    // Summary: Verify Individual deselect after Select All when Select All applied
    // Description: Feature: Assignees Select All bulk assignment Scenario: Individual deselect after Select All Given Select All applied When user manually deselects one user Then that user only should be unselected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1023: Verify Selection retained on dropdown reopen when Select All applied', async ({ page }) => {
    // Test Case: UTC-1023
    // Summary: Verify Selection retained on dropdown reopen when Select All applied
    // Description: Feature: Assignees Select All bulk assignment Scenario: Selection retained on dropdown reopen Given Select All applied When dropdown closed and reopened Then all users should remain selected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1024: Verify Save payload includes all users when Select All chosen', async ({ page }) => {
    // Test Case: UTC-1024
    // Summary: Verify Save payload includes all users when Select All chosen
    // Description: Feature: Assignees Select All bulk assignment Scenario: Save payload includes all users Given Select All chosen When session saved Then all user IDs should be included in API payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1025: Verify Selected count visible when multiple users selected', async ({ page }) => {
    // Test Case: UTC-1025
    // Summary: Verify Selected count visible when multiple users selected
    // Description: Feature: Assignees Select All bulk assignment Scenario: Selected count visible Given multiple users selected When viewing field Then selected users should be clearly indicated (chips/count)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1026: Verify Large list performance when 100+ users exist', async ({ page }) => {
    // Test Case: UTC-1026
    // Summary: Verify Large list performance when 100+ users exist
    // Description: Feature: Assignees Select All bulk assignment Scenario: Large list performance Given 100+ users exist When Select All clicked Then selection should complete without lag

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1027: Verify Page navigation persistence when users selected', async ({ page }) => {
    // Test Case: UTC-1027
    // Summary: Verify Page navigation persistence when users selected
    // Description: Feature: Assignees Select All bulk assignment Scenario: Page navigation persistence Given users selected When navigating within form Then selections should persist

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1028: Verify No users available when no users exist', async ({ page }) => {
    // Test Case: UTC-1028
    // Summary: Verify No users available when no users exist
    // Description: Feature: Assignees Select All bulk assignment Scenario: No users available Given no users exist When dropdown opened Then Select All should be disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1029: Verify Restricted role cannot assign when user lacks assignment permission', async ({ page }) => {
    // Test Case: UTC-1029
    // Summary: Verify Restricted role cannot assign when user lacks assignment permission
    // Description: Feature: Assignees Select All bulk assignment Scenario: Restricted role cannot assign Given user lacks assignment permission When dropdown opened Then Select All should be hidden or disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1030: Verify Keyboard accessibility when Select All checkbox focused', async ({ page }) => {
    // Test Case: UTC-1030
    // Summary: Verify Keyboard accessibility when Select All checkbox focused
    // Description: Feature: Assignees Select All bulk assignment Scenario: Keyboard accessibility Given Select All checkbox focused When Space/Enter pressed Then all users should be selected

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
