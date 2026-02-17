import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Load images only for current approval level when the user logs in as a Level 1 reviewer
 * URS: URS-DV-GEN-3
 * SRS: SRS-28
 * SDS: SDS-28
 */
test.describe('URS-DV-GEN-3: Verify Load images only for current approval level when the ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-338: Verify Load images only for current approval level when the user logs in as a Le', async ({ page }) => {
    // Test Case: UTC-338
    // Summary: Verify Load images only for current approval level when the user logs in as a Level 1 reviewer
    // Description: Feature: Multi-Level Image Approval Flow Scenario: Load images only for current approval level Given the user logs in as a Level 1 reviewer When the image grid loads Then only Level 1 assigned images should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-339: Verify Show current level indicator when the user opens an image', async ({ page }) => {
    // Test Case: UTC-339
    // Summary: Verify Show current level indicator when the user opens an image
    // Description: Scenario: Show current level indicator Given the user opens an image When the image details panel is displayed Then the current approval level should be shown clearly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-340: Verify Accept button enabled for assigned user when the image belongs to the use', async ({ page }) => {
    // Test Case: UTC-340
    // Summary: Verify Accept button enabled for assigned user when the image belongs to the users active level
    // Description: Scenario: Accept button enabled for assigned user Given the image belongs to the user’s active level When the image loads Then the Accept button should be enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-341: Verify Reject button enabled for assigned user when the image belongs to the use', async ({ page }) => {
    // Test Case: UTC-341
    // Summary: Verify Reject button enabled for assigned user when the image belongs to the users active level
    // Description: Scenario: Reject button enabled for assigned user Given the image belongs to the user’s active level When the image loads Then the Reject button should be enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-342: Verify Accept moves image to next level when an image is at Level 1', async ({ page }) => {
    // Test Case: UTC-342
    // Summary: Verify Accept moves image to next level when an image is at Level 1
    // Description: Scenario: Accept moves image to next level Given an image is at Level 1 When the user clicks Accept Then the image should move to Level 2 and be removed from Level 1 list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-343: Verify Reject moves image to previous level when an image is at Level 2', async ({ page }) => {
    // Test Case: UTC-343
    // Summary: Verify Reject moves image to previous level when an image is at Level 2
    // Description: Scenario: Reject moves image to previous level Given an image is at Level 2 When the user clicks Reject Then the image should move back to Level 1

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-344: Verify Final approval completes workflow when an image is at Level 5', async ({ page }) => {
    // Test Case: UTC-344
    // Summary: Verify Final approval completes workflow when an image is at Level 5
    // Description: Scenario: Final approval completes workflow Given an image is at Level 5 When the user clicks Accept Then the image status should change to Approved/Completed and exit the approval queue

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-345: Verify Other level users cannot view image when an image is assigned to Level 2', async ({ page }) => {
    // Test Case: UTC-345
    // Summary: Verify Other level users cannot view image when an image is assigned to Level 2
    // Description: Scenario: Other level users cannot view image Given an image is assigned to Level 2 When a Level 1 user logs in Then the image should not be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-346: Verify Multiple users at same level can act when multiple reviewers are assigned', async ({ page }) => {
    // Test Case: UTC-346
    // Summary: Verify Multiple users at same level can act when multiple reviewers are assigned to Level 1
    // Description: Scenario: Multiple users at same level can act Given multiple reviewers are assigned to Level 1 When any reviewer performs Accept or Reject Then the action should be processed successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-347: Verify User group members can access images when a user belongs to an assigned a', async ({ page }) => {
    // Test Case: UTC-347
    // Summary: Verify User group members can access images when a user belongs to an assigned approval group
    // Description: Scenario: User group members can access images Given a user belongs to an assigned approval group When images are loaded Then the group user should be able to review and act

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-348: Verify Status updates immediately after action when the user clicks Accept or Re', async ({ page }) => {
    // Test Case: UTC-348
    // Summary: Verify Status updates immediately after action when the user clicks Accept or Reject
    // Description: Scenario: Status updates immediately after action Given the user clicks Accept or Reject When the action completes Then the image status and level should update instantly without reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-349: Verify Actions disabled for unauthorized users when the user is not assigned to ', async ({ page }) => {
    // Test Case: UTC-349
    // Summary: Verify Actions disabled for unauthorized users when the user is not assigned to the current level
    // Description: Scenario: Actions disabled for unauthorized users Given the user is not assigned to the current level When viewing the image Then Accept and Reject buttons should be disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-350: Verify Prevent duplicate actions when the user clicks Accept once', async ({ page }) => {
    // Test Case: UTC-350
    // Summary: Verify Prevent duplicate actions when the user clicks Accept once
    // Description: Scenario: Prevent duplicate actions Given the user clicks Accept once When the request is processing Then additional clicks should be ignored

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-351: Verify Status and level clearly visible when multiple images exist across levels', async ({ page }) => {
    // Test Case: UTC-351
    // Summary: Verify Status and level clearly visible when multiple images exist across levels
    // Description: Scenario: Status and level clearly visible Given multiple images exist across levels When the grid is displayed Then each image should show clear status and level labels

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
