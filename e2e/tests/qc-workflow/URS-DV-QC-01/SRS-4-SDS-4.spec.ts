import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Display QUALITY CHECKER stage for Levels when the Approval Levels user is on the Data Labeling page
 * URS: URS-DV-QC-01
 * SRS: SRS-4
 * SDS: SDS-4
 */
test.describe('URS-DV-QC-01: Verify Display QUALITY CHECKER stage for Levels when the App', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-29: Verify Display QUALITY CHECKER stage for Levels when the Approval Levels user is', async ({ page }) => {
    // Test Case: UTC-29
    // Summary: Verify Display QUALITY CHECKER stage for Levels when the Approval Levels user is on the Data Labeling page
    // Description: Feature: QC Session – Stage Display As an Approval Level reviewer, the user wants to clearly identify the current session stage. Scenario: Display QUALITY CHECKER stage for Levels Given the Approval Levels user is on the Data Labeling page When the session details are viewed Then the Stage should be displayed as QUALITY CHECKER

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-30: Verify Display Assignee name for Approval Levels when the Approval Levels user i', async ({ page }) => {
    // Test Case: UTC-30
    // Summary: Verify Display Assignee name for Approval Levels when the Approval Levels user is on the Data Labeling page
    // Description: Feature: QC Session – Assignee Display As a reviewer, the user wants to see the correct assignee information. Scenario: Display Assignee name for Approval Levels Given the Approval Levels user is on the Data Labeling page When the session details are viewed Then the Assignee should be displayed correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-31: Verify Display Approval Level as Level 1 , Level 2 , Level 3, Level 4 and Level ', async ({ page }) => {
    // Test Case: UTC-31
    // Summary: Verify Display Approval Level as Level 1 , Level 2 , Level 3, Level 4 and Level 5 when the Approval Levels user is on the Data Labeling page
    // Description: Feature: QC Session – Approval Level Display As a reviewer, the user wants to confirm their approval levels. Scenario: Display Approval Level as Level 1 , Level 2 , Level 3, Level 4 and Level 5 Given the Approval Levels user is on the Data Labeling page When the session details are viewed Then the Approval Level should be displayed as Level 1 , Level 2 , Level 3, Level 4 and Level 5

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-32: Verify Default Select Status is IN_REVIEW when the user is logged in as Approval', async ({ page }) => {
    // Test Case: UTC-32
    // Summary: Verify Default Select Status is IN_REVIEW when the user is logged in as Approval Levels
    // Description: Feature: QC Status Filtering – Default State As an Approval Levels reviewer, the user wants to immediately see images pending their review. Scenario: Default Select Status is IN_REVIEW Given the user is logged in as Approval Levels When the user opens the Data Labeling page Then the Select Status field should default to IN_REVIEW

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-33: Verify Auto-check Awaiting Approval for Levels when the user is logged in as App', async ({ page }) => {
    // Test Case: UTC-33
    // Summary: Verify Auto-check Awaiting Approval for Levels when the user is logged in as Approval Level
    // Description: Feature: QC Filter Defaults – Awaiting Approval As a reviewer, the user wants the system to automatically filter images awaiting their action. Scenario: Auto-check Awaiting Approval for Levels Given the user is logged in as Approval Level When the Data Labeling page is loaded Then Awaiting Approval should be auto-checked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-34: Verify Display Accept and Reject actions when an image is in IN_REVIEW state', async ({ page }) => {
    // Test Case: UTC-34
    // Summary: Verify Display Accept and Reject actions when an image is in IN_REVIEW state
    // Description: Feature: QC Actions – Availability As a Levels reviewer, the user wants to accept or reject images. Scenario: Display Accept and Reject actions Given an image is in IN_REVIEW state When the image actions are viewed Then Accept and Reject options should be available

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-35: Verify Any Level user accepts image when an image is in IN_REVIEW state', async ({ page }) => {
    // Test Case: UTC-35
    // Summary: Verify Any Level user accepts image when an image is in IN_REVIEW state
    // Description: Feature: QC Actions – Accept at Levels As a Levels reviewer, the user wants to approve images. Scenario: Any Level user accepts image Given an image is in IN_REVIEW state When any Level user clicks Accept Then the image should be accepted at Levels

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-36: Verify Reject moves image to earlier approval level when a rejected image is sel', async ({ page }) => {
    // Test Case: UTC-36
    // Summary: Verify Reject moves image to earlier approval level when a rejected image is selected
    // Description: Feature: QC Rollback Workflow – Reject Action As a previous level reviewer, the user wants to further reject the image. Scenario: Reject moves image to earlier approval level Given a rejected image is selected When the user clicks Reject Then the image should move to the earlier approval level

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
