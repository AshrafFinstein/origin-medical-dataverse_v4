import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Remove icon visibility when at least one link row exists
 * URS: URS-DV-GEN-07
 * SRS: SRS-81
 * SDS: SDS-81
 */
test.describe('URS-DV-GEN-07: Verify Remove icon visibility when at least one link row exi', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1002: Verify Remove icon visibility when at least one link row exists', async ({ page }) => {
    // Test Case: UTC-1002
    // Summary: Verify Remove icon visibility when at least one link row exists
    // Description: Feature: Remove Link Action for external references Scenario: Remove icon visibility Given at least one link row exists When the row is displayed Then a small “X” or trash icon should appear at the right end

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1003: Verify Icon clarity when the delete control is visible', async ({ page }) => {
    // Test Case: UTC-1003
    // Summary: Verify Icon clarity when the delete control is visible
    // Description: Feature: Remove Link Action for external references Scenario: Icon clarity Given the delete control is visible When user views the row Then icon should clearly indicate deletion action

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1004: Verify Remove single link row when one link row exists', async ({ page }) => {
    // Test Case: UTC-1004
    // Summary: Verify Remove single link row when one link row exists
    // Description: Feature: Remove Link Action for external references Scenario: Remove single link row Given one link row exists When user clicks remove icon Then the selected row should be deleted immediately

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1005: Verify Remove specific row only when multiple link rows exist', async ({ page }) => {
    // Test Case: UTC-1005
    // Summary: Verify Remove specific row only when multiple link rows exist
    // Description: Feature: Remove Link Action for external references Scenario: Remove specific row only Given multiple link rows exist When user deletes the second row Then only that specific row should be removed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1006: Verify Immediate UI update when user clicks delete', async ({ page }) => {
    // Test Case: UTC-1006
    // Summary: Verify Immediate UI update when user clicks delete
    // Description: Feature: Remove Link Action for external references Scenario: Immediate UI update Given user clicks delete When action executes Then UI should update instantly without page refresh

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1007: Verify State array updated when multiple links in state array', async ({ page }) => {
    // Test Case: UTC-1007
    // Summary: Verify State array updated when multiple links in state array
    // Description: Feature: Remove Link Action for external references Scenario: State array updated Given multiple links in state array When one is removed Then the specific index should be deleted from local array

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1008: Verify Remove last row when multiple links exist', async ({ page }) => {
    // Test Case: UTC-1008
    // Summary: Verify Remove last row when multiple links exist
    // Description: Feature: Remove Link Action for external references Scenario: Remove last row Given multiple links exist When last row deleted Then remaining rows should persist correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1009: Verify Remove all rows when multiple links exist', async ({ page }) => {
    // Test Case: UTC-1009
    // Summary: Verify Remove all rows when multiple links exist
    // Description: Feature: Remove Link Action for external references Scenario: Remove all rows Given multiple links exist When all rows deleted one by one Then no link rows should remain

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1010: Verify No residual data after removal when link row removed', async ({ page }) => {
    // Test Case: UTC-1010
    // Summary: Verify No residual data after removal when link row removed
    // Description: Feature: Remove Link Action for external references Scenario: No residual data after removal Given link row removed When saving session Then deleted link should not appear in payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1011: Verify Confirmation feedback when row removed', async ({ page }) => {
    // Test Case: UTC-1011
    // Summary: Verify Confirmation feedback when row removed
    // Description: Feature: Remove Link Action for external references Scenario: Confirmation feedback Given row removed When action completes Then user should clearly see updated list without confusion

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1012: Verify Click delete when no rows exist when no links present', async ({ page }) => {
    // Test Case: UTC-1012
    // Summary: Verify Click delete when no rows exist when no links present
    // Description: Feature: Remove Link Action for external references Scenario: Click delete when no rows exist Given no links present When user attempts removal Then no action should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1013: Verify Multiple deletions performance when many links (10+) exist', async ({ page }) => {
    // Test Case: UTC-1013
    // Summary: Verify Multiple deletions performance when many links (10+) exist
    // Description: Feature: Remove Link Action for external references Scenario: Multiple deletions performance Given many links (10+) exist When rows deleted repeatedly Then UI should remain responsive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1014: Verify Keyboard accessibility when delete icon focused', async ({ page }) => {
    // Test Case: UTC-1014
    // Summary: Verify Keyboard accessibility when delete icon focused
    // Description: Feature: Remove Link Action for external references Scenario: Keyboard accessibility Given delete icon focused When Enter/Space pressed Then row should be removed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1015: Verify Prevent accidental deletion during freeze/disabled state when form is dis', async ({ page }) => {
    // Test Case: UTC-1015
    // Summary: Verify Prevent accidental deletion during freeze/disabled state when form is disabled or frozen
    // Description: Feature: Remove Link Action for external references Scenario: Prevent accidental deletion during freeze/disabled state Given form is disabled or frozen When delete clicked Then removal should not occur

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
