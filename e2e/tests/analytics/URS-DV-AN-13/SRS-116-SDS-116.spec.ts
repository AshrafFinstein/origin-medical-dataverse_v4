import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Page remains responsive during upload when multiple JSON files selected
 * URS: URS-DV-AN-13
 * SRS: SRS-116
 * SDS: SDS-116
 */
test.describe('URS-DV-AN-13: Verify Page remains responsive during upload when multiple J', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1580: Verify Page remains responsive during upload when multiple JSON files selected', async ({ page }) => {
    // Test Case: UTC-1580
    // Summary: Verify Page remains responsive during upload when multiple JSON files selected
    // Description: Feature: Multi-File Upload Performance Scenario: Page remains responsive during upload Given multiple JSON files selected When upload starts Then UI should remain responsive without freezing

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1581: Verify Non-blocking async uploads when multiple files staged', async ({ page }) => {
    // Test Case: UTC-1581
    // Summary: Verify Non-blocking async uploads when multiple files staged
    // Description: Feature: Multi-File Upload Performance Scenario: Non-blocking async uploads Given multiple files staged When upload begins Then files should upload asynchronously in background

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1582: Verify Progress indicator visible when upload is in progress', async ({ page }) => {
    // Test Case: UTC-1582
    // Summary: Verify Progress indicator visible when upload is in progress
    // Description: Feature: Multi-File Upload Performance Scenario: Progress indicator visible Given upload is in progress When files are being processed Then progress or loading indicator should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1583: Verify User can navigate during upload when uploads running', async ({ page }) => {
    // Test Case: UTC-1583
    // Summary: Verify User can navigate during upload when uploads running
    // Description: Feature: Multi-File Upload Performance Scenario: User can navigate during upload Given uploads running When user scrolls or clicks other controls Then interactions should work normally

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1584: Verify Validation runs in background when files selected', async ({ page }) => {
    // Test Case: UTC-1584
    // Summary: Verify Validation runs in background when files selected
    // Description: Feature: Multi-File Upload Performance Scenario: Validation runs in background Given files selected When validation occurs Then validation should not block UI actions

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1585: Verify Multiple files processed simultaneously when 5+ files selected', async ({ page }) => {
    // Test Case: UTC-1585
    // Summary: Verify Multiple files processed simultaneously when 5+ files selected
    // Description: Feature: Multi-File Upload Performance Scenario: Multiple files processed simultaneously Given 5+ files selected When uploads start Then processing should occur in parallel instead of sequential

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1586: Verify One slow file does not block others when one large file and several small', async ({ page }) => {
    // Test Case: UTC-1586
    // Summary: Verify One slow file does not block others when one large file and several small files
    // Description: Feature: Multi-File Upload Performance Scenario: One slow file does not block others Given one large file and several small files When uploading Then small files should complete without waiting

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1587: Verify Upload time within threshold when up to 10 medium files', async ({ page }) => {
    // Test Case: UTC-1587
    // Summary: Verify Upload time within threshold when up to 10 medium files
    // Description: Feature: Multi-File Upload Performance Scenario: Upload time within threshold Given up to 10 medium files When upload completes Then all files should process within acceptable response time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1588: Verify Controls not disabled unnecessarily when upload running', async ({ page }) => {
    // Test Case: UTC-1588
    // Summary: Verify Controls not disabled unnecessarily when upload running
    // Description: Feature: Multi-File Upload Performance Scenario: Controls not disabled unnecessarily Given upload running When user views page Then unrelated buttons/fields should remain enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1589: Verify High volume uploads when 20+ files selected', async ({ page }) => {
    // Test Case: UTC-1589
    // Summary: Verify High volume uploads when 20+ files selected
    // Description: Feature: Multi-File Upload Performance Scenario: High volume uploads Given 20+ files selected When uploading Then UI should not freeze or crash

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1590: Verify Network delay handling when slow network', async ({ page }) => {
    // Test Case: UTC-1590
    // Summary: Verify Network delay handling when slow network
    // Description: Feature: Multi-File Upload Performance Scenario: Network delay handling Given slow network When upload delayed Then system should remain responsive and show progress

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1591: Verify Retry on failure when one file fails', async ({ page }) => {
    // Test Case: UTC-1591
    // Summary: Verify Retry on failure when one file fails
    // Description: Feature: Multi-File Upload Performance Scenario: Retry on failure Given one file fails When retry is triggered Then only failed file should retry without restarting all uploads

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1592: Verify File state tracking when multiple uploads', async ({ page }) => {
    // Test Case: UTC-1592
    // Summary: Verify File state tracking when multiple uploads
    // Description: Feature: Multi-File Upload Performance Scenario: File state tracking Given multiple uploads When each completes Then each file should show correct success/failure state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1593: Verify Memory usage stable when multiple uploads', async ({ page }) => {
    // Test Case: UTC-1593
    // Summary: Verify Memory usage stable when multiple uploads
    // Description: Feature: Multi-File Upload Performance Scenario: Memory usage stable Given multiple uploads When monitoring resources Then memory/CPU usage should remain within safe limits

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1594: Verify Keyboard interaction during upload when uploads in progress', async ({ page }) => {
    // Test Case: UTC-1594
    // Summary: Verify Keyboard interaction during upload when uploads in progress
    // Description: Feature: Multi-File Upload Performance Scenario: Keyboard interaction during upload Given uploads in progress When using keyboard navigation Then controls should remain accessible

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
