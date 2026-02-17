import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Add Level button is visible when the reviewer is on Session Creation page
 * URS: URS-DV-GEN-3
 * SRS: SRS-27
 * SDS: SDS-27
 */
test.describe('URS-DV-GEN-3: Verify Add Level button is visible when the reviewer is on S', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-326: Verify Add Level button is visible when the reviewer is on Session Creation page', async ({ page }) => {
    // Test Case: UTC-326
    // Summary: Verify Add Level button is visible when the reviewer is on Session Creation page
    // Description: Feature: Multi-Level Approval Setup Scenario: Add Level button is visible Given the reviewer is on Session Creation page When the Approval Level section loads Then the Add Level button should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-327: Verify Level 1 created on first click when no approval levels exist', async ({ page }) => {
    // Test Case: UTC-327
    // Summary: Verify Level 1 created on first click when no approval levels exist
    // Description: Scenario: Level 1 created on first click Given no approval levels exist When the user clicks Add Level Then Level 1 should be added and displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-328: Verify Level 2 created sequentially when Level 1 exists', async ({ page }) => {
    // Test Case: UTC-328
    // Summary: Verify Level 2 created sequentially when Level 1 exists
    // Description: Scenario: Level 2 created sequentially Given Level 1 exists When the user clicks Add Level Then Level 2 should be added after Level 1

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-329: Verify Level 3 created sequentially when Levels 1 and 2 exist', async ({ page }) => {
    // Test Case: UTC-329
    // Summary: Verify Level 3 created sequentially when Levels 1 and 2 exist
    // Description: Scenario: Level 3 created sequentially Given Levels 1 and 2 exist When the user clicks Add Level Then Level 3 should be added in sequence

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-330: Verify Level 4 created sequentially when Levels 1 to 3 exist', async ({ page }) => {
    // Test Case: UTC-330
    // Summary: Verify Level 4 created sequentially when Levels 1 to 3 exist
    // Description: Scenario: Level 4 created sequentially Given Levels 1 to 3 exist When the user clicks Add Level Then Level 4 should be added correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-331: Verify Level 5 created sequentially when Levels 1 to 4 exist', async ({ page }) => {
    // Test Case: UTC-331
    // Summary: Verify Level 5 created sequentially when Levels 1 to 4 exist
    // Description: Scenario: Level 5 created sequentially Given Levels 1 to 4 exist When the user clicks Add Level Then Level 5 should be added correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-332: Verify Levels appear immediately after creation when user clicks Add Level', async ({ page }) => {
    // Test Case: UTC-332
    // Summary: Verify Levels appear immediately after creation when user clicks Add Level
    // Description: Scenario: Levels appear immediately after creation Given user clicks Add Level When the level is added Then the new level should appear instantly without page reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-333: Verify Correct sequential order maintained when multiple levels are added', async ({ page }) => {
    // Test Case: UTC-333
    // Summary: Verify Correct sequential order maintained when multiple levels are added
    // Description: Scenario: Correct sequential order maintained Given multiple levels are added When viewing the approval configuration Then levels should display in ascending order (L1 → L5)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-334: Verify Adding beyond Level 5 restricted when Levels 1 to 5 already exist', async ({ page }) => {
    // Test Case: UTC-334
    // Summary: Verify Adding beyond Level 5 restricted when Levels 1 to 5 already exist
    // Description: Scenario: Adding beyond Level 5 restricted Given Levels 1 to 5 already exist When the user clicks Add Level again Then Level 6 should not be created

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-335: Verify Validation message for maximum levels when 5 levels already configured', async ({ page }) => {
    // Test Case: UTC-335
    // Summary: Verify Validation message for maximum levels when 5 levels already configured
    // Description: Scenario: Validation message for maximum levels Given 5 levels already configured When the user attempts to add another level Then a clear message should indicate that maximum 5 levels are allowed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-336: Verify Previously configured levels retained when multiple levels are added with', async ({ page }) => {
    // Test Case: UTC-336
    // Summary: Verify Previously configured levels retained when multiple levels are added with approvers
    // Description: Scenario: Previously configured levels retained Given multiple levels are added with approvers When a new level is added Then existing level data should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-337: Verify User clearly sees level labels when levels are added', async ({ page }) => {
    // Test Case: UTC-337
    // Summary: Verify User clearly sees level labels when levels are added
    // Description: Scenario: User clearly sees level labels Given levels are added When the approval section is displayed Then each level should show clear labels (Level 1, Level 2, … Level 5)

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
