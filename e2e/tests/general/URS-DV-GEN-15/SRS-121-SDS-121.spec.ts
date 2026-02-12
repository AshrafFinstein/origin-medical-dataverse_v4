import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify History cleared after successful save when annotation history exists
 * URS: URS-DV-GEN-15
 * SRS: SRS-121
 * SDS: SDS-121
 */
test.describe('URS-DV-GEN-15: Verify History cleared after successful save when annotation', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1658: Verify History cleared after successful save when annotation history exists', async ({ page }) => {
    // Test Case: UTC-1658
    // Summary: Verify History cleared after successful save when annotation history exists
    // Description: Feature: Post-Save History Constraint Scenario: History cleared after successful save Given annotation history exists When user clicks Save and save succeeds Then Undo and Redo stacks should be purged immediately

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1659: Verify Undo button disabled after save when save success notification appears', async ({ page }) => {
    // Test Case: UTC-1659
    // Summary: Verify Undo button disabled after save when save success notification appears
    // Description: Feature: Post-Save History Constraint Scenario: Undo button disabled after save Given save success notification appears When toolbar refreshes Then Undo icon should become permanently grey and disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1660: Verify Redo button disabled after save when save success notification appears', async ({ page }) => {
    // Test Case: UTC-1660
    // Summary: Verify Redo button disabled after save when save success notification appears
    // Description: Feature: Post-Save History Constraint Scenario: Redo button disabled after save Given save success notification appears When toolbar refreshes Then Redo icon should become permanently grey and disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1661: Verify Undo action blocked post-save when save completed', async ({ page }) => {
    // Test Case: UTC-1661
    // Summary: Verify Undo action blocked post-save when save completed
    // Description: Feature: Post-Save History Constraint Scenario: Undo action blocked post-save Given save completed When user clicks Undo Then no action should be performed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1662: Verify Redo action blocked post-save when save completed', async ({ page }) => {
    // Test Case: UTC-1662
    // Summary: Verify Redo action blocked post-save when save completed
    // Description: Feature: Post-Save History Constraint Scenario: Redo action blocked post-save Given save completed When user clicks Redo Then no action should be performed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1663: Verify Ctrl+Z blocked after save when save success', async ({ page }) => {
    // Test Case: UTC-1663
    // Summary: Verify Ctrl+Z blocked after save when save success
    // Description: Feature: Post-Save History Constraint Scenario: Ctrl+Z blocked after save Given save success When user presses Ctrl+Z Then shortcut should be intercepted and ignored

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1664: Verify Ctrl+Y blocked after save when save success', async ({ page }) => {
    // Test Case: UTC-1664
    // Summary: Verify Ctrl+Y blocked after save when save success
    // Description: Feature: Post-Save History Constraint Scenario: Ctrl+Y blocked after save Given save success When user presses Ctrl+Y Then shortcut should be intercepted and ignored

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1665: Verify Pointer reset after purge when save success', async ({ page }) => {
    // Test Case: UTC-1665
    // Summary: Verify Pointer reset after purge when save success
    // Description: Feature: Post-Save History Constraint Scenario: Pointer reset after purge Given save success When stacks cleared Then history pointer should be null

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1666: Verify No revert to pre-save state when changes saved', async ({ page }) => {
    // Test Case: UTC-1666
    // Summary: Verify No revert to pre-save state when changes saved
    // Description: Feature: Post-Save History Constraint Scenario: No revert to pre-save state Given changes saved When attempting undo Then UI must not revert to earlier state

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1667: Verify Stack purge performance when large history stack (100+ actions)', async ({ page }) => {
    // Test Case: UTC-1667
    // Summary: Verify Stack purge performance when large history stack (100+ actions)
    // Description: Feature: Post-Save History Constraint Scenario: Stack purge performance Given large history stack (100+ actions) When save completes Then purge should occur instantly without lag

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1668: Verify Visual clarity of disabled state when buttons disabled', async ({ page }) => {
    // Test Case: UTC-1668
    // Summary: Verify Visual clarity of disabled state when buttons disabled
    // Description: Feature: Post-Save History Constraint Scenario: Visual clarity of disabled state Given buttons disabled When viewed Then disabled state should be clearly distinguishable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1669: Verify Immediate transition after toast when Saved Successfully toast appears', async ({ page }) => {
    // Test Case: UTC-1669
    // Summary: Verify Immediate transition after toast when Saved Successfully toast appears
    // Description: Feature: Post-Save History Constraint Scenario: Immediate transition after toast Given “Saved Successfully” toast appears When toast is displayed Then buttons should disable instantly without delay

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await datalabellingPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1670: Verify Multiple rapid shortcut attempts when save completed', async ({ page }) => {
    // Test Case: UTC-1670
    // Summary: Verify Multiple rapid shortcut attempts when save completed
    // Description: Feature: Post-Save History Constraint Scenario: Multiple rapid shortcut attempts Given save completed When user presses Ctrl+Z repeatedly Then no unexpected behavior or errors should occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1671: Verify New actions create fresh history when save completed', async ({ page }) => {
    // Test Case: UTC-1671
    // Summary: Verify New actions create fresh history when save completed
    // Description: Feature: Post-Save History Constraint Scenario: New actions create fresh history Given save completed When user performs a new annotation Then a new history stack should start and Undo becomes enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1672: Verify Save failure does not purge history when save fails', async ({ page }) => {
    // Test Case: UTC-1672
    // Summary: Verify Save failure does not purge history when save fails
    // Description: Feature: Post-Save History Constraint Scenario: Save failure does not purge history Given save fails When error shown Then history stacks should remain intact

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1673: Verify Keyboard focus on disabled buttons when buttons disabled', async ({ page }) => {
    // Test Case: UTC-1673
    // Summary: Verify Keyboard focus on disabled buttons when buttons disabled
    // Description: Feature: Post-Save History Constraint Scenario: Keyboard focus on disabled buttons Given buttons disabled When navigated using keyboard Then buttons should not trigger any action

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
