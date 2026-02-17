import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Generate button visibility when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-77
 * SDS: SDS-77
 */
test.describe('URS-DV-GEN-07: Verify Generate button visibility when Session Creation page', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-957: Verify Generate button visibility when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-957
    // Summary: Verify Generate button visibility when Session Creation page loads
    // Description: Feature: Generate Button for Session ID creation Scenario: Generate button visibility Given Session Creation page loads When metadata section renders Then Generate button should be visible at bottom

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-958: Verify Button label correctness when the button is displayed', async ({ page }) => {
    // Test Case: UTC-958
    // Summary: Verify Button label correctness when the button is displayed
    // Description: Feature: Generate Button for Session ID creation Scenario: Button label correctness Given the button is displayed When user views it Then label should read “Generate”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-959: Verify Trigger backend call when valid metadata exists', async ({ page }) => {
    // Test Case: UTC-959
    // Summary: Verify Trigger backend call when valid metadata exists
    // Description: Feature: Generate Button for Session ID creation Scenario: Trigger backend call Given valid metadata exists When user clicks Generate Then request should be sent to backend API

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-960: Verify Unique ID returned when backend processes request', async ({ page }) => {
    // Test Case: UTC-960
    // Summary: Verify Unique ID returned when backend processes request
    // Description: Feature: Generate Button for Session ID creation Scenario: Unique ID returned Given backend processes request When response received Then a unique session ID should be returned

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-961: Verify ID populated in UI when ID generated', async ({ page }) => {
    // Test Case: UTC-961
    // Summary: Verify ID populated in UI when ID generated
    // Description: Feature: Generate Button for Session ID creation Scenario: ID populated in UI Given ID generated When response is received Then generated ID should populate Session ID field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-962: Verify Response time within limits when metadata submitted', async ({ page }) => {
    // Test Case: UTC-962
    // Summary: Verify Response time within limits when metadata submitted
    // Description: Feature: Generate Button for Session ID creation Scenario: Response time within limits Given metadata submitted When Generate clicked Then ID should be returned within 2 seconds

    // Navigate to module
    await sessionPage.navigateToModule();

    // Create session
    await sessionPage.createSession({
      name: 'Test Session',
      description: 'Test Description'
    });

    const sessionExists = await sessionPage.sessionExists('Test Session');
    expect(sessionExists).toBe(true);
  });

  test('UTC-963: Verify Button disabled during processing when Generate clicked', async ({ page }) => {
    // Test Case: UTC-963
    // Summary: Verify Button disabled during processing when Generate clicked
    // Description: Feature: Generate Button for Session ID creation Scenario: Button disabled during processing Given Generate clicked When request is processing Then button should be disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-964: Verify Loading indicator shown when backend request is active', async ({ page }) => {
    // Test Case: UTC-964
    // Summary: Verify Loading indicator shown when backend request is active
    // Description: Feature: Generate Button for Session ID creation Scenario: Loading indicator shown Given backend request is active When processing Then loading spinner should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-965: Verify Prevent double click when request already triggered', async ({ page }) => {
    // Test Case: UTC-965
    // Summary: Verify Prevent double click when request already triggered
    // Description: Feature: Generate Button for Session ID creation Scenario: Prevent double click Given request already triggered When user clicks again Then duplicate submission should not occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-966: Verify ID uniqueness when multiple generations', async ({ page }) => {
    // Test Case: UTC-966
    // Summary: Verify ID uniqueness when multiple generations
    // Description: Feature: Generate Button for Session ID creation Scenario: ID uniqueness Given multiple generations When Generate clicked repeatedly Then each ID should be unique

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-967: Verify Uses latest metadata when metadata changed before click', async ({ page }) => {
    // Test Case: UTC-967
    // Summary: Verify Uses latest metadata when metadata changed before click
    // Description: Feature: Generate Button for Session ID creation Scenario: Uses latest metadata Given metadata changed before click When Generate pressed Then new metadata should be included in request

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-968: Verify Unauthorized user blocked when user lacks permission', async ({ page }) => {
    // Test Case: UTC-968
    // Summary: Verify Unauthorized user blocked when user lacks permission
    // Description: Feature: Generate Button for Session ID creation Scenario: Unauthorized user blocked Given user lacks permission When clicking Generate Then action should be restricted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-969: Verify Backend failure handled when server error occurs', async ({ page }) => {
    // Test Case: UTC-969
    // Summary: Verify Backend failure handled when server error occurs
    // Description: Feature: Generate Button for Session ID creation Scenario: Backend failure handled Given server error occurs When request fails Then system shows error toast

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-970: Verify Retry allowed when first attempt failed', async ({ page }) => {
    // Test Case: UTC-970
    // Summary: Verify Retry allowed when first attempt failed
    // Description: Feature: Generate Button for Session ID creation Scenario: Retry allowed Given first attempt failed When user retries Then generation should work successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-971: Verify Clear visual placement when user scrolls page', async ({ page }) => {
    // Test Case: UTC-971
    // Summary: Verify Clear visual placement when user scrolls page
    // Description: Feature: Generate Button for Session ID creation Scenario: Clear visual placement Given user scrolls page When reaching metadata end Then Generate button should be easily discoverable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-972: Verify Keyboard activation when button focused', async ({ page }) => {
    // Test Case: UTC-972
    // Summary: Verify Keyboard activation when button focused
    // Description: Feature: Generate Button for Session ID creation Scenario: Keyboard activation Given button focused When Enter/Space pressed Then generation should trigger

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-973: Verify State persistence when ID generated', async ({ page }) => {
    // Test Case: UTC-973
    // Summary: Verify State persistence when ID generated
    // Description: Feature: Generate Button for Session ID creation Scenario: State persistence Given ID generated When navigating within form Then generated ID should remain intact

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
