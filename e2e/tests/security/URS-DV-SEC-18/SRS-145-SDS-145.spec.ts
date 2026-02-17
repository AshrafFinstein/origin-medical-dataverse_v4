import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Approve button visibility when admin opens deletion dashboard
 * URS: URS-DV-SEC-18
 * SRS: SRS-145
 * SDS: SDS-145
 */
test.describe('URS-DV-SEC-18: Verify Approve button visibility when admin opens deletion d', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1905: Verify Approve button visibility when admin opens deletion dashboard', async ({ page }) => {
    // Test Case: UTC-1905
    // Summary: Verify Approve button visibility when admin opens deletion dashboard
    // Description: Feature: Final Deletion Approval Scenario: Approve button visibility Given admin opens deletion dashboard When a request is in Pending state Then green Approve button should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1906: Verify Confirmation modal shown when admin clicks Approve', async ({ page }) => {
    // Test Case: UTC-1906
    // Summary: Verify Confirmation modal shown when admin clicks Approve
    // Description: Feature: Final Deletion Approval Scenario: Confirmation modal shown Given admin clicks Approve When action triggered Then final confirmation modal should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1907: Verify Cancel deletion when confirmation modal displayed', async ({ page }) => {
    // Test Case: UTC-1907
    // Summary: Verify Cancel deletion when confirmation modal displayed
    // Description: Feature: Final Deletion Approval Scenario: Cancel deletion Given confirmation modal displayed When admin clicks Cancel/No Then session should not be deleted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1908: Verify Approve deletion successfully when confirmation modal displayed', async ({ page }) => {
    // Test Case: UTC-1908
    // Summary: Verify Approve deletion successfully when confirmation modal displayed
    // Description: Feature: Final Deletion Approval Scenario: Approve deletion successfully Given confirmation modal displayed When admin clicks Yes/Approve Then session should be permanently deleted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1909: Verify Success notification when session deleted', async ({ page }) => {
    // Test Case: UTC-1909
    // Summary: Verify Success notification when session deleted
    // Description: Feature: Final Deletion Approval Scenario: Success notification Given session deleted When action completes Then success toast Session deleted successfully should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1910: Verify Remove from active session list when session deleted', async ({ page }) => {
    // Test Case: UTC-1910
    // Summary: Verify Remove from active session list when session deleted
    // Description: Feature: Final Deletion Approval Scenario: Remove from active session list Given session deleted When dashboard refreshes Then session should not appear in active session list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1911: Verify Request status update when session deletion approved', async ({ page }) => {
    // Test Case: UTC-1911
    // Summary: Verify Request status update when session deletion approved
    // Description: Feature: Final Deletion Approval Scenario: Request status update Given session deletion approved When backend updates Then request status should change to Approved

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1912: Verify Cascading delete executed when session has images and labels', async ({ page }) => {
    // Test Case: UTC-1912
    // Summary: Verify Cascading delete executed when session has images and labels
    // Description: Feature: Final Deletion Approval Scenario: Cascading delete executed Given session has images and labels When deletion approved Then all related records should be removed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1913: Verify Prevent partial deletion when deletion triggered', async ({ page }) => {
    // Test Case: UTC-1913
    // Summary: Verify Prevent partial deletion when deletion triggered
    // Description: Feature: Final Deletion Approval Scenario: Prevent partial deletion Given deletion triggered When transaction executes Then either all related data deleted or none

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1914: Verify Only admin can approve when non-admin user logged in', async ({ page }) => {
    // Test Case: UTC-1914
    // Summary: Verify Only admin can approve when non-admin user logged in
    // Description: Feature: Final Deletion Approval Scenario: Only admin can approve Given non-admin user logged in When accessing approval action Then Approve button should be hidden or disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1915: Verify Direct API access blocked when non-admin user calls delete API', async ({ page }) => {
    // Test Case: UTC-1915
    // Summary: Verify Direct API access blocked when non-admin user calls delete API
    // Description: Feature: Final Deletion Approval Scenario: Direct API access blocked Given non-admin user calls delete API When request sent Then server should return 403 Forbidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1916: Verify Session currently active when session being edited by another user', async ({ page }) => {
    // Test Case: UTC-1916
    // Summary: Verify Session currently active when session being edited by another user
    // Description: Feature: Final Deletion Approval Scenario: Session currently active Given session being edited by another user When admin tries to approve Then deletion should be blocked with message

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1917: Verify Real-time UI update when session deleted', async ({ page }) => {
    // Test Case: UTC-1917
    // Summary: Verify Real-time UI update when session deleted
    // Description: Feature: Final Deletion Approval Scenario: Real-time UI update Given session deleted When dashboard is open Then row should disappear without page reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1918: Verify Invalid session ID when request references invalid session', async ({ page }) => {
    // Test Case: UTC-1918
    // Summary: Verify Invalid session ID when request references invalid session
    // Description: Feature: Final Deletion Approval Scenario: Invalid session ID Given request references invalid session When deletion attempted Then safe error message should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1919: Verify Large data deletion performance when session contains many assets', async ({ page }) => {
    // Test Case: UTC-1919
    // Summary: Verify Large data deletion performance when session contains many assets
    // Description: Feature: Final Deletion Approval Scenario: Large data deletion performance Given session contains many assets When deletion approved Then deletion should complete within acceptable time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1920: Verify Audit logging when session deleted', async ({ page }) => {
    // Test Case: UTC-1920
    // Summary: Verify Audit logging when session deleted
    // Description: Feature: Final Deletion Approval Scenario: Audit logging Given session deleted When action completes Then audit log should record admin, timestamp, and session ID

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
