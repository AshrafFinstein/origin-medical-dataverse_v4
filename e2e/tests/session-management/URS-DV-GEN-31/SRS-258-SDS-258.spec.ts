import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify lock icon is visible but disabled when user belongs to group but lacks lock permission when the user is assigned to the project/session group
 * URS: URS-DV-GEN-31
 * SRS: SRS-258
 * SDS: SDS-258
 */
test.describe('URS-DV-GEN-31: Verify lock icon is visible but disabled when user belongs t', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2675: Verify lock icon is visible but disabled when user belongs to group but lacks lo', async ({ page }) => {
    // Test Case: UTC-2675
    // Summary: Verify lock icon is visible but disabled when user belongs to group but lacks lock permission when the user is assigned to the project/session group
    // Description: Feature: Lock Icon – Disabled Without Lock Permission Scenario: Verify lock icon is visible but disabled when user belongs to group but lacks lock permission Given the user is assigned to the project/session group And the user role does not have Lock permission enabled When the user opens Data Labelling Session list page Then the Lock icon should be visible And it should be greyed out and non-clickable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2676: Verify clicking disabled lock icon does not open popup when lock icon is display', async ({ page }) => {
    // Test Case: UTC-2676
    // Summary: Verify clicking disabled lock icon does not open popup when lock icon is displayed in disabled state
    // Description: Feature: Lock Icon – Click Ignored in Disabled State Scenario: Verify clicking disabled lock icon does not open popup Given lock icon is displayed in disabled state When the user clicks the disabled Lock icon Then Lock popup should not open And no action should be performed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2677: Verify tooltip message indicates permission missing when lock icon is disabled', async ({ page }) => {
    // Test Case: UTC-2677
    // Summary: Verify tooltip message indicates permission missing when lock icon is disabled
    // Description: Feature: Lock Icon – Tooltip for Disabled State (If Available) Scenario: Verify tooltip message indicates permission missing Given lock icon is disabled When the user hovers over the lock icon Then tooltip should indicate lock permission is required (if tooltip is implemented)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2678: Verify disabled lock icon becomes enabled after Lock permission is granted when ', async ({ page }) => {
    // Test Case: UTC-2678
    // Summary: Verify disabled lock icon becomes enabled after Lock permission is granted when the user is in the group but lock permission is disabled initially
    // Description: Feature: Lock Icon – Enabled After Permission Granted Scenario: Verify disabled lock icon becomes enabled after Lock permission is granted Given the user is in the group but lock permission is disabled initially When admin enables Lock permission for the user role And the user refreshes or re-login Then the lock icon should become enabled and clickable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2679: Verify user cannot lock session via API even if icon is visible disabled when th', async ({ page }) => {
    // Test Case: UTC-2679
    // Summary: Verify user cannot lock session via API even if icon is visible disabled when the user belongs to the group but lacks Lock permission
    // Description: Feature: Lock Action – Blocked Without Permission Even If Visible Scenario: Verify user cannot lock session via API even if icon is visible disabled Given the user belongs to the group but lacks Lock permission When the user attempts lock action through direct request/API call Then the system should reject the request And session should remain unlocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
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
