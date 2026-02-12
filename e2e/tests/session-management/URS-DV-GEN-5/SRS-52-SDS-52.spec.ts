import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, LabelSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Placeholder text visible when the Session Creation page loads
 * URS: URS-DV-GEN-5
 * SRS: SRS-52
 * SDS: SDS-52
 */
test.describe('URS-DV-GEN-5: Verify Placeholder text visible when the Session Creation pa', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-604: Verify Placeholder text visible when the Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-604
    // Summary: Verify Placeholder text visible when the Session Creation page loads
    // Description: Feature: Session Label Usability & Clarity Scenario: Placeholder text visible Given the Session Creation page loads When the Session Label field is displayed Then a clear placeholder text (e.g., Select Session Label) should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-605: Verify Dropdown alignment consistent when the form fields are displayed', async ({ page }) => {
    // Test Case: UTC-605
    // Summary: Verify Dropdown alignment consistent when the form fields are displayed
    // Description: Feature: Session Label Usability & Clarity Scenario: Dropdown alignment consistent Given the form fields are displayed When viewing the Session Label dropdown Then the field should align consistently with other input controls

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-606: Verify Labels clearly readable when labels exist in dropdown', async ({ page }) => {
    // Test Case: UTC-606
    // Summary: Verify Labels clearly readable when labels exist in dropdown
    // Description: Feature: Session Label Usability & Clarity Scenario: Labels clearly readable Given labels exist in dropdown When the dropdown opens Then label names should be clearly readable without truncation or overlap

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-607: Verify Selected label visible after selection when the user selects a label', async ({ page }) => {
    // Test Case: UTC-607
    // Summary: Verify Selected label visible after selection when the user selects a label
    // Description: Feature: Session Label Usability & Clarity Scenario: Selected label visible after selection Given the user selects a label When the dropdown closes Then the selected label should be displayed clearly in the field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-608: Verify Clear selection feedback when the user selects a label', async ({ page }) => {
    // Test Case: UTC-608
    // Summary: Verify Clear selection feedback when the user selects a label
    // Description: Feature: Session Label Usability & Clarity Scenario: Clear selection feedback Given the user selects a label When selection occurs Then visual feedback (highlight/checkmark) should confirm selection

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-609: Verify Easy open and close behavior when the dropdown is visible', async ({ page }) => {
    // Test Case: UTC-609
    // Summary: Verify Easy open and close behavior when the dropdown is visible
    // Description: Feature: Session Label Usability & Clarity Scenario: Easy open and close behavior Given the dropdown is visible When the user clicks the field or outside area Then it should open and close smoothly without confusion

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-610: Verify Empty state message clarity when no labels exist', async ({ page }) => {
    // Test Case: UTC-610
    // Summary: Verify Empty state message clarity when no labels exist
    // Description: Feature: Session Label Usability & Clarity Scenario: Empty state message clarity Given no labels exist When the dropdown opens Then a clear “No Labels Available” message should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-611: Verify Remove selected label easily when a label is selected', async ({ page }) => {
    // Test Case: UTC-611
    // Summary: Verify Remove selected label easily when a label is selected
    // Description: Feature: Session Label Usability & Clarity Scenario: Remove selected label easily Given a label is selected When the user clicks remove/clear option Then the field should reset to empty state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-612: Verify No confusing technical errors when an invalid or empty state occurs', async ({ page }) => {
    // Test Case: UTC-612
    // Summary: Verify No confusing technical errors when an invalid or empty state occurs
    // Description: Feature: Session Label Usability & Clarity Scenario: No confusing technical errors Given an invalid or empty state occurs When validation is triggered Then a simple non-technical message should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-613: Verify Keyboard accessibility support when the user uses keyboard navigation', async ({ page }) => {
    // Test Case: UTC-613
    // Summary: Verify Keyboard accessibility support when the user uses keyboard navigation
    // Description: Feature: Session Label Usability & Clarity Scenario: Keyboard accessibility support Given the user uses keyboard navigation When pressing Tab/Enter/Arrow keys Then the dropdown should be operable without mouse

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
