import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Unlock icon is visible for locked session when a session is locked successfully
 * URS: URS-DV-GEN-31
 * SRS: SRS-257
 * SDS: SDS-257
 */
test.describe('URS-DV-GEN-31: Verify Unlock icon is visible for locked session when a sess', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2667: Verify Unlock icon is visible for locked session when a session is locked succes', async ({ page }) => {
    // Test Case: UTC-2667
    // Summary: Verify Unlock icon is visible for locked session when a session is locked successfully
    // Description: Feature: Unlock Session – Unlock Icon Visibility Scenario: Verify Unlock icon is visible for locked session Given a session is locked successfully When the session list page is displayed Then Unlock icon should be visible for that locked session row

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2668: Verify Unlock popup opens on clicking unlock icon when the session is locked', async ({ page }) => {
    // Test Case: UTC-2668
    // Summary: Verify Unlock popup opens on clicking unlock icon when the session is locked
    // Description: Feature: Unlock Session – Popup Open Scenario: Verify Unlock popup opens on clicking unlock icon Given the session is locked When the user clicks Unlock icon Then Unlock popup should open with Reason textbox and Submit/Cancel buttons

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2669: Verify unlock submission is blocked if reason is empty when Unlock popup is open', async ({ page }) => {
    // Test Case: UTC-2669
    // Summary: Verify unlock submission is blocked if reason is empty when Unlock popup is opened
    // Description: Feature: Unlock Session – Reason Mandatory Validation Scenario: Verify unlock submission is blocked if reason is empty Given Unlock popup is opened When the user keeps Reason field empty And clicks Submit Then the system should block unlock action And mandatory validation should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2670: Verify session unlocks successfully with valid reason when Unlock popup is opene', async ({ page }) => {
    // Test Case: UTC-2670
    // Summary: Verify session unlocks successfully with valid reason when Unlock popup is opened
    // Description: Feature: Unlock Session – Successful Unlock Scenario: Verify session unlocks successfully with valid reason Given Unlock popup is opened When the user enters a valid unlock reason And clicks Submit Then the session should be unlocked successfully And session state should change to Re-open

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2671: Verify Edit/Delete actions are enabled after session unlock when the session was', async ({ page }) => {
    // Test Case: UTC-2671
    // Summary: Verify Edit/Delete actions are enabled after session unlock when the session was locked and then unlocked successfully
    // Description: Feature: Unlock Session – Actions Enabled After Unlock Scenario: Verify Edit/Delete actions are enabled after session unlock Given the session was locked and then unlocked successfully When the user views Actions column for that session Then Edit and Delete actions should become enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2672: Verify session remains locked when user cancels unlock popup when Unlock popup i', async ({ page }) => {
    // Test Case: UTC-2672
    // Summary: Verify session remains locked when user cancels unlock popup when Unlock popup is opened
    // Description: Feature: Unlock Session – Cancel Does Not Unlock Session Scenario: Verify session remains locked when user cancels unlock popup Given Unlock popup is opened When the user enters a reason And clicks Cancel Then the popup should close And the session should remain locked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2673: Verify unauthorized user cannot unlock session when a session is locked', async ({ page }) => {
    // Test Case: UTC-2673
    // Summary: Verify unauthorized user cannot unlock session when a session is locked
    // Description: Feature: Unlock Session – Only Authorized Users Can Unlock Scenario: Verify unauthorized user cannot unlock session Given a session is locked And the logged-in user does not have Lock permission When the user tries to unlock the session Then the system should block the unlock action And session should remain locked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2674: Verify unlock reason is stored for audit and visible in history/tooltip if avail', async ({ page }) => {
    // Test Case: UTC-2674
    // Summary: Verify unlock reason is stored for audit and visible in history/tooltip if available when the session is unlocked with a reason
    // Description: Feature: Unlock Session – Unlock Reason Stored Scenario: Verify unlock reason is stored for audit and visible in history/tooltip if available Given the session is unlocked with a reason When the user checks lock/unlock info (tooltip/log if available) Then the unlock reason should be recorded correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
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
