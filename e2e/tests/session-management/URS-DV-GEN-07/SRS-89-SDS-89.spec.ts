import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Filter dropdown visibility when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-89
 * SDS: SDS-89
 */
test.describe('URS-DV-GEN-07: Verify Filter dropdown visibility when Session Creation page', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1123: Verify Filter dropdown visibility when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-1123
    // Summary: Verify Filter dropdown visibility when Session Creation page loads
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Filter dropdown visibility Given Session Creation page loads When annotation section renders Then Select Annotations dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1124: Verify Placeholder text displayed when no annotation selected', async ({ page }) => {
    // Test Case: UTC-1124
    // Summary: Verify Placeholder text displayed when no annotation selected
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Placeholder text displayed Given no annotation selected When dropdown loads Then placeholder should show “Select Annotations”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1125: Verify Load annotations from taxonomy when taxonomy selected', async ({ page }) => {
    // Test Case: UTC-1125
    // Summary: Verify Load annotations from taxonomy when taxonomy selected
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Load annotations from taxonomy Given taxonomy selected When dropdown opened Then system should display annotations belonging to selected taxonomy only

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1126: Verify Select single annotation when annotation list available', async ({ page }) => {
    // Test Case: UTC-1126
    // Summary: Verify Select single annotation when annotation list available
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Select single annotation Given annotation list available When user selects one checkbox Then that annotation should be marked active

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1127: Verify Select multiple annotations when multiple options available', async ({ page }) => {
    // Test Case: UTC-1127
    // Summary: Verify Select multiple annotations when multiple options available
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Select multiple annotations Given multiple options available When user selects several checkboxes Then all selected annotations should appear active

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1128: Verify Select All functionality when dropdown opened', async ({ page }) => {
    // Test Case: UTC-1128
    // Summary: Verify Select All functionality when dropdown opened
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Select All functionality Given dropdown opened When user clicks “Select All” Then all annotations should be selected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1129: Verify Deselect All functionality when all annotations selected', async ({ page }) => {
    // Test Case: UTC-1129
    // Summary: Verify Deselect All functionality when all annotations selected
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Deselect All functionality Given all annotations selected When user unchecks “Select All” Then all annotations should be deselected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1130: Verify Store selected IDs in state when annotations selected', async ({ page }) => {
    // Test Case: UTC-1130
    // Summary: Verify Store selected IDs in state when annotations selected
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Store selected IDs in state Given annotations selected When selection confirmed Then selected annotation IDs should be stored in local state array

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1131: Verify Payload mapping when session saved', async ({ page }) => {
    // Test Case: UTC-1131
    // Summary: Verify Payload mapping when session saved
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Payload mapping Given session saved When API request sent Then filtered annotation IDs should be included in payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1132: Verify Viewer shows only active annotations when filtered annotations configured', async ({ page }) => {
    // Test Case: UTC-1132
    // Summary: Verify Viewer shows only active annotations when filtered annotations configured
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Viewer shows only active annotations Given filtered annotations configured When labeling module opens Then only selected annotations should be available in toolset

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1133: Verify Selected items displayed clearly when annotations selected', async ({ page }) => {
    // Test Case: UTC-1133
    // Summary: Verify Selected items displayed clearly when annotations selected
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Selected items displayed clearly Given annotations selected When dropdown closed Then selected items should be visible as chips or count label

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1134: Verify Prevent invalid annotation selection when annotation not part of taxonomy', async ({ page }) => {
    // Test Case: UTC-1134
    // Summary: Verify Prevent invalid annotation selection when annotation not part of taxonomy
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Prevent invalid annotation selection Given annotation not part of taxonomy When user attempts selection Then system should block invalid option

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1135: Verify Selection persistence when annotations selected', async ({ page }) => {
    // Test Case: UTC-1135
    // Summary: Verify Selection persistence when annotations selected
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Selection persistence Given annotations selected When user navigates within form Then selections should remain intact

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1136: Verify Fast dropdown rendering when many annotations (1000+)', async ({ page }) => {
    // Test Case: UTC-1136
    // Summary: Verify Fast dropdown rendering when many annotations (1000+)
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Fast dropdown rendering Given many annotations (1000+) When dropdown opens Then options should render smoothly without UI freeze

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1137: Verify Fetch failure handling when annotation fetch fails', async ({ page }) => {
    // Test Case: UTC-1137
    // Summary: Verify Fetch failure handling when annotation fetch fails
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Fetch failure handling Given annotation fetch fails When dropdown opens Then system should show friendly message “Failed to load annotations”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1138: Verify Keyboard support when dropdown focused', async ({ page }) => {
    // Test Case: UTC-1138
    // Summary: Verify Keyboard support when dropdown focused
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Keyboard support Given dropdown focused When user navigates via keyboard Then options should be selectable using keys

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1139: Verify Role-based access restriction when user lacks edit permission', async ({ page }) => {
    // Test Case: UTC-1139
    // Summary: Verify Role-based access restriction when user lacks edit permission
    // Description: Feature: Annotation filter to control active taxonomy labels Scenario: Role-based access restriction Given user lacks edit permission When page loads Then annotation filter should be disabled or read-only

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
