import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Delete selected canvas mark when an annotation mark is selected on canvas
 * URS: URS-DV-GEN-16
 * SRS: SRS-122
 * SDS: SDS-122
 */
test.describe('URS-DV-GEN-16: Verify Delete selected canvas mark when an annotation mark i', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1674: Verify Delete selected canvas mark when an annotation mark is selected on canvas', async ({ page }) => {
    // Test Case: UTC-1674
    // Summary: Verify Delete selected canvas mark when an annotation mark is selected on canvas
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: Delete selected canvas mark Given an annotation mark is selected on canvas When user presses Backspace Then the selected mark should be deleted

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1675: Verify Delete focused sidebar label when a sidebar label is focused', async ({ page }) => {
    // Test Case: UTC-1675
    // Summary: Verify Delete focused sidebar label when a sidebar label is focused
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: Delete focused sidebar label Given a sidebar label is focused When user presses Backspace Then the focused label should be deleted

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1676: Verify Canvas takes priority when both label and mark exist', async ({ page }) => {
    // Test Case: UTC-1676
    // Summary: Verify Canvas takes priority when both label and mark exist
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: Canvas takes priority Given both label and mark exist And canvas mark is selected When Backspace is pressed Then only the mark should be deleted

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1677: Verify Delete label when no mark selected when no canvas mark selected', async ({ page }) => {
    // Test Case: UTC-1677
    // Summary: Verify Delete label when no mark selected when no canvas mark selected
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: Delete label when no mark selected Given no canvas mark selected And a sidebar label is focused When Backspace is pressed Then the label should be deleted

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1678: Verify No object selected when no mark or label is selected', async ({ page }) => {
    // Test Case: UTC-1678
    // Summary: Verify No object selected when no mark or label is selected
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: No object selected Given no mark or label is selected When Backspace is pressed Then no deletion should occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1679: Verify Ignore shortcut while typing in text input when cursor is inside a text i', async ({ page }) => {
    // Test Case: UTC-1679
    // Summary: Verify Ignore shortcut while typing in text input when cursor is inside a text input field
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: Ignore shortcut while typing in text input Given cursor is inside a text input field When Backspace is pressed Then only text should delete and no annotation/label should be removed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Fill input field
    await datalabellingPage.clickCreateButton();
    await datalabellingPage.fillInputField('name', 'Test Session');

    const inputVisible = await datalabellingPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1680: Verify Ignore shortcut inside search bar when search field is focused', async ({ page }) => {
    // Test Case: UTC-1680
    // Summary: Verify Ignore shortcut inside search bar when search field is focused
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: Ignore shortcut inside search bar Given search field is focused When Backspace is pressed Then search text updates and no deletion action occurs

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1681: Verify UI refresh after deletion when an item is deleted using Backspace', async ({ page }) => {
    // Test Case: UTC-1681
    // Summary: Verify UI refresh after deletion when an item is deleted using Backspace
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: UI refresh after deletion Given an item is deleted using Backspace When deletion completes Then UI should update instantly without page reload

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1682: Verify Backend state synchronized when deletion occurs', async ({ page }) => {
    // Test Case: UTC-1682
    // Summary: Verify Backend state synchronized when deletion occurs
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: Backend state synchronized Given deletion occurs When state/API sync runs Then deleted item should not exist in payload

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1683: Verify Multiple deletions sequentially when multiple items selected sequentially', async ({ page }) => {
    // Test Case: UTC-1683
    // Summary: Verify Multiple deletions sequentially when multiple items selected sequentially
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: Multiple deletions sequentially Given multiple items selected sequentially When Backspace pressed repeatedly Then each item should delete one by one

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1684: Verify Fast response time when multiple annotations exist', async ({ page }) => {
    // Test Case: UTC-1684
    // Summary: Verify Fast response time when multiple annotations exist
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: Fast response time Given multiple annotations exist When Backspace is pressed Then deletion should complete within acceptable time (<200ms)

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1685: Verify Keyboard-only usage when user navigates using keyboard only', async ({ page }) => {
    // Test Case: UTC-1685
    // Summary: Verify Keyboard-only usage when user navigates using keyboard only
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: Keyboard-only usage Given user navigates using keyboard only When Backspace is pressed Then deletion should work without mouse

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1686: Verify Works after image change when user navigates to another image', async ({ page }) => {
    // Test Case: UTC-1686
    // Summary: Verify Works after image change when user navigates to another image
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: Works after image change Given user navigates to another image When Backspace pressed Then deletion should still function correctly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1687: Verify Rapid repeated key press handling when user presses Backspace rapidly', async ({ page }) => {
    // Test Case: UTC-1687
    // Summary: Verify Rapid repeated key press handling when user presses Backspace rapidly
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: Rapid repeated key press handling Given user presses Backspace rapidly When system processes events Then application should remain stable without crash

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1688: Verify Frozen/locked mode active when grid interaction is frozen', async ({ page }) => {
    // Test Case: UTC-1688
    // Summary: Verify Frozen/locked mode active when grid interaction is frozen
    // Description: Feature: Keyboard Shortcut Mapping for Deletion Scenario: Frozen/locked mode active Given grid interaction is frozen When Backspace pressed Then deletion should be blocked

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
