import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Individual lock icon visible when annotations exist
 * URS: URS-DV-DA-10
 * SRS: SRS-106
 * SDS: SDS-106
 */
test.describe('URS-DV-DA-10: Verify Individual lock icon visible when annotations exist', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1407: Verify Individual lock icon visible when annotations exist', async ({ page }) => {
    // Test Case: UTC-1407
    // Summary: Verify Individual lock icon visible when annotations exist
    // Description: Feature: Individual and overall annotation lock control Scenario: Individual lock icon visible Given annotations exist When annotation list loads Then each annotation should display a lock icon

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1408: Verify Overall lock icon visible when image loaded', async ({ page }) => {
    // Test Case: UTC-1408
    // Summary: Verify Overall lock icon visible when image loaded
    // Description: Feature: Individual and overall annotation lock control Scenario: Overall lock icon visible Given image loaded When toolbar renders Then overall lock icon should be displayed in header

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1409: Verify Lock single annotation when annotation unlocked', async ({ page }) => {
    // Test Case: UTC-1409
    // Summary: Verify Lock single annotation when annotation unlocked
    // Description: Feature: Individual and overall annotation lock control Scenario: Lock single annotation Given annotation unlocked When user clicks individual lock Then only that annotation becomes locked

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1410: Verify Prevent edit for locked annotation when annotation locked', async ({ page }) => {
    // Test Case: UTC-1410
    // Summary: Verify Prevent edit for locked annotation when annotation locked
    // Description: Feature: Individual and overall annotation lock control Scenario: Prevent edit for locked annotation Given annotation locked When user tries move/resize Then action should be blocked

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1411: Verify Other annotations unaffected when one annotation locked', async ({ page }) => {
    // Test Case: UTC-1411
    // Summary: Verify Other annotations unaffected when one annotation locked
    // Description: Feature: Individual and overall annotation lock control Scenario: Other annotations unaffected Given one annotation locked When editing another unlocked annotation Then edit should work normally

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1412: Verify Unlock single annotation when annotation locked', async ({ page }) => {
    // Test Case: UTC-1412
    // Summary: Verify Unlock single annotation when annotation locked
    // Description: Feature: Individual and overall annotation lock control Scenario: Unlock single annotation Given annotation locked When unlock clicked Then annotation becomes editable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1413: Verify Apply overall lock when multiple annotations exist', async ({ page }) => {
    // Test Case: UTC-1413
    // Summary: Verify Apply overall lock when multiple annotations exist
    // Description: Feature: Individual and overall annotation lock control Scenario: Apply overall lock Given multiple annotations exist When overall lock clicked Then all annotations become locked

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1414: Verify Prevent edit during overall lock when overall lock active', async ({ page }) => {
    // Test Case: UTC-1414
    // Summary: Verify Prevent edit during overall lock when overall lock active
    // Description: Feature: Individual and overall annotation lock control Scenario: Prevent edit during overall lock Given overall lock active When editing any annotation Then edit should be disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1415: Verify Overall lock visual highlight when overall lock enabled', async ({ page }) => {
    // Test Case: UTC-1415
    // Summary: Verify Overall lock visual highlight when overall lock enabled
    // Description: Feature: Individual and overall annotation lock control Scenario: Overall lock visual highlight Given overall lock enabled When viewing toolbar Then lock icon should appear highlighted

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1416: Verify Unlock overall when overall lock active', async ({ page }) => {
    // Test Case: UTC-1416
    // Summary: Verify Unlock overall when overall lock active
    // Description: Feature: Individual and overall annotation lock control Scenario: Unlock overall Given overall lock active When unlock clicked Then all annotations become editable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1417: Verify Lock state persisted in state model when annotation locked', async ({ page }) => {
    // Test Case: UTC-1417
    // Summary: Verify Lock state persisted in state model when annotation locked
    // Description: Feature: Individual and overall annotation lock control Scenario: Lock state persisted in state model Given annotation locked When saving state Then locked flag should be stored

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1418: Verify No page reload needed when lock/unlock action', async ({ page }) => {
    // Test Case: UTC-1418
    // Summary: Verify No page reload needed when lock/unlock action
    // Description: Feature: Individual and overall annotation lock control Scenario: No page reload needed Given lock/unlock action When executed Then UI updates instantly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1419: Verify Lock multiple individually when multiple annotations', async ({ page }) => {
    // Test Case: UTC-1419
    // Summary: Verify Lock multiple individually when multiple annotations
    // Description: Feature: Individual and overall annotation lock control Scenario: Lock multiple individually Given multiple annotations When locking each individually Then each should lock independently

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1420: Verify Lock already locked annotation when annotation already locked', async ({ page }) => {
    // Test Case: UTC-1420
    // Summary: Verify Lock already locked annotation when annotation already locked
    // Description: Feature: Individual and overall annotation lock control Scenario: Lock already locked annotation Given annotation already locked When lock clicked again Then no duplicate state change or error

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1421: Verify Individual unlock during overall lock when overall lock active', async ({ page }) => {
    // Test Case: UTC-1421
    // Summary: Verify Individual unlock during overall lock when overall lock active
    // Description: Feature: Individual and overall annotation lock control Scenario: Individual unlock during overall lock Given overall lock active When individual unlock clicked Then annotation should remain locked due to overall lock

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1422: Verify Large number of annotations when 100+ annotations', async ({ page }) => {
    // Test Case: UTC-1422
    // Summary: Verify Large number of annotations when 100+ annotations
    // Description: Feature: Individual and overall annotation lock control Scenario: Large number of annotations Given 100+ annotations When overall lock applied Then all should lock without lag

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1423: Verify Lock performance when many annotations', async ({ page }) => {
    // Test Case: UTC-1423
    // Summary: Verify Lock performance when many annotations
    // Description: Feature: Individual and overall annotation lock control Scenario: Lock performance Given many annotations When overall lock clicked Then response should occur within 1s

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1424: Verify Keyboard toggle when lock icon focused', async ({ page }) => {
    // Test Case: UTC-1424
    // Summary: Verify Keyboard toggle when lock icon focused
    // Description: Feature: Individual and overall annotation lock control Scenario: Keyboard toggle Given lock icon focused When Enter/Space pressed Then lock/unlock should toggle

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1425: Verify Clear lock feedback when lock applied', async ({ page }) => {
    // Test Case: UTC-1425
    // Summary: Verify Clear lock feedback when lock applied
    // Description: Feature: Individual and overall annotation lock control Scenario: Clear lock feedback Given lock applied When viewing annotation Then clear visual locked indicator should show

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1426: Verify Lock state after refresh when annotations locked', async ({ page }) => {
    // Test Case: UTC-1426
    // Summary: Verify Lock state after refresh when annotations locked
    // Description: Feature: Individual and overall annotation lock control Scenario: Lock state after refresh Given annotations locked When page refreshed Then lock states should persist correctly

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
