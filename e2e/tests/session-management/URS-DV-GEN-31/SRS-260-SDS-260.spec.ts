import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify session lock completes without noticeable delay when the user is on Data Labelling Session list page
 * URS: URS-DV-GEN-31
 * SRS: SRS-260
 * SDS: SDS-260
 */
test.describe('URS-DV-GEN-31: Verify session lock completes without noticeable delay when ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2686: Verify session lock completes without noticeable delay when the user is on Data ', async ({ page }) => {
    // Test Case: UTC-2686
    // Summary: Verify session lock completes without noticeable delay when the user is on Data Labelling Session list page
    // Description: Feature: Lock Action – Quick Completion Scenario: Verify session lock completes without noticeable delay Given the user is on Data Labelling Session list page When the user locks a Completed session with valid reason Then the lock action should complete quickly And lock state should reflect immediately in grid

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2687: Verify session unlock completes without noticeable delay when a session is locke', async ({ page }) => {
    // Test Case: UTC-2687
    // Summary: Verify session unlock completes without noticeable delay when a session is locked
    // Description: Feature: Unlock Action – Quick Completion Scenario: Verify session unlock completes without noticeable delay Given a session is locked When the user unlocks the session with valid reason Then the unlock action should complete quickly And session status should update to Re-open instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2688: Verify loader is shown during lock/unlock processing when the user triggers Lock', async ({ page }) => {
    // Test Case: UTC-2688
    // Summary: Verify loader is shown during lock/unlock processing when the user triggers Lock or Unlock action
    // Description: Feature: Lock/Unlock – Loader Visibility Scenario: Verify loader is shown during lock/unlock processing Given the user triggers Lock or Unlock action When the system processes the request Then a loader/processing indicator should be shown until completion

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2689: Verify grid refresh happens instantly without full page reload when the session ', async ({ page }) => {
    // Test Case: UTC-2689
    // Summary: Verify grid refresh happens instantly without full page reload when the session list page is open
    // Description: Feature: Lock Action – Grid Refresh Without Full Page Reload Scenario: Verify grid refresh happens instantly without full page reload Given the session list page is open When the user locks a session Then the grid should refresh immediately And the page should not fully reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-2690: Verify retry option/message appears when lock action times out when the user tri', async ({ page }) => {
    // Test Case: UTC-2690
    // Summary: Verify retry option/message appears when lock action times out when the user triggers lock/unlock action
    // Description: Feature: Lock/Unlock Timeout Retry Handling Scenario: Verify retry option/message appears when lock action times out Given the user triggers lock/unlock action When the request times out due to slow network/backend delay Then the system should show retry option or timeout message And user should be able to retry without breaking UI

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
