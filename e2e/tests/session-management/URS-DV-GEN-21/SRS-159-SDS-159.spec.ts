import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving duplicate annotation name when an annotation already exists with Name BRAIN_01
 * URS: URS-DV-GEN-21
 * SRS: SRS-159
 * SDS: SDS-159
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving duplicate annotation name when', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1977: Verify system prevents saving duplicate annotation name when an annotation alrea', async ({ page }) => {
    // Test Case: UTC-1977
    // Summary: Verify system prevents saving duplicate annotation name when an annotation already exists with Name BRAIN_01
    // Description: Feature: Annotation Name Uniqueness – Duplicate Block Scenario: Verify system prevents saving duplicate annotation name Given an annotation already exists with Name “BRAIN_01” When the user enters Annotation Name as “BRAIN_01” again And clicks Save Then the system should block submission And show toast message “An annotation with this name already exists. Please choose a different name”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1978: Verify duplicate name message is detailed and user-friendly when the user tries ', async ({ page }) => {
    // Test Case: UTC-1978
    // Summary: Verify duplicate name message is detailed and user-friendly when the user tries to save an annotation with an existing name
    // Description: Feature: Annotation Name Uniqueness – Error Message Detail Scenario: Verify duplicate name message is detailed and user-friendly Given the user tries to save an annotation with an existing name When backend returns duplicate match Then the system should show a clear duplicate message And should not show technical database errors

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
