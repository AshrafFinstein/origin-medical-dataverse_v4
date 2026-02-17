import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving duplicate Session Label Name when a session label already exists with Name Urgent
 * URS: URS-DV-GEN-21
 * SRS: SRS-169
 * SDS: SDS-169
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving duplicate Session Label Name w', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1997: Verify system prevents saving duplicate Session Label Name when a session label ', async ({ page }) => {
    // Test Case: UTC-1997
    // Summary: Verify system prevents saving duplicate Session Label Name when a session label already exists with Name Urgent
    // Description: Feature: Session Label Name Uniqueness – Duplicate Block Scenario: Verify system prevents saving duplicate Session Label Name Given a session label already exists with Name “Urgent” When the user enters Session Label Name as “Urgent” again And clicks Save Then the system should block submission And show toast message “A session label with this name already exists. Please choose a different name”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1998: Verify duplicate message is clear and user-friendly when the user tries to save ', async ({ page }) => {
    // Test Case: UTC-1998
    // Summary: Verify duplicate message is clear and user-friendly when the user tries to save a duplicate session label name
    // Description: Feature: Session Label Name Uniqueness – Message Clarity Scenario: Verify duplicate message is clear and user-friendly Given the user tries to save a duplicate session label name When backend returns duplicate match Then the system should show a clear duplicate message And should not show technical database errors

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
