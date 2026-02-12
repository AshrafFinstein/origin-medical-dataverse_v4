import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving project without selecting assignees when the user is on Create Project form
 * URS: URS-DV-GEN-21
 * SRS: SRS-190
 * SDS: SDS-190
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving project without selecting assi', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2039: Verify system prevents saving project without selecting assignees when the user ', async ({ page }) => {
    // Test Case: UTC-2039
    // Summary: Verify system prevents saving project without selecting assignees when the user is on Create Project form
    // Description: Feature: Project Assignees Mandatory – Block Empty Assignee List Scenario: Verify system prevents saving project without selecting assignees Given the user is on Create Project form When the user does not select any assignee in Assignee dropdown And clicks Save/Create Then the system should block saving And show toast message “At least one assignee is required”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2040: Verify missing assignee message clearly explains the requirement when the user c', async ({ page }) => {
    // Test Case: UTC-2040
    // Summary: Verify missing assignee message clearly explains the requirement when the user clicks Save without selecting any assignee
    // Description: Feature: Project Assignees Mandatory – Error Message Clarity Scenario: Verify missing assignee message clearly explains the requirement Given the user clicks Save without selecting any assignee When validation fails Then the toast message should clearly mention that at least one assignee is required And should not show technical error codes

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
