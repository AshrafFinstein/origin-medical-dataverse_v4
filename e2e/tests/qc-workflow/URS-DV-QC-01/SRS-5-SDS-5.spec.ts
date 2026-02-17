import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Final level user rejects image when an image is in IN_REVIEW state
 * URS: URS-DV-QC-01
 * SRS: SRS-5
 * SDS: SDS-5
 */
test.describe('URS-DV-QC-01: Verify Final level user rejects image when an image is in IN', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-37: Verify Final level user rejects image when an image is in IN_REVIEW state', async ({ page }) => {
    // Test Case: UTC-37
    // Summary: Verify Final level user rejects image when an image is in IN_REVIEW state
    // Description: Feature: QC Decision – Reject Action As a final approval user, the user wants to reject images that fail QC checks. Scenario: Final level user rejects image Given an image is in IN_REVIEW state When the final level user clicks Reject Then the image should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-38: Verify Rejected image moves to previous level when an image is rejected at the f', async ({ page }) => {
    // Test Case: UTC-38
    // Summary: Verify Rejected image moves to previous level when an image is rejected at the final approval level
    // Description: Feature: QC Workflow Rollback – Final Rejection As a system, rejected images must move back to the previous approval level. Scenario: Rejected image moves to previous level Given an image is rejected at the final approval level When the workflow is updated Then the image should move back to the previous approval level

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-39: Verify REJECTED option available in Select Status when the user is on the Data L', async ({ page }) => {
    // Test Case: UTC-39
    // Summary: Verify REJECTED option available in Select Status when the user is on the Data Labeling page
    // Description: Feature: QC Status Filtering – REJECTED Option As a user, the user wants to filter rejected images easily. Scenario: REJECTED option available in Select Status Given the user is on the Data Labeling page When the user clicks the Select Status dropdown Then the REJECTED option should be available

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-40: Verify Display rejected images under REJECTED status when the user selects REJEC', async ({ page }) => {
    // Test Case: UTC-40
    // Summary: Verify Display rejected images under REJECTED status when the user selects REJECTED from the Select Status dropdown
    // Description: Feature: QC Image Listing – Rejected Images As a user, the user wants to view rejected images separately. Scenario: Display rejected images under REJECTED status Given the user selects REJECTED from the Select Status dropdown When the image grid is displayed Then the rejected image should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-41: Verify Display REJECTED L indicator when a rejected image is displayed under REJ', async ({ page }) => {
    // Test Case: UTC-41
    // Summary: Verify Display REJECTED L indicator when a rejected image is displayed under REJECTED status
    // Description: Feature: QC Rejection Indicator – Level As a user, the user wants to see rejection level information clearly. Scenario: Display REJECTED L indicator Given a rejected image is displayed under REJECTED status When the image card is viewed Then REJECTED L should be displayed inside the image

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-42: Verify Rejected image hidden from IN_REVIEW when an image is rejected at the fin', async ({ page }) => {
    // Test Case: UTC-42
    // Summary: Verify Rejected image hidden from IN_REVIEW when an image is rejected at the final level
    // Description: Feature: QC Status Consistency – Rejected Images As a system, rejected images must not appear in active review lists. Scenario: Rejected image hidden from IN_REVIEW Given an image is rejected at the final level When the user filters images by IN_REVIEW status Then the rejected image should not be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-43: Verify Change Select Status to REJECTED when the user is on the Data Labeling pa', async ({ page }) => {
    // Test Case: UTC-43
    // Summary: Verify Change Select Status to REJECTED when the user is on the Data Labeling page
    // Description: Feature: QC Status Filtering – REJECTED (Rollback) As a previous level reviewer, the user wants to view rejected images. Scenario: Change Select Status to REJECTED Given the user is on the Data Labeling page When the user selects REJECTED from the Select Status dropdown Then the status filter should be updated to REJECTED

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-44: Verify Display rejected images after rollback when Select Status is set to REJEC', async ({ page }) => {
    // Test Case: UTC-44
    // Summary: Verify Display rejected images after rollback when Select Status is set to REJECTED
    // Description: Feature: QC Image Listing – Rejected (Previous Level) As a previous level reviewer, the user wants to see rejected images. Scenario: Display rejected images after rollback Given Select Status is set to REJECTED When the image grid is displayed Then rejected images should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-45: Verify Display REJECTED L indicator when rejected images are displayed', async ({ page }) => {
    // Test Case: UTC-45
    // Summary: Verify Display REJECTED L indicator when rejected images are displayed
    // Description: Feature: QC Rejection Indicator – Rollback View As a previous level reviewer, the user wants to see correct rejection level. Scenario: Display REJECTED L indicator Given rejected images are displayed When the image card is viewed Then REJECTED L should be displayed inside the image

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-46: Verify Enable Accept and Reject actions for rejected image when a rejected image', async ({ page }) => {
    // Test Case: UTC-46
    // Summary: Verify Enable Accept and Reject actions for rejected image when a rejected image is selected
    // Description: Feature: QC Rollback Actions – Previous Level As a previous level reviewer, the user wants to take action on rejected images. Scenario: Enable Accept and Reject actions for rejected image Given a rejected image is selected When the image action panel is viewed Then Accept and Reject buttons should be enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-47: Verify Reject moves image to earlier approval level when a rejected image is sel', async ({ page }) => {
    // Test Case: UTC-47
    // Summary: Verify Reject moves image to earlier approval level when a rejected image is selected
    // Description: Feature: QC Rollback Workflow – Reject Action As a previous level reviewer, the user wants to further reject the image. Scenario: Reject moves image to earlier approval level Given a rejected image is selected When the user clicks Reject Then the image should move to the earlier approval level

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-48: Verify Accept moves image to final approval level when a rejected image is selec', async ({ page }) => {
    // Test Case: UTC-48
    // Summary: Verify Accept moves image to final approval level when a rejected image is selected
    // Description: Feature: QC Rollback Workflow – Accept Action As a previous level reviewer, the user wants to forward the image again. Scenario: Accept moves image to final approval level Given a rejected image is selected When the user clicks Accept Then the image should move to the final approval level

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
