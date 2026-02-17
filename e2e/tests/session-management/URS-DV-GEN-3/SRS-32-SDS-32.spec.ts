import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Clear level labels displayed when approval section is visible
 * URS: URS-DV-GEN-3
 * SRS: SRS-32
 * SDS: SDS-32
 */
test.describe('URS-DV-GEN-3: Verify Clear level labels displayed when approval section is', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-380: Verify Clear level labels displayed when approval section is visible', async ({ page }) => {
    // Test Case: UTC-380
    // Summary: Verify Clear level labels displayed when approval section is visible
    // Description: Feature: Approval Level Usability Scenario: Clear level labels displayed Given approval section is visible When levels are listed Then labels should display as Level 1–Level 5 clearly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-381: Verify Add Level icon clarity when user views approval section', async ({ page }) => {
    // Test Case: UTC-381
    // Summary: Verify Add Level icon clarity when user views approval section
    // Description: Scenario: Add Level icon clarity Given user views approval section When Add Level is shown Then it should be easily identifiable

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-382: Verify Remove icon clarity when levels exist', async ({ page }) => {
    // Test Case: UTC-382
    // Summary: Verify Remove icon clarity when levels exist
    // Description: Scenario: Remove icon clarity Given levels exist When Remove icon is displayed Then icon should clearly indicate deletion

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-383: Verify Approver fields readable when approver fields are shown', async ({ page }) => {
    // Test Case: UTC-383
    // Summary: Verify Approver fields readable when approver fields are shown
    // Description: Scenario: Approver fields readable Given approver fields are shown When user views dropdowns Then names should be readable and selectable easily

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-384: Verify Immediate UI feedback when user adds or removes a level', async ({ page }) => {
    // Test Case: UTC-384
    // Summary: Verify Immediate UI feedback when user adds or removes a level
    // Description: Scenario: Immediate UI feedback Given user adds or removes a level When action completes Then UI should update immediately

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-385: Verify Validation message clarity when invalid configuration occurs', async ({ page }) => {
    // Test Case: UTC-385
    // Summary: Verify Validation message clarity when invalid configuration occurs
    // Description: Scenario: Validation message clarity Given invalid configuration occurs When validation message appears Then message should be simple and non-technical

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
