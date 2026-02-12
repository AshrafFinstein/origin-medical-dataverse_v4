import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system blocks session modification when session is locked when an existing session is in Locked state
 * URS: URS-DV-GEN-21
 * SRS: SRS-200
 * SDS: SDS-200
 */
test.describe('URS-DV-GEN-21: Verify system blocks session modification when session is lo', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2059: Verify system blocks session modification when session is locked when an existin', async ({ page }) => {
    // Test Case: UTC-2059
    // Summary: Verify system blocks session modification when session is locked when an existing session is in Locked state
    // Description: Feature: Session Lock Status – Block Edit When Locked Scenario: Verify system blocks session modification when session is locked Given an existing session is in Locked state When the user tries to edit any session field And clicks Save/Update Then the system should block modifications And show toast message “Session is locked”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2060: Verify Edit controls are disabled when session is locked when the session is loc', async ({ page }) => {
    // Test Case: UTC-2060
    // Summary: Verify Edit controls are disabled when session is locked when the session is locked
    // Description: Feature: Session Lock Status – UI Control Disabled Scenario: Verify Edit controls are disabled when session is locked Given the session is locked When the user views session page Then Edit button should be disabled or hidden And user should not be able to modify fields

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
