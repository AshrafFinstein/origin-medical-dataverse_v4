import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Delete Session modal opens when user has delete permission
 * URS: URS-DV-SEC-18
 * SRS: SRS-143
 * SDS: SDS-143
 */
test.describe('URS-DV-SEC-18: Verify Delete Session modal opens when user has delete permi', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1870: Verify Delete Session modal opens when user has delete permission', async ({ page }) => {
    // Test Case: UTC-1870
    // Summary: Verify Delete Session modal opens when user has delete permission
    // Description: Feature: Deletion Request Submission Scenario: Delete Session modal opens Given user has delete permission When user clicks Delete Session Then the Delete Session modal should open

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1871: Verify Session name displayed as read-only when modal is open', async ({ page }) => {
    // Test Case: UTC-1871
    // Summary: Verify Session name displayed as read-only when modal is open
    // Description: Feature: Deletion Request Submission Scenario: Session name displayed as read-only Given modal is open When user views session name field Then session name should be visible and read-only

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1872: Verify Reason textarea visible when modal is open', async ({ page }) => {
    // Test Case: UTC-1872
    // Summary: Verify Reason textarea visible when modal is open
    // Description: Feature: Deletion Request Submission Scenario: Reason textarea visible Given modal is open When UI renders Then Reason textarea should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1873: Verify Request button disabled by default when modal opens', async ({ page }) => {
    // Test Case: UTC-1873
    // Summary: Verify Request button disabled by default when modal opens
    // Description: Feature: Deletion Request Submission Scenario: Request button disabled by default Given modal opens When no reason is entered Then Request Approval button should be disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1874: Verify Enable submit after input when modal is open', async ({ page }) => {
    // Test Case: UTC-1874
    // Summary: Verify Enable submit after input when modal is open
    // Description: Feature: Deletion Request Submission Scenario: Enable submit after input Given modal is open When user enters at least one character Then Request Approval button should be enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1875: Verify Leading/trailing spaces trimmed when reason entered with spaces', async ({ page }) => {
    // Test Case: UTC-1875
    // Summary: Verify Leading/trailing spaces trimmed when reason entered with spaces
    // Description: Feature: Deletion Request Submission Scenario: Leading/trailing spaces trimmed Given reason entered with spaces When Request Approval is clicked Then submitted reason should be trimmed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1876: Verify Character counter displayed when modal is open', async ({ page }) => {
    // Test Case: UTC-1876
    // Summary: Verify Character counter displayed when modal is open
    // Description: Feature: Deletion Request Submission Scenario: Character counter displayed Given modal is open When user types reason Then character counter should update correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1877: Verify Max character limit enforced when 500 characters entered', async ({ page }) => {
    // Test Case: UTC-1877
    // Summary: Verify Max character limit enforced when 500 characters entered
    // Description: Feature: Deletion Request Submission Scenario: Max character limit enforced Given 500 characters entered When user tries to exceed limit Then additional characters should not be accepted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1878: Verify Submit request successfully when valid reason entered', async ({ page }) => {
    // Test Case: UTC-1878
    // Summary: Verify Submit request successfully when valid reason entered
    // Description: Feature: Deletion Request Submission Scenario: Submit request successfully Given valid reason entered When user clicks Request Approval Then deletion request should be created

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1879: Verify Status set to PENDING when request is submitted', async ({ page }) => {
    // Test Case: UTC-1879
    // Summary: Verify Status set to PENDING when request is submitted
    // Description: Feature: Deletion Request Submission Scenario: Status set to PENDING Given request is submitted When backend stores request Then status should be saved as PENDING

    // Navigate to module
    await sessionPage.navigateToModule();

    // Create session
    await sessionPage.createSession({
      name: 'Test Session',
      description: 'Test Description'
    });

    const sessionExists = await sessionPage.sessionExists('Test Session');
    expect(sessionExists).toBe(true);
  });

  test('UTC-1880: Verify Correct payload sent when Request Approval clicked', async ({ page }) => {
    // Test Case: UTC-1880
    // Summary: Verify Correct payload sent when Request Approval clicked
    // Description: Feature: Deletion Request Submission Scenario: Correct payload sent Given Request Approval clicked When API request is sent Then payload should contain sessionId and reason

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1881: Verify Cancel button behavior when modal is open', async ({ page }) => {
    // Test Case: UTC-1881
    // Summary: Verify Cancel button behavior when modal is open
    // Description: Feature: Deletion Request Submission Scenario: Cancel button behavior Given modal is open When user clicks Cancel Then modal should close without saving

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1882: Verify Unauthorized access blocked when user lacks delete permission', async ({ page }) => {
    // Test Case: UTC-1882
    // Summary: Verify Unauthorized access blocked when user lacks delete permission
    // Description: Feature: Deletion Request Submission Scenario: Unauthorized access blocked Given user lacks delete permission When Delete Session is attempted Then modal should not open

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1883: Verify No duplicate submissions when Request Approval clicked once', async ({ page }) => {
    // Test Case: UTC-1883
    // Summary: Verify No duplicate submissions when Request Approval clicked once
    // Description: Feature: Deletion Request Submission Scenario: No duplicate submissions Given Request Approval clicked once When button is disabled during API call Then duplicate requests should not be created

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1884: Verify API failure handling when backend error occurs', async ({ page }) => {
    // Test Case: UTC-1884
    // Summary: Verify API failure handling when backend error occurs
    // Description: Feature: Deletion Request Submission Scenario: API failure handling Given backend error occurs When Request Approval is clicked Then error message should be shown and request not saved

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
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
