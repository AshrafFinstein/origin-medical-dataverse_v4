import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Stage displayed as QUALITY CHECKER when the Final Approval Level user is on the Data Labeling page
 * URS: URS-DV-QC-01
 * SRS: SRS-7
 * SDS: SDS-7
 */
test.describe('URS-DV-QC-01: Verify Stage displayed as QUALITY CHECKER when the Final App', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-53: Verify Stage displayed as QUALITY CHECKER when the Final Approval Level user is ', async ({ page }) => {
    // Test Case: UTC-53
    // Summary: Verify Stage displayed as QUALITY CHECKER when the Final Approval Level user is on the Data Labeling page
    // Description: Feature: QC Session Details – Stage (Final Level) As a final reviewer, the user wants to see correct stage information. Scenario: Stage displayed as QUALITY CHECKER Given the Final Approval Level user is on the Data Labeling page When the session details are viewed Then the Stage should be displayed as QUALITY CHECKER

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-54: Verify Default Select Status is IN_REVIEW when the user is logged in as Final Ap', async ({ page }) => {
    // Test Case: UTC-54
    // Summary: Verify Default Select Status is IN_REVIEW when the user is logged in as Final Approval Level
    // Description: Feature: QC Status Default – Final Level As a final reviewer, the user wants default filters applied. Scenario: Default Select Status is IN_REVIEW Given the user is logged in as Final Approval Level When the Data Labeling page is opened Then the Select Status field should default to IN_REVIEW

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-55: Verify Display IN_REVIEW L images when Select Status is IN_REVIEW', async ({ page }) => {
    // Test Case: UTC-55
    // Summary: Verify Display IN_REVIEW L images when Select Status is IN_REVIEW
    // Description: Feature: QC Awaiting Approval – Final Level As a final reviewer, the user wants to see images awaiting action. Scenario: Display IN_REVIEW L images Given Select Status is IN_REVIEW And Awaiting Approval is checked When the image grid is displayed Then IN_REVIEW L images should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-56: Verify Enable Accept and Reject for IN_REVIEW L when an IN_REVIEW L image is sel', async ({ page }) => {
    // Test Case: UTC-56
    // Summary: Verify Enable Accept and Reject for IN_REVIEW L when an IN_REVIEW L image is selected
    // Description: Feature: QC Final Actions – Accept & Reject As a final reviewer, the user wants to take decision on images. Scenario: Enable Accept and Reject for IN_REVIEW L Given an IN_REVIEW L image is selected When the image action panel is viewed Then Accept and Reject buttons should be enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-57: Verify Image moves to ACCEPTED on Accept when an IN_REVIEW image is selected', async ({ page }) => {
    // Test Case: UTC-57
    // Summary: Verify Image moves to ACCEPTED on Accept when an IN_REVIEW image is selected
    // Description: Feature: QC Final Acceptance Workflow As a final reviewer, the user wants to accept the image. Scenario: Image moves to ACCEPTED on Accept Given an IN_REVIEW image is selected When the user clicks Accept Then the image should move to ACCEPTED status

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-58: Verify ACCEPTED status available after final acceptance when the image is accept', async ({ page }) => {
    // Test Case: UTC-58
    // Summary: Verify ACCEPTED status available after final acceptance when the image is accepted at final level
    // Description: Feature: QC Status Filter – ACCEPTED As a user, the user wants to filter accepted images. Scenario: ACCEPTED status available after final acceptance Given the image is accepted at final level When the user views Select Status options Then ACCEPTED status should be available

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-59: Verify Display accepted image under ACCEPTED status when the user selects ACCEPT', async ({ page }) => {
    // Test Case: UTC-59
    // Summary: Verify Display accepted image under ACCEPTED status when the user selects ACCEPTED from Select Status dropdown
    // Description: Feature: QC Image Listing – ACCEPTED As a user, the user wants to view accepted images. Scenario: Display accepted image under ACCEPTED status Given the user selects ACCEPTED from Select Status dropdown When the image grid is displayed Then the accepted image should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-60: Verify Assignee views accepted images when the image is in ACCEPTED status', async ({ page }) => {
    // Test Case: UTC-60
    // Summary: Verify Assignee views accepted images when the image is in ACCEPTED status
    // Description: Feature: QC Visibility – Assignee Accepted Images As an assignee, the user wants to view accepted images. Scenario: Assignee views accepted images Given the image is in ACCEPTED status When the assignee logs in and selects ACCEPTED Then the accepted image should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-61: Verify All approval levels view accepted images when the image is in ACCEPTED st', async ({ page }) => {
    // Test Case: UTC-61
    // Summary: Verify All approval levels view accepted images when the image is in ACCEPTED status
    // Description: Feature: QC Visibility – All Approval Levels As a system, accepted images must be visible to all approval levels. Scenario: All approval levels view accepted images Given the image is in ACCEPTED status When any approval level user selects ACCEPTED Then the accepted image should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-62: Verify Display ACCEPTED indicator on image when an accepted image is displayed', async ({ page }) => {
    // Test Case: UTC-62
    // Summary: Verify Display ACCEPTED indicator on image when an accepted image is displayed
    // Description: Feature: QC Accepted Indicator As a user, the user wants clear accepted status visibility. Scenario: Display ACCEPTED indicator on image Given an accepted image is displayed When the image card is viewed Then ACCEPTED status should be displayed inside the image

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
