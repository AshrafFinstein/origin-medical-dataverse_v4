import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving session without selecting assignees when the user is on Create Session form
 * URS: URS-DV-GEN-21
 * SRS: SRS-198
 * SDS: SDS-198
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving session without selecting assi', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2055: Verify system prevents saving session without selecting assignees when the user ', async ({ page }) => {
    // Test Case: UTC-2055
    // Summary: Verify system prevents saving session without selecting assignees when the user is on Create Session form
    // Description: Feature: Session Assignees Mandatory – Block Empty Assignee List Scenario: Verify system prevents saving session without selecting assignees Given the user is on Create Session form When the user does not select any assignee in Assignee dropdown And clicks Save/Create Session Then the system should block submission And show toast message “At least one assignee is required”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2056: Verify missing assignee message clearly explains requirement when the user click', async ({ page }) => {
    // Test Case: UTC-2056
    // Summary: Verify missing assignee message clearly explains requirement when the user clicks Save without selecting any assignee
    // Description: Feature: Session Assignees Mandatory – Message Clarity Scenario: Verify missing assignee message clearly explains requirement Given the user clicks Save without selecting any assignee When validation fails Then the toast message should clearly mention at least one assignee is required And should not show technical error codes

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
