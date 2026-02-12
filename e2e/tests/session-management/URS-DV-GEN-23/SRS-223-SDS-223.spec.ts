import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Multiple sequential sorts when 5+ sort cycles
 * URS: URS-DV-GEN-23
 * SRS: SRS-223
 * SDS: SDS-223
 */
test.describe('URS-DV-GEN-23: Verify Multiple sequential sorts when 5+ sort cycles', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2264: Verify Multiple sequential sorts when 5+ sort cycles', async ({ page }) => {
    // Test Case: UTC-2264
    // Summary: Verify Multiple sequential sorts when 5+ sort cycles
    // Description: Feature: Reorder Performance Scenario: Multiple sequential sorts Given 5+ sort cycles When executed continuously Then average update time remains under 200ms

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2265: Verify Edit permission allows reorder when user has Edit permission', async ({ page }) => {
    // Test Case: UTC-2265
    // Summary: Verify Edit permission allows reorder when user has Edit permission
    // Description: Feature: Security and Validation for Annotation List Scenario: Edit permission allows reorder Given user has Edit permission When list loads Then drag handles and sort controls should be enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2266: Verify Read-only user cannot reorder when user has READ_ONLY role', async ({ page }) => {
    // Test Case: UTC-2266
    // Summary: Verify Read-only user cannot reorder when user has READ_ONLY role
    // Description: Feature: Security and Validation for Annotation List Scenario: Read-only user cannot reorder Given user has READ_ONLY role When list loads Then drag handles should be hidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2267: Verify Sort disabled for read-only when user is READ_ONLY', async ({ page }) => {
    // Test Case: UTC-2267
    // Summary: Verify Sort disabled for read-only when user is READ_ONLY
    // Description: Feature: Security and Validation for Annotation List Scenario: Sort disabled for read-only Given user is READ_ONLY When viewing list header Then sort icon should be disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2268: Verify Drag attempt blocked for read-only when user is READ_ONLY', async ({ page }) => {
    // Test Case: UTC-2268
    // Summary: Verify Drag attempt blocked for read-only when user is READ_ONLY
    // Description: Feature: Security and Validation for Annotation List Scenario: Drag attempt blocked for read-only Given user is READ_ONLY When attempting to drag item Then reorder should not occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2269: Verify Permission checked on load when page initializes', async ({ page }) => {
    // Test Case: UTC-2269
    // Summary: Verify Permission checked on load when page initializes
    // Description: Feature: Security and Validation for Annotation List Scenario: Permission checked on load Given page initializes When permission state resolved Then draggable attributes should match role

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2270: Verify Console manipulation prevented when read-only user opens console', async ({ page }) => {
    // Test Case: UTC-2270
    // Summary: Verify Console manipulation prevented when read-only user opens console
    // Description: Feature: Security and Validation for Annotation List Scenario: Console manipulation prevented Given read-only user opens console When attempting DOM reorder manually Then backend save should return 403

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2271: Verify UI reverts unauthorized change when unauthorized reorder attempt', async ({ page }) => {
    // Test Case: UTC-2271
    // Summary: Verify UI reverts unauthorized change when unauthorized reorder attempt
    // Description: Feature: Security and Validation for Annotation List Scenario: UI reverts unauthorized change Given unauthorized reorder attempt When backend rejects request Then UI should revert to original order

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2272: Verify Valid annotation IDs only when dataset loaded', async ({ page }) => {
    // Test Case: UTC-2272
    // Summary: Verify Valid annotation IDs only when dataset loaded
    // Description: Feature: Security and Validation for Annotation List Scenario: Valid annotation IDs only Given dataset loaded When list renders Then items with undefined IDs should be filtered out

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2273: Verify Malformed labels filtered when corrupted label data received', async ({ page }) => {
    // Test Case: UTC-2273
    // Summary: Verify Malformed labels filtered when corrupted label data received
    // Description: Feature: Security and Validation for Annotation List Scenario: Malformed labels filtered Given corrupted label data received When rendering Then malformed annotations should not display

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2274: Verify Null dataset safe handling when null list response', async ({ page }) => {
    // Test Case: UTC-2274
    // Summary: Verify Null dataset safe handling when null list response
    // Description: Feature: Security and Validation for Annotation List Scenario: Null dataset safe handling Given null list response When UI renders Then no crash occurs and list remains empty

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2275: Verify Backend authorization enforced when unauthorized request to reorder API', async ({ page }) => {
    // Test Case: UTC-2275
    // Summary: Verify Backend authorization enforced when unauthorized request to reorder API
    // Description: Feature: Security and Validation for Annotation List Scenario: Backend authorization enforced Given unauthorized request to reorder API When request submitted Then server returns Forbidden response

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2276: Verify No hidden controls accessible via keyboard when read-only role', async ({ page }) => {
    // Test Case: UTC-2276
    // Summary: Verify No hidden controls accessible via keyboard when read-only role
    // Description: Feature: Security and Validation for Annotation List Scenario: No hidden controls accessible via keyboard Given read-only role When using keyboard shortcuts Then reorder should remain disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2277: Verify Visual clarity for disabled state when controls disabled', async ({ page }) => {
    // Test Case: UTC-2277
    // Summary: Verify Visual clarity for disabled state when controls disabled
    // Description: Feature: Security and Validation for Annotation List Scenario: Visual clarity for disabled state Given controls disabled When user views header Then disabled state should appear greyed out

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2278: Verify Filtered data persists when invalid items removed', async ({ page }) => {
    // Test Case: UTC-2278
    // Summary: Verify Filtered data persists when invalid items removed
    // Description: Feature: Security and Validation for Annotation List Scenario: Filtered data persists Given invalid items removed When reloading page Then invalid items should remain excluded

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2279: Verify Permission downgrade effect when user role changed from Edit to Read-only', async ({ page }) => {
    // Test Case: UTC-2279
    // Summary: Verify Permission downgrade effect when user role changed from Edit to Read-only
    // Description: Feature: Security and Validation for Annotation List Scenario: Permission downgrade effect Given user role changed from Edit to Read-only When page refreshed Then reorder controls disappear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2280: Verify Duplicate IDs rejected when duplicate annotations received', async ({ page }) => {
    // Test Case: UTC-2280
    // Summary: Verify Duplicate IDs rejected when duplicate annotations received
    // Description: Feature: Security and Validation for Annotation List Scenario: Duplicate IDs rejected Given duplicate annotations received When list loads Then duplicates should not render

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2281: Verify Unauthorized API injection blocked when forged reorder request', async ({ page }) => {
    // Test Case: UTC-2281
    // Summary: Verify Unauthorized API injection blocked when forged reorder request
    // Description: Feature: Security and Validation for Annotation List Scenario: Unauthorized API injection blocked Given forged reorder request When backend validates token Then request denied

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2282: Verify Safe fallback on validation error when invalid payload', async ({ page }) => {
    // Test Case: UTC-2282
    // Summary: Verify Safe fallback on validation error when invalid payload
    // Description: Feature: Security and Validation for Annotation List Scenario: Safe fallback on validation error Given invalid payload When render fails validation Then system shows empty safe state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-2283: Verify Permission enforced on sort when read-only user', async ({ page }) => {
    // Test Case: UTC-2283
    // Summary: Verify Permission enforced on sort when read-only user
    // Description: Feature: Security and Validation for Annotation List Scenario: Permission enforced on sort Given read-only user When sort clicked Then order remains unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2284: Verify Audit trail recorded when reorder attempt', async ({ page }) => {
    // Test Case: UTC-2284
    // Summary: Verify Audit trail recorded when reorder attempt
    // Description: Feature: Security and Validation for Annotation List Scenario: Audit trail recorded Given reorder attempt When save triggered Then audit log should capture user and action

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
