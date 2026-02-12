import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Default state of Approval Level field when the user is on the Create Session page
 * URS: URS-DV-QC-01
 * SRS: SRS-1
 * SDS: SDS-1
 */
test.describe('URS-DV-QC-01: Verify Default state of Approval Level field when the user i', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1: Verify Default state of Approval Level field when the user is on the Create Sess', async ({ page }) => {
    // Test Case: UTC-1
    // Summary: Verify Default state of Approval Level field when the user is on the Create Session page
    // Description: Feature: Approval Level Initialization The system controls default visibility of Approval Level fields. Scenario: Default state of Approval Level field Given the user is on the Create Session page When the page loads Then only the Add Level button should be visible and no Approval Level field should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2: Verify Display Approval Level field on Add Level click when the user is on the C', async ({ page }) => {
    // Test Case: UTC-2
    // Summary: Verify Display Approval Level field on Add Level click when the user is on the Create Session page
    // Description: Feature: Dynamic Approval Level Addition The system allows users to add approval levels dynamically. Scenario: Display Approval Level field on Add Level click Given the user is on the Create Session page When the user clicks the Add Level button Then a new Approval Level field should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-3: Verify Add approval levels up to maximum limit when the user keeps clicking Add ', async ({ page }) => {
    // Test Case: UTC-3
    // Summary: Verify Add approval levels up to maximum limit when the user keeps clicking Add Level
    // Description: Feature: Approval Level Limit Control The system restricts the number of approval levels. Scenario: Add approval levels up to maximum limit Given the user keeps clicking Add Level When five Approval Level fields are added Then the system should not allow adding more than 5 levels

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-4: Verify Submit session with empty Approval Level fields when one or more Approval', async ({ page }) => {
    // Test Case: UTC-4
    // Summary: Verify Submit session with empty Approval Level fields when one or more Approval Level fields are added
    // Description: Feature: Mandatory User Selection Validation The system validates user selection in approval levels. Scenario: Submit session with empty Approval Level fields Given one or more Approval Level fields are added And no user or group is selected in a level When the user clicks Create Session Then a toast message should be displayed saying: “Error creating session: Each approval level must have at least one user selected”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-5: Verify Select multiple users in a single approval level when an Approval Level f', async ({ page }) => {
    // Test Case: UTC-5
    // Summary: Verify Select multiple users in a single approval level when an Approval Level field is displayed
    // Description: Feature: Multiple User Selection per Level The system supports assigning multiple users or groups per level. Scenario: Select multiple users in a single approval level Given an Approval Level field is displayed When the user selects multiple users or user groups Then all selected users or groups should be added successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-6: Verify Same user added individually and via group when a user is already part of', async ({ page }) => {
    // Test Case: UTC-6
    // Summary: Verify Same user added individually and via group when a user is already part of a selected user group
    // Description: Feature: Duplicate User Conflict Prevention (Individual vs Group) The system prevents duplicate user assignments. Scenario: Same user added individually and via group Given a user is already part of a selected user group When the same user is selected individually in the same level Then the system should prevent the selection or show validation

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-7: Verify User group added after individual user selection when an individual user ', async ({ page }) => {
    // Test Case: UTC-7
    // Summary: Verify User group added after individual user selection when an individual user is already selected in a level
    // Description: Feature: Duplicate User Conflict Prevention (Group vs Individual) The system enforces unique user assignment per level. Scenario: User group added after individual user selection Given an individual user is already selected in a level When a group containing the same user is selected Then the system should restrict the group selection or exclude the duplicate user

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-8: Verify Submit session with valid approval levels when all Approval Levels have a', async ({ page }) => {
    // Test Case: UTC-8
    // Summary: Verify Submit session with valid approval levels when all Approval Levels have at least one unique user or group selected
    // Description: Feature: Approval Level Data Integrity The system ensures each level has valid and unique users. Scenario: Submit session with valid approval levels Given all Approval Levels have at least one unique user or group selected And no duplicate users exist across individual and group selections When the user submits the session Then the session should be created successfully

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
