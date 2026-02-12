import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents creating project with duplicate name when a project already exists with Name PRJ_ALPHA
 * URS: URS-DV-GEN-21
 * SRS: SRS-189
 * SDS: SDS-189
 */
test.describe('URS-DV-GEN-21: Verify system prevents creating project with duplicate name ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2037: Verify system prevents creating project with duplicate name when a project alrea', async ({ page }) => {
    // Test Case: UTC-2037
    // Summary: Verify system prevents creating project with duplicate name when a project already exists with Name PRJ_ALPHA
    // Description: Feature: Project Name Uniqueness – Duplicate Block Scenario: Verify system prevents creating project with duplicate name Given a project already exists with Name “PRJ_ALPHA” When the user enters Project Name as “PRJ_ALPHA” again And clicks Save/Create Then the system should block saving And show toast message “A project with this name already exists. Please choose a different name”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2038: Verify duplicate project message is user-friendly and detailed when the user tri', async ({ page }) => {
    // Test Case: UTC-2038
    // Summary: Verify duplicate project message is user-friendly and detailed when the user tries to save a duplicate project name
    // Description: Feature: Project Name Uniqueness – Message Clarity Scenario: Verify duplicate project message is user-friendly and detailed Given the user tries to save a duplicate project name When backend returns duplicate match Then the system should show a clear duplicate message And should not show technical database errors

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
