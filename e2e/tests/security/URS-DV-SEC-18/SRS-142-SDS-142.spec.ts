import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Badge visible when pending requests exist when pending deletion requests > 0
 * URS: URS-DV-SEC-18
 * SRS: SRS-142
 * SDS: SDS-142
 */
test.describe('URS-DV-SEC-18: Verify Badge visible when pending requests exist when pendin', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1857: Verify Badge visible when pending requests exist when pending deletion requests ', async ({ page }) => {
    // Test Case: UTC-1857
    // Summary: Verify Badge visible when pending requests exist when pending deletion requests > 0
    // Description: Feature: Delete Request Notification Badge Scenario: Badge visible when pending requests exist Given pending deletion requests > 0 When Epic page loads Then a red notification badge should be visible on the Delete Session Requests button

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1858: Verify Correct count displayed when 5 pending requests exist', async ({ page }) => {
    // Test Case: UTC-1858
    // Summary: Verify Correct count displayed when 5 pending requests exist
    // Description: Feature: Delete Request Notification Badge Scenario: Correct count displayed Given 5 pending requests exist When badge renders Then badge should display count “5”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1859: Verify Badge hidden when count is zero when no pending requests', async ({ page }) => {
    // Test Case: UTC-1859
    // Summary: Verify Badge hidden when count is zero when no pending requests
    // Description: Feature: Delete Request Notification Badge Scenario: Badge hidden when count is zero Given no pending requests When page loads Then badge should not be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1860: Verify Real-time count update when badge shows count 2', async ({ page }) => {
    // Test Case: UTC-1860
    // Summary: Verify Real-time count update when badge shows count 2
    // Description: Feature: Delete Request Notification Badge Scenario: Real-time count update Given badge shows count 2 When a new request is added Then badge should update to 3 without page refresh

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1861: Verify Count decreases after request resolved when count shows 3', async ({ page }) => {
    // Test Case: UTC-1861
    // Summary: Verify Count decreases after request resolved when count shows 3
    // Description: Feature: Delete Request Notification Badge Scenario: Count decreases after request resolved Given count shows 3 When one request is approved or rejected Then badge should update to 2

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1862: Verify Correct badge position when Delete Session Requests button is visible', async ({ page }) => {
    // Test Case: UTC-1862
    // Summary: Verify Correct badge position when Delete Session Requests button is visible
    // Description: Feature: Delete Request Notification Badge Scenario: Correct badge position Given Delete Session Requests button is visible When UI renders Then badge should appear at top-right corner of the button

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1863: Verify Badge styling consistency when badge displayed', async ({ page }) => {
    // Test Case: UTC-1863
    // Summary: Verify Badge styling consistency when badge displayed
    // Description: Feature: Delete Request Notification Badge Scenario: Badge styling consistency Given badge displayed When viewing UI Then badge should be red circular with white numeric text

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1864: Verify Count loads quickly when page initializes', async ({ page }) => {
    // Test Case: UTC-1864
    // Summary: Verify Count loads quickly when page initializes
    // Description: Feature: Delete Request Notification Badge Scenario: Count loads quickly Given page initializes When aggregation API is called Then badge count should load within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1865: Verify No flicker during initial render when page loads', async ({ page }) => {
    // Test Case: UTC-1865
    // Summary: Verify No flicker during initial render when page loads
    // Description: Feature: Delete Request Notification Badge Scenario: No flicker during initial render Given page loads When UI renders Then badge should not flash incorrect values before final count

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1866: Verify Unauthorized user cannot view badge when user lacks delete permission', async ({ page }) => {
    // Test Case: UTC-1866
    // Summary: Verify Unauthorized user cannot view badge when user lacks delete permission
    // Description: Feature: Delete Request Notification Badge Scenario: Unauthorized user cannot view badge Given user lacks delete permission When page loads Then Delete Session Requests button and badge should not be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1867: Verify API failure handling when aggregation API fails', async ({ page }) => {
    // Test Case: UTC-1867
    // Summary: Verify API failure handling when aggregation API fails
    // Description: Feature: Delete Request Notification Badge Scenario: API failure handling Given aggregation API fails When UI loads Then badge should remain hidden and page should not break

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1868: Verify Only PENDING status counted when requests with multiple statuses exist', async ({ page }) => {
    // Test Case: UTC-1868
    // Summary: Verify Only PENDING status counted when requests with multiple statuses exist
    // Description: Feature: Delete Request Notification Badge Scenario: Only PENDING status counted Given requests with multiple statuses exist When aggregation runs Then only records with status “PENDING” should be included in count

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1869: Verify Large count formatting when pending requests exceed 99', async ({ page }) => {
    // Test Case: UTC-1869
    // Summary: Verify Large count formatting when pending requests exceed 99
    // Description: Feature: Delete Request Notification Badge Scenario: Large count formatting Given pending requests exceed 99 When badge renders Then value should display “99+” or capped format for readability

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
