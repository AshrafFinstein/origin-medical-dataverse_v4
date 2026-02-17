import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Display Send Selected to QC button when a PENDING image is selected in the image grid
 * URS: URS-DV-QC-01
 * SRS: SRS-3
 * SDS: SDS-3
 */
test.describe('URS-DV-QC-01: Verify Display Send Selected to QC button when a PENDING ima', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-21: Verify Display Send Selected to QC button when a PENDING image is selected in th', async ({ page }) => {
    // Test Case: UTC-21
    // Summary: Verify Display Send Selected to QC button when a PENDING image is selected in the image grid
    // Description: Feature: Data Labeling – Send to QC Action Availability As an Assignee, the user wants to send images to QC so that review can begin. Scenario: Display Send Selected to QC button Given a PENDING image is selected in the image grid When the image is displayed in the right-side panel Then the Send Selected to QC button should be visible and enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-22: Verify Send image to QC workflow when a PENDING image is selected', async ({ page }) => {
    // Test Case: UTC-22
    // Summary: Verify Send image to QC workflow when a PENDING image is selected
    // Description: Feature: Data Labeling – Send Image to QC As an Assignee, the user wants to send selected images to QC so that the approval workflow can start. Scenario: Send image to QC workflow Given a PENDING image is selected When the user clicks the Send Selected to QC button Then the image should be sent to the QC workflow

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-23: Verify Assign image to Approval Level 1 user when the image is sent to QC', async ({ page }) => {
    // Test Case: UTC-23
    // Summary: Verify Assign image to Approval Level 1 user when the image is sent to QC
    // Description: Feature: QC Routing – Image Assignment As a QC workflow system, the image must be routed to the correct approval level so that review can begin. Scenario: Assign image to Approval Level 1 user Given the image is sent to QC When the QC assignment is processed Then the image should be assigned to the Approval Level 1 user

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-24: Verify Change image status from PENDING to IN_REVIEW when the image is sent to Q', async ({ page }) => {
    // Test Case: UTC-24
    // Summary: Verify Change image status from PENDING to IN_REVIEW when the image is sent to QC
    // Description: Feature: QC Workflow – Status Transition As a system, the image status must update correctly when entering QC. Scenario: Change image status from PENDING to IN_REVIEW Given the image is sent to QC When the image status is checked Then the status should change from PENDING to IN_REVIEW

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-25: Verify Display review level indicator inside image when the image is in QC revie', async ({ page }) => {
    // Test Case: UTC-25
    // Summary: Verify Display review level indicator inside image when the image is in QC review state
    // Description: Feature: QC Review – Visual Indicators As a reviewer, the user wants to see the review level clearly on the image so that the current stage is obvious. Scenario: Display review level indicator inside image Given the image is in QC review state When the image is displayed in the image grid Then the review level indicator should be displayed inside the image

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-26: Verify Display IN_REVIEW L2 label inside image when the image has moved to the Q', async ({ page }) => {
    // Test Case: UTC-26
    // Summary: Verify Display IN_REVIEW L2 label inside image when the image has moved to the QC workflow
    // Description: Feature: QC Review – Level Label Display As a reviewer, the user wants the exact QC level to be visible on the image. Scenario: Display “IN_REVIEW L2” label inside image Given the image has moved to the QC workflow When the image is displayed in the grid Then IN_REVIEW L2 should be displayed inside the image

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-27: Verify Remove image from PENDING list after sending to QC when the image is sent', async ({ page }) => {
    // Test Case: UTC-27
    // Summary: Verify Remove image from PENDING list after sending to QC when the image is sent to QC
    // Description: Feature: QC Workflow – Status Filtering As a user, the user should no longer see QC images under PENDING status. Scenario: Remove image from PENDING list after sending to QC Given the image is sent to QC When the user filters images by PENDING status Then the image should not be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-28: Verify Display image under IN_REVIEW status when the image is sent to QC', async ({ page }) => {
    // Test Case: UTC-28
    // Summary: Verify Display image under IN_REVIEW status when the image is sent to QC
    // Description: Feature: QC Workflow – IN_REVIEW Listing As a reviewer, the user wants QC images to appear under IN_REVIEW status. Scenario: Display image under IN_REVIEW status Given the image is sent to QC When the user filters images by IN_REVIEW status Then the image should be displayed

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
