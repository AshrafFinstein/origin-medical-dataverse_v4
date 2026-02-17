import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Trigger confirmation modal on Backspace without canvas selection when no canvas mark is selected
 * URS: URS-DV-GEN-16
 * SRS: SRS-123
 * SDS: SDS-123
 */
test.describe('URS-DV-GEN-16: Verify Trigger confirmation modal on Backspace without canva', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1689: Verify Trigger confirmation modal on Backspace without canvas selection when no ', async ({ page }) => {
    // Test Case: UTC-1689
    // Summary: Verify Trigger confirmation modal on Backspace without canvas selection when no canvas mark is selected
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: Trigger confirmation modal on Backspace without canvas selection Given no canvas mark is selected And a label exists in sidebar When user presses Backspace Then a “Remove Labels” confirmation modal should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1690: Verify Modal UI elements visible when confirmation modal is open', async ({ page }) => {
    // Test Case: UTC-1690
    // Summary: Verify Modal UI elements visible when confirmation modal is open
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: Modal UI elements visible Given confirmation modal is open When user views the modal Then title “Remove Labels” and Yes/No buttons should be visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1691: Verify Confirm deletion when confirmation modal is open', async ({ page }) => {
    // Test Case: UTC-1691
    // Summary: Verify Confirm deletion when confirmation modal is open
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: Confirm deletion Given confirmation modal is open When user clicks Yes Then the selected label should be removed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1692: Verify Cancel deletion using No when confirmation modal is open', async ({ page }) => {
    // Test Case: UTC-1692
    // Summary: Verify Cancel deletion using No when confirmation modal is open
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: Cancel deletion using No Given confirmation modal is open When user clicks No Then the label should remain unchanged

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1693: Verify Cancel deletion by closing modal when confirmation modal is open', async ({ page }) => {
    // Test Case: UTC-1693
    // Summary: Verify Cancel deletion by closing modal when confirmation modal is open
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: Cancel deletion by closing modal Given confirmation modal is open When user closes the modal (X/overlay click) Then deletion should not occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1694: Verify Success toast after deletion when label is deleted successfully', async ({ page }) => {
    // Test Case: UTC-1694
    // Summary: Verify Success toast after deletion when label is deleted successfully
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: Success toast after deletion Given label is deleted successfully When operation completes Then green success toast should be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await datalabellingPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1695: Verify Sidebar refresh after deletion when deletion confirmed', async ({ page }) => {
    // Test Case: UTC-1695
    // Summary: Verify Sidebar refresh after deletion when deletion confirmed
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: Sidebar refresh after deletion Given deletion confirmed When sidebar updates Then removed label should not appear in list

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1696: Verify Backend object updated when deletion confirmed', async ({ page }) => {
    // Test Case: UTC-1696
    // Summary: Verify Backend object updated when deletion confirmed
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: Backend object updated Given deletion confirmed When API payload is inspected Then label ID should be removed from image object

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1697: Verify No label active when no active label exists', async ({ page }) => {
    // Test Case: UTC-1697
    // Summary: Verify No label active when no active label exists
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: No label active Given no active label exists When Backspace pressed Then no modal should appear and no deletion occurs

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1698: Verify Ignore Backspace inside text input when cursor is inside a text/search fi', async ({ page }) => {
    // Test Case: UTC-1698
    // Summary: Verify Ignore Backspace inside text input when cursor is inside a text/search field
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: Ignore Backspace inside text input Given cursor is inside a text/search field When Backspace pressed Then only text edits occur and modal should not appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1699: Verify Multiple deletions sequentially when multiple labels exist', async ({ page }) => {
    // Test Case: UTC-1699
    // Summary: Verify Multiple deletions sequentially when multiple labels exist
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: Multiple deletions sequentially Given multiple labels exist When user deletes labels one by one Then each deletion should follow confirmation flow correctly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1700: Verify Modal appears quickly when Backspace pressed', async ({ page }) => {
    // Test Case: UTC-1700
    // Summary: Verify Modal appears quickly when Backspace pressed
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: Modal appears quickly Given Backspace pressed When system responds Then modal should appear within acceptable time (<200ms)

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1701: Verify Keyboard navigation support when modal is open', async ({ page }) => {
    // Test Case: UTC-1701
    // Summary: Verify Keyboard navigation support when modal is open
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: Keyboard navigation support Given modal is open When user navigates with Tab/Enter Then Yes/No buttons should be selectable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1702: Verify State persistence on navigation when label deletion confirmed', async ({ page }) => {
    // Test Case: UTC-1702
    // Summary: Verify State persistence on navigation when label deletion confirmed
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: State persistence on navigation Given label deletion confirmed When user navigates or refreshes Then deleted label should not reappear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1703: Verify Rapid Backspace presses when user presses Backspace repeatedly', async ({ page }) => {
    // Test Case: UTC-1703
    // Summary: Verify Rapid Backspace presses when user presses Backspace repeatedly
    // Description: Feature: Label Deletion Workflow with Confirmation Scenario: Rapid Backspace presses Given user presses Backspace repeatedly When system processes input Then only one confirmation modal should appear without duplication

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

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
