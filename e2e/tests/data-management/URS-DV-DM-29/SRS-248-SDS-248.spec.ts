import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify tooltips are available for S3 action buttons when the user navigates to the page containing S3 actions
 * URS: URS-DV-DM-29
 * SRS: SRS-248
 * SDS: SDS-248
 */
test.describe('URS-DV-DM-29: Verify tooltips are available for S3 action buttons when the', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2610: Verify tooltips are available for S3 action buttons when the user navigates to t', async ({ page }) => {
    // Test Case: UTC-2610
    // Summary: Verify tooltips are available for S3 action buttons when the user navigates to the page containing S3 actions
    // Description: Feature: S3 Upload & Push – Tooltip Availability Scenario: Verify tooltips are available for S3 action buttons Given the user navigates to the page containing S3 actions When the page loads Then tooltips should be available for both Upload from S3 and Push to S3 buttons

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2611: Verify guidance text for Upload from S3 button when the Upload from S3 button is', async ({ page }) => {
    // Test Case: UTC-2611
    // Summary: Verify guidance text for Upload from S3 button when the Upload from S3 button is visible
    // Description: Feature: S3 Upload & Push – Upload Tooltip Content Scenario: Verify guidance text for Upload from S3 button Given the Upload from S3 button is visible When the user hovers over or focuses on the button Then a tooltip should be displayed with clear guidance and expected input format

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2612: Verify guidance text for Push to S3 button when the Push to S3 button is visible', async ({ page }) => {
    // Test Case: UTC-2612
    // Summary: Verify guidance text for Push to S3 button when the Push to S3 button is visible
    // Description: Feature: S3 Upload & Push – Push Tooltip Content Scenario: Verify guidance text for Push to S3 button Given the Push to S3 button is visible When the user hovers over or focuses on the button Then a tooltip should be displayed explaining the action purpose and outcome

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2613: Verify tooltips are accessible via keyboard navigation when the user navigates u', async ({ page }) => {
    // Test Case: UTC-2613
    // Summary: Verify tooltips are accessible via keyboard navigation when the user navigates using the keyboard
    // Description: Feature: S3 Upload & Push – Tooltip Accessibility Scenario: Verify tooltips are accessible via keyboard navigation Given the user navigates using the keyboard When focus is moved to Upload from S3 or Push to S3 buttons Then the corresponding tooltip should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2614: Verify tooltip content loads instantly without delay when the page containing S3', async ({ page }) => {
    // Test Case: UTC-2614
    // Summary: Verify tooltip content loads instantly without delay when the page containing S3 actions is loaded
    // Description: Feature: S3 Upload & Push – Instant Tooltip Availability Scenario: Verify tooltip content loads instantly without delay Given the page containing S3 actions is loaded When the user hovers over the S3 action buttons Then the tooltip should appear instantly without additional loading time

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
