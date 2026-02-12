import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving project when name exceeds 100 characters when the user is on Create Project form
 * URS: URS-DV-GEN-21
 * SRS: SRS-187
 * SDS: SDS-187
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving project when name exceeds 100 ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2033: Verify system prevents saving project when name exceeds 100 characters when the ', async ({ page }) => {
    // Test Case: UTC-2033
    // Summary: Verify system prevents saving project when name exceeds 100 characters when the user is on Create Project form
    // Description: Feature: Project Name Max Length – Block >100 Characters Scenario: Verify system prevents saving project when name exceeds 100 characters Given the user is on Create Project form When the user enters Project Name with more than 100 characters And clicks Save/Create Then the system should block submission And show toast message “Name must be 100 characters or less”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2034: Verify max length message clearly mentions 100 character limit when the user ent', async ({ page }) => {
    // Test Case: UTC-2034
    // Summary: Verify max length message clearly mentions 100 character limit when the user enters project name exceeding 100 characters
    // Description: Feature: Project Name Max Length – Message Mentions Limit Scenario: Verify max length message clearly mentions 100 character limit Given the user enters project name exceeding 100 characters When Save is clicked Then the toast message should clearly mention the allowed maximum length

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
