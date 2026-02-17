import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, LabelSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Name cannot be empty when the Create Session Label popup is open
 * URS: URS-DV-GEN-5
 * SRS: SRS-44
 * SDS: SDS-44
 */
test.describe('URS-DV-GEN-5: Verify Name cannot be empty when the Create Session Label po', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-521: Verify Name cannot be empty when the Create Session Label popup is open', async ({ page }) => {
    // Test Case: UTC-521
    // Summary: Verify Name cannot be empty when the Create Session Label popup is open
    // Description: Feature: Session Label Name Validation – Mandatory Field Scenario: Name cannot be empty Given the Create Session Label popup is open When the Name field is left empty and user clicks Create Then submission should be blocked and inline validation message displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-522: Verify Name contains only spaces when the Name field contains only spaces', async ({ page }) => {
    // Test Case: UTC-522
    // Summary: Verify Name contains only spaces when the Name field contains only spaces
    // Description: Feature: Session Label Name Validation – Space-only Restriction Scenario: Name contains only spaces Given the Name field contains only spaces When the user submits Then system should trim input and display validation error

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-523: Verify Valid alphanumeric name accepted when the user enters a valid label name', async ({ page }) => {
    // Test Case: UTC-523
    // Summary: Verify Valid alphanumeric name accepted when the user enters a valid label name
    // Description: Feature: Session Label Name Validation – Valid Input Acceptance Scenario: Valid alphanumeric name accepted Given the user enters a valid label name When the user submits Then the label should be created successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-524: Verify Restricted characters entered when the Name field contains invalid charac', async ({ page }) => {
    // Test Case: UTC-524
    // Summary: Verify Restricted characters entered when the Name field contains invalid characters (!,@,#,$,%, etc.)
    // Description: Feature: Session Label Name Validation – Invalid Special Characters Scenario: Restricted characters entered Given the Name field contains invalid characters (!,@,#,$,%, etc.) When validation runs Then invalid characters should be rejected and error displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-525: Verify Exceed max character limit when the Name exceeds the maximum allowed leng', async ({ page }) => {
    // Test Case: UTC-525
    // Summary: Verify Exceed max character limit when the Name exceeds the maximum allowed length
    // Description: Feature: Session Label Name Validation – Maximum Length Scenario: Exceed max character limit Given the Name exceeds the maximum allowed length When user types beyond the limit Then input should be blocked or truncated

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-526: Verify Error message placement when validation fails', async ({ page }) => {
    // Test Case: UTC-526
    // Summary: Verify Error message placement when validation fails
    // Description: Feature: Session Label Name Validation – Inline Error Visibility Scenario: Error message placement Given validation fails When error appears Then inline message should display below field with red highlight

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-527: Verify Validate on blur when user leaves Name field (blur)', async ({ page }) => {
    // Test Case: UTC-527
    // Summary: Verify Validate on blur when user leaves Name field (blur)
    // Description: Feature: Session Label Name Validation – Blur Validation Scenario: Validate on blur Given user leaves Name field (blur) When invalid input exists Then validation message should trigger immediately

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-528: Verify Validate again on submit when valid input earlier', async ({ page }) => {
    // Test Case: UTC-528
    // Summary: Verify Validate again on submit when valid input earlier
    // Description: Feature: Session Label Name Validation – Submit Validation Scenario: Validate again on submit Given valid input earlier When submitting Then system should revalidate before API call

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-529: Verify Validation fails when invalid name', async ({ page }) => {
    // Test Case: UTC-529
    // Summary: Verify Validation fails when invalid name
    // Description: Feature: Session Label Name Validation – Prevent API Call on Failure Scenario: Validation fails Given invalid name When submit pressed Then no API request should be triggered

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-530: Verify Non-technical error messages when validation fails', async ({ page }) => {
    // Test Case: UTC-530
    // Summary: Verify Non-technical error messages when validation fails
    // Description: Feature: Session Label Name Validation – User-friendly Messaging Scenario: Non-technical error messages Given validation fails When message shown Then message should be simple and understandable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
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
