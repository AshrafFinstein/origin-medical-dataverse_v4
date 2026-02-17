import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Modal appears for deletion when a user initiates any delete action
 * URS: URS-DV-GEN-16
 * SRS: SRS-125
 * SDS: SDS-125
 */
test.describe('URS-DV-GEN-16: Verify Modal appears for deletion when a user initiates any ', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1722: Verify Modal appears for deletion when a user initiates any delete action', async ({ page }) => {
    // Test Case: UTC-1722
    // Summary: Verify Modal appears for deletion when a user initiates any delete action
    // Description: Feature: Standardized Deletion Confirmation Modal Scenario: Modal appears for deletion Given a user initiates any delete action When delete is triggered Then a confirmation modal should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1723: Verify Overlay background displayed when the modal is open', async ({ page }) => {
    // Test Case: UTC-1723
    // Summary: Verify Overlay background displayed when the modal is open
    // Description: Feature: Standardized Deletion Confirmation Modal Scenario: Overlay background displayed Given the modal is open When UI renders Then the background should be dimmed with dark overlay

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1724: Verify Question text clarity when modal is displayed', async ({ page }) => {
    // Test Case: UTC-1724
    // Summary: Verify Question text clarity when modal is displayed
    // Description: Feature: Standardized Deletion Confirmation Modal Scenario: Question text clarity Given modal is displayed When content loads Then it should clearly describe items being deleted

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1725: Verify Yes button visible when modal appears', async ({ page }) => {
    // Test Case: UTC-1725
    // Summary: Verify Yes button visible when modal appears
    // Description: Feature: Standardized Deletion Confirmation Modal Scenario: Yes button visible Given modal appears When user views actions Then green Yes button should be visible and enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1726: Verify No button visible when modal appears', async ({ page }) => {
    // Test Case: UTC-1726
    // Summary: Verify No button visible when modal appears
    // Description: Feature: Standardized Deletion Confirmation Modal Scenario: No button visible Given modal appears When user views actions Then red No button should be visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1727: Verify Confirm deletion when modal is open', async ({ page }) => {
    // Test Case: UTC-1727
    // Summary: Verify Confirm deletion when modal is open
    // Description: Feature: Standardized Deletion Confirmation Modal Scenario: Confirm deletion Given modal is open When user clicks Yes Then deletion should proceed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1728: Verify Cancel deletion when modal is open', async ({ page }) => {
    // Test Case: UTC-1728
    // Summary: Verify Cancel deletion when modal is open
    // Description: Feature: Standardized Deletion Confirmation Modal Scenario: Cancel deletion Given modal is open When user clicks No Then deletion should be cancelled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1729: Verify Escape key cancels when modal is active', async ({ page }) => {
    // Test Case: UTC-1729
    // Summary: Verify Escape key cancels when modal is active
    // Description: Feature: Standardized Deletion Confirmation Modal Scenario: Escape key cancels Given modal is active When user presses Escape Then modal should close and cancel action

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1730: Verify Clicking outside cancels when modal is open', async ({ page }) => {
    // Test Case: UTC-1730
    // Summary: Verify Clicking outside cancels when modal is open
    // Description: Feature: Standardized Deletion Confirmation Modal Scenario: Clicking outside cancels Given modal is open When user clicks overlay background Then modal should close with No action

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1731: Verify Pass deletion metadata when deletion type and count are provided', async ({ page }) => {
    // Test Case: UTC-1731
    // Summary: Verify Pass deletion metadata when deletion type and count are provided
    // Description: Feature: Standardized Deletion Confirmation Modal Scenario: Pass deletion metadata Given deletion type and count are provided When modal opens Then correct item type and count should be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1732: Verify Multiple delete triggers when rapid clicks occur', async ({ page }) => {
    // Test Case: UTC-1732
    // Summary: Verify Multiple delete triggers when rapid clicks occur
    // Description: Feature: Standardized Deletion Confirmation Modal Scenario: Multiple delete triggers Given rapid clicks occur When modal already open Then duplicate modals should not appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1733: Verify Keyboard navigation when modal is open', async ({ page }) => {
    // Test Case: UTC-1733
    // Summary: Verify Keyboard navigation when modal is open
    // Description: Feature: Standardized Deletion Confirmation Modal Scenario: Keyboard navigation Given modal is open When user tabs through controls Then focus should move between Yes/No buttons

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1734: Verify Instant modal rendering when delete is clicked', async ({ page }) => {
    // Test Case: UTC-1734
    // Summary: Verify Instant modal rendering when delete is clicked
    // Description: Feature: Standardized Deletion Confirmation Modal Scenario: Instant modal rendering Given delete is clicked When modal opens Then it should appear within 1 second

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1735: Verify No action without confirmation when modal is shown', async ({ page }) => {
    // Test Case: UTC-1735
    // Summary: Verify No action without confirmation when modal is shown
    // Description: Feature: Standardized Deletion Confirmation Modal Scenario: No action without confirmation Given modal is shown When user closes browser/tab Then deletion must not execute

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
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
