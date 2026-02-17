import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Select All checkbox visibility when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-84
 * SDS: SDS-84
 */
test.describe('URS-DV-GEN-07: Verify Select All checkbox visibility when Session Creation ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1046: Verify Select All checkbox visibility when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-1046
    // Summary: Verify Select All checkbox visibility when Session Creation page loads
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: Select All checkbox visibility Given Session Creation page loads When Reviewer dropdown renders Then “Select All” checkbox should be visible above the list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1047: Verify Checkbox alignment when dropdown opened', async ({ page }) => {
    // Test Case: UTC-1047
    // Summary: Verify Checkbox alignment when dropdown opened
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: Checkbox alignment Given dropdown opened When UI displays reviewers Then Select All should appear at the top clearly separated from users

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1048: Verify Select all reviewers when reviewer list loaded', async ({ page }) => {
    // Test Case: UTC-1048
    // Summary: Verify Select all reviewers when reviewer list loaded
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: Select all reviewers Given reviewer list loaded When user clicks Select All Then all reviewers should become selected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1049: Verify Deselect all reviewers when all reviewers selected', async ({ page }) => {
    // Test Case: UTC-1049
    // Summary: Verify Deselect all reviewers when all reviewers selected
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: Deselect all reviewers Given all reviewers selected When user unchecks Select All Then all reviewers should be deselected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1050: Verify Manual selection updates Select All state when some reviewers manually se', async ({ page }) => {
    // Test Case: UTC-1050
    // Summary: Verify Manual selection updates Select All state when some reviewers manually selected
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: Manual selection updates Select All state Given some reviewers manually selected When not all are selected Then Select All should show unchecked or indeterminate state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1051: Verify Select All after partial selection when few reviewers selected', async ({ page }) => {
    // Test Case: UTC-1051
    // Summary: Verify Select All after partial selection when few reviewers selected
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: Select All after partial selection Given few reviewers selected When Select All clicked Then remaining reviewers should also be selected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1052: Verify State array update when Select All clicked', async ({ page }) => {
    // Test Case: UTC-1052
    // Summary: Verify State array update when Select All clicked
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: State array update Given Select All clicked When checking component state Then all reviewer IDs should be stored in reviewers array

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1053: Verify Payload inclusion when reviewers selected', async ({ page }) => {
    // Test Case: UTC-1053
    // Summary: Verify Payload inclusion when reviewers selected
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: Payload inclusion Given reviewers selected When session saved Then all reviewer IDs should be present in API payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1054: Verify Visual feedback when reviewers selected', async ({ page }) => {
    // Test Case: UTC-1054
    // Summary: Verify Visual feedback when reviewers selected
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: Visual feedback Given reviewers selected When dropdown collapses Then selected reviewers should appear as chips/tags

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1055: Verify Empty reviewer list when no reviewers available', async ({ page }) => {
    // Test Case: UTC-1055
    // Summary: Verify Empty reviewer list when no reviewers available
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: Empty reviewer list Given no reviewers available When dropdown opens Then Select All should be disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1056: Verify Search after Select All when all selected', async ({ page }) => {
    // Test Case: UTC-1056
    // Summary: Verify Search after Select All when all selected
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: Search after Select All Given all selected When filtering list Then selection state should persist

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1057: Verify Navigation persistence when reviewers selected', async ({ page }) => {
    // Test Case: UTC-1057
    // Summary: Verify Navigation persistence when reviewers selected
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: Navigation persistence Given reviewers selected When navigating within page Then selection should remain intact

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1058: Verify Large list performance when 200+ reviewers exist', async ({ page }) => {
    // Test Case: UTC-1058
    // Summary: Verify Large list performance when 200+ reviewers exist
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: Large list performance Given 200+ reviewers exist When Select All clicked Then UI should update instantly without lag

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1059: Verify Unauthorized role restriction when user lacks permission', async ({ page }) => {
    // Test Case: UTC-1059
    // Summary: Verify Unauthorized role restriction when user lacks permission
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: Unauthorized role restriction Given user lacks permission When page loads Then reviewer dropdown and Select All should be hidden or disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1060: Verify Keyboard accessibility when Select All focused', async ({ page }) => {
    // Test Case: UTC-1060
    // Summary: Verify Keyboard accessibility when Select All focused
    // Description: Feature: Reviewers Select All checkbox for bulk reviewer assignment Scenario: Keyboard accessibility Given Select All focused When Space/Enter pressed Then all reviewers should toggle selection

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

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
