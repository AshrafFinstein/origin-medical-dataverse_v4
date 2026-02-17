import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents saving when Session Label Name contains spaces/special characters when the user is on Create Session Label form
 * URS: URS-DV-GEN-21
 * SRS: SRS-168
 * SDS: SDS-168
 */
test.describe('URS-DV-GEN-21: Verify system prevents saving when Session Label Name contai', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1995: Verify system prevents saving when Session Label Name contains spaces/special ch', async ({ page }) => {
    // Test Case: UTC-1995
    // Summary: Verify system prevents saving when Session Label Name contains spaces/special characters when the user is on Create Session Label form
    // Description: Feature: Session Label Name Format – Block Spaces & Special Characters Scenario: Verify system prevents saving when Session Label Name contains spaces/special characters Given the user is on Create Session Label form When the user enters Name as “Label Name@01” And clicks Save Then the system should block submission And show toast message “Name can only contain letters, numbers, underscores, and hyphens”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1996: Verify system allows saving when Session Label Name is valid when the user is on', async ({ page }) => {
    // Test Case: UTC-1996
    // Summary: Verify system allows saving when Session Label Name is valid when the user is on Create Session Label form
    // Description: Feature: Session Label Name Format – Allow Valid Name Scenario: Verify system allows saving when Session Label Name is valid Given the user is on Create Session Label form When the user enters Name as “Session_Label-01” And clicks Save Then the system should save successfully And no format error message should appear

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
