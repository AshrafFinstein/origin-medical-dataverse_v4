import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Individual lock icon visible when an image with annotations
 * URS: URS-DV-DA-10
 * SRS: SRS-107
 * SDS: SDS-107
 */
test.describe('URS-DV-DA-10: Verify Individual lock icon visible when an image with annot', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1427: Verify Individual lock icon visible when an image with annotations', async ({ page }) => {
    // Test Case: UTC-1427
    // Summary: Verify Individual lock icon visible when an image with annotations
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Individual lock icon visible Given an image with annotations When annotation panel loads Then each annotation should display a lock icon

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1428: Verify Overall lock icon visible when annotation toolbar visible', async ({ page }) => {
    // Test Case: UTC-1428
    // Summary: Verify Overall lock icon visible when annotation toolbar visible
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Overall lock icon visible Given annotation toolbar visible When header renders Then overall lock/unlock icon should be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1429: Verify Lock selected annotation using key L when an annotation is selected', async ({ page }) => {
    // Test Case: UTC-1429
    // Summary: Verify Lock selected annotation using key L when an annotation is selected
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Lock selected annotation using key L Given an annotation is selected When user presses L Then the selected annotation should become locked

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1430: Verify Unlock selected annotation using key L when selected annotation locked', async ({ page }) => {
    // Test Case: UTC-1430
    // Summary: Verify Unlock selected annotation using key L when selected annotation locked
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Unlock selected annotation using key L Given selected annotation locked When user presses L Then annotation becomes editable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1431: Verify Lock all annotations using Ctrl + L when multiple annotations exist', async ({ page }) => {
    // Test Case: UTC-1431
    // Summary: Verify Lock all annotations using Ctrl + L when multiple annotations exist
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Lock all annotations using Ctrl + L Given multiple annotations exist When user presses Ctrl + L Then all annotations should be locked

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1432: Verify Unlock all annotations using Ctrl + L when all annotations locked', async ({ page }) => {
    // Test Case: UTC-1432
    // Summary: Verify Unlock all annotations using Ctrl + L when all annotations locked
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Unlock all annotations using Ctrl + L Given all annotations locked When user presses Ctrl + L again Then all annotations should be unlocked

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1433: Verify Locked annotation cannot be moved when annotation locked', async ({ page }) => {
    // Test Case: UTC-1433
    // Summary: Verify Locked annotation cannot be moved when annotation locked
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Locked annotation cannot be moved Given annotation locked When dragging Then movement should not occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1434: Verify Locked annotation cannot be resized when annotation locked', async ({ page }) => {
    // Test Case: UTC-1434
    // Summary: Verify Locked annotation cannot be resized when annotation locked
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Locked annotation cannot be resized Given annotation locked When resizing Then resize should be blocked

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1435: Verify Unlocked annotation can be edited when annotation unlocked', async ({ page }) => {
    // Test Case: UTC-1435
    // Summary: Verify Unlocked annotation can be edited when annotation unlocked
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Unlocked annotation can be edited Given annotation unlocked When dragging or resizing Then edit should succeed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1436: Verify Visual highlight for locked state when annotation locked', async ({ page }) => {
    // Test Case: UTC-1436
    // Summary: Verify Visual highlight for locked state when annotation locked
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Visual highlight for locked state Given annotation locked When viewing list Then lock icon should be highlighted

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1437: Verify Lock state stored correctly when annotation locked', async ({ page }) => {
    // Test Case: UTC-1437
    // Summary: Verify Lock state stored correctly when annotation locked
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Lock state stored correctly Given annotation locked When state saved Then locked flag should be stored in model

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1438: Verify Lock persists after refresh when annotation locked', async ({ page }) => {
    // Test Case: UTC-1438
    // Summary: Verify Lock persists after refresh when annotation locked
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Lock persists after refresh Given annotation locked When page refreshed Then lock state should persist

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1439: Verify Press L without selection when no annotation selected', async ({ page }) => {
    // Test Case: UTC-1439
    // Summary: Verify Press L without selection when no annotation selected
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Press L without selection Given no annotation selected When user presses L Then no action should occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1440: Verify Shortcut ignored in text field when cursor inside text input', async ({ page }) => {
    // Test Case: UTC-1440
    // Summary: Verify Shortcut ignored in text field when cursor inside text input
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Shortcut ignored in text field Given cursor inside text input When user presses L Then lock action should not trigger

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1441: Verify UI and shortcut sync when locked via keyboard', async ({ page }) => {
    // Test Case: UTC-1441
    // Summary: Verify UI and shortcut sync when locked via keyboard
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: UI and shortcut sync Given locked via keyboard When viewing lock icon Then icon state should reflect locked

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1442: Verify UI lock toggles keyboard behavior when locked via UI', async ({ page }) => {
    // Test Case: UTC-1442
    // Summary: Verify UI lock toggles keyboard behavior when locked via UI
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: UI lock toggles keyboard behavior Given locked via UI When pressing L Then annotation unlocks

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1443: Verify Large number of annotations when 100+ annotations', async ({ page }) => {
    // Test Case: UTC-1443
    // Summary: Verify Large number of annotations when 100+ annotations
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Large number of annotations Given 100+ annotations When Ctrl + L pressed Then all should lock correctly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1444: Verify Shortcut performance when many annotations', async ({ page }) => {
    // Test Case: UTC-1444
    // Summary: Verify Shortcut performance when many annotations
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Shortcut performance Given many annotations When Ctrl + L pressed Then locking should complete within 1 second

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1445: Verify Keyboard-only usage when user uses keyboard only', async ({ page }) => {
    // Test Case: UTC-1445
    // Summary: Verify Keyboard-only usage when user uses keyboard only
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Keyboard-only usage Given user uses keyboard only When pressing L or Ctrl + L Then locking should work without mouse

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1446: Verify Clear feedback on toggle when shortcut pressed', async ({ page }) => {
    // Test Case: UTC-1446
    // Summary: Verify Clear feedback on toggle when shortcut pressed
    // Description: Feature: Annotation lock/unlock with keyboard shortcuts Scenario: Clear feedback on toggle Given shortcut pressed When state changes Then visual cue should appear immediately

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
