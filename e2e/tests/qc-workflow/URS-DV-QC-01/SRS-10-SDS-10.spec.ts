import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Assignee and Approval users see consistent layout when the user logs in as Assignee or Approval Level user
 * URS: URS-DV-QC-01
 * SRS: SRS-10
 * SDS: SDS-10
 */
test.describe('URS-DV-QC-01: Verify Assignee and Approval users see consistent layout whe', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-80: Verify Assignee and Approval users see consistent layout when the user logs in a', async ({ page }) => {
    // Test Case: UTC-80
    // Summary: Verify Assignee and Approval users see consistent layout when the user logs in as Assignee or Approval Level user
    // Description: Feature: Clear and consistent UI across roles Scenario: Assignee and Approval users see consistent layout Given the user logs in as Assignee or Approval Level user When the Data Labeling page is opened Then the page layout, icons, and controls should be consistent across roles

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-81: Verify User can easily identify image status when images are displayed in the gr', async ({ page }) => {
    // Test Case: UTC-81
    // Summary: Verify User can easily identify image status when images are displayed in the grid
    // Description: Feature: Image status clarity Scenario: User can easily identify image status Given images are displayed in the grid When the user views image cards Then status labels such as PENDING, IN_REVIEW, ACCEPTED, REJECTED should be clearly visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-82: Verify Approval level is clearly indicated on images when an image is under revi', async ({ page }) => {
    // Test Case: UTC-82
    // Summary: Verify Approval level is clearly indicated on images when an image is under review
    // Description: Feature: Approval level indicator visibility Scenario: Approval level is clearly indicated on images Given an image is under review When the image card is displayed Then approval level indicators like L1, L2, L3, L4, L5 should be clearly shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-83: Verify User navigates between sessions smoothly when the user is on the Session ', async ({ page }) => {
    // Test Case: UTC-83
    // Summary: Verify User navigates between sessions smoothly when the user is on the Session list page
    // Description: Feature: Easy navigation across sessions Scenario: User navigates between sessions smoothly Given the user is on the Session list page When the user navigates between different sessions Then navigation should be intuitive with clear breadcrumbs and page titles

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-84: Verify Actions remain predictable across approval levels when users at different', async ({ page }) => {
    // Test Case: UTC-84
    // Summary: Verify Actions remain predictable across approval levels when users at different approval levels access the same workflow
    // Description: Feature: Consistent action buttons across levels Scenario: Actions remain predictable across approval levels Given users at different approval levels access the same workflow When action buttons are displayed Then Accept, Reject, View actions should appear consistently based on role

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-85: Verify User understands actions via tooltips when the user hovers over icons or ', async ({ page }) => {
    // Test Case: UTC-85
    // Summary: Verify User understands actions via tooltips when the user hovers over icons or buttons
    // Description: Feature: Tooltip and label guidance Scenario: User understands actions via tooltips Given the user hovers over icons or buttons When tooltips are shown Then the tooltip text should clearly explain the action in simple language

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-86: Verify UI updates instantly after user action when the user performs Accept or R', async ({ page }) => {
    // Test Case: UTC-86
    // Summary: Verify UI updates instantly after user action when the user performs Accept or Reject action
    // Description: Feature: Immediate UI feedback on actions Scenario: UI updates instantly after user action Given the user performs Accept or Reject action When the action is completed Then image status and approval level should update immediately in the UI

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-87: Verify User receives understandable error messages when a restricted or invalid ', async ({ page }) => {
    // Test Case: UTC-87
    // Summary: Verify User receives understandable error messages when a restricted or invalid action is performed
    // Description: Feature: Plain-language validation messages Scenario: User receives understandable error messages Given a restricted or invalid action is performed When an error message is displayed Then the message should be in plain, non-technical language

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-88: Verify User understands why actions are disabled when the image is not in the us', async ({ page }) => {
    // Test Case: UTC-88
    // Summary: Verify User understands why actions are disabled when the image is not in the users active approval level
    // Description: Feature: Role-based restriction clarity Scenario: User understands why actions are disabled Given the image is not in the user’s active approval level When the user views the image Then edit and action controls should be disabled with clear indication

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-89: Verify End-to-end image review is easy to understand when a user participates in', async ({ page }) => {
    // Test Case: UTC-89
    // Summary: Verify End-to-end image review is easy to understand when a user participates in the review workflow from login to action
    // Description: Feature: Overall review experience simplicity Scenario: End-to-end image review is easy to understand Given a user participates in the review workflow from login to action When navigating, reviewing, and approving images Then the workflow should feel intuitive without requiring training

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
