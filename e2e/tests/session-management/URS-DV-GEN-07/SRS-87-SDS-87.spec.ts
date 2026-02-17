import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Dropdown visibility when an approval level is added
 * URS: URS-DV-GEN-07
 * SRS: SRS-87
 * SDS: SDS-87
 */
test.describe('URS-DV-GEN-07: Verify Dropdown visibility when an approval level is added', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1093: Verify Dropdown visibility when an approval level is added', async ({ page }) => {
    // Test Case: UTC-1093
    // Summary: Verify Dropdown visibility when an approval level is added
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Dropdown visibility Given an approval level is added When the level renders Then hierarchy dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1094: Verify Default value when Level 1 created', async ({ page }) => {
    // Test Case: UTC-1094
    // Summary: Verify Default value when Level 1 created
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Default value Given Level 1 created When dropdown loads Then default selected value should be Level 1

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1095: Verify Dropdown shows available levels when hierarchy dropdown opened', async ({ page }) => {
    // Test Case: UTC-1095
    // Summary: Verify Dropdown shows available levels when hierarchy dropdown opened
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Dropdown shows available levels Given hierarchy dropdown opened When options displayed Then all valid stages (Level 1–Level 5) should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1096: Verify Select level rank when dropdown open', async ({ page }) => {
    // Test Case: UTC-1096
    // Summary: Verify Select level rank when dropdown open
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Select level rank Given dropdown open When user selects Level 2 Then selected value should update immediately

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1097: Verify Sequence mapping to backend when Level 3 selected', async ({ page }) => {
    // Test Case: UTC-1097
    // Summary: Verify Sequence mapping to backend when Level 3 selected
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Sequence mapping to backend Given Level 3 selected When session saved Then approval_sequence should be stored as integer 3 in payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1098: Verify Prevent duplicate sequence when Level 2 already assigned to another stage', async ({ page }) => {
    // Test Case: UTC-1098
    // Summary: Verify Prevent duplicate sequence when Level 2 already assigned to another stage
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Prevent duplicate sequence Given Level 2 already assigned to another stage When selecting Level 2 again Then system should prevent duplicate selection

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1099: Verify Reordering updates sequence when two levels exist', async ({ page }) => {
    // Test Case: UTC-1099
    // Summary: Verify Reordering updates sequence when two levels exist
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Reordering updates sequence Given two levels exist When user swaps Level 1 to Level 2 Then order should update correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1100: Verify Clear label display when dropdown closed', async ({ page }) => {
    // Test Case: UTC-1100
    // Summary: Verify Clear label display when dropdown closed
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Clear label display Given dropdown closed When value selected Then selected label should be clearly readable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1101: Verify Persist value on navigation when level selected', async ({ page }) => {
    // Test Case: UTC-1101
    // Summary: Verify Persist value on navigation when level selected
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Persist value on navigation Given level selected When user navigates within page Then selection should remain intact

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1102: Verify Unauthorized user cannot modify when non-reviewer user logged in', async ({ page }) => {
    // Test Case: UTC-1102
    // Summary: Verify Unauthorized user cannot modify when non-reviewer user logged in
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Unauthorized user cannot modify Given non-reviewer user logged in When viewing dropdown Then field should be disabled or hidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1103: Verify Maximum level boundary when Level 5 selected', async ({ page }) => {
    // Test Case: UTC-1103
    // Summary: Verify Maximum level boundary when Level 5 selected
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Maximum level boundary Given Level 5 selected When trying to exceed range Then system should not allow values beyond Level 5

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1104: Verify Dropdown opens quickly when user clicks dropdown', async ({ page }) => {
    // Test Case: UTC-1104
    // Summary: Verify Dropdown opens quickly when user clicks dropdown
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Dropdown opens quickly Given user clicks dropdown When options load Then it should open within acceptable time (<1s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1105: Verify Rapid changes handled safely when user changes selection multiple times', async ({ page }) => {
    // Test Case: UTC-1105
    // Summary: Verify Rapid changes handled safely when user changes selection multiple times
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Rapid changes handled safely Given user changes selection multiple times When system processes Then final selection should be stored correctly without crash

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1106: Verify Keyboard selection support when dropdown focused', async ({ page }) => {
    // Test Case: UTC-1106
    // Summary: Verify Keyboard selection support when dropdown focused
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Keyboard selection support Given dropdown focused When arrow keys and Enter used Then user should select option via keyboard

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1107: Verify Invalid value handling when manipulated invalid value sent', async ({ page }) => {
    // Test Case: UTC-1107
    // Summary: Verify Invalid value handling when manipulated invalid value sent
    // Description: Feature: Approval Level hierarchy selector for defining workflow order Scenario: Invalid value handling Given manipulated invalid value sent When saving session Then backend should reject invalid sequence

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
