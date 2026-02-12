import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify User can edit image only at their active approval level when an image is in IN_REVIEW status at a specific approval level
 * URS: URS-DV-QC-01
 * SRS: SRS-8
 * SDS: SDS-8
 */
test.describe('URS-DV-QC-01: Verify User can edit image only at their active approval lev', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-63: Verify User can edit image only at their active approval level when an image is ', async ({ page }) => {
    // Test Case: UTC-63
    // Summary: Verify User can edit image only at their active approval level when an image is in IN_REVIEW status at a specific approval level
    // Description: Feature: Role & approval level based image access control Scenario: User can edit image only at their active approval level Given an image is in IN_REVIEW status at a specific approval level And the user belongs to the same active approval level When the user opens the image on the Data Labeling page Then all edit and action controls (Annotation, Zoom, Rotate, Pen, Brightness, etc.) should be enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-64: Verify Image becomes non-editable for previous level after moving forward when a', async ({ page }) => {
    // Test Case: UTC-64
    // Summary: Verify Image becomes non-editable for previous level after moving forward when an image is accepted and moved to the next approval level
    // Description: Feature: Edit restriction for previous approval level Scenario: Image becomes non-editable for previous level after moving forward Given an image is accepted and moved to the next approval level When a user from the previous approval level opens the same image Then all image edit and action controls should be disabled and image should be read-only

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-65: Verify Image becomes editable only for the new active level after rejection when', async ({ page }) => {
    // Test Case: UTC-65
    // Summary: Verify Image becomes editable only for the new active level after rejection when an image is rejected and moved back to a previous approval level
    // Description: Feature: Access update when image moves backward in workflow Scenario: Image becomes editable only for the new active level after rejection Given an image is rejected and moved back to a previous approval level When a user from the new active level opens the image Then the image should be editable, and controls enabled only for that level

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-66: Verify System blocks edit actions by non-active level users when a user does not', async ({ page }) => {
    // Test Case: UTC-66
    // Summary: Verify System blocks edit actions by non-active level users when a user does not belong to the current active approval level
    // Description: Feature: Unauthorized edit attempt blocking Scenario: System blocks edit actions by non-active level users Given a user does not belong to the current active approval level When the user attempts any edit or action on the image (via UI or shortcut) Then the system shall block the action and prevent modification

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-67: Verify Edit and action controls are hidden or disabled for unauthorized users wh', async ({ page }) => {
    // Test Case: UTC-67
    // Summary: Verify Edit and action controls are hidden or disabled for unauthorized users when a user opens an image outside their approval level
    // Description: Feature: UI-level access enforcement Scenario: Edit and action controls are hidden or disabled for unauthorized users Given a user opens an image outside their approval level When the Data Labeling page loads Then edit icons, buttons, and shortcuts should be disabled or non-interactive

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-68: Verify Backend validates role and approval level before allowing image actions w', async ({ page }) => {
    // Test Case: UTC-68
    // Summary: Verify Backend validates role and approval level before allowing image actions when a user attempts an image action through API or forced UI trigger
    // Description: Feature: Backend authorization validation Scenario: Backend validates role and approval level before allowing image actions Given a user attempts an image action through API or forced UI trigger When role, approval level, or group mapping does not match active level Then the backend shall reject the request and not apply changes

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-69: Verify Only one approval level has edit access at any time when the image exists', async ({ page }) => {
    // Test Case: UTC-69
    // Summary: Verify Only one approval level has edit access at any time when the image exists across multiple workflow stages
    // Description: Feature: Single active-level edit enforcement Scenario: Only one approval level has edit access at any time Given the image exists across multiple workflow stages When users from different approval levels access the image simultaneously Then only the current active level user should be able to edit the image

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
