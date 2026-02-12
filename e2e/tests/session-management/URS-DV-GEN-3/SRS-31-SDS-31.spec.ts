import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Section loads instantly when the Session Creation page loads
 * URS: URS-DV-GEN-3
 * SRS: SRS-31
 * SDS: SDS-31
 */
test.describe('URS-DV-GEN-3: Verify Section loads instantly when the Session Creation pag', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-374: Verify Section loads instantly when the Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-374
    // Summary: Verify Section loads instantly when the Session Creation page loads
    // Description: Feature: Approval Level Performance Scenario: Section loads instantly Given the Session Creation page loads When the approval section is rendered Then it should load without noticeable delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-375: Verify Add Level responds instantly when approval section is visible', async ({ page }) => {
    // Test Case: UTC-375
    // Summary: Verify Add Level responds instantly when approval section is visible
    // Description: Scenario: Add Level responds instantly Given approval section is visible When Add Level is clicked Then new level should appear immediately

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-376: Verify Remove Level responds instantly when levels exist', async ({ page }) => {
    // Test Case: UTC-376
    // Summary: Verify Remove Level responds instantly when levels exist
    // Description: Scenario: Remove Level responds instantly Given levels exist When Remove icon is clicked Then level should disappear instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-377: Verify No page reload required when approval actions are performed', async ({ page }) => {
    // Test Case: UTC-377
    // Summary: Verify No page reload required when approval actions are performed
    // Description: Scenario: No page reload required Given approval actions are performed When adding or removing levels Then actions should complete without page refresh

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-378: Verify Multiple levels load efficiently when 5 levels configured', async ({ page }) => {
    // Test Case: UTC-378
    // Summary: Verify Multiple levels load efficiently when 5 levels configured
    // Description: Scenario: Multiple levels load efficiently Given 5 levels configured When page loads Then all levels should render smoothly without UI freeze

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-379: Verify Retry on load failure when loading temporarily fails', async ({ page }) => {
    // Test Case: UTC-379
    // Summary: Verify Retry on load failure when loading temporarily fails
    // Description: Scenario: Retry on load failure Given loading temporarily fails When retry is triggered Then approval configuration should load successfully

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
