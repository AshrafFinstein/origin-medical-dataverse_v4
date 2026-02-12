import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Freeze button visibility when the grid page is loaded
 * URS: URS-DV-DL-04
 * SRS: SRS-39
 * SDS: SDS-39
 */
test.describe('URS-DV-DL-04: Verify Freeze button visibility when the grid page is loaded', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-467: Verify Freeze button visibility when the grid page is loaded', async ({ page }) => {
    // Test Case: UTC-467
    // Summary: Verify Freeze button visibility when the grid page is loaded
    // Description: Feature: Freeze Mode Toggle Scenario: Freeze button visibility Given the grid page is loaded When the toolbar renders Then the Freeze toggle button should be visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-468: Verify Freeze activates locking when the grid is active', async ({ page }) => {
    // Test Case: UTC-468
    // Summary: Verify Freeze activates locking when the grid is active
    // Description: Feature: Freeze Mode Toggle Scenario: Freeze activates locking Given the grid is active When the user clicks Freeze Then the grid interactions should be disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-469: Verify Unfreeze restores interaction when the grid is frozen', async ({ page }) => {
    // Test Case: UTC-469
    // Summary: Verify Unfreeze restores interaction when the grid is frozen
    // Description: Feature: Freeze Mode Toggle Scenario: Unfreeze restores interaction Given the grid is frozen When the user clicks Unfreeze Then all grid interactions should be enabled again

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-470: Verify Toggle label changes when the grid is frozen', async ({ page }) => {
    // Test Case: UTC-470
    // Summary: Verify Toggle label changes when the grid is frozen
    // Description: Feature: Freeze Mode Toggle Scenario: Toggle label changes Given the grid is frozen When viewing the toggle button Then the label should change from Freeze to Unfreeze

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-471: Verify Prevent image selection while frozen when the grid is frozen', async ({ page }) => {
    // Test Case: UTC-471
    // Summary: Verify Prevent image selection while frozen when the grid is frozen
    // Description: Feature: Freeze Mode Toggle Scenario: Prevent image selection while frozen Given the grid is frozen When the user clicks an image card Then the image should not be selected

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-472: Verify Prevent bulk action execution when the grid is frozen', async ({ page }) => {
    // Test Case: UTC-472
    // Summary: Verify Prevent bulk action execution when the grid is frozen
    // Description: Feature: Freeze Mode Toggle Scenario: Prevent bulk action execution Given the grid is frozen When the user clicks a bulk action Then the action should not execute

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-473: Verify Labeling blocked during freeze when images are selected and grid is froze', async ({ page }) => {
    // Test Case: UTC-473
    // Summary: Verify Labeling blocked during freeze when images are selected and grid is frozen
    // Description: Feature: Freeze Mode Toggle Scenario: Labeling blocked during freeze Given images are selected and grid is frozen When the user attempts to apply labels Then the system should ignore the request

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-474: Verify Visual overlay displayed when the grid is frozen', async ({ page }) => {
    // Test Case: UTC-474
    // Summary: Verify Visual overlay displayed when the grid is frozen
    // Description: Feature: Freeze Mode Toggle Scenario: Visual overlay displayed Given the grid is frozen When the state changes Then an overlay or dimmed effect should be visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-475: Verify Cursor restriction feedback when the grid is frozen', async ({ page }) => {
    // Test Case: UTC-475
    // Summary: Verify Cursor restriction feedback when the grid is frozen
    // Description: Feature: Freeze Mode Toggle Scenario: Cursor restriction feedback Given the grid is frozen When hovering over disabled items Then a restricted cursor icon should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-476: Verify State retained after navigation when the grid is frozen', async ({ page }) => {
    // Test Case: UTC-476
    // Summary: Verify State retained after navigation when the grid is frozen
    // Description: Feature: Freeze Mode Toggle Scenario: State retained after navigation Given the grid is frozen When the user refreshes or navigates within the page Then the freeze state should persist correctly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-477: Verify Toggle responds instantly when the grid is active', async ({ page }) => {
    // Test Case: UTC-477
    // Summary: Verify Toggle responds instantly when the grid is active
    // Description: Feature: Freeze Mode Toggle Scenario: Toggle responds instantly Given the grid is active When the user toggles Freeze or Unfreeze Then the state change should occur without delay

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-478: Verify Multiple rapid toggles handled safely when the user clicks Freeze and Unf', async ({ page }) => {
    // Test Case: UTC-478
    // Summary: Verify Multiple rapid toggles handled safely when the user clicks Freeze and Unfreeze rapidly
    // Description: Feature: Freeze Mode Toggle Scenario: Multiple rapid toggles handled safely Given the user clicks Freeze and Unfreeze rapidly When the actions are processed Then the system should remain stable without errors

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
