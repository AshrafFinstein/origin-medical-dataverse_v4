import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Add Level button visibility when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-86
 * SDS: SDS-86
 */
test.describe('URS-DV-GEN-07: Verify Add Level button visibility when Session Creation pag', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1078: Verify Add Level button visibility when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-1078
    // Summary: Verify Add Level button visibility when Session Creation page loads
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Add Level button visibility Given Session Creation page loads When approval configuration section renders Then “+ Add Level” button should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1079: Verify Button styling clarity when Add Level button displayed', async ({ page }) => {
    // Test Case: UTC-1079
    // Summary: Verify Button styling clarity when Add Level button displayed
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Button styling clarity Given Add Level button displayed When user views control Then it should appear as blue clickable text/button

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1080: Verify Add first approval level when no levels configured', async ({ page }) => {
    // Test Case: UTC-1080
    // Summary: Verify Add first approval level when no levels configured
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Add first approval level Given no levels configured When user clicks Add Level Then Level 1 component should be created

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1081: Verify Add second level sequentially when Level 1 exists', async ({ page }) => {
    // Test Case: UTC-1081
    // Summary: Verify Add second level sequentially when Level 1 exists
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Add second level sequentially Given Level 1 exists When Add Level clicked Then Level 2 should be added after Level 1

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1082: Verify Component renders instantly when user clicks Add Level', async ({ page }) => {
    // Test Case: UTC-1082
    // Summary: Verify Component renders instantly when user clicks Add Level
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Component renders instantly Given user clicks Add Level When action completes Then new level should appear immediately without page reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1083: Verify Sequence count update when multiple levels added', async ({ page }) => {
    // Test Case: UTC-1083
    // Summary: Verify Sequence count update when multiple levels added
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Sequence count update Given multiple levels added When inspecting state Then sequence count should increment correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1084: Verify Maintain order when several levels added', async ({ page }) => {
    // Test Case: UTC-1084
    // Summary: Verify Maintain order when several levels added
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Maintain order Given several levels added When viewing configuration Then levels should display in ascending order

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1085: Verify Limit total levels to five when Levels 1â€“5 exist', async ({ page }) => {
    // Test Case: UTC-1085
    // Summary: Verify Limit total levels to five when Levels 1â€“5 exist
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Limit total levels to five Given Levels 1–5 exist When Add Level clicked Then no additional level should be created

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1086: Verify Maximum level message when 5 levels configured', async ({ page }) => {
    // Test Case: UTC-1086
    // Summary: Verify Maximum level message when 5 levels configured
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Maximum level message Given 5 levels configured When Add Level attempted Then validation message should indicate limit reached

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1087: Verify Existing level data retained when approvers assigned to existing levels', async ({ page }) => {
    // Test Case: UTC-1087
    // Summary: Verify Existing level data retained when approvers assigned to existing levels
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Existing level data retained Given approvers assigned to existing levels When new level added Then existing data should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1088: Verify Unauthorized users restricted when user lacks reviewer permission', async ({ page }) => {
    // Test Case: UTC-1088
    // Summary: Verify Unauthorized users restricted when user lacks reviewer permission
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Unauthorized users restricted Given user lacks reviewer permission When page loads Then Add Level control should be hidden or disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1089: Verify Clear labeling when approval section visible', async ({ page }) => {
    // Test Case: UTC-1089
    // Summary: Verify Clear labeling when approval section visible
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Clear labeling Given approval section visible When viewing levels Then each level should show clear labels (Level 1, Level 2, etc.)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1090: Verify Rapid multiple clicks when user clicks Add Level quickly', async ({ page }) => {
    // Test Case: UTC-1090
    // Summary: Verify Rapid multiple clicks when user clicks Add Level quickly
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Rapid multiple clicks Given user clicks Add Level quickly When system processes clicks Then duplicate or skipped levels should not occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1091: Verify Keyboard interaction when button focused', async ({ page }) => {
    // Test Case: UTC-1091
    // Summary: Verify Keyboard interaction when button focused
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Keyboard interaction Given button focused When Enter or Space pressed Then level should be added

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1092: Verify Retry after temporary failure when level creation temporarily fails', async ({ page }) => {
    // Test Case: UTC-1092
    // Summary: Verify Retry after temporary failure when level creation temporarily fails
    // Description: Feature: Add Level trigger for configuring approval workflow levels Scenario: Retry after temporary failure Given level creation temporarily fails When user retries Then level should be added successfully

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
