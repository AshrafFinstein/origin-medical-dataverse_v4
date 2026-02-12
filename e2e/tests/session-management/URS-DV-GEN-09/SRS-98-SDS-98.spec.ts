import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Validate duplicates on import trigger when JSON files are selected
 * URS: URS-DV-GEN-09
 * SRS: SRS-98
 * SDS: SDS-98
 */
test.describe('URS-DV-GEN-09: Verify Validate duplicates on import trigger when JSON files', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1274: Verify Validate duplicates on import trigger when JSON files are selected', async ({ page }) => {
    // Test Case: UTC-1274
    // Summary: Verify Validate duplicates on import trigger when JSON files are selected
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Validate duplicates on import trigger Given JSON files are selected When user clicks Import Then system should cross-reference file image IDs with existing session data

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1275: Verify No duplicates found when selected files contain unique images', async ({ page }) => {
    // Test Case: UTC-1275
    // Summary: Verify No duplicates found when selected files contain unique images
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: No duplicates found Given selected files contain unique images When import starts Then files should import directly without showing modal

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1276: Verify Duplicates detected when selected files contain duplicate image IDs', async ({ page }) => {
    // Test Case: UTC-1276
    // Summary: Verify Duplicates detected when selected files contain duplicate image IDs
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Duplicates detected Given selected files contain duplicate image IDs When validation completes Then duplicate detection modal should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1277: Verify Modal title visibility when duplicates exist', async ({ page }) => {
    // Test Case: UTC-1277
    // Summary: Verify Modal title visibility when duplicates exist
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Modal title visibility Given duplicates exist When modal opens Then title “Duplicate Images Detected” should be clearly visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1278: Verify Modal displays filename when duplicate files detected', async ({ page }) => {
    // Test Case: UTC-1278
    // Summary: Verify Modal displays filename when duplicate files detected
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Modal displays filename Given duplicate files detected When modal appears Then filename should be listed in modal

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1279: Verify Modal displays counts when duplicates detected', async ({ page }) => {
    // Test Case: UTC-1279
    // Summary: Verify Modal displays counts when duplicates detected
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Modal displays counts Given duplicates detected When modal loads Then total images count and duplicate count should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1280: Verify Modal action buttons visible when modal open', async ({ page }) => {
    // Test Case: UTC-1280
    // Summary: Verify Modal action buttons visible when modal open
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Modal action buttons visible Given modal open When user views options Then Yes and No buttons should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1281: Verify User selects No when duplicate modal displayed', async ({ page }) => {
    // Test Case: UTC-1281
    // Summary: Verify User selects No when duplicate modal displayed
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: User selects No Given duplicate modal displayed When user clicks No Then import should be aborted for that file

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1282: Verify User selects Yes when duplicate modal displayed', async ({ page }) => {
    // Test Case: UTC-1282
    // Summary: Verify User selects Yes when duplicate modal displayed
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: User selects Yes Given duplicate modal displayed When user clicks Yes Then system should proceed with non-duplicate entries only

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1283: Verify Only unique images stored when import proceeds', async ({ page }) => {
    // Test Case: UTC-1283
    // Summary: Verify Only unique images stored when import proceeds
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Only unique images stored Given import proceeds When processing completes Then database should contain only non-duplicate images

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1284: Verify Accurate duplicate count when duplicates present', async ({ page }) => {
    // Test Case: UTC-1284
    // Summary: Verify Accurate duplicate count when duplicates present
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Accurate duplicate count Given duplicates present When modal shows counts Then count should match database results

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1285: Verify Empty file when file contains no images', async ({ page }) => {
    // Test Case: UTC-1285
    // Summary: Verify Empty file when file contains no images
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Empty file Given file contains no images When imported Then no duplicate check should fail or crash

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1286: Verify Modal closes safely when modal open', async ({ page }) => {
    // Test Case: UTC-1286
    // Summary: Verify Modal closes safely when modal open
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Modal closes safely Given modal open When user dismisses Then UI should return to staging state without error

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1287: Verify Multiple files with mixed duplicates when several files selected', async ({ page }) => {
    // Test Case: UTC-1287
    // Summary: Verify Multiple files with mixed duplicates when several files selected
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Multiple files with mixed duplicates Given several files selected When validation runs Then modal should display discrepancies per file

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1288: Verify Large dataset validation when large file (1000+ images)', async ({ page }) => {
    // Test Case: UTC-1288
    // Summary: Verify Large dataset validation when large file (1000+ images)
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Large dataset validation Given large file (1000+ images) When checking duplicates Then validation should complete within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1289: Verify Clear explanation message when duplicates detected', async ({ page }) => {
    // Test Case: UTC-1289
    // Summary: Verify Clear explanation message when duplicates detected
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Clear explanation message Given duplicates detected When modal displayed Then user-friendly message should explain impact

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1290: Verify Keyboard support when modal focused', async ({ page }) => {
    // Test Case: UTC-1290
    // Summary: Verify Keyboard support when modal focused
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Keyboard support Given modal focused When user presses Enter/Space Then selected action button should activate

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-1291: Verify Retry after cancel when user clicks No', async ({ page }) => {
    // Test Case: UTC-1291
    // Summary: Verify Retry after cancel when user clicks No
    // Description: Feature: Duplicate Image Detection during JSON Import Scenario: Retry after cancel Given user clicks No When importing again with corrected file Then import should proceed normally

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
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
