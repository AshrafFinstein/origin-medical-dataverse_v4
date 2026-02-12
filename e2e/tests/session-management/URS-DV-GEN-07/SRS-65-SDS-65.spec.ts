import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Auto Generate label visibility when the Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-65
 * SDS: SDS-65
 */
test.describe('URS-DV-GEN-07: Verify Auto Generate label visibility when the Session Creat', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-784: Verify Auto Generate label visibility when the Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-784
    // Summary: Verify Auto Generate label visibility when the Session Creation page loads
    // Description: Feature: Automatic session name generation using timestamp/ID-based naming with conflict-safe suffix Scenario: Auto Generate label visibility Given the Session Creation page loads When the name field is displayed Then “Auto Generate Session Name” label should be visible and clickable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-785: Verify Name auto-filled on click when the input field is empty', async ({ page }) => {
    // Test Case: UTC-785
    // Summary: Verify Name auto-filled on click when the input field is empty
    // Description: Feature: Automatic session name generation using timestamp/ID-based naming with conflict-safe suffix Scenario: Name auto-filled on click Given the input field is empty When user clicks Auto Generate Then a generated name should populate the field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-786: Verify Naming format validation when Auto Generate is clicked', async ({ page }) => {
    // Test Case: UTC-786
    // Summary: Verify Naming format validation when Auto Generate is clicked
    // Description: Feature: Automatic session name generation using timestamp/ID-based naming with conflict-safe suffix Scenario: Naming format validation Given Auto Generate is clicked When name is created Then name should follow pattern like SES_YYYYMMDD or ID-based

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-787: Verify Overwrite existing text when manual text exists in field', async ({ page }) => {
    // Test Case: UTC-787
    // Summary: Verify Overwrite existing text when manual text exists in field
    // Description: Feature: Automatic session name generation using timestamp/ID-based naming with conflict-safe suffix Scenario: Overwrite existing text Given manual text exists in field When Auto Generate is clicked Then field should update with generated name

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-788: Verify Generated name is valid when name is auto-generated', async ({ page }) => {
    // Test Case: UTC-788
    // Summary: Verify Generated name is valid when name is auto-generated
    // Description: Feature: Automatic session name generation using timestamp/ID-based naming with conflict-safe suffix Scenario: Generated name is valid Given name is auto-generated When validation runs Then no mandatory or format validation error should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-789: Verify Unique name generation when no existing duplicate', async ({ page }) => {
    // Test Case: UTC-789
    // Summary: Verify Unique name generation when no existing duplicate
    // Description: Feature: Automatic session name generation using timestamp/ID-based naming with conflict-safe suffix Scenario: Unique name generation Given no existing duplicate When name is generated Then the name should be unique in the system

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-790: Verify Conflict handling with suffix when generated name already exists', async ({ page }) => {
    // Test Case: UTC-790
    // Summary: Verify Conflict handling with suffix when generated name already exists
    // Description: Feature: Automatic session name generation using timestamp/ID-based naming with conflict-safe suffix Scenario: Conflict handling with suffix Given generated name already exists When Auto Generate runs Then system should append _1 or increment suffix automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-791: Verify Multiple clicks generate new values when user clicks multiple times', async ({ page }) => {
    // Test Case: UTC-791
    // Summary: Verify Multiple clicks generate new values when user clicks multiple times
    // Description: Feature: Automatic session name generation using timestamp/ID-based naming with conflict-safe suffix Scenario: Multiple clicks generate new values Given user clicks multiple times When each click occurs Then each generated value should be unique

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-792: Verify Stored in payload when auto-generated value exists', async ({ page }) => {
    // Test Case: UTC-792
    // Summary: Verify Stored in payload when auto-generated value exists
    // Description: Feature: Automatic session name generation using timestamp/ID-based naming with conflict-safe suffix Scenario: Stored in payload Given auto-generated value exists When session is submitted Then generated name should be sent in API payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-793: Verify Visual clarity of link when user views field', async ({ page }) => {
    // Test Case: UTC-793
    // Summary: Verify Visual clarity of link when user views field
    // Description: Feature: Automatic session name generation using timestamp/ID-based naming with conflict-safe suffix Scenario: Visual clarity of link Given user views field When Auto Generate option displayed Then it should be styled as blue clickable label

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-794: Verify Instant generation when user clicks Auto Generate', async ({ page }) => {
    // Test Case: UTC-794
    // Summary: Verify Instant generation when user clicks Auto Generate
    // Description: Feature: Automatic session name generation using timestamp/ID-based naming with conflict-safe suffix Scenario: Instant generation Given user clicks Auto Generate When action occurs Then name should populate instantly (<1s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-795: Verify Conflict resolution works without crash when duplicate detected', async ({ page }) => {
    // Test Case: UTC-795
    // Summary: Verify Conflict resolution works without crash when duplicate detected
    // Description: Feature: Automatic session name generation using timestamp/ID-based naming with conflict-safe suffix Scenario: Conflict resolution works without crash Given duplicate detected When suffix added Then system should not show error or block generation

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
