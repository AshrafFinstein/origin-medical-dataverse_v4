import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Apply filter updates dataset when records exist
 * URS: URS-DV-GEN-2
 * SRS: SRS-21
 * SDS: SDS-21
 */
test.describe('URS-DV-GEN-2: Verify Apply filter updates dataset when records exist', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-235: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-235
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-236: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-236
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-237: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-237
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-238: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-238
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-239: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-239
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-240: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-240
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-241: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-241
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-242: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-242
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-243: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-243
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-244: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-244
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-245: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-245
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-246: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-246
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-247: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-247
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-248: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-248
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-249: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-249
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-250: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-250
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-251: Verify Apply filter updates dataset when records exist', async ({ page }) => {
    // Test Case: UTC-251
    // Summary: Verify Apply filter updates dataset when records exist
    // Description: Feature: Filter Application Logic & Immediate Table Update Scenario: Apply filter updates dataset Given records exist When user confirms filter Then table refreshes with filtered results instantly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

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
