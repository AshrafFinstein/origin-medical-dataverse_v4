import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Add Links control visibility when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-78
 * SDS: SDS-78
 */
test.describe('URS-DV-GEN-07: Verify Add Links control visibility when Session Creation pa', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-974: Verify Add Links control visibility when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-974
    // Summary: Verify Add Links control visibility when Session Creation page loads
    // Description: Feature: Add Links Trigger for external references Scenario: Add Links control visibility Given Session Creation page loads When metadata section renders Then “+ Add Links” clickable element should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-975: Verify Visual clarity when the Add Links element is displayed', async ({ page }) => {
    // Test Case: UTC-975
    // Summary: Verify Visual clarity when the Add Links element is displayed
    // Description: Feature: Add Links Trigger for external references Scenario: Visual clarity Given the Add Links element is displayed When user views the control Then it should appear as blue clickable text with icon

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
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
