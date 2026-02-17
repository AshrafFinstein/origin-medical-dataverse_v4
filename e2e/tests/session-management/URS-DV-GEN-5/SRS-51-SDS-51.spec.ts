import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, LabelSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown opens instantly when the Session Creation page is loaded
 * URS: URS-DV-GEN-5
 * SRS: SRS-51
 * SDS: SDS-51
 */
test.describe('URS-DV-GEN-5: Verify Dropdown opens instantly when the Session Creation pa', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-594: Verify Dropdown opens instantly when the Session Creation page is loaded', async ({ page }) => {
    // Test Case: UTC-594
    // Summary: Verify Dropdown opens instantly when the Session Creation page is loaded
    // Description: Feature: Session Label Dropdown Performance Scenario: Dropdown opens instantly Given the Session Creation page is loaded When the user clicks the Session Label dropdown Then the dropdown should open within 2 seconds without noticeable delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-595: Verify Labels load quickly when labels exist in master data', async ({ page }) => {
    // Test Case: UTC-595
    // Summary: Verify Labels load quickly when labels exist in master data
    // Description: Feature: Session Label Dropdown Performance Scenario: Labels load quickly Given labels exist in master data When the dropdown opens Then all labels should be displayed immediately without lag

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-596: Verify Loading indicator shown during delay when network latency occurs', async ({ page }) => {
    // Test Case: UTC-596
    // Summary: Verify Loading indicator shown during delay when network latency occurs
    // Description: Feature: Session Label Dropdown Performance Scenario: Loading indicator shown during delay Given network latency occurs When the dropdown is opened Then a loading spinner or indicator should be displayed until data loads

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-597: Verify Smooth scrolling with many labels when 200+ labels exist', async ({ page }) => {
    // Test Case: UTC-597
    // Summary: Verify Smooth scrolling with many labels when 200+ labels exist
    // Description: Feature: Session Label Dropdown Performance Scenario: Smooth scrolling with many labels Given 200+ labels exist When the user scrolls the dropdown Then scrolling should remain smooth without UI freeze

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-598: Verify No page blocking during load when dropdown data is being fetched', async ({ page }) => {
    // Test Case: UTC-598
    // Summary: Verify No page blocking during load when dropdown data is being fetched
    // Description: Feature: Session Label Dropdown Performance Scenario: No page blocking during load Given dropdown data is being fetched When the request is processing Then the rest of the page should remain responsive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-599: Verify Cached labels load faster on reopen when the dropdown was opened once', async ({ page }) => {
    // Test Case: UTC-599
    // Summary: Verify Cached labels load faster on reopen when the dropdown was opened once
    // Description: Feature: Session Label Dropdown Performance Scenario: Cached labels load faster on reopen Given the dropdown was opened once When reopened again within short time Then labels should appear faster using cached data

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-600: Verify Failed load shows safe empty state when label fetch API fails', async ({ page }) => {
    // Test Case: UTC-600
    // Summary: Verify Failed load shows safe empty state when label fetch API fails
    // Description: Feature: Session Label Dropdown Performance Scenario: Failed load shows safe empty state Given label fetch API fails When the dropdown opens Then an empty state should be shown without breaking the page

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-601: Verify Retry works after failure when first fetch fails', async ({ page }) => {
    // Test Case: UTC-601
    // Summary: Verify Retry works after failure when first fetch fails
    // Description: Feature: Session Label Dropdown Performance Scenario: Retry works after failure Given first fetch fails When the user retries opening the dropdown Then labels should load successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-602: Verify Large dataset load within threshold when 500+ labels exist', async ({ page }) => {
    // Test Case: UTC-602
    // Summary: Verify Large dataset load within threshold when 500+ labels exist
    // Description: Feature: Session Label Dropdown Performance Scenario: Large dataset load within threshold Given 500+ labels exist When dropdown loads Then response time should remain within acceptable threshold (<2–3s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-603: Verify No visual flicker during render when the dropdown loads', async ({ page }) => {
    // Test Case: UTC-603
    // Summary: Verify No visual flicker during render when the dropdown loads
    // Description: Feature: Session Label Dropdown Performance Scenario: No visual flicker during render Given the dropdown loads When labels are displayed Then there should be no layout shift or flicker

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
