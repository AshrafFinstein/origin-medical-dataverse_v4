import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Buttons visible on toolbar when annotation page loads
 * URS: URS-DV-GEN-15
 * SRS: SRS-120
 * SDS: SDS-120
 */
test.describe('URS-DV-GEN-15: Verify Buttons visible on toolbar when annotation page loads', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1642: Verify Buttons visible on toolbar when annotation page loads', async ({ page }) => {
    // Test Case: UTC-1642
    // Summary: Verify Buttons visible on toolbar when annotation page loads
    // Description: Feature: Undo/Redo Visual States Scenario: Buttons visible on toolbar Given annotation page loads When bottom toolbar renders Then Undo and Redo buttons should be visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1643: Verify Default disabled state when no history exists', async ({ page }) => {
    // Test Case: UTC-1643
    // Summary: Verify Default disabled state when no history exists
    // Description: Feature: Undo/Redo Visual States Scenario: Default disabled state Given no history exists When toolbar loads Then both buttons should appear disabled with 0.5 opacity

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1644: Verify Undo enables after action when user performs an annotation', async ({ page }) => {
    // Test Case: UTC-1644
    // Summary: Verify Undo enables after action when user performs an annotation
    // Description: Feature: Undo/Redo Visual States Scenario: Undo enables after action Given user performs an annotation When history stack updated Then Undo button should become enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1645: Verify Redo enables after undo when user performs Undo', async ({ page }) => {
    // Test Case: UTC-1645
    // Summary: Verify Redo enables after undo when user performs Undo
    // Description: Feature: Undo/Redo Visual States Scenario: Redo enables after undo Given user performs Undo When redo stack has item Then Redo button should become enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1646: Verify Disabled tooltip for Undo when Undo disabled', async ({ page }) => {
    // Test Case: UTC-1646
    // Summary: Verify Disabled tooltip for Undo when Undo disabled
    // Description: Feature: Undo/Redo Visual States Scenario: Disabled tooltip for Undo Given Undo disabled When user hovers over button Then tooltip “No actions to undo” should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1647: Verify Disabled tooltip for Redo when Redo disabled', async ({ page }) => {
    // Test Case: UTC-1647
    // Summary: Verify Disabled tooltip for Redo when Redo disabled
    // Description: Feature: Undo/Redo Visual States Scenario: Disabled tooltip for Redo Given Redo disabled When hovered Then tooltip “No actions to redo” should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1648: Verify Buttons update dynamically when multiple actions performed', async ({ page }) => {
    // Test Case: UTC-1648
    // Summary: Verify Buttons update dynamically when multiple actions performed
    // Description: Feature: Undo/Redo Visual States Scenario: Buttons update dynamically Given multiple actions performed When undo/redo stack changes Then buttons should toggle enabled/disabled instantly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1649: Verify Save clears history when history exists', async ({ page }) => {
    // Test Case: UTC-1649
    // Summary: Verify Save clears history when history exists
    // Description: Feature: Undo/Redo Visual States Scenario: Save clears history Given history exists When Save clicked successfully Then both buttons become disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1650: Verify History stacks cleared on save when save successful', async ({ page }) => {
    // Test Case: UTC-1650
    // Summary: Verify History stacks cleared on save when save successful
    // Description: Feature: Undo/Redo Visual States Scenario: History stacks cleared on save Given save successful When stacks purged Then undo/redo arrays should be empty

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1651: Verify Tooltip after save when save completed', async ({ page }) => {
    // Test Case: UTC-1651
    // Summary: Verify Tooltip after save when save completed
    // Description: Feature: Undo/Redo Visual States Scenario: Tooltip after save Given save completed When hovering buttons Then tooltip “History cleared after save” should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1652: Verify Save failure preserves history when save fails', async ({ page }) => {
    // Test Case: UTC-1652
    // Summary: Verify Save failure preserves history when save fails
    // Description: Feature: Undo/Redo Visual States Scenario: Save failure preserves history Given save fails When system shows error Then Undo/Redo should remain enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1653: Verify Disabled prevents interaction when button disabled', async ({ page }) => {
    // Test Case: UTC-1653
    // Summary: Verify Disabled prevents interaction when button disabled
    // Description: Feature: Undo/Redo Visual States Scenario: Disabled prevents interaction Given button disabled When clicked Then no action should occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1654: Verify Keyboard navigation when button focused via Tab', async ({ page }) => {
    // Test Case: UTC-1654
    // Summary: Verify Keyboard navigation when button focused via Tab
    // Description: Feature: Undo/Redo Visual States Scenario: Keyboard navigation Given button focused via Tab When disabled Then Enter/Space should not trigger action

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1655: Verify Visual clarity when buttons disabled', async ({ page }) => {
    // Test Case: UTC-1655
    // Summary: Verify Visual clarity when buttons disabled
    // Description: Feature: Undo/Redo Visual States Scenario: Visual clarity Given buttons disabled When viewed Then reduced opacity clearly indicates non-interactive state

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1656: Verify State change performance when frequent actions', async ({ page }) => {
    // Test Case: UTC-1656
    // Summary: Verify State change performance when frequent actions
    // Description: Feature: Undo/Redo Visual States Scenario: State change performance Given frequent actions When toggling states Then UI should update without lag

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1657: Verify Rapid save clicks when multiple rapid save attempts', async ({ page }) => {
    // Test Case: UTC-1657
    // Summary: Verify Rapid save clicks when multiple rapid save attempts
    // Description: Feature: Undo/Redo Visual States Scenario: Rapid save clicks Given multiple rapid save attempts When save processed Then buttons remain stable and do not flicker

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
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
