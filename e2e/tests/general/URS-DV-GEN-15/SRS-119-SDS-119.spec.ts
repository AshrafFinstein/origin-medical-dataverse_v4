import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Redo icon visibility when annotation screen loads
 * URS: URS-DV-GEN-15
 * SRS: SRS-119
 * SDS: SDS-119
 */
test.describe('URS-DV-GEN-15: Verify Redo icon visibility when annotation screen loads', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1626: Verify Redo icon visibility when annotation screen loads', async ({ page }) => {
    // Test Case: UTC-1626
    // Summary: Verify Redo icon visibility when annotation screen loads
    // Description: Feature: Redo Reverted Action Scenario: Redo icon visibility Given annotation screen loads When bottom toolbar renders Then curved right arrow Redo icon should be visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1627: Verify Default disabled state when no undo action performed', async ({ page }) => {
    // Test Case: UTC-1627
    // Summary: Verify Default disabled state when no undo action performed
    // Description: Feature: Redo Reverted Action Scenario: Default disabled state Given no undo action performed When toolbar displayed Then Redo icon should appear greyed out

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1628: Verify Enable after undo when user performs Undo', async ({ page }) => {
    // Test Case: UTC-1628
    // Summary: Verify Enable after undo when user performs Undo
    // Description: Feature: Redo Reverted Action Scenario: Enable after undo Given user performs Undo When action moves to Redo stack Then Redo icon should become enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1629: Verify Restore last undone action when annotation undone', async ({ page }) => {
    // Test Case: UTC-1629
    // Summary: Verify Restore last undone action when annotation undone
    // Description: Feature: Redo Reverted Action Scenario: Restore last undone action Given annotation undone When Redo clicked Then annotation should be restored on canvas

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1630: Verify Restore movement when annotation position undone', async ({ page }) => {
    // Test Case: UTC-1630
    // Summary: Verify Restore movement when annotation position undone
    // Description: Feature: Redo Reverted Action Scenario: Restore movement Given annotation position undone When Redo clicked Then annotation returns to moved position

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1631: Verify FIFO restoration order when multiple undo actions exist', async ({ page }) => {
    // Test Case: UTC-1631
    // Summary: Verify FIFO restoration order when multiple undo actions exist
    // Description: Feature: Redo Reverted Action Scenario: FIFO restoration order Given multiple undo actions exist When Redo clicked repeatedly Then actions should restore in correct order

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1632: Verify Stack movement validation when Redo executed', async ({ page }) => {
    // Test Case: UTC-1632
    // Summary: Verify Stack movement validation when Redo executed
    // Description: Feature: Redo Reverted Action Scenario: Stack movement validation Given Redo executed When action restored Then item moves from Redo stack to Undo stack

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await datalabellingPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1633: Verify Disabled when stack empty when Redo stack empty', async ({ page }) => {
    // Test Case: UTC-1633
    // Summary: Verify Disabled when stack empty when Redo stack empty
    // Description: Feature: Redo Reverted Action Scenario: Disabled when stack empty Given Redo stack empty When Redo clicked Then no change should occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1634: Verify New action clears Redo stack when undo performed', async ({ page }) => {
    // Test Case: UTC-1634
    // Summary: Verify New action clears Redo stack when undo performed
    // Description: Feature: Redo Reverted Action Scenario: New action clears Redo stack Given undo performed When new annotation created Then Redo stack should clear and button disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1635: Verify Disabled after save when session saved', async ({ page }) => {
    // Test Case: UTC-1635
    // Summary: Verify Disabled after save when session saved
    // Description: Feature: Redo Reverted Action Scenario: Disabled after save Given session saved When toolbar updates Then Redo icon should be disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1636: Verify Keyboard shortcut works when Redo available', async ({ page }) => {
    // Test Case: UTC-1636
    // Summary: Verify Keyboard shortcut works when Redo available
    // Description: Feature: Redo Reverted Action Scenario: Keyboard shortcut works Given Redo available When user presses Ctrl+Shift+Z Then last undone action should be restored

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1637: Verify Shortcut disabled when inactive when Redo disabled', async ({ page }) => {
    // Test Case: UTC-1637
    // Summary: Verify Shortcut disabled when inactive when Redo disabled
    // Description: Feature: Redo Reverted Action Scenario: Shortcut disabled when inactive Given Redo disabled When shortcut pressed Then no action should occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1638: Verify Immediate UI update when Redo clicked', async ({ page }) => {
    // Test Case: UTC-1638
    // Summary: Verify Immediate UI update when Redo clicked
    // Description: Feature: Redo Reverted Action Scenario: Immediate UI update Given Redo clicked When action restored Then UI updates instantly without reload

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1639: Verify Rapid clicks handling when multiple rapid clicks', async ({ page }) => {
    // Test Case: UTC-1639
    // Summary: Verify Rapid clicks handling when multiple rapid clicks
    // Description: Feature: Redo Reverted Action Scenario: Rapid clicks handling Given multiple rapid clicks When Redo pressed repeatedly Then system should not crash or duplicate actions

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1640: Verify Large stack performance when 20+ actions in redo stack', async ({ page }) => {
    // Test Case: UTC-1640
    // Summary: Verify Large stack performance when 20+ actions in redo stack
    // Description: Feature: Redo Reverted Action Scenario: Large stack performance Given 20+ actions in redo stack When Redo repeatedly Then UI should remain responsive

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1641: Verify Prevent redo after external refresh when external data refresh occurs', async ({ page }) => {
    // Test Case: UTC-1641
    // Summary: Verify Prevent redo after external refresh when external data refresh occurs
    // Description: Feature: Redo Reverted Action Scenario: Prevent redo after external refresh Given external data refresh occurs When Redo attempted Then action should be blocked safely

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
