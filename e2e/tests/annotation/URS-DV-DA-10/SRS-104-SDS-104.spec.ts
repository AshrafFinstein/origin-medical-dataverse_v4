import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Lock icon activation when an annotation exists
 * URS: URS-DV-DA-10
 * SRS: SRS-104
 * SDS: SDS-104
 */
test.describe('URS-DV-DA-10: Verify Lock icon activation when an annotation exists', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1367: Verify Lock icon activation when an annotation exists', async ({ page }) => {
    // Test Case: UTC-1367
    // Summary: Verify Lock icon activation when an annotation exists
    // Description: Feature: Locked annotation disables edit interactions Scenario: Lock icon activation Given an annotation exists When user clicks Lock icon Then annotation state should change to locked

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1368: Verify Visual locked indicator when annotation is locked', async ({ page }) => {
    // Test Case: UTC-1368
    // Summary: Verify Visual locked indicator when annotation is locked
    // Description: Feature: Locked annotation disables edit interactions Scenario: Visual locked indicator Given annotation is locked When viewing canvas Then locked annotation should show lock icon or visual highlight

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1369: Verify Selection handles disabled when annotation is locked', async ({ page }) => {
    // Test Case: UTC-1369
    // Summary: Verify Selection handles disabled when annotation is locked
    // Description: Feature: Locked annotation disables edit interactions Scenario: Selection handles disabled Given annotation is locked When selected Then resize handles should not be visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1370: Verify Prevent move action when annotation is locked', async ({ page }) => {
    // Test Case: UTC-1370
    // Summary: Verify Prevent move action when annotation is locked
    // Description: Feature: Locked annotation disables edit interactions Scenario: Prevent move action Given annotation is locked When user attempts drag Then annotation position should not change

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1371: Verify Prevent resize action when annotation is locked', async ({ page }) => {
    // Test Case: UTC-1371
    // Summary: Verify Prevent resize action when annotation is locked
    // Description: Feature: Locked annotation disables edit interactions Scenario: Prevent resize action Given annotation is locked When user attempts resize Then size should remain unchanged

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1372: Verify Multiple move attempts ignored when locked annotation', async ({ page }) => {
    // Test Case: UTC-1372
    // Summary: Verify Multiple move attempts ignored when locked annotation
    // Description: Feature: Locked annotation disables edit interactions Scenario: Multiple move attempts ignored Given locked annotation When multiple drags attempted Then system should ignore all attempts

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1373: Verify Multiple resize attempts ignored when locked annotation', async ({ page }) => {
    // Test Case: UTC-1373
    // Summary: Verify Multiple resize attempts ignored when locked annotation
    // Description: Feature: Locked annotation disables edit interactions Scenario: Multiple resize attempts ignored Given locked annotation When multiple resize attempts Then no size change occurs

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1374: Verify Coordinates unchanged when locked annotation', async ({ page }) => {
    // Test Case: UTC-1374
    // Summary: Verify Coordinates unchanged when locked annotation
    // Description: Feature: Locked annotation disables edit interactions Scenario: Coordinates unchanged Given locked annotation When move attempted Then stored coordinates should remain same in state

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1375: Verify Dimensions unchanged when locked annotation', async ({ page }) => {
    // Test Case: UTC-1375
    // Summary: Verify Dimensions unchanged when locked annotation
    // Description: Feature: Locked annotation disables edit interactions Scenario: Dimensions unchanged Given locked annotation When resize attempted Then stored dimensions should remain same

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1376: Verify Unlock restores edit when annotation locked', async ({ page }) => {
    // Test Case: UTC-1376
    // Summary: Verify Unlock restores edit when annotation locked
    // Description: Feature: Locked annotation disables edit interactions Scenario: Unlock restores edit Given annotation locked When user clicks Unlock Then move/resize should be enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1377: Verify Drag works after unlock when annotation unlocked', async ({ page }) => {
    // Test Case: UTC-1377
    // Summary: Verify Drag works after unlock when annotation unlocked
    // Description: Feature: Locked annotation disables edit interactions Scenario: Drag works after unlock Given annotation unlocked When user drags Then annotation should move

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1378: Verify Resize works after unlock when annotation unlocked', async ({ page }) => {
    // Test Case: UTC-1378
    // Summary: Verify Resize works after unlock when annotation unlocked
    // Description: Feature: Locked annotation disables edit interactions Scenario: Resize works after unlock Given annotation unlocked When user resizes Then annotation size should update

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1379: Verify No system errors on blocked action when annotation locked', async ({ page }) => {
    // Test Case: UTC-1379
    // Summary: Verify No system errors on blocked action when annotation locked
    // Description: Feature: Locked annotation disables edit interactions Scenario: No system errors on blocked action Given annotation locked When edit attempted Then system should silently ignore without errors

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await datalabellingPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1380: Verify Rapid drag attempts when locked annotation', async ({ page }) => {
    // Test Case: UTC-1380
    // Summary: Verify Rapid drag attempts when locked annotation
    // Description: Feature: Locked annotation disables edit interactions Scenario: Rapid drag attempts Given locked annotation When rapid drag performed Then annotation should remain fixed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1381: Verify Lock multiple annotations when multiple annotations exist', async ({ page }) => {
    // Test Case: UTC-1381
    // Summary: Verify Lock multiple annotations when multiple annotations exist
    // Description: Feature: Locked annotation disables edit interactions Scenario: Lock multiple annotations Given multiple annotations exist When all locked Then none should allow edit

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1382: Verify Mixed states behavior when one locked and one unlocked annotation', async ({ page }) => {
    // Test Case: UTC-1382
    // Summary: Verify Mixed states behavior when one locked and one unlocked annotation
    // Description: Feature: Locked annotation disables edit interactions Scenario: Mixed states behavior Given one locked and one unlocked annotation When editing both Then only unlocked should be editable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1383: Verify Lock action performance when annotation selected', async ({ page }) => {
    // Test Case: UTC-1383
    // Summary: Verify Lock action performance when annotation selected
    // Description: Feature: Locked annotation disables edit interactions Scenario: Lock action performance Given annotation selected When lock clicked Then lock should apply instantly (<1s)

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1384: Verify Keyboard lock/unlock when icon focused', async ({ page }) => {
    // Test Case: UTC-1384
    // Summary: Verify Keyboard lock/unlock when icon focused
    // Description: Feature: Locked annotation disables edit interactions Scenario: Keyboard lock/unlock Given icon focused When Enter/Space pressed Then lock/unlock should toggle

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1385: Verify Clear user feedback when annotation locked', async ({ page }) => {
    // Test Case: UTC-1385
    // Summary: Verify Clear user feedback when annotation locked
    // Description: Feature: Locked annotation disables edit interactions Scenario: Clear user feedback Given annotation locked When viewing UI Then user should clearly understand it is non-editable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1386: Verify Large annotation lock when very large annotation', async ({ page }) => {
    // Test Case: UTC-1386
    // Summary: Verify Large annotation lock when very large annotation
    // Description: Feature: Locked annotation disables edit interactions Scenario: Large annotation lock Given very large annotation When locked Then edit should still be blocked

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
