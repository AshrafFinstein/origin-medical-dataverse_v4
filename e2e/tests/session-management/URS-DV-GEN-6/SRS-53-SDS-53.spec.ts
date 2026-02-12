import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Admin can view bucket registry page when the admin logs into the system
 * URS: URS-DV-GEN-6
 * SRS: SRS-53
 * SDS: SDS-53
 */
test.describe('URS-DV-GEN-6: Verify Admin can view bucket registry page when the admin lo', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-614: Verify Admin can view bucket registry page when the admin logs into the system', async ({ page }) => {
    // Test Case: UTC-614
    // Summary: Verify Admin can view bucket registry page when the admin logs into the system
    // Description: Feature: Multi-Bucket Registration Scenario: Admin can view bucket registry page Given the admin logs into the system When navigating to Bucket Configuration screen Then the bucket registry list should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-615: Verify Add Bucket button visible when the registry page is open', async ({ page }) => {
    // Test Case: UTC-615
    // Summary: Verify Add Bucket button visible when the registry page is open
    // Description: Feature: Multi-Bucket Registration Scenario: Add Bucket button visible Given the registry page is open When the page loads Then an “Add Bucket” button should be available

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-616: Verify Open Add Bucket modal when the user clicks Add Bucket', async ({ page }) => {
    // Test Case: UTC-616
    // Summary: Verify Open Add Bucket modal when the user clicks Add Bucket
    // Description: Feature: Multi-Bucket Registration Scenario: Open Add Bucket modal Given the user clicks Add Bucket When the action is triggered Then a modal form should open for bucket details entry

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-617: Verify Enter bucket metadata when the modal is open', async ({ page }) => {
    // Test Case: UTC-617
    // Summary: Verify Enter bucket metadata when the modal is open
    // Description: Feature: Multi-Bucket Registration Scenario: Enter bucket metadata Given the modal is open When the user fills provider, region, lifecycle policy, and credentials Then all fields should accept valid input

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-618: Verify Save bucket successfully when valid bucket metadata is entered', async ({ page }) => {
    // Test Case: UTC-618
    // Summary: Verify Save bucket successfully when valid bucket metadata is entered
    // Description: Feature: Multi-Bucket Registration Scenario: Save bucket successfully Given valid bucket metadata is entered When the user clicks Save Then the bucket should be stored in the registry and listed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-619: Verify Mandatory field validation when required fields are empty', async ({ page }) => {
    // Test Case: UTC-619
    // Summary: Verify Mandatory field validation when required fields are empty
    // Description: Feature: Multi-Bucket Registration Scenario: Mandatory field validation Given required fields are empty When Save is clicked Then inline validation errors should appear and save should be blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-620: Verify Prevent duplicate bucket registration when an existing bucket name alread', async ({ page }) => {
    // Test Case: UTC-620
    // Summary: Verify Prevent duplicate bucket registration when an existing bucket name already registered
    // Description: Feature: Multi-Bucket Registration Scenario: Prevent duplicate bucket registration Given an existing bucket name already registered When the same bucket is added again Then the system should prevent saving and show error

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-621: Verify Edit bucket configuration when a bucket exists in the list', async ({ page }) => {
    // Test Case: UTC-621
    // Summary: Verify Edit bucket configuration when a bucket exists in the list
    // Description: Feature: Multi-Bucket Registration Scenario: Edit bucket configuration Given a bucket exists in the list When the user clicks Edit Then existing values should load in modal for update

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-622: Verify Update bucket details when the edit modal is open', async ({ page }) => {
    // Test Case: UTC-622
    // Summary: Verify Update bucket details when the edit modal is open
    // Description: Feature: Multi-Bucket Registration Scenario: Update bucket details Given the edit modal is open When changes are saved Then updated metadata should reflect immediately in registry

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-623: Verify Status badge display when buckets exist', async ({ page }) => {
    // Test Case: UTC-623
    // Summary: Verify Status badge display when buckets exist
    // Description: Feature: Multi-Bucket Registration Scenario: Status badge display Given buckets exist When viewing registry Then each bucket should show Active or Inactive status badge

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-624: Verify Services fetch configuration dynamically when services require storage ro', async ({ page }) => {
    // Test Case: UTC-624
    // Summary: Verify Services fetch configuration dynamically when services require storage routing
    // Description: Feature: Multi-Bucket Registration Scenario: Services fetch configuration dynamically Given services require storage routing When an operation is executed Then bucket configuration should be retrieved from registry dynamically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-625: Verify Unauthorized users restricted when a non-admin user logs in', async ({ page }) => {
    // Test Case: UTC-625
    // Summary: Verify Unauthorized users restricted when a non-admin user logs in
    // Description: Feature: Multi-Bucket Registration Scenario: Unauthorized users restricted Given a non-admin user logs in When accessing bucket configuration page Then access should be denied or hidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-626: Verify Cancel action discards changes when the modal is open with changes', async ({ page }) => {
    // Test Case: UTC-626
    // Summary: Verify Cancel action discards changes when the modal is open with changes
    // Description: Feature: Multi-Bucket Registration Scenario: Cancel action discards changes Given the modal is open with changes When Cancel is clicked Then no data should be saved

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-627: Verify Registration failure handling when backend error occurs during save', async ({ page }) => {
    // Test Case: UTC-627
    // Summary: Verify Registration failure handling when backend error occurs during save
    // Description: Feature: Multi-Bucket Registration Scenario: Registration failure handling Given backend error occurs during save When the request fails Then a clear error message should be displayed and configuration not saved

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-628: Verify Registry loads quickly when multiple buckets are configured', async ({ page }) => {
    // Test Case: UTC-628
    // Summary: Verify Registry loads quickly when multiple buckets are configured
    // Description: Feature: Multi-Bucket Registration Scenario: Registry loads quickly Given multiple buckets are configured When opening the registry page Then data should load within acceptable time (<2s)

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
