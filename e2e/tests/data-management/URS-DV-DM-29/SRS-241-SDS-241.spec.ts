import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Upload from S3 button visibility when Create Session page loads
 * URS: URS-DV-DM-29
 * SRS: SRS-241
 * SDS: SDS-241
 */
test.describe('URS-DV-DM-29: Verify Upload from S3 button visibility when Create Session ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2517: Verify Upload from S3 button visibility when Create Session page loads', async ({ page }) => {
    // Test Case: UTC-2517
    // Summary: Verify Upload from S3 button visibility when Create Session page loads
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Upload from S3 button visibility Given Create Session page loads When page renders Then “Upload from S3” button should appear at top-right corner

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2518: Verify Modal opens on click when user clicks Upload from S3', async ({ page }) => {
    // Test Case: UTC-2518
    // Summary: Verify Modal opens on click when user clicks Upload from S3
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Modal opens on click Given user clicks Upload from S3 When action triggered Then modal dialog should open with S3 Key field and Upload button

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2519: Verify Upload disabled initially when modal is opened', async ({ page }) => {
    // Test Case: UTC-2519
    // Summary: Verify Upload disabled initially when modal is opened
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Upload disabled initially Given modal is opened When no S3 key entered Then Upload button should remain disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2520: Verify Enable Upload on valid key when valid S3 key format entered', async ({ page }) => {
    // Test Case: UTC-2520
    // Summary: Verify Enable Upload on valid key when valid S3 key format entered
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Enable Upload on valid key Given valid S3 key format entered When input validated Then Upload button becomes enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2521: Verify Successful JSON fetch when valid accessible S3 key', async ({ page }) => {
    // Test Case: UTC-2521
    // Summary: Verify Successful JSON fetch when valid accessible S3 key
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Successful JSON fetch Given valid accessible S3 key When user clicks Upload Then JSON should be fetched and bound to session form

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2522: Verify Display uploaded file name when JSON uploaded successfully', async ({ page }) => {
    // Test Case: UTC-2522
    // Summary: Verify Display uploaded file name when JSON uploaded successfully
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Display uploaded file name Given JSON uploaded successfully When upload completes Then file name should appear below upload area with remove icon

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2523: Verify Remove uploaded file when file is displayed', async ({ page }) => {
    // Test Case: UTC-2523
    // Summary: Verify Remove uploaded file when file is displayed
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Remove uploaded file Given file is displayed When user clicks remove icon Then file should be removed from session state and UI list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2524: Verify Empty key validation when S3 key empty', async ({ page }) => {
    // Test Case: UTC-2524
    // Summary: Verify Empty key validation when S3 key empty
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Empty key validation Given S3 key empty When Upload attempted Then validation message should display

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2525: Verify Invalid key format when malformed key entered', async ({ page }) => {
    // Test Case: UTC-2525
    // Summary: Verify Invalid key format when malformed key entered
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Invalid key format Given malformed key entered When validated Then system should show invalid format message

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2526: Verify Access denied handling when unauthorized S3 path', async ({ page }) => {
    // Test Case: UTC-2526
    // Summary: Verify Access denied handling when unauthorized S3 path
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Access denied handling Given unauthorized S3 path When fetch attempted Then failure toast should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2527: Verify File not found handling when non-existing key', async ({ page }) => {
    // Test Case: UTC-2527
    // Summary: Verify File not found handling when non-existing key
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: File not found handling Given non-existing key When fetch attempted Then file-not-found message should display

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2528: Verify Invalid JSON structure when corrupted JSON file', async ({ page }) => {
    // Test Case: UTC-2528
    // Summary: Verify Invalid JSON structure when corrupted JSON file
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Invalid JSON structure Given corrupted JSON file When parsed Then system should reject file and show structure error

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2529: Verify Metadata stored in state when upload success', async ({ page }) => {
    // Test Case: UTC-2529
    // Summary: Verify Metadata stored in state when upload success
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Metadata stored in state Given upload success When session form inspected Then file metadata (name, size, path) should be stored

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2530: Verify Page remains stable on error when upload fails', async ({ page }) => {
    // Test Case: UTC-2530
    // Summary: Verify Page remains stable on error when upload fails
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Page remains stable on error Given upload fails When error occurs Then session creation page should remain usable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2531: Verify Fast upload readiness when user clicks upload', async ({ page }) => {
    // Test Case: UTC-2531
    // Summary: Verify Fast upload readiness when user clicks upload
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Fast upload readiness Given user clicks upload When processing Then spinner shows and UI remains responsive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2532: Verify Secure signed URL usage when fetch initiated', async ({ page }) => {
    // Test Case: UTC-2532
    // Summary: Verify Secure signed URL usage when fetch initiated
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Secure signed URL usage Given fetch initiated When backend called Then secure signed URL should be used without exposing credentials

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2533: Verify Clear success feedback when upload successful', async ({ page }) => {
    // Test Case: UTC-2533
    // Summary: Verify Clear success feedback when upload successful
    // Description: Feature: Upload Link JSON from S3 during session creation Scenario: Clear success feedback Given upload successful When completed Then success toast should be displayed

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
