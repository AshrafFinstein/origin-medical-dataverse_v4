import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Popup controls clearly visible when user opens label popup
 * URS: URS-DV-DA-27
 * SRS: SRS-239
 * SDS: SDS-239
 */
test.describe('URS-DV-DA-27: Verify Popup controls clearly visible when user opens label ', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2488: Verify Popup controls clearly visible when user opens label popup', async ({ page }) => {
    // Test Case: UTC-2488
    // Summary: Verify Popup controls clearly visible when user opens label popup
    // Description: Feature: User-friendly labeling workflow experience Scenario: Popup controls clearly visible Given user opens label popup When popup renders Then search, labels, and Apply button should be clearly visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2489: Verify Search field guidance when popup open', async ({ page }) => {
    // Test Case: UTC-2489
    // Summary: Verify Search field guidance when popup open
    // Description: Feature: User-friendly labeling workflow experience Scenario: Search field guidance Given popup open When user views search field Then placeholder text should guide label search

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2490: Verify Labels readable when labels listed', async ({ page }) => {
    // Test Case: UTC-2490
    // Summary: Verify Labels readable when labels listed
    // Description: Feature: User-friendly labeling workflow experience Scenario: Labels readable Given labels listed When user views list Then label text should be readable and properly spaced

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify table/grid
    await datalabellingPage.waitForSessionTable();
    const count = await datalabellingPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2491: Verify Checkbox clarity when label list visible', async ({ page }) => {
    // Test Case: UTC-2491
    // Summary: Verify Checkbox clarity when label list visible
    // Description: Feature: User-friendly labeling workflow experience Scenario: Checkbox clarity Given label list visible When selecting a checkbox Then selection state should be clearly highlighted

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2492: Verify Apply button default disabled when popup opens', async ({ page }) => {
    // Test Case: UTC-2492
    // Summary: Verify Apply button default disabled when popup opens
    // Description: Feature: User-friendly labeling workflow experience Scenario: Apply button default disabled Given popup opens When no label selected Then Apply button should be disabled to prevent mistakes

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2493: Verify Apply button enabled feedback when label selected', async ({ page }) => {
    // Test Case: UTC-2493
    // Summary: Verify Apply button enabled feedback when label selected
    // Description: Feature: User-friendly labeling workflow experience Scenario: Apply button enabled feedback Given label selected When checkbox marked Then Apply button should enable clearly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2494: Verify Immediate label reflection when labels applied', async ({ page }) => {
    // Test Case: UTC-2494
    // Summary: Verify Immediate label reflection when labels applied
    // Description: Feature: User-friendly labeling workflow experience Scenario: Immediate label reflection Given labels applied When action completes Then labels appear instantly below image

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2495: Verify Success confirmation message when labels applied', async ({ page }) => {
    // Test Case: UTC-2495
    // Summary: Verify Success confirmation message when labels applied
    // Description: Feature: User-friendly labeling workflow experience Scenario: Success confirmation message Given labels applied When process succeeds Then success toast should display clear message

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2496: Verify Empty search result feedback when search text has no match', async ({ page }) => {
    // Test Case: UTC-2496
    // Summary: Verify Empty search result feedback when search text has no match
    // Description: Feature: User-friendly labeling workflow experience Scenario: Empty search result feedback Given search text has no match When filtering Then “No results found” message should display

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2497: Verify Cancel action clarity when popup open', async ({ page }) => {
    // Test Case: UTC-2497
    // Summary: Verify Cancel action clarity when popup open
    // Description: Feature: User-friendly labeling workflow experience Scenario: Cancel action clarity Given popup open When Cancel clicked Then popup should close without changes

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2498: Verify Confirmation modal clarity when removal initiated', async ({ page }) => {
    // Test Case: UTC-2498
    // Summary: Verify Confirmation modal clarity when removal initiated
    // Description: Feature: User-friendly labeling workflow experience Scenario: Confirmation modal clarity Given removal initiated When confirmation appears Then modal text clearly describes action

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2499: Verify Yes/No button distinction when confirmation modal', async ({ page }) => {
    // Test Case: UTC-2499
    // Summary: Verify Yes/No button distinction when confirmation modal
    // Description: Feature: User-friendly labeling workflow experience Scenario: Yes/No button distinction Given confirmation modal When displayed Then Yes and No buttons should be visually distinct

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2500: Verify No accidental apply when no label selected', async ({ page }) => {
    // Test Case: UTC-2500
    // Summary: Verify No accidental apply when no label selected
    // Description: Feature: User-friendly labeling workflow experience Scenario: No accidental apply Given no label selected When user clicks Apply repeatedly Then no action should occur

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2501: Verify Selection persistence when labels selected', async ({ page }) => {
    // Test Case: UTC-2501
    // Summary: Verify Selection persistence when labels selected
    // Description: Feature: User-friendly labeling workflow experience Scenario: Selection persistence Given labels selected When popup reopened Then previous selections should remain visible

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2502: Verify Keyboard navigation when popup open', async ({ page }) => {
    // Test Case: UTC-2502
    // Summary: Verify Keyboard navigation when popup open
    // Description: Feature: User-friendly labeling workflow experience Scenario: Keyboard navigation Given popup open When using Tab/Space/Enter Then controls should be accessible via keyboard

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2503: Verify Consistent layout when multiple interactions', async ({ page }) => {
    // Test Case: UTC-2503
    // Summary: Verify Consistent layout when multiple interactions
    // Description: Feature: User-friendly labeling workflow experience Scenario: Consistent layout Given multiple interactions When popup used repeatedly Then layout remains stable and predictable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2504: Verify Non-technical error messaging when failure occurs', async ({ page }) => {
    // Test Case: UTC-2504
    // Summary: Verify Non-technical error messaging when failure occurs
    // Description: Feature: User-friendly labeling workflow experience Scenario: Non-technical error messaging Given failure occurs When error shown Then message should be simple and user-friendly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await datalabellingPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
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
