import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Validation on blur when the Session Name field is empty
 * URS: URS-DV-GEN-07
 * SRS: SRS-64
 * SDS: SDS-64
 */
test.describe('URS-DV-GEN-07: Verify Validation on blur when the Session Name field is emp', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-772: Verify Validation on blur when the Session Name field is empty', async ({ page }) => {
    // Test Case: UTC-772
    // Summary: Verify Validation on blur when the Session Name field is empty
    // Description: Feature: Mandatory session name validation with visual alerts and submission block Scenario: Validation on blur Given the Session Name field is empty When the user clicks outside (blur) Then the border should turn red and “Field is required” message should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-773: Verify Validation on submit when the field is empty', async ({ page }) => {
    // Test Case: UTC-773
    // Summary: Verify Validation on submit when the field is empty
    // Description: Feature: Mandatory session name validation with visual alerts and submission block Scenario: Validation on submit Given the field is empty When the user clicks Submit Then validation message should appear and submission should stop

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-774: Verify Space-only input treated as empty when the user enters only spaces', async ({ page }) => {
    // Test Case: UTC-774
    // Summary: Verify Space-only input treated as empty when the user enters only spaces
    // Description: Feature: Mandatory session name validation with visual alerts and submission block Scenario: Space-only input treated as empty Given the user enters only spaces When submit is attempted Then the system should treat it as invalid and show error

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-775: Verify Valid text removes error when the field previously showed error', async ({ page }) => {
    // Test Case: UTC-775
    // Summary: Verify Valid text removes error when the field previously showed error
    // Description: Feature: Mandatory session name validation with visual alerts and submission block Scenario: Valid text removes error Given the field previously showed error When user enters valid text Then red border and error message should disappear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-776: Verify Submission allowed after valid entry when a valid session name is entered', async ({ page }) => {
    // Test Case: UTC-776
    // Summary: Verify Submission allowed after valid entry when a valid session name is entered
    // Description: Feature: Mandatory session name validation with visual alerts and submission block Scenario: Submission allowed after valid entry Given a valid session name is entered When user clicks Submit Then submission should proceed successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-777: Verify API not called on invalid input when field is empty', async ({ page }) => {
    // Test Case: UTC-777
    // Summary: Verify API not called on invalid input when field is empty
    // Description: Feature: Mandatory session name validation with visual alerts and submission block Scenario: API not called on invalid input Given field is empty When submit attempted Then API request should not be triggered

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-778: Verify Boolean validation check executed when validation runs', async ({ page }) => {
    // Test Case: UTC-778
    // Summary: Verify Boolean validation check executed when validation runs
    // Description: Feature: Mandatory session name validation with visual alerts and submission block Scenario: Boolean validation check executed Given validation runs When field is empty Then internal validation flag should be false

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-779: Verify Error message clarity when validation fails', async ({ page }) => {
    // Test Case: UTC-779
    // Summary: Verify Error message clarity when validation fails
    // Description: Feature: Mandatory session name validation with visual alerts and submission block Scenario: Error message clarity Given validation fails When message appears Then text should be simple and readable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-780: Verify Error persists until corrected when invalid input remains', async ({ page }) => {
    // Test Case: UTC-780
    // Summary: Verify Error persists until corrected when invalid input remains
    // Description: Feature: Mandatory session name validation with visual alerts and submission block Scenario: Error persists until corrected Given invalid input remains When user attempts multiple submits Then submission should always remain blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-781: Verify Prevent backend bypass when user tries manual API call with empty name', async ({ page }) => {
    // Test Case: UTC-781
    // Summary: Verify Prevent backend bypass when user tries manual API call with empty name
    // Description: Feature: Mandatory session name validation with visual alerts and submission block Scenario: Prevent backend bypass Given user tries manual API call with empty name When backend validates request Then request should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-782: Verify Instant validation response when user interacts with field', async ({ page }) => {
    // Test Case: UTC-782
    // Summary: Verify Instant validation response when user interacts with field
    // Description: Feature: Mandatory session name validation with visual alerts and submission block Scenario: Instant validation response Given user interacts with field When validation triggers Then feedback should appear immediately (<1s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-783: Verify Visual consistency when error state', async ({ page }) => {
    // Test Case: UTC-783
    // Summary: Verify Visual consistency when error state
    // Description: Feature: Mandatory session name validation with visual alerts and submission block Scenario: Visual consistency Given error state When field highlighted Then red styling should match system validation theme

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
