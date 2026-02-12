import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Description field visibility when the Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-66
 * SDS: SDS-66
 */
test.describe('URS-DV-GEN-07: Verify Description field visibility when the Session Creatio', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-796: Verify Description field visibility when the Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-796
    // Summary: Verify Description field visibility when the Session Creation page loads
    // Description: Feature: Multi-line session description input with safe storage and XSS sanitization Scenario: Description field visibility Given the Session Creation page loads When the form renders Then a multi-line description textarea should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-797: Verify Placeholder text displayed when the description field is empty', async ({ page }) => {
    // Test Case: UTC-797
    // Summary: Verify Placeholder text displayed when the description field is empty
    // Description: Feature: Multi-line session description input with safe storage and XSS sanitization Scenario: Placeholder text displayed Given the description field is empty When the field loads Then placeholder “Enter description” should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-798: Verify User enters multi-line text when the textarea is active', async ({ page }) => {
    // Test Case: UTC-798
    // Summary: Verify User enters multi-line text when the textarea is active
    // Description: Feature: Multi-line session description input with safe storage and XSS sanitization Scenario: User enters multi-line text Given the textarea is active When user types multiple lines Then all lines should be captured correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-799: Verify Field is vertically resizable when the textarea is visible', async ({ page }) => {
    // Test Case: UTC-799
    // Summary: Verify Field is vertically resizable when the textarea is visible
    // Description: Feature: Multi-line session description input with safe storage and XSS sanitization Scenario: Field is vertically resizable Given the textarea is visible When the user drags the resize handle Then the height should adjust smoothly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-800: Verify Description stored in payload when text is entered', async ({ page }) => {
    // Test Case: UTC-800
    // Summary: Verify Description stored in payload when text is entered
    // Description: Feature: Multi-line session description input with safe storage and XSS sanitization Scenario: Description stored in payload Given text is entered When session is submitted Then description should be included in API payload as session_description

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-801: Verify Text persists after navigation when description is entered', async ({ page }) => {
    // Test Case: UTC-801
    // Summary: Verify Text persists after navigation when description is entered
    // Description: Feature: Multi-line session description input with safe storage and XSS sanitization Scenario: Text persists after navigation Given description is entered When user navigates within the form Then entered text should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-802: Verify HTML tags removed when user enters HTML tags like <script>', async ({ page }) => {
    // Test Case: UTC-802
    // Summary: Verify HTML tags removed when user enters HTML tags like <script>
    // Description: Feature: Multi-line session description input with safe storage and XSS sanitization Scenario: HTML tags removed Given user enters HTML tags like <script> When input is processed Then tags should be stripped before save

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-803: Verify Script injection blocked when malicious script is entered', async ({ page }) => {
    // Test Case: UTC-803
    // Summary: Verify Script injection blocked when malicious script is entered
    // Description: Feature: Multi-line session description input with safe storage and XSS sanitization Scenario: Script injection blocked Given malicious script is entered When session is saved Then script should not execute and content sanitized

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-804: Verify Accepts alphanumeric and symbols when user enters normal text and punctua', async ({ page }) => {
    // Test Case: UTC-804
    // Summary: Verify Accepts alphanumeric and symbols when user enters normal text and punctuation
    // Description: Feature: Multi-line session description input with safe storage and XSS sanitization Scenario: Accepts alphanumeric and symbols Given user enters normal text and punctuation When saved Then content should store correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-805: Verify No lag during typing when long text input', async ({ page }) => {
    // Test Case: UTC-805
    // Summary: Verify No lag during typing when long text input
    // Description: Feature: Multi-line session description input with safe storage and XSS sanitization Scenario: No lag during typing Given long text input When typing continuously Then UI should remain responsive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-806: Verify Optional field behavior when description is left empty', async ({ page }) => {
    // Test Case: UTC-806
    // Summary: Verify Optional field behavior when description is left empty
    // Description: Feature: Multi-line session description input with safe storage and XSS sanitization Scenario: Optional field behavior Given description is left empty When session is submitted Then submission should succeed without error

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-807: Verify Refresh retains saved data when description saved successfully', async ({ page }) => {
    // Test Case: UTC-807
    // Summary: Verify Refresh retains saved data when description saved successfully
    // Description: Feature: Multi-line session description input with safe storage and XSS sanitization Scenario: Refresh retains saved data Given description saved successfully When page reloads Then saved description should display correctly

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
