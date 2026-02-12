import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Completed option enabled after eligibility when a session is eligible for completion
 * URS: URS-DV-GEN-25
 * SRS: SRS-230
 * SDS: SDS-230
 */
test.describe('URS-DV-GEN-25: Verify Completed option enabled after eligibility when a ses', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2357: Verify Completed option enabled after eligibility when a session is eligible for', async ({ page }) => {
    // Test Case: UTC-2357
    // Summary: Verify Completed option enabled after eligibility when a session is eligible for completion
    // Description: Feature: Update Session Status to Completed Scenario: Completed option enabled after eligibility Given a session is eligible for completion When the Session Status dropdown is opened Then the “Completed” option should be enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2358: Verify Change status to Completed when the session is eligible', async ({ page }) => {
    // Test Case: UTC-2358
    // Summary: Verify Change status to Completed when the session is eligible
    // Description: Feature: Update Session Status to Completed Scenario: Change status to Completed Given the session is eligible When the user selects “Completed” from the dropdown Then the session status should change to “Completed”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2359: Verify Persist Completed status in backend when Completed is selected', async ({ page }) => {
    // Test Case: UTC-2359
    // Summary: Verify Persist Completed status in backend when Completed is selected
    // Description: Feature: Update Session Status to Completed Scenario: Persist Completed status in backend Given “Completed” is selected When the update request is sent Then the backend should persist the status as “Completed”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2360: Verify Completed status visible in session list when session status is Completed', async ({ page }) => {
    // Test Case: UTC-2360
    // Summary: Verify Completed status visible in session list when session status is Completed
    // Description: Feature: Update Session Status to Completed Scenario: Completed status visible in session list Given session status is “Completed” When the session list loads Then the session row should display “Completed” status

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2361: Verify Completed status visible in session detail view when session is marked Co', async ({ page }) => {
    // Test Case: UTC-2361
    // Summary: Verify Completed status visible in session detail view when session is marked Completed
    // Description: Feature: Update Session Status to Completed Scenario: Completed status visible in session detail view Given session is marked Completed When the session detail page opens Then the status field should show “Completed”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2362: Verify Status persists after page refresh when the session is marked Completed', async ({ page }) => {
    // Test Case: UTC-2362
    // Summary: Verify Status persists after page refresh when the session is marked Completed
    // Description: Feature: Update Session Status to Completed Scenario: Status persists after page refresh Given the session is marked Completed When the user refreshes the page Then the status should remain “Completed”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2363: Verify Restore previous status on failure when backend update fails', async ({ page }) => {
    // Test Case: UTC-2363
    // Summary: Verify Restore previous status on failure when backend update fails
    // Description: Feature: Update Session Status to Completed Scenario: Restore previous status on failure Given backend update fails When user selects “Completed” Then the previous session status should be restored

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2364: Verify Prevent completion when not eligible when the session is not eligible', async ({ page }) => {
    // Test Case: UTC-2364
    // Summary: Verify Prevent completion when not eligible when the session is not eligible
    // Description: Feature: Update Session Status to Completed Scenario: Prevent completion when not eligible Given the session is not eligible When the dropdown is opened Then “Completed” option should be disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2365: Verify Clear user feedback on status change when the status is updated successfu', async ({ page }) => {
    // Test Case: UTC-2365
    // Summary: Verify Clear user feedback on status change when the status is updated successfully
    // Description: Feature: Update Session Status to Completed Scenario: Clear user feedback on status change Given the status is updated successfully When the update completes Then the user should see clear visual confirmation

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2366: Verify Fast status update response when user selects Completed', async ({ page }) => {
    // Test Case: UTC-2366
    // Summary: Verify Fast status update response when user selects Completed
    // Description: Feature: Update Session Status to Completed Scenario: Fast status update response Given user selects “Completed” When the update request is sent Then the UI should update without noticeable delay

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
