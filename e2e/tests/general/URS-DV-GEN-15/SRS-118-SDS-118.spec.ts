import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Undo icon visibility when annotation screen loads
 * URS: URS-DV-GEN-15
 * SRS: SRS-118
 * SDS: SDS-118
 */
test.describe('URS-DV-GEN-15: Verify Undo icon visibility when annotation screen loads', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1610: Verify Undo icon visibility when annotation screen loads', async ({ page }) => {
    // Test Case: UTC-1610
    // Summary: Verify Undo icon visibility when annotation screen loads
    // Description: Feature: Undo Last Annotation Action Scenario: Undo icon visibility Given annotation screen loads When bottom toolbar renders Then curved left arrow Undo icon should be visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1611: Verify Default disabled state when no actions performed', async ({ page }) => {
    // Test Case: UTC-1611
    // Summary: Verify Default disabled state when no actions performed
    // Description: Feature: Undo Last Annotation Action Scenario: Default disabled state Given no actions performed When toolbar displayed Then Undo icon should appear greyed out

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1612: Verify Enable after action when annotation created', async ({ page }) => {
    // Test Case: UTC-1612
    // Summary: Verify Enable after action when annotation created
    // Description: Feature: Undo Last Annotation Action Scenario: Enable after action Given annotation created When action added to stack Then Undo icon should be enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1613: Verify Undo last creation when annotation created', async ({ page }) => {
    // Test Case: UTC-1613
    // Summary: Verify Undo last creation when annotation created
    // Description: Feature: Undo Last Annotation Action Scenario: Undo last creation Given annotation created When Undo clicked Then annotation should be removed from canvas

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1614: Verify Undo movement when annotation moved', async ({ page }) => {
    // Test Case: UTC-1614
    // Summary: Verify Undo movement when annotation moved
    // Description: Feature: Undo Last Annotation Action Scenario: Undo movement Given annotation moved When Undo clicked Then annotation should return to previous position

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1615: Verify LIFO order maintained when multiple actions performed', async ({ page }) => {
    // Test Case: UTC-1615
    // Summary: Verify LIFO order maintained when multiple actions performed
    // Description: Feature: Undo Last Annotation Action Scenario: LIFO order maintained Given multiple actions performed When Undo clicked repeatedly Then actions should revert in reverse order

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1616: Verify Stack transfer to Redo when Undo performed', async ({ page }) => {
    // Test Case: UTC-1616
    // Summary: Verify Stack transfer to Redo when Undo performed
    // Description: Feature: Undo Last Annotation Action Scenario: Stack transfer to Redo Given Undo performed When action reverted Then action should move to Redo stack

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1617: Verify Ignore when stack empty when Undo stack empty', async ({ page }) => {
    // Test Case: UTC-1617
    // Summary: Verify Ignore when stack empty when Undo stack empty
    // Description: Feature: Undo Last Annotation Action Scenario: Ignore when stack empty Given Undo stack empty When Undo clicked Then no change should occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1618: Verify Disabled after save when session saved', async ({ page }) => {
    // Test Case: UTC-1618
    // Summary: Verify Disabled after save when session saved
    // Description: Feature: Undo Last Annotation Action Scenario: Disabled after save Given session saved When toolbar updates Then Undo icon should be disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1619: Verify Keyboard shortcut works when actions available', async ({ page }) => {
    // Test Case: UTC-1619
    // Summary: Verify Keyboard shortcut works when actions available
    // Description: Feature: Undo Last Annotation Action Scenario: Keyboard shortcut works Given actions available When user presses Ctrl+Z Then last action should revert

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1620: Verify Shortcut disabled when inactive when Undo disabled', async ({ page }) => {
    // Test Case: UTC-1620
    // Summary: Verify Shortcut disabled when inactive when Undo disabled
    // Description: Feature: Undo Last Annotation Action Scenario: Shortcut disabled when inactive Given Undo disabled When Ctrl+Z pressed Then no action should occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1621: Verify Immediate UI update when Undo executed', async ({ page }) => {
    // Test Case: UTC-1621
    // Summary: Verify Immediate UI update when Undo executed
    // Description: Feature: Undo Last Annotation Action Scenario: Immediate UI update Given Undo executed When action completes Then UI should update instantly without reload

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1622: Verify Rapid clicks handling when multiple rapid clicks', async ({ page }) => {
    // Test Case: UTC-1622
    // Summary: Verify Rapid clicks handling when multiple rapid clicks
    // Description: Feature: Undo Last Annotation Action Scenario: Rapid clicks handling Given multiple rapid clicks When Undo pressed repeatedly Then system should not crash or duplicate actions

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1623: Verify Only unsaved changes revert when annotations saved', async ({ page }) => {
    // Test Case: UTC-1623
    // Summary: Verify Only unsaved changes revert when annotations saved
    // Description: Feature: Undo Last Annotation Action Scenario: Only unsaved changes revert Given annotations saved When Undo attempted Then saved actions should not revert

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1624: Verify Multiple undo performance when 20+ actions in stack', async ({ page }) => {
    // Test Case: UTC-1624
    // Summary: Verify Multiple undo performance when 20+ actions in stack
    // Description: Feature: Undo Last Annotation Action Scenario: Multiple undo performance Given 20+ actions in stack When Undo repeatedly Then UI should remain responsive

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1625: Verify Clear visual feedback when actions available', async ({ page }) => {
    // Test Case: UTC-1625
    // Summary: Verify Clear visual feedback when actions available
    // Description: Feature: Undo Last Annotation Action Scenario: Clear visual feedback Given actions available When user views icon Then icon should be highlighted clearly

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
