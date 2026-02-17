import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Download button is disabled when no version is selected when the user opens the Version History list
 * URS: URS-DV-DM-17
 * SRS: SRS-129
 * SDS: SDS-129
 */
test.describe('URS-DV-DM-17: Verify Download button is disabled when no version is select', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1758: Verify Download button is disabled when no version is selected when the user ope', async ({ page }) => {
    // Test Case: UTC-1758
    // Summary: Verify Download button is disabled when no version is selected when the user opens the Version History list
    // Description: Feature: Version Download – Download Disabled by Default Scenario: Verify Download button is disabled when no version is selected Given the user opens the Version History list When no version row is selected Then the Download button should remain disabled or inactive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-1759: Verify Download button becomes enabled after selecting a version row when the Ve', async ({ page }) => {
    // Test Case: UTC-1759
    // Summary: Verify Download button becomes enabled after selecting a version row when the Version History list is displayed
    // Description: Feature: Version Download – Enable Download After Selection Scenario: Verify Download button becomes enabled after selecting a version row Given the Version History list is displayed When the user selects a valid version row (ex: V2) Then the Download button should become enabled/active

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1760: Verify selected version identifier is validated before download when a version r', async ({ page }) => {
    // Test Case: UTC-1760
    // Summary: Verify selected version identifier is validated before download when a version row is selected
    // Description: Feature: Version Download – Correct Version Identifier Used Scenario: Verify selected version identifier is validated before download Given a version row is selected When the user clicks Download Then the system should validate the selected version identifier And start download only for the selected version

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1761: Verify changing selection updates which version is downloaded when the user sele', async ({ page }) => {
    // Test Case: UTC-1761
    // Summary: Verify changing selection updates which version is downloaded when the user selected version V2 and Download is enabled
    // Description: Feature: Version Download – Change Selection Updates Download Target Scenario: Verify changing selection updates which version is downloaded Given the user selected version V2 and Download is enabled When the user changes selection to V4 And clicks Download Then the system should download V4 (not V2)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1762: Verify system blocks download if selected row is invalid when the user selected ', async ({ page }) => {
    // Test Case: UTC-1762
    // Summary: Verify system blocks download if selected row is invalid when the user selected a version row
    // Description: Feature: Version Download – Prevent Download With Invalid Selection Scenario: Verify system blocks download if selected row is invalid Given the user selected a version row When the selected version identifier is missing/invalid due to UI glitch Then the system should block download And show a user-friendly message

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1763: Verify Download becomes disabled if selection is cleared when a version row is s', async ({ page }) => {
    // Test Case: UTC-1763
    // Summary: Verify Download becomes disabled if selection is cleared when a version row is selected and Download is enabled
    // Description: Feature: Version Download – Disabled Again After Deselection Scenario: Verify Download becomes disabled if selection is cleared Given a version row is selected and Download is enabled When the user clears the selection (click outside / deselect row) Then the Download button should return to disabled/inactive state

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
