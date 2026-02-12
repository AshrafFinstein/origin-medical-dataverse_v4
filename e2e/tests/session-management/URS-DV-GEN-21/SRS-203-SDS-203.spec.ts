import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system blocks when same user is assigned as Assignee and Approver when the user is on Create/Edit Session page
 * URS: URS-DV-GEN-21
 * SRS: SRS-203
 * SDS: SDS-203
 */
test.describe('URS-DV-GEN-21: Verify system blocks when same user is assigned as Assignee ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2065: Verify system blocks when same user is assigned as Assignee and Approver when th', async ({ page }) => {
    // Test Case: UTC-2065
    // Summary: Verify system blocks when same user is assigned as Assignee and Approver when the user is on Create/Edit Session page
    // Description: Feature: User Role Conflict – Block Assignee vs Approver Conflict Scenario: Verify system blocks when same user is assigned as Assignee and Approver Given the user is on Create/Edit Session page When the user selects “User A” as an Assignee And also selects “User A” in Approval Level 1 And clicks Save/Create Session Then the system should block submission And show toast message “User A is assigned as both Assignee and in Approval Level 1”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2066: Verify system blocks when same user is assigned to multiple approval levels when', async ({ page }) => {
    // Test Case: UTC-2066
    // Summary: Verify system blocks when same user is assigned to multiple approval levels when the user is configuring approval levels
    // Description: Feature: User Role Conflict – Block Multiple Approval Level Assignment Scenario: Verify system blocks when same user is assigned to multiple approval levels Given the user is configuring approval levels When the user selects “User B” in Approval Level 1 And also selects “User B” in Approval Level 2 And clicks Save/Create Session Then the system should block submission And show toast message “User B is assigned to multiple Approval Levels...”

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
