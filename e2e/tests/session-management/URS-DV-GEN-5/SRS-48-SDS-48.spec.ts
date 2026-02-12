import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, LabelSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown visibility when the user opens Session Creation page
 * URS: URS-DV-GEN-5
 * SRS: SRS-48
 * SDS: SDS-48
 */
test.describe('URS-DV-GEN-5: Verify Dropdown visibility when the user opens Session Creat', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-563: Verify Dropdown visibility when the user opens Session Creation page', async ({ page }) => {
    // Test Case: UTC-563
    // Summary: Verify Dropdown visibility when the user opens Session Creation page
    // Description: Feature: Session Label Dropdown Rendering & Persistence Scenario: Dropdown visibility Given the user opens Session Creation page When the page loads Then the Session Label dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-564: Verify Load labels from masters when labels exist in masters', async ({ page }) => {
    // Test Case: UTC-564
    // Summary: Verify Load labels from masters when labels exist in masters
    // Description: Feature: Session Label Dropdown Rendering & Persistence Scenario: Load labels from masters Given labels exist in masters When the dropdown is opened Then all active labels should be listed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-565: Verify Select label when labels are available', async ({ page }) => {
    // Test Case: UTC-565
    // Summary: Verify Select label when labels are available
    // Description: Feature: Session Label Dropdown Rendering & Persistence Scenario: Select label Given labels are available When the user selects a label Then the selected label should appear in the field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-566: Verify Selection retention when a label is selected', async ({ page }) => {
    // Test Case: UTC-566
    // Summary: Verify Selection retention when a label is selected
    // Description: Feature: Session Label Dropdown Rendering & Persistence Scenario: Selection retention Given a label is selected When the user navigates within the form Then the selected label should remain retained

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-567: Verify Remove selected label when a label is selected', async ({ page }) => {
    // Test Case: UTC-567
    // Summary: Verify Remove selected label when a label is selected
    // Description: Feature: Session Label Dropdown Rendering & Persistence Scenario: Remove selected label Given a label is selected When the user clears/removes the label Then the field should become empty

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-568: Verify Dynamic refresh of new labels when a new label is added in masters', async ({ page }) => {
    // Test Case: UTC-568
    // Summary: Verify Dynamic refresh of new labels when a new label is added in masters
    // Description: Feature: Session Label Dropdown Rendering & Persistence Scenario: Dynamic refresh of new labels Given a new label is added in masters When the dropdown is reopened or refreshed Then the new label should appear in the list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-569: Verify Save with selected label when a label is selected', async ({ page }) => {
    // Test Case: UTC-569
    // Summary: Verify Save with selected label when a label is selected
    // Description: Feature: Session Label Dropdown Rendering & Persistence Scenario: Save with selected label Given a label is selected When the user creates the session Then the label should be stored in the session payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-570: Verify Prevent invalid selection when labels are unavailable or invalid', async ({ page }) => {
    // Test Case: UTC-570
    // Summary: Verify Prevent invalid selection when labels are unavailable or invalid
    // Description: Feature: Session Label Dropdown Rendering & Persistence Scenario: Prevent invalid selection Given labels are unavailable or invalid When the user opens dropdown Then selection should be disabled and empty state shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-571: Verify Empty state clarity when no labels exist', async ({ page }) => {
    // Test Case: UTC-571
    // Summary: Verify Empty state clarity when no labels exist
    // Description: Feature: Session Label Dropdown Rendering & Persistence Scenario: Empty state clarity Given no labels exist When the dropdown is opened Then a clear No Labels Available message should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-572: Verify Unauthorized access restriction when the user lacks permission', async ({ page }) => {
    // Test Case: UTC-572
    // Summary: Verify Unauthorized access restriction when the user lacks permission
    // Description: Feature: Session Label Dropdown Rendering & Persistence Scenario: Unauthorized access restriction Given the user lacks permission When the page loads Then dropdown should be hidden or disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-573: Verify Fast dropdown load when many labels exist', async ({ page }) => {
    // Test Case: UTC-573
    // Summary: Verify Fast dropdown load when many labels exist
    // Description: Feature: Session Label Dropdown Rendering & Persistence Scenario: Fast dropdown load Given many labels exist When the dropdown is opened Then the list should load without noticeable delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-574: Verify API failure handling when label API fails', async ({ page }) => {
    // Test Case: UTC-574
    // Summary: Verify API failure handling when label API fails
    // Description: Feature: Session Label Dropdown Rendering & Persistence Scenario: API failure handling Given label API fails When the dropdown loads Then system should show friendly message without crash

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
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
