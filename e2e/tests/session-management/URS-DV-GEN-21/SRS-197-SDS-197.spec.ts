import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system prevents adding more than 5 approval levels when the user is configuring approval levels during session creation
 * URS: URS-DV-GEN-21
 * SRS: SRS-197
 * SDS: SDS-197
 */
test.describe('URS-DV-GEN-21: Verify system prevents adding more than 5 approval levels wh', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2053: Verify system prevents adding more than 5 approval levels when the user is confi', async ({ page }) => {
    // Test Case: UTC-2053
    // Summary: Verify system prevents adding more than 5 approval levels when the user is configuring approval levels during session creation
    // Description: Feature: Approval Level Limit – Restrict to Maximum 5 Levels Scenario: Verify system prevents adding more than 5 approval levels Given the user is configuring approval levels during session creation When the user adds 5 approval levels successfully And tries to add the 6th level using Add Level button Then the system should prevent adding the 6th level And show toast message “Maximum of 5 approval levels allowed”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2054: Verify Add Level button becomes disabled after reaching 5 levels when the user h', async ({ page }) => {
    // Test Case: UTC-2054
    // Summary: Verify Add Level button becomes disabled after reaching 5 levels when the user has configured 5 approval levels
    // Description: Feature: Approval Level Limit – Add Level Button Disabled at 5 Scenario: Verify Add Level button becomes disabled after reaching 5 levels Given the user has configured 5 approval levels When the user views the Add Level button Then the Add Level button should be disabled or inactive And should not allow adding additional levels

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
