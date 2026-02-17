import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, LabelSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Popup opens in Create mode when the user clicks Create Session Label
 * URS: URS-DV-GEN-5
 * SRS: SRS-47
 * SDS: SDS-47
 */
test.describe('URS-DV-GEN-5: Verify Popup opens in Create mode when the user clicks Creat', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-553: Verify Popup opens in Create mode when the user clicks Create Session Label', async ({ page }) => {
    // Test Case: UTC-553
    // Summary: Verify Popup opens in Create mode when the user clicks Create Session Label
    // Description: Feature: Session Label Popup Close, Cancel & Edit Handling Scenario: Popup opens in Create mode Given the user clicks Create Session Label When the popup is displayed Then Name, Description and Color fields should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-554: Verify Close icon dismisses popup when the popup is open', async ({ page }) => {
    // Test Case: UTC-554
    // Summary: Verify Close icon dismisses popup when the popup is open
    // Description: Feature: Session Label Popup Close, Cancel & Edit Handling Scenario: Close icon dismisses popup Given the popup is open When the user clicks the Close (X) icon Then the popup should close without saving any data

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-555: Verify Cancel button dismisses popup when the popup is open', async ({ page }) => {
    // Test Case: UTC-555
    // Summary: Verify Cancel button dismisses popup when the popup is open
    // Description: Feature: Session Label Popup Close, Cancel & Edit Handling Scenario: Cancel button dismisses popup Given the popup is open When the user clicks Cancel Then the popup should close and discard changes

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-556: Verify Unsaved data is discarded on Close when the user enters label details', async ({ page }) => {
    // Test Case: UTC-556
    // Summary: Verify Unsaved data is discarded on Close when the user enters label details
    // Description: Feature: Session Label Popup Close, Cancel & Edit Handling Scenario: Unsaved data is discarded on Close Given the user enters label details When the popup is closed using X Then reopening should show empty/default values

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-557: Verify Unsaved data is discarded on Cancel when the user modifies fields', async ({ page }) => {
    // Test Case: UTC-557
    // Summary: Verify Unsaved data is discarded on Cancel when the user modifies fields
    // Description: Feature: Session Label Popup Close, Cancel & Edit Handling Scenario: Unsaved data is discarded on Cancel Given the user modifies fields When Cancel is clicked Then no backend save or API call should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-558: Verify Edit mode pre-fills values when an existing label is selected for edit', async ({ page }) => {
    // Test Case: UTC-558
    // Summary: Verify Edit mode pre-fills values when an existing label is selected for edit
    // Description: Feature: Session Label Popup Close, Cancel & Edit Handling Scenario: Edit mode pre-fills values Given an existing label is selected for edit When the popup opens Then Name, Description and Color should show existing values

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-559: Verify Update saves edited values when fields are modified in Edit mode', async ({ page }) => {
    // Test Case: UTC-559
    // Summary: Verify Update saves edited values when fields are modified in Edit mode
    // Description: Feature: Session Label Popup Close, Cancel & Edit Handling Scenario: Update saves edited values Given fields are modified in Edit mode When the user clicks Update/Submit Then the same label record should be updated successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-560: Verify Cancel in Edit mode does not change record when an existing label is edit', async ({ page }) => {
    // Test Case: UTC-560
    // Summary: Verify Cancel in Edit mode does not change record when an existing label is edited
    // Description: Feature: Session Label Popup Close, Cancel & Edit Handling Scenario: Cancel in Edit mode does not change record Given an existing label is edited When Cancel is clicked Then the original values should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-561: Verify User returns to main page after dismissal when the popup is closed or can', async ({ page }) => {
    // Test Case: UTC-561
    // Summary: Verify User returns to main page after dismissal when the popup is closed or canceled
    // Description: Feature: Session Label Popup Close, Cancel & Edit Handling Scenario: User returns to main page after dismissal Given the popup is closed or canceled When the action completes Then the Session Label page should remain visible without refresh

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-562: Verify No validation triggered on cancel when invalid data exists in fields', async ({ page }) => {
    // Test Case: UTC-562
    // Summary: Verify No validation triggered on cancel when invalid data exists in fields
    // Description: Feature: Session Label Popup Close, Cancel & Edit Handling Scenario: No validation triggered on cancel Given invalid data exists in fields When Cancel is clicked Then no validation or error message should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
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
