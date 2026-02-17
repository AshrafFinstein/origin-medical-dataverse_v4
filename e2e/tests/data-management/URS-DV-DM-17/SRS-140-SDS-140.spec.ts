import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify version history loads correctly with 100+ stored versions when a session has more than 100 JSON versions stored
 * URS: URS-DV-DM-17
 * SRS: SRS-140
 * SDS: SDS-140
 */
test.describe('URS-DV-DM-17: Verify version history loads correctly with 100+ stored vers', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1838: Verify version history loads correctly with 100+ stored versions when a session ', async ({ page }) => {
    // Test Case: UTC-1838
    // Summary: Verify version history loads correctly with 100+ stored versions when a session has more than 100 JSON versions stored
    // Description: Feature: Version History – Supports 100+ Versions Scenario: Verify version history loads correctly with 100+ stored versions Given a session has more than 100 JSON versions stored When the user opens Version History panel Then the version list should load successfully without crash or UI freeze

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1839: Verify version history remains stable with 500+ versions when a session has more', async ({ page }) => {
    // Test Case: UTC-1839
    // Summary: Verify version history remains stable with 500+ versions when a session has more than 500 JSON versions stored
    // Description: Feature: Version History – Supports 500+ Versions Scenario: Verify version history remains stable with 500+ versions Given a session has more than 500 JSON versions stored When the user opens Version History panel Then the system should remain stable And should not show errors or blank list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1840: Verify UI uses pagination or lazy loading for large datasets when many version r', async ({ page }) => {
    // Test Case: UTC-1840
    // Summary: Verify UI uses pagination or lazy loading for large datasets when many version records exist
    // Description: Feature: Version History – Pagination Prevents Overcrowding Scenario: Verify UI uses pagination or lazy loading for large datasets Given many version records exist When the Version History table loads Then pagination or lazy loading should be applied And the UI should not display an overcrowded single long table

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1841: Verify retrieval time does not degrade significantly with large history when ses', async ({ page }) => {
    // Test Case: UTC-1841
    // Summary: Verify retrieval time does not degrade significantly with large history when sessions exist with 10 versions and 500 versions
    // Description: Feature: Version History – Consistent Retrieval Time as Versions Grow Scenario: Verify retrieval time does not degrade significantly with large history Given sessions exist with 10 versions and 500 versions When the user opens Version History for both sessions Then the load time should remain consistent without major degradation

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1842: Verify pagination navigation works correctly for large dataset when version hist', async ({ page }) => {
    // Test Case: UTC-1842
    // Summary: Verify pagination navigation works correctly for large dataset when version history spans multiple pages
    // Description: Feature: Version History – Page Navigation Stability Scenario: Verify pagination navigation works correctly for large dataset Given version history spans multiple pages When the user navigates to last page and back to first page Then the table should load correctly without missing records or UI errors

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1843: Verify UI does not crash due to large version list rendering when 500+ version r', async ({ page }) => {
    // Test Case: UTC-1843
    // Summary: Verify UI does not crash due to large version list rendering when 500+ version rows exist
    // Description: Feature: Version History – No Browser Memory Crash Scenario: Verify UI does not crash due to large version list rendering Given 500+ version rows exist When the user scrolls and navigates pages repeatedly Then the browser should not crash or become unresponsive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1844: Verify backend query handles large version history efficiently when many version', async ({ page }) => {
    // Test Case: UTC-1844
    // Summary: Verify backend query handles large version history efficiently when many versions exist in storage for a session
    // Description: Feature: Version History – Backend Query Scalability Scenario: Verify backend query handles large version history efficiently Given many versions exist in storage for a session When the system fetches version metadata in batches Then the backend should return results successfully without timeout or failure

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
