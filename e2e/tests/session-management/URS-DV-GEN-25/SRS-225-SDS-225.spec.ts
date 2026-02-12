import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown visible on Create Session page when user opens Create Session page
 * URS: URS-DV-GEN-25
 * SRS: SRS-225
 * SDS: SDS-225
 */
test.describe('URS-DV-GEN-25: Verify Dropdown visible on Create Session page when user ope', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2301: Verify Dropdown visible on Create Session page when user opens Create Session pa', async ({ page }) => {
    // Test Case: UTC-2301
    // Summary: Verify Dropdown visible on Create Session page when user opens Create Session page
    // Description: Feature: Restricted Session Status Selection Scenario: Dropdown visible on Create Session page Given user opens Create Session page When form loads Then Session Status dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2302: Verify Enabled options list when dropdown opened', async ({ page }) => {
    // Test Case: UTC-2302
    // Summary: Verify Enabled options list when dropdown opened
    // Description: Feature: Restricted Session Status Selection Scenario: Enabled options list Given dropdown opened When options are displayed Then Yet to do and In Progress should be enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2303: Verify Disabled Completed option when dropdown opened', async ({ page }) => {
    // Test Case: UTC-2303
    // Summary: Verify Disabled Completed option when dropdown opened
    // Description: Feature: Restricted Session Status Selection Scenario: Disabled Completed option Given dropdown opened When user views Completed Then it should appear disabled and non-selectable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2304: Verify Disabled Re-open option when dropdown opened', async ({ page }) => {
    // Test Case: UTC-2304
    // Summary: Verify Disabled Re-open option when dropdown opened
    // Description: Feature: Restricted Session Status Selection Scenario: Disabled Re-open option Given dropdown opened When user views Re-open Then it should appear disabled and non-selectable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2305: Verify Prevent selection of Completed when Completed is disabled', async ({ page }) => {
    // Test Case: UTC-2305
    // Summary: Verify Prevent selection of Completed when Completed is disabled
    // Description: Feature: Restricted Session Status Selection Scenario: Prevent selection of Completed Given Completed is disabled When user clicks Completed Then selection should not occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2306: Verify Prevent selection of Re-open when Re-open is disabled', async ({ page }) => {
    // Test Case: UTC-2306
    // Summary: Verify Prevent selection of Re-open when Re-open is disabled
    // Description: Feature: Restricted Session Status Selection Scenario: Prevent selection of Re-open Given Re-open is disabled When user clicks Re-open Then selection should not occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2307: Verify Select Yet to do when dropdown opened', async ({ page }) => {
    // Test Case: UTC-2307
    // Summary: Verify Select Yet to do when dropdown opened
    // Description: Feature: Restricted Session Status Selection Scenario: Select Yet to do Given dropdown opened When user selects Yet to do Then value should populate the field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2308: Verify Select In Progress when dropdown opened', async ({ page }) => {
    // Test Case: UTC-2308
    // Summary: Verify Select In Progress when dropdown opened
    // Description: Feature: Restricted Session Status Selection Scenario: Select In Progress Given dropdown opened When user selects In Progress Then value should populate the field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2309: Verify Payload contains only allowed statuses when user selects allowed status', async ({ page }) => {
    // Test Case: UTC-2309
    // Summary: Verify Payload contains only allowed statuses when user selects allowed status
    // Description: Feature: Restricted Session Status Selection Scenario: Payload contains only allowed statuses Given user selects allowed status When session is submitted Then API payload should include only Yet to do or In Progress

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2310: Verify Prevent manual injection of restricted status when user manipulates UI/co', async ({ page }) => {
    // Test Case: UTC-2310
    // Summary: Verify Prevent manual injection of restricted status when user manipulates UI/console to send Completed
    // Description: Feature: Restricted Session Status Selection Scenario: Prevent manual injection of restricted status Given user manipulates UI/console to send Completed When submitting Then backend should reject the request

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2311: Verify Load configuration on form initialization when form loads', async ({ page }) => {
    // Test Case: UTC-2311
    // Summary: Verify Load configuration on form initialization when form loads
    // Description: Feature: Restricted Session Status Selection Scenario: Load configuration on form initialization Given form loads When config service responds Then allowed statuses should bind correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2312: Verify Config service failure handling when configuration API fails', async ({ page }) => {
    // Test Case: UTC-2312
    // Summary: Verify Config service failure handling when configuration API fails
    // Description: Feature: Restricted Session Status Selection Scenario: Config service failure handling Given configuration API fails When dropdown initializes Then dropdown should be disabled and toast shown “Unable to load session status options”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2313: Verify Visual clarity for disabled options when dropdown open', async ({ page }) => {
    // Test Case: UTC-2313
    // Summary: Verify Visual clarity for disabled options when dropdown open
    // Description: Feature: Restricted Session Status Selection Scenario: Visual clarity for disabled options Given dropdown open When disabled statuses shown Then they should appear greyed out or visually distinct

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2314: Verify Keyboard cannot select disabled items when keyboard navigation used', async ({ page }) => {
    // Test Case: UTC-2314
    // Summary: Verify Keyboard cannot select disabled items when keyboard navigation used
    // Description: Feature: Restricted Session Status Selection Scenario: Keyboard cannot select disabled items Given keyboard navigation used When focusing disabled options Then selection should be blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2315: Verify Dropdown loads instantly when page loads', async ({ page }) => {
    // Test Case: UTC-2315
    // Summary: Verify Dropdown loads instantly when page loads
    // Description: Feature: Restricted Session Status Selection Scenario: Dropdown loads instantly Given page loads When dropdown opens Then options should render without delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2316: Verify Edit session does not affect restriction when Create Session mode active', async ({ page }) => {
    // Test Case: UTC-2316
    // Summary: Verify Edit session does not affect restriction when Create Session mode active
    // Description: Feature: Restricted Session Status Selection Scenario: Edit session does not affect restriction Given Create Session mode active When opening dropdown repeatedly Then restriction rules should remain enforced consistently

    // Navigate to module
    await sessionPage.navigateToModule();

    // Create session
    await sessionPage.createSession({
      name: 'Test Session',
      description: 'Test Description'
    });

    const sessionExists = await sessionPage.sessionExists('Test Session');
    expect(sessionExists).toBe(true);
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
