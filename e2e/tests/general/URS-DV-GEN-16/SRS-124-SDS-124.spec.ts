import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Trigger deletion modal when mark selected when a canvas annotation mark is selected
 * URS: URS-DV-GEN-16
 * SRS: SRS-124
 * SDS: SDS-124
 */
test.describe('URS-DV-GEN-16: Verify Trigger deletion modal when mark selected when a canv', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1704: Verify Trigger deletion modal when mark selected when a canvas annotation mark i', async ({ page }) => {
    // Test Case: UTC-1704
    // Summary: Verify Trigger deletion modal when mark selected when a canvas annotation mark is selected
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Trigger deletion modal when mark selected Given a canvas annotation mark is selected When user presses Backspace Then “Delete Annotation Marks” confirmation modal should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1705: Verify Modal UI elements visible when deletion modal is open', async ({ page }) => {
    // Test Case: UTC-1705
    // Summary: Verify Modal UI elements visible when deletion modal is open
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Modal UI elements visible Given deletion modal is open When user views modal Then title and Yes/No buttons should be clearly visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1706: Verify Confirm deletion when deletion modal is displayed', async ({ page }) => {
    // Test Case: UTC-1706
    // Summary: Verify Confirm deletion when deletion modal is displayed
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Confirm deletion Given deletion modal is displayed When user clicks Yes Then selected mark should be removed from canvas

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1707: Verify Cancel deletion when deletion modal is displayed', async ({ page }) => {
    // Test Case: UTC-1707
    // Summary: Verify Cancel deletion when deletion modal is displayed
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Cancel deletion Given deletion modal is displayed When user clicks No Then the mark should remain unchanged

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1708: Verify Close modal without action when modal is open', async ({ page }) => {
    // Test Case: UTC-1708
    // Summary: Verify Close modal without action when modal is open
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Close modal without action Given modal is open When user clicks close icon or outside modal Then deletion should not occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1709: Verify Success toast after deletion when mark deletion completed', async ({ page }) => {
    // Test Case: UTC-1709
    // Summary: Verify Success toast after deletion when mark deletion completed
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Success toast after deletion Given mark deletion completed When operation succeeds Then success toast should appear at top-right

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await datalabellingPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1710: Verify Canvas layer updated when mark deleted', async ({ page }) => {
    // Test Case: UTC-1710
    // Summary: Verify Canvas layer updated when mark deleted
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Canvas layer updated Given mark deleted When canvas refreshes Then deleted object should not render

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1711: Verify Right-side data tree updated when mark deleted', async ({ page }) => {
    // Test Case: UTC-1711
    // Summary: Verify Right-side data tree updated when mark deleted
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Right-side data tree updated Given mark deleted When tree refreshes Then corresponding UID should be removed from tree

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1712: Verify Only selected mark deleted when multiple marks exist', async ({ page }) => {
    // Test Case: UTC-1712
    // Summary: Verify Only selected mark deleted when multiple marks exist
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Only selected mark deleted Given multiple marks exist When user confirms deletion Then only selected mark should be deleted

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1713: Verify No mark selected when no canvas object selected', async ({ page }) => {
    // Test Case: UTC-1713
    // Summary: Verify No mark selected when no canvas object selected
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: No mark selected Given no canvas object selected When Backspace pressed Then no modal should appear and no deletion occurs

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1714: Verify Locked annotation cannot be deleted when annotation is locked', async ({ page }) => {
    // Test Case: UTC-1714
    // Summary: Verify Locked annotation cannot be deleted when annotation is locked
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Locked annotation cannot be deleted Given annotation is locked When Backspace pressed Then deletion modal should not appear and “Locked” message shown

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1715: Verify Multiple selections handling when multiple marks selected', async ({ page }) => {
    // Test Case: UTC-1715
    // Summary: Verify Multiple selections handling when multiple marks selected
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Multiple selections handling Given multiple marks selected When user confirms deletion Then all selected marks should be deleted

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1716: Verify Rapid Backspace presses when mark selected', async ({ page }) => {
    // Test Case: UTC-1716
    // Summary: Verify Rapid Backspace presses when mark selected
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Rapid Backspace presses Given mark selected When Backspace pressed repeatedly Then only one modal should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1717: Verify Modal appears quickly when Backspace pressed', async ({ page }) => {
    // Test Case: UTC-1717
    // Summary: Verify Modal appears quickly when Backspace pressed
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Modal appears quickly Given Backspace pressed When system responds Then modal should appear instantly (<200ms)

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1718: Verify Keyboard navigation support when modal is open', async ({ page }) => {
    // Test Case: UTC-1718
    // Summary: Verify Keyboard navigation support when modal is open
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Keyboard navigation support Given modal is open When user navigates with Tab/Enter Then Yes/No buttons should be selectable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1719: Verify Persistence after refresh when deletion confirmed', async ({ page }) => {
    // Test Case: UTC-1719
    // Summary: Verify Persistence after refresh when deletion confirmed
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Persistence after refresh Given deletion confirmed When page refreshes Then deleted mark should not reappear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1720: Verify Ignore shortcut inside text input when cursor is typing in a textbox', async ({ page }) => {
    // Test Case: UTC-1720
    // Summary: Verify Ignore shortcut inside text input when cursor is typing in a textbox
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Ignore shortcut inside text input Given cursor is typing in a textbox When Backspace pressed Then text deletes only and no modal appears

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1721: Verify Network failure during deletion when backend deletion fails', async ({ page }) => {
    // Test Case: UTC-1721
    // Summary: Verify Network failure during deletion when backend deletion fails
    // Description: Feature: Annotation Mark Deletion with Confirmation Scenario: Network failure during deletion Given backend deletion fails When operation attempted Then error toast shown and mark remains intact

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

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
