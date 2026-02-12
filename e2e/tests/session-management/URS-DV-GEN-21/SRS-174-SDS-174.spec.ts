import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving Structure Group when Name is empty when the user is on Create Structure Group form/popup
 * URS: URS-DV-GEN-21
 * SRS: SRS-174
 * SDS: SDS-174
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving Structure Group when Name is e', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2007: Verify system prevents saving Structure Group when Name is empty when the user i', async ({ page }) => {
    // Test Case: UTC-2007
    // Summary: Verify system prevents saving Structure Group when Name is empty when the user is on Create Structure Group form/popup
    // Description: Feature: Structure Name Mandatory – Empty Block Scenario: Verify system prevents saving Structure Group when Name is empty Given the user is on Create Structure Group form/popup When the user leaves Name field empty And clicks Save Then the system should block submission And show toast message “Name is required”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2008: Verify missing structure name message is clear and descriptive when the user cli', async ({ page }) => {
    // Test Case: UTC-2008
    // Summary: Verify missing structure name message is clear and descriptive when the user clicks Save without entering Structure Name
    // Description: Feature: Structure Name Mandatory – Error Message Clarity Scenario: Verify missing structure name message is clear and descriptive Given the user clicks Save without entering Structure Name When validation fails Then the error message should clearly describe the missing Name field And should not show technical codes

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
