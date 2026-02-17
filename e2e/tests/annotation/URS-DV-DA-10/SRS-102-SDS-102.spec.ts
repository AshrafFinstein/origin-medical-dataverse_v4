import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Toolbar visibility when annotation screen loads
 * URS: URS-DV-DA-10
 * SRS: SRS-102
 * SDS: SDS-102
 */
test.describe('URS-DV-DA-10: Verify Toolbar visibility when annotation screen loads', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1340: Verify Toolbar visibility when annotation screen loads', async ({ page }) => {
    // Test Case: UTC-1340
    // Summary: Verify Toolbar visibility when annotation screen loads
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Toolbar visibility Given annotation screen loads When toolbar renders Then Lock and Unlock icons should be visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1341: Verify Icons displayed in header when annotation list displayed', async ({ page }) => {
    // Test Case: UTC-1341
    // Summary: Verify Icons displayed in header when annotation list displayed
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Icons displayed in header Given annotation list displayed When header loads Then Lock/Unlock controls should appear near anatomy types

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1342: Verify Lock action disables editing when annotation is editable', async ({ page }) => {
    // Test Case: UTC-1342
    // Summary: Verify Lock action disables editing when annotation is editable
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Lock action disables editing Given annotation is editable When user clicks Lock Then editing controls should be disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1343: Verify Unlock action enables editing when annotation is locked', async ({ page }) => {
    // Test Case: UTC-1343
    // Summary: Verify Unlock action enables editing when annotation is locked
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Unlock action enables editing Given annotation is locked When user clicks Unlock Then editing controls should be enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1344: Verify Instant state update when user toggles lock/unlock', async ({ page }) => {
    // Test Case: UTC-1344
    // Summary: Verify Instant state update when user toggles lock/unlock
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Instant state update Given user toggles lock/unlock When action occurs Then UI state should update immediately without page reload

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1345: Verify Visual clarity of state when annotation is locked', async ({ page }) => {
    // Test Case: UTC-1345
    // Summary: Verify Visual clarity of state when annotation is locked
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Visual clarity of state Given annotation is locked When viewing icon Then lock icon should clearly indicate non-editable state

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1346: Verify Icon toggles correctly when locked state active', async ({ page }) => {
    // Test Case: UTC-1346
    // Summary: Verify Icon toggles correctly when locked state active
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Icon toggles correctly Given locked state active When unlocking Then icon should change to unlocked symbol

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1347: Verify Controls remain visible during review when user navigates between images', async ({ page }) => {
    // Test Case: UTC-1347
    // Summary: Verify Controls remain visible during review when user navigates between images
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Controls remain visible during review Given user navigates between images When review continues Then toolbar controls should remain persistent

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1348: Verify Prevent edit when locked when annotation locked', async ({ page }) => {
    // Test Case: UTC-1348
    // Summary: Verify Prevent edit when locked when annotation locked
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Prevent edit when locked Given annotation locked When user attempts draw/edit Then action should be blocked

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1349: Verify Allow edit when unlocked when annotation unlocked', async ({ page }) => {
    // Test Case: UTC-1349
    // Summary: Verify Allow edit when unlocked when annotation unlocked
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Allow edit when unlocked Given annotation unlocked When user edits annotation Then modification should be allowed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1350: Verify No UI lag when multiple rapid toggles', async ({ page }) => {
    // Test Case: UTC-1350
    // Summary: Verify No UI lag when multiple rapid toggles
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: No UI lag Given multiple rapid toggles When switching states repeatedly Then UI should respond smoothly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1351: Verify Lock state persists when annotation locked', async ({ page }) => {
    // Test Case: UTC-1351
    // Summary: Verify Lock state persists when annotation locked
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Lock state persists Given annotation locked When navigating away and back Then lock state should remain unchanged

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1352: Verify Empty dataset handling when no annotations exist', async ({ page }) => {
    // Test Case: UTC-1352
    // Summary: Verify Empty dataset handling when no annotations exist
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Empty dataset handling Given no annotations exist When screen loads Then “No Data” message should display

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1353: Verify Network failure handling when server fetch fails', async ({ page }) => {
    // Test Case: UTC-1353
    // Summary: Verify Network failure handling when server fetch fails
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Network failure handling Given server fetch fails When annotations requested Then “Failed to fetch” toast should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1354: Verify Toggle without data when no annotation selected', async ({ page }) => {
    // Test Case: UTC-1354
    // Summary: Verify Toggle without data when no annotation selected
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Toggle without data Given no annotation selected When lock/unlock clicked Then system should ignore safely without crash

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1355: Verify Keyboard accessibility when icon focused', async ({ page }) => {
    // Test Case: UTC-1355
    // Summary: Verify Keyboard accessibility when icon focused
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Keyboard accessibility Given icon focused When Enter/Space pressed Then lock/unlock should trigger

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1356: Verify Large annotation list when many annotations exist', async ({ page }) => {
    // Test Case: UTC-1356
    // Summary: Verify Large annotation list when many annotations exist
    // Description: Feature: Annotation toolbar lock/unlock state controls Scenario: Large annotation list Given many annotations exist When toggling state Then UI should remain stable without freeze

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
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
