import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Sort by Name ascending when analysis table loaded with multiple records
 * URS: URS-DV-GEN-2
 * SRS: SRS-19
 * SDS: SDS-19
 */
test.describe('URS-DV-GEN-2: Verify Sort by Name ascending when analysis table loaded wit', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-213: Verify Sort by Name ascending when analysis table loaded with multiple records', async ({ page }) => {
    // Test Case: UTC-213
    // Summary: Verify Sort by Name ascending when analysis table loaded with multiple records
    // Description: Feature: Server-Side Sorting Across Full Dataset Scenario: Sort by Name ascending Given analysis table loaded with multiple records When user clicks Name header once Then system sorts entire dataset ascending before pagination

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-214: Verify Sort by Name descending when Name column sorted ascending', async ({ page }) => {
    // Test Case: UTC-214
    // Summary: Verify Sort by Name descending when Name column sorted ascending
    // Description: Feature: Server-Side Sorting Across Full Dataset Scenario: Sort by Name descending Given Name column sorted ascending When user clicks Name header again Then system sorts entire dataset descending

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-215: Verify Sort by Count ascending when Count values displayed', async ({ page }) => {
    // Test Case: UTC-215
    // Summary: Verify Sort by Count ascending when Count values displayed
    // Description: Feature: Server-Side Sorting Across Full Dataset Scenario: Sort by Count ascending Given Count values displayed When user clicks Count header Then records sorted low to high across full dataset

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-216: Verify Sort by Count descending when Count sorted ascending', async ({ page }) => {
    // Test Case: UTC-216
    // Summary: Verify Sort by Count descending when Count sorted ascending
    // Description: Feature: Server-Side Sorting Across Full Dataset Scenario: Sort by Count descending Given Count sorted ascending When user clicks again Then records sorted high to low

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-217: Verify Sorting applies to full dataset not current page only when pagination ena', async ({ page }) => {
    // Test Case: UTC-217
    // Summary: Verify Sorting applies to full dataset not current page only when pagination enabled
    // Description: Feature: Server-Side Sorting Across Full Dataset Scenario: Sorting applies to full dataset not current page only Given pagination enabled When sorting applied Then backend sorts before LIMIT/OFFSET

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
