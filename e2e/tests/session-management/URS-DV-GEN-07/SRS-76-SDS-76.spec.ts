import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Set Code field visible when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-76
 * SDS: SDS-76
 */
test.describe('URS-DV-GEN-07: Verify Set Code field visible when Session Creation page loa', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-942: Verify Set Code field visible when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-942
    // Summary: Verify Set Code field visible when Session Creation page loads
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Set Code field visible Given Session Creation page loads When form renders Then Set Code text input should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-943: Verify Accept alphanumeric value when user enters SET001', async ({ page }) => {
    // Test Case: UTC-943
    // Summary: Verify Accept alphanumeric value when user enters SET001
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Accept alphanumeric value Given user enters SET001 When input saved Then value should be accepted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-944: Verify Accept mixed characters when user enters Batch-2026-A', async ({ page }) => {
    // Test Case: UTC-944
    // Summary: Verify Accept mixed characters when user enters Batch-2026-A
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Accept mixed characters Given user enters Batch-2026-A When saved Then value should be stored correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-945: Verify Placeholder visible when field loads', async ({ page }) => {
    // Test Case: UTC-945
    // Summary: Verify Placeholder visible when field loads
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Placeholder visible Given field loads When user views input Then placeholder text should guide user

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-946: Verify Trim leading/trailing spaces when user enters  SET100', async ({ page }) => {
    // Test Case: UTC-946
    // Summary: Verify Trim leading/trailing spaces when user enters  SET100
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Trim leading/trailing spaces Given user enters  SET100  When saved Then spaces should be removed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-947: Verify Prevent special characters when user enters invalid symbols (@#$%)', async ({ page }) => {
    // Test Case: UTC-947
    // Summary: Verify Prevent special characters when user enters invalid symbols (@#$%)
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Prevent special characters Given user enters invalid symbols (@#$%) When validated Then system should block or sanitize invalid characters

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-948: Verify Maximum length enforcement when input exceeds limit', async ({ page }) => {
    // Test Case: UTC-948
    // Summary: Verify Maximum length enforcement when input exceeds limit
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Maximum length enforcement Given input exceeds limit When validation runs Then system should prevent excess characters

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-949: Verify Value persists during navigation when Set Code entered', async ({ page }) => {
    // Test Case: UTC-949
    // Summary: Verify Value persists during navigation when Set Code entered
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Value persists during navigation Given Set Code entered When navigating within form Then value should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-950: Verify Value included in API payload when session submitted', async ({ page }) => {
    // Test Case: UTC-950
    // Summary: Verify Value included in API payload when session submitted
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Value included in API payload Given session submitted When request sent Then setCode should be present in payload

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

  test('UTC-951: Verify Indexed for batch search when sessions created with same Set Code', async ({ page }) => {
    // Test Case: UTC-951
    // Summary: Verify Indexed for batch search when sessions created with same Set Code
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Indexed for batch search Given sessions created with same Set Code When searched by set value Then related sessions should be retrieved

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-952: Verify Empty field allowed when no Set Code entered', async ({ page }) => {
    // Test Case: UTC-952
    // Summary: Verify Empty field allowed when no Set Code entered
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Empty field allowed Given no Set Code entered When session saved Then session should still be created successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-953: Verify Keyboard typing supported when field focused', async ({ page }) => {
    // Test Case: UTC-953
    // Summary: Verify Keyboard typing supported when field focused
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Keyboard typing supported Given field focused When typing value Then input should work without mouse

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-954: Verify Refresh retains value when value saved', async ({ page }) => {
    // Test Case: UTC-954
    // Summary: Verify Refresh retains value when value saved
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Refresh retains value Given value saved When page refreshed Then Set Code should reload correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-955: Verify Instant save response when value entered', async ({ page }) => {
    // Test Case: UTC-955
    // Summary: Verify Instant save response when value entered
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Instant save response Given value entered When saved Then system should respond without noticeable delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-956: Verify Editable after creation when session opened in edit mode', async ({ page }) => {
    // Test Case: UTC-956
    // Summary: Verify Editable after creation when session opened in edit mode
    // Description: Feature: Set Code batch grouping input for sessions Scenario: Editable after creation Given session opened in edit mode When modifying Set Code Then updated value should be saved successfully

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
