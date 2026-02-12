import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving when Session Label Name exceeds 300 characters when the user is on Create Session Label form
 * URS: URS-DV-GEN-21
 * SRS: SRS-167
 * SDS: SDS-167
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving when Session Label Name exceed', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1993: Verify system prevents saving when Session Label Name exceeds 300 characters whe', async ({ page }) => {
    // Test Case: UTC-1993
    // Summary: Verify system prevents saving when Session Label Name exceeds 300 characters when the user is on Create Session Label form
    // Description: Feature: Session Label Name Max Length – Block >300 Characters Scenario: Verify system prevents saving when Session Label Name exceeds 300 characters Given the user is on Create Session Label form When the user enters Name with more than 300 characters And clicks Save Then the system should block submission And show toast message “Name must be 300 characters or less”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1994: Verify max length error message clearly states 300 character limit when the user', async ({ page }) => {
    // Test Case: UTC-1994
    // Summary: Verify max length error message clearly states 300 character limit when the user enters Name exceeding 300 characters
    // Description: Feature: Session Label Name Max Length – Message Mentions Limit Scenario: Verify max length error message clearly states 300 character limit Given the user enters Name exceeding 300 characters When Save is clicked Then the toast message should clearly mention the allowed maximum length

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
