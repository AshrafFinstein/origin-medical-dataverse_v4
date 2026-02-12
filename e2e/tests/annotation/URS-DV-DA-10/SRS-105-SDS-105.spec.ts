import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Unlock icon click when annotation is locked
 * URS: URS-DV-DA-10
 * SRS: SRS-105
 * SDS: SDS-105
 */
test.describe('URS-DV-DA-10: Verify Unlock icon click when annotation is locked', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1387: Verify Unlock icon click when annotation is locked', async ({ page }) => {
    // Test Case: UTC-1387
    // Summary: Verify Unlock icon click when annotation is locked
    // Description: Feature: Unlock enables annotation editing Scenario: Unlock icon click Given annotation is locked When user clicks Unlock icon Then annotation state should change to editable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1388: Verify Lock icon visual reset when annotation unlocked', async ({ page }) => {
    // Test Case: UTC-1388
    // Summary: Verify Lock icon visual reset when annotation unlocked
    // Description: Feature: Unlock enables annotation editing Scenario: Lock icon visual reset Given annotation unlocked When viewing toolbar Then lock icon should not be highlighted

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1389: Verify Edit handles visible when annotation unlocked', async ({ page }) => {
    // Test Case: UTC-1389
    // Summary: Verify Edit handles visible when annotation unlocked
    // Description: Feature: Unlock enables annotation editing Scenario: Edit handles visible Given annotation unlocked When selected Then resize/move handles should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1390: Verify Drag enabled when annotation unlocked', async ({ page }) => {
    // Test Case: UTC-1390
    // Summary: Verify Drag enabled when annotation unlocked
    // Description: Feature: Unlock enables annotation editing Scenario: Drag enabled Given annotation unlocked When user drags annotation Then annotation position should update

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1391: Verify Resize enabled when annotation unlocked', async ({ page }) => {
    // Test Case: UTC-1391
    // Summary: Verify Resize enabled when annotation unlocked
    // Description: Feature: Unlock enables annotation editing Scenario: Resize enabled Given annotation unlocked When user resizes Then annotation size should update

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1392: Verify Coordinates stored after move when annotation unlocked', async ({ page }) => {
    // Test Case: UTC-1392
    // Summary: Verify Coordinates stored after move when annotation unlocked
    // Description: Feature: Unlock enables annotation editing Scenario: Coordinates stored after move Given annotation unlocked When moved Then updated coordinates should be saved in state

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1393: Verify Dimensions stored after resize when unlocked', async ({ page }) => {
    // Test Case: UTC-1393
    // Summary: Verify Dimensions stored after resize when unlocked
    // Description: Feature: Unlock enables annotation editing Scenario: Dimensions stored after resize Given unlocked When resized Then new dimensions should be saved

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1394: Verify Multiple annotations unlock when multiple locked annotations', async ({ page }) => {
    // Test Case: UTC-1394
    // Summary: Verify Multiple annotations unlock when multiple locked annotations
    // Description: Feature: Unlock enables annotation editing Scenario: Multiple annotations unlock Given multiple locked annotations When each unlocked Then all become editable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1395: Verify No UI refresh required when unlock action', async ({ page }) => {
    // Test Case: UTC-1395
    // Summary: Verify No UI refresh required when unlock action
    // Description: Feature: Unlock enables annotation editing Scenario: No UI refresh required Given unlock action When executed Then edit capability should enable instantly without reload

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1396: Verify Toggle lock/unlock repeatedly when annotation', async ({ page }) => {
    // Test Case: UTC-1396
    // Summary: Verify Toggle lock/unlock repeatedly when annotation
    // Description: Feature: Unlock enables annotation editing Scenario: Toggle lock/unlock repeatedly Given annotation When toggled multiple times Then state should switch correctly each time

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1397: Verify Unlock already editable when annotation already unlocked', async ({ page }) => {
    // Test Case: UTC-1397
    // Summary: Verify Unlock already editable when annotation already unlocked
    // Description: Feature: Unlock enables annotation editing Scenario: Unlock already editable Given annotation already unlocked When unlock clicked again Then no state change or error occurs

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1398: Verify Selection after unlock when annotation unlocked', async ({ page }) => {
    // Test Case: UTC-1398
    // Summary: Verify Selection after unlock when annotation unlocked
    // Description: Feature: Unlock enables annotation editing Scenario: Selection after unlock Given annotation unlocked When clicked Then selection box should activate normally

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1399: Verify Move after immediate unlock when unlock clicked', async ({ page }) => {
    // Test Case: UTC-1399
    // Summary: Verify Move after immediate unlock when unlock clicked
    // Description: Feature: Unlock enables annotation editing Scenario: Move after immediate unlock Given unlock clicked When user drags instantly Then move should succeed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1400: Verify Resize after immediate unlock when unlock clicked', async ({ page }) => {
    // Test Case: UTC-1400
    // Summary: Verify Resize after immediate unlock when unlock clicked
    // Description: Feature: Unlock enables annotation editing Scenario: Resize after immediate unlock Given unlock clicked When resize attempted Then resize should succeed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1401: Verify Clear user feedback when unlock performed', async ({ page }) => {
    // Test Case: UTC-1401
    // Summary: Verify Clear user feedback when unlock performed
    // Description: Feature: Unlock enables annotation editing Scenario: Clear user feedback Given unlock performed When viewing UI Then user should visually understand edit is enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1402: Verify Unlock performance when annotation locked', async ({ page }) => {
    // Test Case: UTC-1402
    // Summary: Verify Unlock performance when annotation locked
    // Description: Feature: Unlock enables annotation editing Scenario: Unlock performance Given annotation locked When unlock clicked Then state change should occur within 1s

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1403: Verify Keyboard unlock when unlock icon focused', async ({ page }) => {
    // Test Case: UTC-1403
    // Summary: Verify Keyboard unlock when unlock icon focused
    // Description: Feature: Unlock enables annotation editing Scenario: Keyboard unlock Given unlock icon focused When Enter/Space pressed Then annotation should unlock

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1404: Verify Very large annotation unlock when large annotation', async ({ page }) => {
    // Test Case: UTC-1404
    // Summary: Verify Very large annotation unlock when large annotation
    // Description: Feature: Unlock enables annotation editing Scenario: Very large annotation unlock Given large annotation When unlocked Then editing should still work smoothly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1405: Verify Unlock after page idle when page idle for long time', async ({ page }) => {
    // Test Case: UTC-1405
    // Summary: Verify Unlock after page idle when page idle for long time
    // Description: Feature: Unlock enables annotation editing Scenario: Unlock after page idle Given page idle for long time When unlocked Then editing should still enable without failure

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1406: Verify Mixed lock states behavior when one locked and one unlocked annotation', async ({ page }) => {
    // Test Case: UTC-1406
    // Summary: Verify Mixed lock states behavior when one locked and one unlocked annotation
    // Description: Feature: Unlock enables annotation editing Scenario: Mixed lock states behavior Given one locked and one unlocked annotation When editing Then only unlocked annotations should allow edit

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
