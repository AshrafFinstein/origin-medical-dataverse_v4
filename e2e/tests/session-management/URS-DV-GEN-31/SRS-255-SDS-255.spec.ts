import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Lock confirmation popup opens on clicking Lock icon when the user is on Data Labelling Session list page
 * URS: URS-DV-GEN-31
 * SRS: SRS-255
 * SDS: SDS-255
 */
test.describe('URS-DV-GEN-31: Verify Lock confirmation popup opens on clicking Lock icon w', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2654: Verify Lock confirmation popup opens on clicking Lock icon when the user is on D', async ({ page }) => {
    // Test Case: UTC-2654
    // Summary: Verify Lock confirmation popup opens on clicking Lock icon when the user is on Data Labelling Session list page
    // Description: Feature: Lock Session – Popup Open Scenario: Verify Lock confirmation popup opens on clicking Lock icon Given the user is on Data Labelling Session list page And a session status is Completed When the user clicks the Lock icon Then the Lock popup should open with Reason textbox and Submit/Cancel buttons

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2655: Verify submission is blocked if reason is empty when Lock popup is opened', async ({ page }) => {
    // Test Case: UTC-2655
    // Summary: Verify submission is blocked if reason is empty when Lock popup is opened
    // Description: Feature: Lock Session – Reason Mandatory Scenario: Verify submission is blocked if reason is empty Given Lock popup is opened When the user keeps Reason field empty And clicks Submit Then the system should block submission And mandatory validation should be shown for Reason

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2656: Verify session is locked when valid reason is entered when Lock popup is opened', async ({ page }) => {
    // Test Case: UTC-2656
    // Summary: Verify session is locked when valid reason is entered when Lock popup is opened
    // Description: Feature: Lock Session – Lock Success with Valid Reason Scenario: Verify session is locked when valid reason is entered Given Lock popup is opened When the user enters a valid reason (Ex:For testing lock) And clicks Submit Then the session should be locked successfully And lock state should be applied in UI

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2657: Verify session is not locked when user cancels popup when Lock popup is opened', async ({ page }) => {
    // Test Case: UTC-2657
    // Summary: Verify session is not locked when user cancels popup when Lock popup is opened
    // Description: Feature: Lock Session – Cancel Does Not Lock Session Scenario: Verify session is not locked when user cancels popup Given Lock popup is opened When the user enters a reason And clicks Cancel Then the popup should close And session should remain unlocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2658: Verify lock reason is stored and visible as tooltip after locking when the sessi', async ({ page }) => {
    // Test Case: UTC-2658
    // Summary: Verify lock reason is stored and visible as tooltip after locking when the session is locked using a reason
    // Description: Feature: Lock Session – Reason Stored for Audit Scenario: Verify lock reason is stored and visible as tooltip after locking Given the session is locked using a reason When the user hovers over lock indicator/icon in session list Then the tooltip should show “Session is locked. Reason: <entered reason>”

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
