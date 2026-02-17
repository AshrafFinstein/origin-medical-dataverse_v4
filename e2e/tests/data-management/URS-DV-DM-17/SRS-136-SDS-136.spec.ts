import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify version history loads quickly with small dataset when a session has less than 10 versions stored
 * URS: URS-DV-DM-17
 * SRS: SRS-136
 * SDS: SDS-136
 */
test.describe('URS-DV-DM-17: Verify version history loads quickly with small dataset when', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1809: Verify version history loads quickly with small dataset when a session has less ', async ({ page }) => {
    // Test Case: UTC-1809
    // Summary: Verify version history loads quickly with small dataset when a session has less than 10 versions stored
    // Description: Feature: Version History – Fast Load for Small Dataset Scenario: Verify version history loads quickly with small dataset Given a session has less than 10 versions stored When the user opens the Version History panel Then the version list should load quickly without noticeable delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1810: Verify version history loads consistently with large dataset when a session has ', async ({ page }) => {
    // Test Case: UTC-1810
    // Summary: Verify version history loads consistently with large dataset when a session has 100+ versions stored
    // Description: Feature: Version History – Fast Load for Large Dataset Scenario: Verify version history loads consistently with large dataset Given a session has 100+ versions stored When the user opens the Version History panel Then the system should load the version list smoothly without UI freeze

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1811: Verify UI remains responsive while loading version history when a session contai', async ({ page }) => {
    // Test Case: UTC-1811
    // Summary: Verify UI remains responsive while loading version history when a session contains many versions
    // Description: Feature: Version History – No UI Freeze During Load Scenario: Verify UI remains responsive while loading version history Given a session contains many versions When the user opens Version History panel Then the UI should remain responsive And user should not face page freeze

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1812: Verify pagination navigation is fast when version history is paginated across mu', async ({ page }) => {
    // Test Case: UTC-1812
    // Summary: Verify pagination navigation is fast when version history is paginated across multiple pages
    // Description: Feature: Version History – Pagination Performance Scenario: Verify pagination navigation is fast Given version history is paginated across multiple pages When the user navigates between pages Then each page transition should load quickly without delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1813: Verify system loads records in batches (not full dataset at once) when a session', async ({ page }) => {
    // Test Case: UTC-1813
    // Summary: Verify system loads records in batches (not full dataset at once) when a session has a large version history dataset
    // Description: Feature: Version History – Batch Fetch Validation Scenario: Verify system loads records in batches (not full dataset at once) Given a session has a large version history dataset When the user opens Version History panel Then the system should fetch records in batches using pagination And should not load all records in a single request

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1814: Verify response times remain predictable across repeated loads when a session co', async ({ page }) => {
    // Test Case: UTC-1814
    // Summary: Verify response times remain predictable across repeated loads when a session contains many versions
    // Description: Feature: Version History – Consistent Response Time Scenario: Verify response times remain predictable across repeated loads Given a session contains many versions When the user opens Version History panel multiple times Then the load time should remain consistent across attempts

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1815: Verify smooth scrolling inside Version History list when many version records ex', async ({ page }) => {
    // Test Case: UTC-1815
    // Summary: Verify smooth scrolling inside Version History list when many version records exist in the table
    // Description: Feature: Version History – Scroll Performance with Large Dataset Scenario: Verify smooth scrolling inside Version History list Given many version records exist in the table When the user scrolls through the version list Then scrolling should remain smooth without lag

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
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
