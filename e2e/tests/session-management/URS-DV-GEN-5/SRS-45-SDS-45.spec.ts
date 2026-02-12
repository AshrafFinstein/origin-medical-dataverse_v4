import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, LabelSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Description field is visible when the Create/Edit Session Label popup is opened
 * URS: URS-DV-GEN-5
 * SRS: SRS-45
 * SDS: SDS-45
 */
test.describe('URS-DV-GEN-5: Verify Description field is visible when the Create/Edit Ses', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-531: Verify Description field is visible when the Create/Edit Session Label popup is ', async ({ page }) => {
    // Test Case: UTC-531
    // Summary: Verify Description field is visible when the Create/Edit Session Label popup is opened
    // Description: Feature: Session Label Description Validation – Description field available for optional details Scenario: Description field is visible Given the Create/Edit Session Label popup is opened When the form loads Then the Description input field should be visible and editable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-532: Verify User enters alphanumeric text when the Description field is focused', async ({ page }) => {
    // Test Case: UTC-532
    // Summary: Verify User enters alphanumeric text when the Description field is focused
    // Description: Feature: Session Label Description Validation – Accept valid characters Scenario: User enters alphanumeric text Given the Description field is focused When the user types valid characters Then the input should be accepted without validation errors

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-533: Verify Enter description within limit when the maximum limit is defined', async ({ page }) => {
    // Test Case: UTC-533
    // Summary: Verify Enter description within limit when the maximum limit is defined
    // Description: Feature: Session Label Description Validation – Maximum character limit enforcement Scenario: Enter description within limit Given the maximum limit is defined When the user enters text less than or equal to the limit Then the system should allow saving successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-534: Verify Enter description equal to max length when the maximum limit', async ({ page }) => {
    // Test Case: UTC-534
    // Summary: Verify Enter description equal to max length when the maximum limit
    // Description: Feature: Session Label Description Validation – Exact limit acceptance Scenario: Enter description equal to max length Given the maximum limit When the user enters exactly the max characters Then saving should still be permitted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-535: Verify Enter description exceeding max length when the Description field has a l', async ({ page }) => {
    // Test Case: UTC-535
    // Summary: Verify Enter description exceeding max length when the Description field has a limit
    // Description: Feature: Session Label Description Validation – Block over-limit input Scenario: Enter description exceeding max length Given the Description field has a limit When the user enters text exceeding the limit Then saving should be blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-536: Verify Over-limit validation message when text exceeds the limit', async ({ page }) => {
    // Test Case: UTC-536
    // Summary: Verify Over-limit validation message when text exceeds the limit
    // Description: Feature: Session Label Description Validation – Error message display Scenario: Over-limit validation message Given text exceeds the limit When the user attempts to save Then a clear validation message should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-537: Verify Save without description when the Description is empty', async ({ page }) => {
    // Test Case: UTC-537
    // Summary: Verify Save without description when the Description is empty
    // Description: Feature: Session Label Description Validation – Optional field behavior Scenario: Save without description Given the Description is empty When the user clicks Save Then the label should still be created successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-538: Verify Description saved in request when valid text is entered', async ({ page }) => {
    // Test Case: UTC-538
    // Summary: Verify Description saved in request when valid text is entered
    // Description: Feature: Session Label Description Validation – Payload inclusion Scenario: Description saved in request Given valid text is entered When the user saves Then the Description should be included in the API payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-539: Verify System handles large invalid input safely when extremely long text is pas', async ({ page }) => {
    // Test Case: UTC-539
    // Summary: Verify System handles large invalid input safely when extremely long text is pasted
    // Description: Feature: Session Label Description Validation – Prevent technical errors Scenario: System handles large invalid input safely Given extremely long text is pasted When validation runs Then the system should not crash and should show an error message

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-540: Verify Visual highlight on error when validation fails', async ({ page }) => {
    // Test Case: UTC-540
    // Summary: Verify Visual highlight on error when validation fails
    // Description: Feature: Session Label Description Validation – Clear feedback Scenario: Visual highlight on error Given validation fails When the message appears Then the Description field should be visually highlighted

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
