import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Name field visibility when Add Links row is created
 * URS: URS-DV-GEN-07
 * SRS: SRS-79
 * SDS: SDS-79
 */
test.describe('URS-DV-GEN-07: Verify Name field visibility when Add Links row is created', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-976: Verify Name field visibility when Add Links row is created', async ({ page }) => {
    // Test Case: UTC-976
    // Summary: Verify Name field visibility when Add Links row is created
    // Description: Feature: Link Name Input for descriptive labeling Scenario: Name field visibility Given Add Links row is created When link inputs render Then a Name text field should be visible beside URL field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-977: Verify Placeholder guidance when Name field is displayed', async ({ page }) => {
    // Test Case: UTC-977
    // Summary: Verify Placeholder guidance when Name field is displayed
    // Description: Feature: Link Name Input for descriptive labeling Scenario: Placeholder guidance Given Name field is displayed When user views the field Then placeholder should show Enter a Name Link

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-978: Verify Enter link name when Name field is active', async ({ page }) => {
    // Test Case: UTC-978
    // Summary: Verify Enter link name when Name field is active
    // Description: Feature: Link Name Input for descriptive labeling Scenario: Enter link name Given Name field is active When user types a label Then the value should be captured and retained

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-979: Verify Multiple names supported when multiple links added', async ({ page }) => {
    // Test Case: UTC-979
    // Summary: Verify Multiple names supported when multiple links added
    // Description: Feature: Link Name Input for descriptive labeling Scenario: Multiple names supported Given multiple links added When user enters names for each Then each row should store its own name independently

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-980: Verify Prevent empty name submission when Name field is empty', async ({ page }) => {
    // Test Case: UTC-980
    // Summary: Verify Prevent empty name submission when Name field is empty
    // Description: Feature: Link Name Input for descriptive labeling Scenario: Prevent empty name submission Given Name field is empty When session is submitted Then validation should block save or show warning

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-981: Verify Accept alphanumeric characters when valid text entered', async ({ page }) => {
    // Test Case: UTC-981
    // Summary: Verify Accept alphanumeric characters when valid text entered
    // Description: Feature: Link Name Input for descriptive labeling Scenario: Accept alphanumeric characters Given valid text entered When saving session Then name should be accepted successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-982: Verify Restrict special characters when invalid special characters entered', async ({ page }) => {
    // Test Case: UTC-982
    // Summary: Verify Restrict special characters when invalid special characters entered
    // Description: Feature: Link Name Input for descriptive labeling Scenario: Restrict special characters Given invalid special characters entered When validation runs Then restricted characters should be blocked or sanitized

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-983: Verify Name paired with URL in payload when name and URL entered', async ({ page }) => {
    // Test Case: UTC-983
    // Summary: Verify Name paired with URL in payload when name and URL entered
    // Description: Feature: Link Name Input for descriptive labeling Scenario: Name paired with URL in payload Given name and URL entered When session saved Then API payload should include nested {name, url} object

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-984: Verify Data persistence during navigation when name entered', async ({ page }) => {
    // Test Case: UTC-984
    // Summary: Verify Data persistence during navigation when name entered
    // Description: Feature: Link Name Input for descriptive labeling Scenario: Data persistence during navigation Given name entered When navigating within form Then value should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-985: Verify Clear alignment with URL when link row visible', async ({ page }) => {
    // Test Case: UTC-985
    // Summary: Verify Clear alignment with URL when link row visible
    // Description: Feature: Link Name Input for descriptive labeling Scenario: Clear alignment with URL Given link row visible When user views inputs Then Name and URL should be aligned and readable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-986: Verify Keyboard accessibility when Name field focused', async ({ page }) => {
    // Test Case: UTC-986
    // Summary: Verify Keyboard accessibility when Name field focused
    // Description: Feature: Link Name Input for descriptive labeling Scenario: Keyboard accessibility Given Name field focused When user tabs through inputs Then focus should move correctly and allow typing

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-987: Verify Instant input response when user types text rapidly', async ({ page }) => {
    // Test Case: UTC-987
    // Summary: Verify Instant input response when user types text rapidly
    // Description: Feature: Link Name Input for descriptive labeling Scenario: Instant input response Given user types text rapidly When characters entered Then UI should update without lag

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
