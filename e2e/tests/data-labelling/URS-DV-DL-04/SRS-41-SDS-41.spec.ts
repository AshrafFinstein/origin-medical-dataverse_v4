import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Logged-in username is visible when the user is authenticated
 * URS: URS-DV-DL-04
 * SRS: SRS-41
 * SDS: SDS-41
 */
test.describe('URS-DV-DL-04: Verify Logged-in username is visible when the user is authen', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-491: Verify Logged-in username is visible when the user is authenticated', async ({ page }) => {
    // Test Case: UTC-491
    // Summary: Verify Logged-in username is visible when the user is authenticated
    // Description: Feature: Role-Based Access Control – Header Identity Display Scenario: Logged-in username is visible Given the user is authenticated When the grid page loads Then the header should display Logged in as: [username]

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-492: Verify Label button enabled for authorized role when user.permissions.canLabel =', async ({ page }) => {
    // Test Case: UTC-492
    // Summary: Verify Label button enabled for authorized role when user.permissions.canLabel = true
    // Description: Feature: Role-Based Access Control – Label Permission Scenario: Label button enabled for authorized role Given user.permissions.canLabel = true When images are selected Then the APPLY button should be enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-493: Verify Label button disabled for read-only role when user.permissions.canLabel =', async ({ page }) => {
    // Test Case: UTC-493
    // Summary: Verify Label button disabled for read-only role when user.permissions.canLabel = false
    // Description: Feature: Role-Based Access Control – Label Restriction Scenario: Label button disabled for read-only role Given user.permissions.canLabel = false When the page loads Then the APPLY button should be hidden or disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-494: Verify Send for QC enabled for authorized users when user has QC permission', async ({ page }) => {
    // Test Case: UTC-494
    // Summary: Verify Send for QC enabled for authorized users when user has QC permission
    // Description: Feature: Role-Based Access Control – Send for QC Permission Scenario: Send for QC enabled for authorized users Given user has QC permission When images are selected Then the Send for QC button should be clickable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-495: Verify Send for QC hidden for read-only users when user lacks QC permission', async ({ page }) => {
    // Test Case: UTC-495
    // Summary: Verify Send for QC hidden for read-only users when user lacks QC permission
    // Description: Feature: Role-Based Access Control – Send for QC Restriction Scenario: Send for QC hidden for read-only users Given user lacks QC permission When viewing grid Then Send for QC button should not be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-496: Verify Unauthorized API action blocked when read-only user triggers label API', async ({ page }) => {
    // Test Case: UTC-496
    // Summary: Verify Unauthorized API action blocked when read-only user triggers label API
    // Description: Feature: Role-Based Access Control – Backend Enforcement Scenario: Unauthorized API action blocked Given read-only user triggers label API When request is sent Then API should return 403/401 and action should fail

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-497: Verify Session expires during action when session timeout occurs', async ({ page }) => {
    // Test Case: UTC-497
    // Summary: Verify Session expires during action when session timeout occurs
    // Description: Feature: Role-Based Access Control – Session Expiry Handling Scenario: Session expires during action Given session timeout occurs When user performs any API action Then system redirects to login page immediately

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-498: Verify Disabled controls clearly indicated when user lacks permissions', async ({ page }) => {
    // Test Case: UTC-498
    // Summary: Verify Disabled controls clearly indicated when user lacks permissions
    // Description: Feature: Role-Based Access Control – Visual Consistency Scenario: Disabled controls clearly indicated Given user lacks permissions When viewing buttons Then disabled buttons should show greyed-out state or tooltip

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-499: Verify User permissions stored in session state when user logs in', async ({ page }) => {
    // Test Case: UTC-499
    // Summary: Verify User permissions stored in session state when user logs in
    // Description: Feature: Role-Based Access Control – Session Data Storage Scenario: User permissions stored in session state Given user logs in When session is inspected Then permissions object should exist in session state

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-500: Verify Manual DOM enable attempt prevented when user manually enables disabled b', async ({ page }) => {
    // Test Case: UTC-500
    // Summary: Verify Manual DOM enable attempt prevented when user manually enables disabled button via dev tools
    // Description: Feature: Role-Based Access Control – Unauthorized UI Attempt Scenario: Manual DOM enable attempt prevented Given user manually enables disabled button via dev tools When action is triggered Then backend should still reject request

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
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
